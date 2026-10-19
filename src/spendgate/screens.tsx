import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  amount,
  approvedTotal,
  categoriesFor,
  countStatus,
  formatWhen,
  naira,
  siteById,
  sitesFor,
  statusLabel,
  type Sheet,
  type SheetStatus,
} from './model.ts'
import { useSpendGate } from './useSpendGate.ts'

const base = '/robes/demo/spendgate'

export function OverviewScreen() {
  const { state } = useSpendGate()
  const approved = approvedTotal(state.sheets)
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Overview</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Expense sheets waiting on a decision</h1>
        <p className="mt-3 max-w-2xl text-muted">
          A site buyer drafts a sheet and submits it. An approver opens it, then approves or rejects it with a remark. The person who submitted a sheet cannot approve it.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Figure label="Drafts" value={String(countStatus(state.sheets, 'draft'))} href={`${base}/claims?status=draft`} />
        <Figure label="Waiting" value={String(countStatus(state.sheets, 'submitted') + countStatus(state.sheets, 'review'))} href={`${base}/review`} />
        <Figure label="Approved" value={naira(approved)} href={`${base}/funding`} />
        <Figure label="Rejected" value={String(countStatus(state.sheets, 'rejected'))} href={`${base}/claims?status=rejected`} />
      </div>
      <section className="border border-line bg-card p-5">
        <h2 className="font-serif text-2xl text-ink">Latest decisions</h2>
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

export function ClaimsScreen() {
  const { state } = useSpendGate()
  const [query, setQuery] = useState('')
  const [params, setParams] = useSearchParams()
  const statusParam = params.get('status')
  const active: SheetStatus | 'all' =
    statusParam === 'draft' || statusParam === 'submitted' || statusParam === 'review' || statusParam === 'approved' || statusParam === 'rejected'
      ? statusParam
      : 'all'
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return state.sheets.filter((sheet) => {
      if (active !== 'all' && sheet.status !== active) return false
      if (!needle) return true
      return `${sheet.number} ${siteById(state.companyId, sheet.siteId)?.name ?? ''} ${sheet.purpose}`.toLowerCase().includes(needle)
    })
  }, [active, query, state.companyId, state.sheets])

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <header>
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Sheets</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Expense sheets</h1>
        </header>
        {state.role === 'submitter' ? (
          <Link to={`${base}/claims/new`} className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">New sheet</Link>
        ) : (
          <p className="max-w-xs text-sm text-muted">Switch to Submitter to raise a sheet.</p>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_14rem]">
        <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sheet or site" aria-label="Search sheets" />
        <select className="field" aria-label="Filter by status" value={active} onChange={(event) => { const value = event.target.value; if (value === 'all') setParams({}); else setParams({ status: value }) }}>
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="review">Under review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <SheetTable rows={rows} empty="No sheets match that search." />
    </div>
  )
}

