import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  bookFor,
  formatWhen,
  itemById,
  kindLabel,
  onHand,
  placeById,
  statusLabel,
  type MoveKind,
  type Movement,
} from './model.ts'
import { useSiteLedger } from './useSiteLedger.ts'

const base = '/robes/demo/siteledger'

export function OverviewScreen() {
  const { state } = useSiteLedger()
  const drafts = state.movements.filter((move) => move.status === 'draft')
  const receipts = state.movements.filter((move) => move.kind === 'receipt' && move.status === 'posted')
  const issues = state.movements.filter((move) => move.kind === 'issue' && move.status === 'posted')
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Overview</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">What came in, what went out, what should still be there</h1>
        <p className="mt-3 max-w-2xl text-muted">
          A storekeeper posts a receipt or an issue. The stock card keeps the opening balance and every posted movement, so the quantity on hand is the history, not a separate guess.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Figure label="Drafts" value={String(drafts.length)} href={`${base}/receipts`} />
        <Figure label="Receipts posted" value={String(receipts.length)} href={`${base}/receipts`} />
        <Figure label="Issues posted" value={String(issues.length)} href={`${base}/issues`} />
        <Figure label="Stock cards" value={String(bookFor(state.companyId).cards.length)} href={`${base}/stock`} />
      </div>
      <section className="border border-line bg-card p-5">
        <h2 className="font-serif text-2xl text-ink">Latest movements</h2>
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

function Figure({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link to={href} className="border border-line bg-card p-5 transition hover:border-robes">
      <p className="font-serif text-3xl text-ink">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </Link>
  )
}

export function StockScreen() {
  const { state } = useSiteLedger()
  const cards = bookFor(state.companyId).cards
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Stock</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Balances</h1>
        <p className="mt-3 max-w-2xl text-muted">Each card is one item in one store. Open it to see how the balance was built.</p>
      </header>
      <div className="overflow-x-auto border border-line bg-card">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Store</th>
              <th className="px-4 py-3 font-medium">On hand</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => {
              const item = itemById(state.companyId, card.itemId)
              const place = placeById(state.companyId, card.placeId)
              const held = onHand(state.companyId, state.movements, card.placeId, card.itemId)
              return (
                <tr key={`${card.placeId}-${card.itemId}`} className="border-t border-line">
                  <td className="px-4 py-3">
                    <Link className="font-medium text-robes" to={`${base}/stock/${card.placeId}/${card.itemId}`}>{item?.name}</Link>
                  </td>
                  <td className="px-4 py-3">{place?.name}</td>
                  <td className="px-4 py-3">{held} {item?.unit}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function CardScreen() {
  const { placeId = '', itemId = '' } = useParams()
  const { state, post, add, reviewCard } = useSiteLedger()
  const item = itemById(state.companyId, itemId)
  const place = placeById(state.companyId, placeId)
  const [error, setError] = useState<string | null>(null)
  const [kind, setKind] = useState<MoveKind>('receipt')
  const [quantity, setQuantity] = useState('')
  const [reference, setReference] = useState('')

  useEffect(() => {
    reviewCard(itemId)
  }, [reviewCard, state.role, itemId])

  if (!item || !place) return <EmptyTitle title="Stock card not found" text="It may belong to another sample business." />

  const opening = bookFor(state.companyId).cards.find((card) => card.placeId === placeId && card.itemId === itemId)?.opening ?? 0
  const held = onHand(state.companyId, state.movements, placeId, itemId)
  const history = state.movements
    .filter((move) => move.placeId === placeId && move.itemId === itemId)
    .slice()
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
  const drafts = history.filter((move) => move.status === 'draft')

  function postDraft(moveId: string) {
    const result = post(moveId)
    setError(result?.error ?? null)
  }

  function onAdd(event: FormEvent) {
    event.preventDefault()
    const result = add({ placeId, itemId, kind, quantity, reference })
    if ('error' in result) {
      setError(result.error)
      return
    }
    setQuantity('')
    setReference('')
    setError(null)
  }

  return (
    <article className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">{place.name}</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{item.name}</h1>
        <p className="mt-3 text-muted">Opening {opening} {item.unit}. On hand {held} {item.unit}.</p>
      </header>
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      <section className="border border-line bg-card p-5">
        <h2 className="font-serif text-2xl text-ink">How this balance was built</h2>
        <p className="mt-2 text-sm text-muted">Opening {opening} {signed(history)} = {held} {item.unit} on hand. Drafts are not in the balance until they are posted.</p>
        <ol className="mt-4 space-y-3">
          {history.map((move) => (
            <li key={move.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-sm">
              <div>
                <p className="text-ink">{move.number} · {kindLabel(move.kind)} · {move.kind === 'receipt' ? '+' : '−'}{move.quantity}</p>
                <p className="text-muted">{move.reference}</p>
              </div>
              <span data-status={move.status} className="app-status">{statusLabel(move.status)}</span>
            </li>
          ))}
        </ol>
      </section>
      {drafts.length > 0 ? (
        <section className="grid gap-3">
          <h2 className="font-serif text-2xl text-ink">Drafts on this card</h2>
          {drafts.map((move) => (
            <div key={move.id} className="flex flex-wrap items-center justify-between gap-3 border border-line bg-card p-4">
              <p className="text-sm text-ink">{move.number} · {kindLabel(move.kind)} {move.quantity} · {move.reference}{state.guide.active && state.guide.focusId === move.id ? ' · current step' : ''}</p>
              {state.role === 'keeper' ? (
                <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => postDraft(move.id)}>Post {move.number}</button>
              ) : (
                <p className="text-sm text-muted">Switch to Storekeeper to post this.</p>
              )}
            </div>
          ))}
        </section>
      ) : null}
      {state.role === 'keeper' ? (
        <form onSubmit={onAdd} className="grid max-w-xl gap-4 border border-line bg-card p-5" noValidate>
          <h2 className="font-serif text-2xl text-ink">Record another movement</h2>
          <label className="grid gap-2 text-sm">Kind
            <select className="field" value={kind} onChange={(event) => setKind(event.target.value as MoveKind)}>
              <option value="receipt">Receipt</option>
              <option value="issue">Issue</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">Quantity
            <input className="field" inputMode="numeric" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm">Reference
            <input className="field" value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Delivery or job" />
          </label>
          <button type="submit" className="inline-flex min-h-11 w-fit items-center bg-robes-fill px-5 text-sm font-medium text-robes-ink">Post movement</button>
        </form>
      ) : (
        <p className="text-sm text-muted">Switch to Storekeeper to record a receipt or an issue.</p>
      )}
    </article>
  )
}

function signed(history: Movement[]) {
  return history
    .filter((move) => move.status === 'posted')
    .map((move) => `${move.kind === 'receipt' ? '+' : '−'}${move.quantity}`)
    .join(' ')
}

export function ReceiptsScreen() {
  return <MoveList kind="receipt" title="Receipts" />
}

export function IssuesScreen() {
  return <MoveList kind="issue" title="Issues" />
}

function MoveList({ kind, title }: { kind: MoveKind; title: string }) {
  const { state } = useSiteLedger()
  const rows = useMemo(
    () => state.movements.filter((move) => move.kind === kind),
    [kind, state.movements],
  )
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">{title}</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{title}</h1>
      </header>
      <div className="overflow-x-auto border border-line bg-card">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Number</th>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((move) => {
              const item = itemById(state.companyId, move.itemId)
              return (
                <tr key={move.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <Link className="font-medium text-robes" to={`${base}/stock/${move.placeId}/${move.itemId}`}>{move.number}</Link>
                  </td>
                  <td className="px-4 py-3">{item?.name}</td>
                  <td className="px-4 py-3">{move.quantity}</td>
                  <td className="px-4 py-3"><span data-status={move.status} className="app-status">{statusLabel(move.status)}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ActivityScreen() {
  const { state } = useSiteLedger()
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Activity</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Movement history</h1>
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
