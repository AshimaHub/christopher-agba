import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  conditions,
  countStatus,
  formatWhen,
  goodsById,
  goodsFor,
  lineDisputed,
  placeById,
  placesFor,
  statusLabel,
  type Condition,
  type DispatchNote,
  type NoteStatus,
} from './model.ts'
import { useWaynote } from './useWaynote.ts'

const base = '/robes/demo/waynote'

export function OverviewScreen() {
  const { state } = useWaynote()
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Overview</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">What left, and what was received</h1>
        <p className="mt-3 max-w-2xl text-muted">
          A loading note is a draft until the sender dispatches it. The receiver then records the quantity and the condition. A mismatch becomes a dispute. A clean receipt can be completed.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Drafts" value={countStatus(state.notes, 'draft')} href={`${base}/notes?status=draft`} />
        <Metric label="Pending receipt" value={countStatus(state.notes, 'pending')} href={`${base}/receive`} />
        <Metric label="Disputed" value={countStatus(state.notes, 'disputed')} href={`${base}/notes?status=disputed`} />
        <Metric label="Completed" value={countStatus(state.notes, 'completed')} href={`${base}/notes?status=completed`} />
      </div>
      <section className="border border-line bg-card p-5">
        <h2 className="font-serif text-2xl text-ink">Latest movement</h2>
        <ol className="mt-4 space-y-3">
          {state.activity.slice(0, 5).map((item) => (
            <li key={item.id} className="border-t border-line pt-3 text-sm first:border-t-0 first:pt-0">
              <p className="text-ink">{item.text}</p>
              <p className="text-muted">{item.actor} · {formatWhen(item.at)}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

function Metric({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link to={href} className="border border-line bg-card p-5 transition hover:border-robes">
      <p className="font-serif text-4xl text-ink">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </Link>
  )
}

export function NotesScreen() {
  const { state } = useWaynote()
  const [query, setQuery] = useState('')
  const [params, setParams] = useSearchParams()
  const statusParam = params.get('status')
  const active: NoteStatus | 'all' =
    statusParam === 'draft' || statusParam === 'pending' || statusParam === 'received' || statusParam === 'disputed' || statusParam === 'completed'
      ? statusParam
      : 'all'
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return state.notes.filter((note) => {
      if (active !== 'all' && note.status !== active) return false
      if (!needle) return true
      const route = `${placeById(state.companyId, note.originId)?.name ?? ''} ${placeById(state.companyId, note.destinationId)?.name ?? ''}`
      return `${note.number} ${route} ${note.carrier}`.toLowerCase().includes(needle)
    })
  }, [active, query, state.companyId, state.notes])

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <header>
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Notes</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Loading notes</h1>
        </header>
        {state.role === 'dispatcher' ? (
          <Link to={`${base}/notes/new`} className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">New note</Link>
        ) : (
          <p className="max-w-xs text-sm text-muted">Switch to Sender to write a note.</p>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_14rem]">
        <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search note or place" aria-label="Search notes" />
        <select className="field" aria-label="Filter by status" value={active} onChange={(event) => { const value = event.target.value; if (value === 'all') setParams({}); else setParams({ status: value }) }}>
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending receipt</option>
          <option value="received">Received</option>
          <option value="disputed">Disputed</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <NoteTable rows={rows} empty="No notes match that search." />
    </div>
  )
}

export function NewNoteScreen() {
  const { state, submit } = useWaynote()
  const navigate = useNavigate()
  const places = placesFor(state.companyId)
  const goods = goodsFor(state.companyId)
  const [originId, setOriginId] = useState(places[0]?.id ?? '')
  const [destinationId, setDestinationId] = useState(places[1]?.id ?? '')
  const [carrier, setCarrier] = useState('Own truck')
  const [reference, setReference] = useState('')
  const [lines, setLines] = useState<{ goodsId: string; quantity: string; condition: Condition }[]>([{ goodsId: '', quantity: '40', condition: 'Good' }])
  const [error, setError] = useState<string | null>(null)

  if (state.role !== 'dispatcher') {
    return <EmptyTitle title="The sender writes the note" text="Switch the demonstration role to Sender before a load is written up." />
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const result = submit({ originId, destinationId, carrier, reference, lines })
    if ('error' in result) { setError(result.error); return }
    navigate(`${base}/notes/${result.id}`)
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-3xl gap-5" noValidate>
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">New note</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Send a loading note</h1>
        <p className="mt-3 text-muted">Sending it makes the note pending receipt. The receiver then confirms quantity and condition.</p>
      </header>
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">From
          <select className="field" value={originId} onChange={(event) => setOriginId(event.target.value)}>{places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select>
        </label>
        <label className="grid gap-2 text-sm">To
          <select className="field" value={destinationId} onChange={(event) => setDestinationId(event.target.value)}>{places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select>
        </label>
      </div>
      <label className="grid gap-2 text-sm">Carrier
        <input className="field" value={carrier} onChange={(event) => setCarrier(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm">What the load is for
        <textarea className="field min-h-24" value={reference} onChange={(event) => setReference(event.target.value)} />
      </label>
      <fieldset className="grid gap-3">
        <legend className="text-sm">Items sent</legend>
        {lines.map((item, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-[1fr_7rem_8rem_auto]">
            <select className="field" aria-label={`Item ${index + 1}`} value={item.goodsId} onChange={(event) => setLines((current) => current.map((line, lineIndex) => lineIndex === index ? { ...line, goodsId: event.target.value } : line))}>
              <option value="">Choose an item</option>
              {goods.map((itemOption) => <option key={itemOption.id} value={itemOption.id}>{itemOption.name}</option>)}
            </select>
            <input className="field" aria-label={`Quantity ${index + 1}`} inputMode="numeric" value={item.quantity} onChange={(event) => setLines((current) => current.map((line, lineIndex) => lineIndex === index ? { ...line, quantity: event.target.value } : line))} />
            <select className="field" aria-label={`Condition sent ${index + 1}`} value={item.condition} onChange={(event) => setLines((current) => current.map((line, lineIndex) => lineIndex === index ? { ...line, condition: event.target.value as Condition } : line))}>
              {conditions.map((condition) => <option key={condition}>{condition}</option>)}
            </select>
            <button type="button" className="min-h-11 px-3 text-sm text-muted" disabled={lines.length === 1} onClick={() => setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))}>Remove</button>
          </div>
        ))}
        <button type="button" className="justify-self-start text-sm font-medium text-robes" onClick={() => setLines((current) => [...current, { goodsId: '', quantity: '1', condition: 'Good' }])}>Add another item</button>
      </fieldset>
      <button type="submit" className="inline-flex min-h-11 w-fit items-center bg-robes-fill px-5 text-sm font-medium text-robes-ink">Send note</button>
    </form>
  )
}

export function NoteDetailScreen() {
  const { id } = useParams()
  const { state } = useWaynote()
  const note = state.notes.find((item) => item.id === id)
  if (!note) return <EmptyTitle title="Note not found" text="It may have been cleared when the demonstration was reset." />
  return <NoteDetail note={note} />
}

function NoteDetail({ note }: { note: DispatchNote }) {
  const { state, send, receive, complete } = useWaynote()
  const [comment, setComment] = useState('')
  const [arrived, setArrived] = useState<Record<string, string>>(() => Object.fromEntries(note.lines.map((line) => [line.goodsId, String(line.sent)])))
  const [condition, setCondition] = useState<Record<string, Condition>>(() => Object.fromEntries(note.lines.map((line) => [line.goodsId, line.conditionSent])))
  const [error, setError] = useState<string | null>(null)
  const canSend = state.role === 'dispatcher' && note.status === 'draft'
  const canReceive = state.role === 'receiver' && note.status === 'pending'
  const canComplete = state.role === 'receiver' && note.status === 'received'

  function onReceive(event: FormEvent) {
    event.preventDefault()
    const result = receive(note.id, note.lines.map((line) => ({ goodsId: line.goodsId, quantity: Number(arrived[line.goodsId]), condition: condition[line.goodsId] ?? line.conditionSent })), comment)
    setError(result?.error ?? null)
  }

  return (
    <article className="grid gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">{note.number}</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">{placeById(state.companyId, note.originId)?.name} to {placeById(state.companyId, note.destinationId)?.name}</h1>
          <p className="mt-2 text-sm text-muted">{note.carrier} · {note.dispatcherName} · {formatWhen(note.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={note.status} />
          <button type="button" className="cr-no-print min-h-11 border border-line px-3 text-sm" onClick={() => window.print()}>Print note</button>
        </div>
      </header>
      <p className="max-w-3xl text-ink">{note.reference}</p>
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-paper-2 text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Item</th>
              <th className="px-3 py-2 font-medium">Sent</th>
              <th className="px-3 py-2 font-medium">Condition sent</th>
              <th className="px-3 py-2 font-medium">Received</th>
              <th className="px-3 py-2 font-medium">Condition received</th>
            </tr>
          </thead>
          <tbody>
            {note.lines.map((line) => {
              const item = goodsById(state.companyId, line.goodsId)
              return (
                <tr key={line.goodsId} className="border-t border-line">
                  <td className="px-3 py-3">{item?.name}{lineDisputed(line) ? ' · disputed' : ''}</td>
                  <td className="px-3 py-3">{line.sent} {item?.unit}</td>
                  <td className="px-3 py-3">{line.conditionSent}</td>
                  <td className="px-3 py-3">{line.arrived === null ? '—' : line.arrived}</td>
                  <td className="px-3 py-3">{line.conditionReceived ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {note.receipt ? <p className="border border-line bg-card p-4 text-sm"><span className="font-medium text-ink">Receipt. </span>{note.receipt.comment}<span className="mt-1 block text-muted">{note.receipt.by} · {formatWhen(note.receipt.at)}</span></p> : null}
      {canSend ? <button type="button" className="cr-no-print min-h-11 w-fit bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => setError(send(note.id)?.error ?? null)}>Send for receipt</button> : null}
      {canReceive ? (
        <form className="cr-no-print grid gap-3 border border-line bg-card p-4" onSubmit={onReceive}>
          <h2 className="font-serif text-2xl">What arrived</h2>
          <p className="text-sm text-muted">The sent quantity and condition are filled in. Change either one when they do not match. A mismatch marks the note disputed.</p>
          {note.lines.map((line) => {
            const item = goodsById(state.companyId, line.goodsId)
            return (
              <div key={line.goodsId} className="grid gap-3 sm:grid-cols-[1fr_8rem_9rem] sm:items-end">
                <p className="text-sm">{item?.name} · {line.sent} sent · {line.conditionSent}</p>
                <label className="grid gap-1 text-sm">Received
                  <input className="field" inputMode="numeric" aria-label={`Received quantity of ${item?.name}`} value={arrived[line.goodsId] ?? ''} onChange={(event) => setArrived((current) => ({ ...current, [line.goodsId]: event.target.value }))} />
                </label>
                <label className="grid gap-1 text-sm">Condition
                  <select className="field" aria-label={`Condition received of ${item?.name}`} value={condition[line.goodsId] ?? line.conditionSent} onChange={(event) => setCondition((current) => ({ ...current, [line.goodsId]: event.target.value as Condition }))}>
                    {conditions.map((itemCondition) => <option key={itemCondition}>{itemCondition}</option>)}
                  </select>
                </label>
              </div>
            )
          })}
          <label className="grid gap-2 text-sm">Receiver remark
            <textarea className="field min-h-20" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Required when quantity or condition does not match." />
          </label>
          <button type="submit" className="min-h-11 w-fit bg-robes-fill px-4 text-sm font-medium text-robes-ink">Record receipt</button>
        </form>
      ) : null}
      {canComplete ? <button type="button" className="cr-no-print min-h-11 w-fit bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => setError(complete(note.id)?.error ?? null)}>Complete note</button> : null}
      {note.status === 'disputed' ? <p className="text-sm text-muted">This note stays disputed. The sent and received lines are both on the record.</p> : null}
    </article>
  )
}

export function ReleaseScreen() {
  const { state } = useWaynote()
  const rows = state.notes.filter((note) => note.status === 'draft')
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Dispatch</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Drafts not yet sent</h1>
        <p className="mt-3 max-w-2xl text-muted">{state.role === 'dispatcher' ? 'Open a draft and send it. It then waits for receipt.' : 'Switch to Sender to dispatch a draft.'}</p>
      </header>
      <NoteTable rows={rows} empty="No draft is waiting to be sent." />
    </div>
  )
}

export function ReceiveScreen() {
  const { state } = useWaynote()
  const rows = state.notes.filter((note) => note.status === 'pending')
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Receive</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Pending receipt</h1>
        <p className="mt-3 max-w-2xl text-muted">{state.role === 'receiver' ? 'Open a note and record the quantity and condition that arrived.' : 'Switch to Receiver to check a load in.'}</p>
      </header>
      <NoteTable rows={rows} empty="No note is pending receipt." />
    </div>
  )
}

export function ActivityScreen() {
  const { state } = useWaynote()
  const [query, setQuery] = useState('')
  const rows = state.activity.filter((item) => item.text.toLowerCase().includes(query.trim().toLowerCase()))
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Activity</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">The trail of each note</h1>
      </header>
      <input className="field max-w-md" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the history" aria-label="Search activity" />
      {rows.length === 0 ? <p className="text-sm text-muted">No history matches that search.</p> : (
        <ol className="border border-line bg-card">
          {rows.map((item) => (
            <li key={item.id} className="border-t border-line px-4 py-3 text-sm first:border-t-0">
              {item.noteId ? <Link to={`${base}/notes/${item.noteId}`} className="text-ink underline decoration-line underline-offset-4">{item.text}</Link> : <span>{item.text}</span>}
              <p className="text-muted">{item.actor} · {formatWhen(item.at)}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export function ReportsScreen() {
  const { state } = useWaynote()
  const statuses: NoteStatus[] = ['draft', 'pending', 'received', 'disputed', 'completed']
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Reports</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Where the notes stand</h1>
      </header>
      <Chart title="Notes by status" items={statuses.map((status) => ({ label: statusLabel(status), value: countStatus(state.notes, status) }))} />
    </div>
  )
}

function Chart({ title, items }: { title: string; items: { label: string; value: number }[] }) {
  const max = Math.max(1, ...items.map((item) => item.value))
  return (
    <section className="border border-line bg-card p-5">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.label}>
            <div className="flex justify-between gap-4 text-sm"><span>{item.label}</span><span className="text-muted">{item.value}</span></div>
            <div className="mt-1 h-2 bg-paper"><div className="h-2 bg-robes-fill" style={{ width: `${(item.value / max) * 100}%` }} /></div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function NoteTable({ rows, empty }: { rows: DispatchNote[]; empty: string }) {
  const { state } = useWaynote()
  if (rows.length === 0) return <p className="text-sm text-muted">{empty}</p>
  return (
    <div className="overflow-x-auto border border-line bg-card">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead className="bg-paper-2 text-muted">
          <tr>
            <th className="px-3 py-2 font-medium">Note</th>
            <th className="px-3 py-2 font-medium">Route</th>
            <th className="px-3 py-2 font-medium">Carrier</th>
            <th className="px-3 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((note) => (
            <tr key={note.id} className="border-t border-line">
              <td className="px-3 py-3"><Link to={`${base}/notes/${note.id}`} className="font-medium text-ink underline decoration-line underline-offset-4">{note.number}</Link></td>
              <td className="px-3 py-3">{placeById(state.companyId, note.originId)?.name} → {placeById(state.companyId, note.destinationId)?.name}</td>
              <td className="px-3 py-3">{note.carrier}</td>
              <td className="px-3 py-3"><StatusPill status={note.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusPill({ status }: { status: NoteStatus }) {
  return <span data-status={status} className="app-status">{statusLabel(status)}</span>
}

function EmptyTitle({ title, text }: { title: string; text: string }) {
  return <div><h1 className="font-serif text-4xl text-ink">{title}</h1><p className="mt-3 max-w-xl text-muted">{text}</p></div>
}