export function NewClaimScreen() {
  const { state, submit } = useSpendGate()
  const navigate = useNavigate()
  const sites = sitesFor(state.companyId)
  const categories = categoriesFor(state.companyId)
  const [siteId, setSiteId] = useState(sites[0]?.id ?? '')
  const [purpose, setPurpose] = useState('')
  const [lines, setLines] = useState([{ category: categories[0] ?? '', description: '', amount: '' }])
  const [error, setError] = useState<string | null>(null)

  if (state.role !== 'submitter') {
    return <EmptyTitle title="Submitters raise the sheet" text="Switch the demonstration role to Submitter before an expense is written." />
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const result = submit({ siteId, purpose, lines })
    if ('error' in result) { setError(result.error); return }
    navigate(`${base}/claims/${result.id}`)
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-3xl gap-5" noValidate>
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">New sheet</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Submit an expense</h1>
        <p className="mt-3 text-muted">Submitting sends the sheet to an approver. You cannot approve your own sheet.</p>
      </header>
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      <label className="grid gap-2 text-sm">Site
        <select className="field" value={siteId} onChange={(event) => setSiteId(event.target.value)}>{sites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}</select>
      </label>
      <label className="grid gap-2 text-sm">What the money is for
        <textarea className="field min-h-24" value={purpose} onChange={(event) => setPurpose(event.target.value)} />
      </label>
      <fieldset className="grid gap-3">
        <legend className="text-sm">Lines</legend>
        {lines.map((line, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-[10rem_1fr_8rem_auto]">
            <select className="field" aria-label={`Category ${index + 1}`} value={line.category} onChange={(event) => setLines((current) => current.map((item, lineIndex) => lineIndex === index ? { ...item, category: event.target.value } : item))}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
            <input className="field" aria-label={`Description ${index + 1}`} value={line.description} onChange={(event) => setLines((current) => current.map((item, lineIndex) => lineIndex === index ? { ...item, description: event.target.value } : item))} />
            <input className="field" aria-label={`Amount ${index + 1}`} inputMode="numeric" value={line.amount} onChange={(event) => setLines((current) => current.map((item, lineIndex) => lineIndex === index ? { ...item, amount: event.target.value } : item))} placeholder="₦" />
            <button type="button" className="min-h-11 px-3 text-sm text-muted" disabled={lines.length === 1} onClick={() => setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))}>Remove</button>
          </div>
        ))}
        <button type="button" className="justify-self-start text-sm font-medium text-robes" onClick={() => setLines((current) => [...current, { category: 'Fuel', description: '', amount: '' }])}>Add another line</button>
      </fieldset>
      <button type="submit" className="inline-flex min-h-11 w-fit items-center bg-robes-fill px-5 text-sm font-medium text-robes-ink">Submit sheet</button>
    </form>
  )
}

export function ClaimDetailScreen() {
  const { id } = useParams()
  const { state } = useSpendGate()
  const sheet = state.sheets.find((item) => item.id === id)
  if (!sheet) return <EmptyTitle title="Sheet not found" text="It may have been cleared when the demonstration was reset." />
  return <SheetDetail sheet={sheet} />
}

function SheetDetail({ sheet }: { sheet: Sheet }) {
  const { state, send, startReview, decide } = useSpendGate()
  const [remark, setRemark] = useState('')
  const [error, setError] = useState<string | null>(null)
  const canSend = state.role === 'submitter' && sheet.status === 'draft'
  const canReview = state.role === 'approver' && sheet.status === 'submitted'
  const canDecide = state.role === 'approver' && (sheet.status === 'submitted' || sheet.status === 'review')

  return (
    <article className="grid gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">{sheet.number}</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">{naira(amount(sheet))}</h1>
          <p className="mt-2 text-sm text-muted">{siteById(state.companyId, sheet.siteId)?.name} · {sheet.submitterName} · {formatWhen(sheet.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={sheet.status} />
          <button type="button" className="cr-no-print min-h-11 border border-line px-3 text-sm" onClick={() => window.print()}>Print sheet</button>
        </div>
      </header>
      <p className="max-w-3xl text-ink">{sheet.purpose}</p>
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="bg-paper-2 text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium">Description</th>
              <th className="px-3 py-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {sheet.lines.map((line, index) => (
              <tr key={`${line.category}-${index}`} className="border-t border-line">
                <td className="px-3 py-3">{line.category}</td>
                <td className="px-3 py-3">{line.description}</td>
                <td className="px-3 py-3">{naira(line.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sheet.decision ? <p className="border border-line bg-card p-4 text-sm"><span className="font-medium text-ink">{sheet.decision.action === 'approved' ? 'Approved. ' : 'Rejected. '}</span>{sheet.decision.remark}<span className="mt-1 block text-muted">{sheet.decision.by} · {formatWhen(sheet.decision.at)}</span></p> : null}
      {canSend ? <button type="button" className="cr-no-print min-h-11 w-fit bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => setError(send(sheet.id)?.error ?? null)}>Submit for approval</button> : null}
      {canReview ? <button type="button" className="cr-no-print min-h-11 w-fit border border-line px-4 text-sm" onClick={() => setError(startReview(sheet.id)?.error ?? null)}>Open for review</button> : null}
      {canDecide ? (
        <form className="cr-no-print grid gap-3 border border-line bg-card p-4" onSubmit={(event) => event.preventDefault()}>
          <label className="grid gap-2 text-sm">Remark
            <textarea className="field min-h-24" value={remark} onChange={(event) => setRemark(event.target.value)} placeholder="Required for approval and for rejection." />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => setError(decide(sheet.id, 'approved', remark)?.error ?? null)}>Approve</button>
            <button type="button" className="min-h-11 border border-line px-4 text-sm" onClick={() => setError(decide(sheet.id, 'rejected', remark)?.error ?? null)}>Reject</button>
          </div>
        </form>
      ) : null}
    </article>
  )
}

export function ReviewScreen() {
  const { state } = useSpendGate()
  const rows = state.sheets.filter((sheet) => sheet.status === 'submitted' || sheet.status === 'review')
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Review</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Waiting for a decision</h1>
        <p className="mt-3 max-w-2xl text-muted">Submitted sheets can be opened for review. Approval and rejection both need a remark.</p>
      </header>
      <SheetTable rows={rows} empty="Nothing is waiting." />
    </div>
  )
}

export function FinanceScreen() {
  const { state } = useSpendGate()
  const rows = state.sheets.filter((sheet) => sheet.status === 'review')
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Decisions</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Under review</h1>
        <p className="mt-3 max-w-2xl text-muted">{state.role === 'approver' ? 'Approve or reject these sheets. You cannot decide a sheet you submitted.' : 'Switch to Approver to decide a sheet.'}</p>
      </header>
      <SheetTable rows={rows} empty="No sheet is under review." />
    </div>
  )
}

export function FundingScreen() {
  const { state } = useSpendGate()
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Approved</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Approved spend by site</h1>
        <p className="mt-3 max-w-2xl text-muted">Only approved sheets are counted. Rejected and draft sheets stay out of the total.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {sitesFor(state.companyId).map((site) => (
          <section key={site.id} className="border border-line bg-card p-5">
            <h2 className="font-serif text-2xl text-ink">{site.name}</h2>
            <p className="mt-3 font-serif text-3xl">{naira(approvedTotal(state.sheets, site.id))}</p>
          </section>
        ))}
      </div>
    </div>
  )
}

