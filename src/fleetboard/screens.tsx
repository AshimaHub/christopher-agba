import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  dayLine,
  earnedHours,
  formatWhen,
  needsReason,
  statusLabel,
  type BoardStatus,
  type Unit,
} from './model.ts'
import { useFleetBoard } from './useFleetBoard.ts'

const base = '/robes/demo/fleetboard'
const order: BoardStatus[] = ['working', 'idle', 'down', 'away', 'unreported']

export function BoardScreen() {
  const { state } = useFleetBoard()
  const earned = earnedHours(state.units)
  const open = state.units.filter(needsReason).length
  const quiet = state.units.filter((unit) => unit.status === 'unreported').length
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Morning board</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Which machines are earning their place</h1>
        <p className="mt-3 max-w-2xl text-muted">
          A yard clerk calls each machine in. Working, idle, down, or off the site it was sent to. This is a morning record, not a live tracker.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        <Figure label="Hours earned" value={`${earned} / 48`} href={`${base}`} />
        <Figure label="Need a reason" value={String(open)} href={`${base}/units/unit-6`} />
        <Figure label="Not called in" value={String(quiet)} href={`${base}/units/unit-3`} />
      </div>
      {order.map((status) => {
        const rows = state.units.filter((unit) => unit.status === status)
        if (rows.length === 0) return null
        return (
          <section key={status} className="grid gap-3">
            <h2 className="font-serif text-2xl text-ink">{statusLabel(status)}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {rows.map((unit) => (
                <Link key={unit.id} to={`${base}/units/${unit.id}`} className="border border-line bg-card p-5 transition hover:border-robes">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-ink">{unit.name}</p>
                    <Tone unit={unit} />
                  </div>
                  <p className="mt-2 text-sm text-muted">{dayLine(unit)}</p>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function Figure({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link to={href} className="border border-line bg-card p-5 transition hover:border-robes">
      <p className="font-serif text-3xl text-ink">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </Link>
  )
}

export function UnitScreen() {
  const { id = '' } = useParams()
  const { state, reviewUnit } = useFleetBoard()
  const unit = state.units.find((item) => item.id === id)
  useEffect(() => {
    reviewUnit(id)
  }, [reviewUnit, id, state.role, unit?.note, unit?.status])
  if (!unit) return <EmptyTitle title="Machine not found" text="It may belong to another sample business." />
  return <UnitDetail unit={unit} />
}

function UnitDetail({ unit }: { unit: Unit }) {
  const { state, callIn, explain } = useFleetBoard()
  const [status, setStatus] = useState<Exclude<BoardStatus, 'unreported'>>('working')
  const [reported, setReported] = useState('')
  const [hours, setHours] = useState('6')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const current = state.guide.active && state.guide.focusId === unit.id

  function onCall(event: FormEvent) {
    event.preventDefault()
    const result = callIn(unit.id, status, reported, Number(hours))
    setError(result?.error ?? null)
  }

  function onExplain(event: FormEvent) {
    event.preventDefault()
    const result = explain(unit.id, note)
    setError(result?.error ?? null)
  }

  return (
    <article className="grid max-w-3xl gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Sent to {unit.assigned}</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{unit.name}</h1>
        <p className="mt-3 text-muted">{dayLine(unit)}</p>
        <p className="mt-2"><Tone unit={unit} />{current ? <span className="ml-2 text-sm text-muted">Current step</span> : null}</p>
      </header>
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      {state.role === 'clerk' && unit.status === 'unreported' ? (
        <form onSubmit={onCall} className="grid gap-4 border border-line bg-card p-5" noValidate>
          <h2 className="font-serif text-2xl text-ink">Call it in</h2>
          <label className="grid gap-2 text-sm">This morning
            <select className="field" value={status} onChange={(event) => setStatus(event.target.value as Exclude<BoardStatus, 'unreported'>)}>
              <option value="working">Working</option>
              <option value="idle">Idle</option>
              <option value="down">Down</option>
              <option value="away">Off site</option>
            </select>
          </label>
          {status === 'working' ? (
            <label className="grid gap-2 text-sm">Hours so far
              <input className="field" inputMode="numeric" value={hours} onChange={(event) => setHours(event.target.value)} />
            </label>
          ) : null}
          {status === 'away' ? (
            <label className="grid gap-2 text-sm">Where it actually is
              <input className="field" value={reported} onChange={(event) => setReported(event.target.value)} />
            </label>
          ) : null}
          <button type="submit" className="inline-flex min-h-11 w-fit items-center bg-robes-fill px-5 text-sm font-medium text-robes-ink">Save the morning</button>
        </form>
      ) : null}
      {state.role === 'supervisor' && needsReason(unit) ? (
        <form onSubmit={onExplain} className="grid gap-4 border border-line bg-card p-5" noValidate>
          <h2 className="font-serif text-2xl text-ink">Why it is not earning</h2>
          <label className="grid gap-2 text-sm">Reason
            <textarea className="field min-h-24" value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
          <button type="submit" className="inline-flex min-h-11 w-fit items-center bg-robes-fill px-5 text-sm font-medium text-robes-ink">Save the reason</button>
        </form>
      ) : null}
      {state.role === 'clerk' && needsReason(unit) ? <p className="text-sm text-muted">Switch to Operations supervisor to write the reason.</p> : null}
      {state.role === 'supervisor' && unit.status === 'unreported' ? <p className="text-sm text-muted">Switch to Yard clerk to call this machine in.</p> : null}
    </article>
  )
}

function Tone({ unit }: { unit: Unit }) {
  const tone = unit.status === 'working' ? 'completed' : unit.status === 'idle' ? 'submitted' : unit.status === 'down' ? 'disputed' : unit.status === 'away' ? 'rejected' : 'draft'
  return <span data-status={tone} className="app-status">{statusLabel(unit.status)}</span>
}

export function ActivityScreen() {
  const { state } = useFleetBoard()
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Activity</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">This morning</h1>
      </header>
      <ol className="space-y-3">
        {state.activity.map((item) => (
          <li key={item.id} className="border border-line bg-card p-4 text-sm">
            <p className="text-ink">{item.text}</p>
            <p className="text-muted">{item.actor} · {formatWhen(item.at)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function EmptyTitle({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">{title}</h1>
      <p className="mt-3 text-muted">{text}</p>
    </div>
  )
}
