import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatWhen, lineAmount, naira, openBills, statusLabel, type Bill } from './model.ts'
import { useReceiveCheck } from './useReceiveCheck.ts'

const base = '/robes/demo/receivecheck'

export function BillsScreen() {
  const { state } = useReceiveCheck()
  const open = openBills(state.bills)
  const short = state.bills.filter((bill) => bill.status === 'mismatch' || bill.status === 'held').length
  const yard = state.bills.find((bill) => bill.id === 'bill-100')?.yardQty
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Bills</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">What was billed, and what arrived</h1>
        <p className="mt-3 max-w-2xl text-muted">
          A bill stays open when the yard count does not match it. Holding it does not pay the supplier. A corrected bill can be accepted only when the quantities agree.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        <Figure label="Still open" value={String(open.length)} href={`${base}/bills/bill-100`} />
        <Figure label="Short" value={String(short)} href={`${base}/bills/bill-100`} />
        <Figure label="Yard tally" value={yard == null ? '—' : String(yard)} href={`${base}/bills/bill-100`} />
      </div>
      <ol className="grid gap-3">
        {state.bills.map((bill) => (
          <li key={bill.id}>
            <Link to={`${base}/bills/${bill.id}`} className="flex flex-wrap items-center justify-between gap-3 border border-line bg-card p-5 transition hover:border-robes">
              <div>
                <p className="font-medium text-ink">{bill.number} · {bill.goods}</p>
                <p className="mt-1 text-sm text-muted">
                  {bill.supplier} · billed {bill.billedQty}{bill.receivedQty == null ? '' : ` · received ${bill.receivedQty}`} · {naira(lineAmount(bill))}
                </p>
              </div>
              <Tone bill={bill} />
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

export function BillScreen() {
  const { id = '' } = useParams()
  const { state } = useReceiveCheck()
  const bill = state.bills.find((entry) => entry.id === id)
  if (!bill) return <EmptyTitle title="Bill not found" text="It may have been cleared when the demonstration was reset." />
  return <BillDetail bill={bill} />
}

function BillDetail({ bill }: { bill: Bill }) {
  const { state, record, hold, accept } = useReceiveCheck()
  const [quantity, setQuantity] = useState(bill.receivedQty == null ? '' : String(bill.receivedQty))
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const current = state.guide.active && state.guide.focusId === bill.id

  function onRecord() {
    const result = record(bill.id)
    setError(result?.error ?? null)
  }

  function onHold() {
    const result = hold(bill.id)
    setError(result?.error ?? null)
  }

  function onAccept(event: FormEvent) {
    event.preventDefault()
    const result = accept(bill.id, Number(quantity.trim()), note)
    setError(result?.error ?? null)
  }

  return (
    <article className="grid max-w-3xl gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">{bill.supplier}</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{bill.goods}</h1>
        <p className="mt-3 text-muted">{bill.number} · {naira(bill.rate)} each · {naira(lineAmount(bill))}</p>
        <p className="mt-2"><Tone bill={bill} />{current ? <span className="ml-2 text-sm text-muted">Current step</span> : null}</p>
      </header>
      <dl className="grid gap-3 border border-line bg-card p-5 text-sm sm:grid-cols-2">
        <div><dt className="text-muted">Billed quantity</dt><dd className="mt-1 text-ink">{bill.billedQty}</dd></div>
        <div><dt className="text-muted">Received</dt><dd className="mt-1 text-ink">{bill.receivedQty ?? 'Not recorded'}</dd></div>
      </dl>
      {bill.note ? <p className="border border-line bg-card p-4 text-sm text-ink">{bill.note}</p> : null}
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      {state.role === 'clerk' && bill.status === 'waiting' && bill.yardQty != null ? (
        <div className="border border-line bg-card p-5">
          <h2 className="font-serif text-2xl text-ink">Record the yard count</h2>
          <p className="mt-2 text-sm text-muted">The yard counted {bill.yardQty}. The bill says {bill.billedQty}. Recording the count does not change the bill.</p>
          <button type="button" className="mt-4 min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={onRecord}>Record {bill.yardQty} received</button>
        </div>
      ) : null}
      {state.role === 'accounts' && bill.status === 'mismatch' ? (
        <div className="border border-line bg-card p-5">
          <h2 className="font-serif text-2xl text-ink">Hold the bill</h2>
          <p className="mt-2 text-sm text-muted">Billed {bill.billedQty}, received {bill.receivedQty}. Holding it keeps the difference visible. It does not pay or refuse the supplier.</p>
          <button type="button" className="mt-4 min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={onHold}>Hold {bill.number}</button>
        </div>
      ) : null}
      {state.role === 'accounts' && bill.status === 'held' ? (
        <form className="grid gap-4 border border-line bg-card p-5" onSubmit={onAccept}>
          <h2 className="font-serif text-2xl text-ink">Accept the corrected bill</h2>
          <p className="text-sm text-muted">Enter the quantity on the supplier's corrected bill. It has to match the {bill.receivedQty} the yard received.</p>
          <label className="grid gap-2 text-sm">Corrected quantity
            <input className="field" inputMode="numeric" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm">Note
            <textarea className="field min-h-24" value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
          <button type="submit" className="min-h-11 justify-self-start bg-robes-fill px-4 text-sm font-medium text-robes-ink">Accept the corrected bill</button>
        </form>
      ) : null}
      {state.role === 'accounts' && bill.status === 'waiting' ? <p className="text-sm text-muted">Switch to Receiving clerk to record the yard count.</p> : null}
      {state.role === 'clerk' && (bill.status === 'mismatch' || bill.status === 'held') ? <p className="text-sm text-muted">Switch to Accounts. The clerk records the count. Accounts holds the bill and accepts a correction.</p> : null}
    </article>
  )
}

function Tone({ bill }: { bill: Bill }) {
  const tone = bill.status === 'accepted' || bill.status === 'matched' ? 'approved' : bill.status === 'held' ? 'review' : bill.status === 'mismatch' ? 'disputed' : 'draft'
  return <span data-status={tone} className="app-status">{statusLabel(bill.status)}</span>
}

export function ActivityScreen() {
  const { state } = useReceiveCheck()
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Activity</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Bill history</h1>
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