export function ActivityScreen() {
  const { state } = useSpendGate()
  const [query, setQuery] = useState('')
  const rows = state.activity.filter((item) => item.text.toLowerCase().includes(query.trim().toLowerCase()))
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Activity</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">How each sheet moved</h1>
      </header>
      <input className="field max-w-md" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the history" aria-label="Search activity" />
      {rows.length === 0 ? <p className="text-sm text-muted">No history matches that search.</p> : (
        <ol className="border border-line bg-card">
          {rows.map((item) => (
            <li key={item.id} className="border-t border-line px-4 py-3 text-sm first:border-t-0">
              {item.sheetId ? <Link to={`${base}/claims/${item.sheetId}`} className="text-ink underline decoration-line underline-offset-4">{item.text}</Link> : <span>{item.text}</span>}
              <p className="text-muted">{item.actor} · {formatWhen(item.at)}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function SheetTable({ rows, empty }: { rows: Sheet[]; empty: string }) {
  const { state } = useSpendGate()
  if (rows.length === 0) return <p className="text-sm text-muted">{empty}</p>
  return (
    <div className="overflow-x-auto border border-line bg-card">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead className="bg-paper-2 text-muted">
          <tr>
            <th className="px-3 py-2 font-medium">Sheet</th>
            <th className="px-3 py-2 font-medium">Site</th>
            <th className="px-3 py-2 font-medium">Amount</th>
            <th className="px-3 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((sheet) => (
            <tr key={sheet.id} className="border-t border-line">
              <td className="px-3 py-3"><Link to={`${base}/claims/${sheet.id}`} className="font-medium text-ink underline decoration-line underline-offset-4">{sheet.number}</Link></td>
              <td className="px-3 py-3">{siteById(state.companyId, sheet.siteId)?.name}</td>
              <td className="px-3 py-3">{naira(amount(sheet))}</td>
              <td className="px-3 py-3"><StatusPill status={sheet.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusPill({ status }: { status: SheetStatus }) {
  return <span className="inline-flex items-center border border-line px-2 py-1 text-xs font-medium tracking-wide text-ink uppercase">{statusLabel(status)}</span>
}

function EmptyTitle({ title, text }: { title: string; text: string }) {
  return <div><h1 className="font-serif text-4xl text-ink">{title}</h1><p className="mt-3 max-w-xl text-muted">{text}</p></div>
}
