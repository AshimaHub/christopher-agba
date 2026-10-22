import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ageLabel,
  formatWhen,
  isLate,
  statusLabel,
  waitingItems,
  type Item,
} from './model.ts'
import { useWaiting } from './useWaiting.ts'

const base = '/robes/demo/waiting'

export function InboxScreen() {
  const { state } = useWaiting()
  const waiting = waitingItems(state.items)
  const late = waiting.filter(isLate).length
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Inbox</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">What is waiting on you</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Requests, expenses, dispatches, and fuel issues sit in one list. The oldest is marked late. Approving or returning an item takes it out of the waiting list.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        <Figure label="Waiting" value={String(waiting.length)} href={`${base}`} />
        <Figure label="Late" value={String(late)} href={`${base}/items/wait-18`} />
        <Figure label="Oldest" value={waiting[0] ? ageLabel(waiting[0]) : 'None'} href={waiting[0] ? `${base}/items/${waiting[0].id}` : `${base}`} />
      </div>
      <ol className="grid gap-3">
        {state.items
          .slice()
          .sort((left, right) => left.raised.localeCompare(right.raised))
          .map((item) => (
            <li key={item.id}>
              <Link to={`${base}/items/${item.id}`} className="flex flex-wrap items-center justify-between gap-3 border border-line bg-card p-5 transition hover:border-robes">
                <div>
                  <p className="font-medium text-ink">{item.number} · {item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.kind} · {item.raisedBy} · {ageLabel(item)}</p>
                </div>
                <Tone item={item} />
              </Link>
            </li>
          ))}
      </ol>
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

export function ItemScreen() {
  const { id = '' } = useParams()
  const { state, reviewItem } = useWaiting()
  const item = state.items.find((entry) => entry.id === id)
  useEffect(() => {
    reviewItem(id)
  }, [reviewItem, id, state.role, item?.status])
  if (!item) return <EmptyTitle title="Item not found" text="It may have been cleared when the demonstration was reset." />
  return <ItemDetail item={item} />
}

function ItemDetail({ item }: { item: Item }) {
  const { state, send, decide } = useWaiting()
  const [remark, setRemark] = useState('')
  const [error, setError] = useState<string | null>(null)
  const current = state.guide.active && state.guide.focusId === item.id

  function onSend() {
    const result = send(item.id)
    setError(result?.error ?? null)
  }

  function onDecide(action: 'approved' | 'returned') {
    const result = decide(item.id, action, remark)
    setError(result?.error ?? null)
  }

  return (
    <article className="grid max-w-3xl gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">{item.kind} · {ageLabel(item)}</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{item.title}</h1>
        <p className="mt-3 text-muted">{item.number} · raised by {item.raisedBy}</p>
        <p className="mt-2"><Tone item={item} />{current ? <span className="ml-2 text-sm text-muted">Current step</span> : null}</p>
      </header>
      {isLate(item) ? <p className="border border-line bg-card p-4 text-sm text-ink">This is the oldest item still waiting. It has been here {ageLabel(item)}.</p> : null}
      {item.decision ? <p className="border border-line bg-card p-4 text-sm text-ink">{item.decision.by}: {item.decision.remark}</p> : null}
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      {state.role === 'requester' && item.status === 'draft' ? (
        <div className="border border-line bg-card p-5">
          <h2 className="font-serif text-2xl text-ink">Send it into the inbox</h2>
          <p className="mt-2 text-sm text-muted">Sending puts it on the approver's waiting list. You cannot approve it yourself.</p>
          <button type="button" className="mt-4 min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={onSend}>Send {item.number}</button>
        </div>
      ) : null}
      {state.role === 'owner' && item.status === 'waiting' ? (
        <form className="grid gap-4 border border-line bg-card p-5" onSubmit={(event: FormEvent) => event.preventDefault()}>
          <h2 className="font-serif text-2xl text-ink">Approve or return</h2>
          <p className="text-sm text-muted">Either action takes this item out of the waiting list. A remark is required.</p>
          <label className="grid gap-2 text-sm">Remark
            <textarea className="field min-h-24" value={remark} onChange={(event) => setRemark(event.target.value)} />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => onDecide('approved')}>Approve</button>
            <button type="button" className="min-h-11 border border-line px-4 text-sm" onClick={() => onDecide('returned')}>Return</button>
          </div>
        </form>
      ) : null}
      {state.role === 'requester' && item.status === 'waiting' ? <p className="text-sm text-muted">Switch to Approver. This item is waiting on you in that role.</p> : null}
      {state.role === 'owner' && item.status === 'draft' ? <p className="text-sm text-muted">Switch to Requester to send this draft.</p> : null}
    </article>
  )
}

function Tone({ item }: { item: Item }) {
  const tone = isLate(item) ? 'disputed' : item.status === 'approved' ? 'approved' : item.status === 'returned' ? 'rejected' : item.status === 'waiting' ? 'submitted' : 'draft'
  const label = isLate(item) ? 'Late' : statusLabel(item.status)
  return <span data-status={tone} className="app-status">{label}</span>
}

export function ActivityScreen() {
  const { state } = useWaiting()
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Activity</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Inbox history</h1>
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
