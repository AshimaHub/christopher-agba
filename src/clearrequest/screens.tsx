import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  actors,
  countStatus,
  formatWhen,
  lowStock,
  materialById,
  materialsFor,
  projectById,
  projectsFor,
  remaining,
  statusLabel,
  stockOf,
  type MaterialRequest,
  type RequestStatus,
} from './model.ts'
import { useClearRequest } from './useClearRequest.ts'

const base = '/robes/demo/clearrequest'

export function OverviewScreen() {
  const { state } = useClearRequest()
  const pending = countStatus(state.requests, 'pending')
  const waiting = countStatus(state.requests, 'approved') + countStatus(state.requests, 'partial')
  const fulfilled = countStatus(state.requests, 'fulfilled')
  const low = lowStock(state.companyId, state.stock)

  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Overview</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">What needs attention</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Requests, approvals, and issues for {actors[state.role].name}. Figures update as you work
          through the demonstration.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Pending approval" value={pending} href={`${base}/approvals`} />
        <Metric label="Waiting to issue" value={waiting} href={`${base}/issuing`} />
        <Metric label="Fulfilled" value={fulfilled} href={`${base}/requests?status=fulfilled`} />
        <Metric label="At or below reorder" value={low.length} href={`${base}/reports`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-line bg-card p-5">
          <h2 className="font-serif text-2xl text-ink">Latest activity</h2>
          <ol className="mt-4 space-y-3">
            {state.activity.slice(0, 5).map((item) => (
              <li key={item.id} className="border-t border-line pt-3 text-sm first:border-t-0 first:pt-0">
                <p className="text-ink">{item.text}</p>
                <p className="text-muted">
                  {item.actor} · {formatWhen(item.at)}
                </p>
              </li>
            ))}
          </ol>
        </section>
        <section className="border border-line bg-card p-5">
          <h2 className="font-serif text-2xl text-ink">Stock that needs a look</h2>
          {low.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Every material is above its reorder level.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {low.map((item) => {
                const material = materialById(state.companyId, item.materialId)
                return (
                  <li key={item.materialId} className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="text-ink">{material?.name}</span>
                    <span className="text-muted">
                      {item.onHand} {material?.unit} on hand
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
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

export function RequestsScreen() {
  const { state } = useClearRequest()
  const [query, setQuery] = useState('')
  const [params, setParams] = useSearchParams()
  const statusParam = params.get('status')
  const activeStatus: RequestStatus | 'all' =
    statusParam === 'pending' || statusParam === 'approved' || statusParam === 'partial' || statusParam === 'fulfilled' || statusParam === 'rejected'
      ? statusParam
      : 'all'

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return state.requests.filter((request) => {
      if (activeStatus !== 'all' && request.status !== activeStatus) return false
      if (!needle) return true
      const project = projectById(state.companyId, request.projectId)?.name ?? ''
      const names = request.lines.map((item) => materialById(state.companyId, item.materialId)?.name ?? '').join(' ')
      return `${request.number} ${project} ${request.requesterName} ${names}`.toLowerCase().includes(needle)
    })
  }, [activeStatus, query, state.companyId, state.requests])

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <header>
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Requests</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Material requests</h1>
        </header>
        {state.role === 'requester' ? (
          <Link to={`${base}/requests/new`} className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">
            New request
          </Link>
        ) : (
          <p className="max-w-xs text-sm text-muted">Switch to Requester to create a request.</p>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_14rem]">
        <input
          className="field"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search number, project, or material"
          aria-label="Search requests"
        />
        <select
          className="field"
          value={activeStatus}
          onChange={(event) => {
            const value = event.target.value
            if (value === 'all') setParams({})
            else setParams({ status: value })
          }}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending approval</option>
          <option value="approved">Approved</option>
          <option value="partial">Partly issued</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <RequestTable rows={rows} empty="No requests match that search." />
    </div>
  )
}

export function NewRequestScreen() {
  const { state, submit } = useClearRequest()
  const navigate = useNavigate()
  const projects = projectsFor(state.companyId)
  const materials = materialsFor(state.companyId)
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '')
  const [reason, setReason] = useState('')
  const [lines, setLines] = useState([{ materialId: '', quantity: '1' }])
  const [error, setError] = useState<string | null>(null)

  if (state.role !== 'requester') {
    return (
      <EmptyTitle
        title="Requesters submit material requests"
        text="Switch the demonstration role to Requester. Approvers and storekeepers cannot create a request."
      />
    )
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const result = submit({ projectId, reason, lines })
    if ('error' in result) {
      setError(result.error)
      return
    }
    navigate(`${base}/requests/${result.id}`)
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-3xl gap-5" noValidate>
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">New request</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Ask for materials</h1>
        <p className="mt-3 text-muted">Submitting sends the request to the approver. Nothing is issued yet.</p>
      </header>
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      <label className="grid gap-2 text-sm">
        Project
        <select className="field" value={projectId} onChange={(event) => setProjectId(event.target.value)}>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        Reason
        <textarea className="field min-h-28" value={reason} onChange={(event) => setReason(event.target.value)} />
      </label>
      <fieldset className="grid gap-3">
        <legend className="text-sm">Materials</legend>
        {lines.map((item, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-[1fr_8rem_auto]">
            <select
              className="field"
              aria-label={`Material ${index + 1}`}
              value={item.materialId}
              onChange={(event) =>
                setLines((current) => current.map((line, lineIndex) => (lineIndex === index ? { ...line, materialId: event.target.value } : line)))
              }
            >
              <option value="">Choose a material</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name} ({material.unit})
                </option>
              ))}
            </select>
            <input
              className="field"
              aria-label={`Quantity ${index + 1}`}
              inputMode="numeric"
              value={item.quantity}
              onChange={(event) =>
                setLines((current) => current.map((line, lineIndex) => (lineIndex === index ? { ...line, quantity: event.target.value } : line)))
              }
            />
            <button
              type="button"
              className="min-h-11 px-3 text-sm text-muted"
              onClick={() => setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))}
              disabled={lines.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="justify-self-start text-sm font-medium text-robes"
          onClick={() => setLines((current) => [...current, { materialId: '', quantity: '1' }])}
        >
          Add another material
        </button>
      </fieldset>
      <button type="submit" className="inline-flex min-h-11 w-fit items-center bg-robes-fill px-5 text-sm font-medium text-robes-ink">
        Submit request
      </button>
    </form>
  )
}

export function RequestDetailScreen() {
  const { id } = useParams()
  const { state } = useClearRequest()
  const request = state.requests.find((item) => item.id === id)
  if (!request) return <EmptyTitle title="Request not found" text="It may have been cleared when the demonstration was reset." />
  return <RequestDetail request={request} />
}

function RequestDetail({ request }: { request: MaterialRequest }) {
  const { state, decide, issue } = useClearRequest()
  const [comment, setComment] = useState('')
  const [quantities, setQuantities] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const project = projectById(state.companyId, request.projectId)

  function onDecide(action: 'approved' | 'rejected') {
    const result = decide(request.id, action, comment)
    setError(result?.error ?? null)
    if (!result) setComment('')
  }

  function onIssue(event: FormEvent) {
    event.preventDefault()
    const result = issue(
      request.id,
      request.lines.map((item) => ({
        materialId: item.materialId,
        quantity: Number(quantities[item.materialId] || 0),
      })),
    )
    setError(result?.error ?? null)
    if (!result) setQuantities({})
  }

  const canDecide = state.role === 'approver' && request.status === 'pending'
  const canIssue = state.role === 'storekeeper' && (request.status === 'approved' || request.status === 'partial')

  return (
    <article className="cr-sheet grid gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">{request.number}</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">{project?.name}</h1>
          <p className="mt-2 text-sm text-muted">
            {request.requesterName} · {formatWhen(request.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={request.status} />
          <button type="button" className="cr-no-print min-h-11 border border-line px-3 text-sm" onClick={() => window.print()}>
            Print summary
          </button>
        </div>
      </header>
      <p className="max-w-3xl text-ink">{request.reason}</p>
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="bg-paper-2 text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Material</th>
              <th className="px-3 py-2 font-medium">Requested</th>
              <th className="px-3 py-2 font-medium">Issued</th>
              <th className="px-3 py-2 font-medium">Still to issue</th>
              <th className="px-3 py-2 font-medium">In stock</th>
            </tr>
          </thead>
          <tbody>
            {request.lines.map((item) => {
              const material = materialById(state.companyId, item.materialId)
              return (
                <tr key={item.materialId} className="border-t border-line">
                  <td className="px-3 py-3">{material?.name}</td>
                  <td className="px-3 py-3">
                    {item.quantity} {material?.unit}
                  </td>
                  <td className="px-3 py-3">{item.issued}</td>
                  <td className="px-3 py-3">{remaining(item)}</td>
                  <td className="px-3 py-3">{stockOf(state.stock, item.materialId)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {request.decision ? (
        <p className="border border-line bg-card p-4 text-sm">
          <span className="font-medium text-ink">{request.decision.action === 'approved' ? 'Approval' : 'Rejection'} note. </span>
          {request.decision.comment}
          <span className="mt-1 block text-muted">
            {request.decision.by} · {formatWhen(request.decision.at)}
          </span>
        </p>
      ) : null}
      {canDecide ? (
        <form
          className="cr-no-print grid gap-3 border border-line bg-card p-4"
          onSubmit={(event) => {
            event.preventDefault()
            onDecide('approved')
          }}
        >
          <label className="grid gap-2 text-sm">
            Comment
            <textarea className="field min-h-24" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Optional for approval. Required if you reject." />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink">
              Approve
            </button>
            <button type="button" className="min-h-11 border border-line px-4 text-sm" onClick={() => onDecide('rejected')}>
              Reject
            </button>
          </div>
        </form>
      ) : null}
      {canIssue ? (
        <form className="cr-no-print grid gap-3 border border-line bg-card p-4" onSubmit={onIssue}>
          <h2 className="font-serif text-2xl">Issue materials</h2>
          {request.lines.filter((item) => remaining(item) > 0).map((item) => {
            const material = materialById(state.companyId, item.materialId)
            return (
              <label key={item.materialId} className="grid gap-2 text-sm sm:grid-cols-[1fr_8rem] sm:items-center">
                <span>
                  {material?.name} · {remaining(item)} still to issue · {stockOf(state.stock, item.materialId)} in stock
                </span>
                <input
                  className="field"
                  inputMode="numeric"
                  aria-label={`Quantity of ${material?.name} to issue`}
                  value={quantities[item.materialId] ?? ''}
                  onChange={(event) => setQuantities((current) => ({ ...current, [item.materialId]: event.target.value }))}
                />
              </label>
            )
          })}
          <button type="submit" className="min-h-11 w-fit bg-robes-fill px-4 text-sm font-medium text-robes-ink">
            Record issue
          </button>
        </form>
      ) : null}
      {request.status === 'rejected' ? (
        <p className="text-sm text-muted">Rejected requests stay closed. Stores cannot issue them.</p>
      ) : null}
      {request.issues.length > 0 ? (
        <section>
          <h2 className="font-serif text-2xl">Issue records</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {request.issues.map((record) => (
              <li key={record.at} className="border-t border-line pt-2">
                {record.lines.map((item) => `${item.quantity} ${materialById(state.companyId, item.materialId)?.name}`).join(', ')} · {record.by} · {formatWhen(record.at)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}

export function ApprovalsScreen() {
  const { state } = useClearRequest()
  const rows = state.requests.filter((request) => request.status === 'pending')
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Approvals</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Waiting for a decision</h1>
        <p className="mt-3 max-w-2xl text-muted">
          {state.role === 'approver'
            ? `${actors.approver.name} can approve or reject these requests.`
            : 'Switch to Approver to decide a request. You can still read the queue.'}
        </p>
      </header>
      <RequestTable rows={rows} empty="Nothing is waiting for approval." />
    </div>
  )
}

export function IssuingScreen() {
  const { state } = useClearRequest()
  const rows = state.requests.filter((request) => request.status === 'approved' || request.status === 'partial')
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Issuing</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Approved, not yet complete</h1>
        <p className="mt-3 max-w-2xl text-muted">
          {state.role === 'storekeeper'
            ? 'Open a request to issue all or part of it. Stock cannot fall below zero.'
            : 'Switch to Storekeeper to issue materials.'}
        </p>
      </header>
      <RequestTable rows={rows} empty="No approved request is waiting for stores." />
    </div>
  )
}

export function ActivityScreen() {
  const { state } = useClearRequest()
  const [query, setQuery] = useState('')
  const rows = state.activity.filter((item) => item.text.toLowerCase().includes(query.trim().toLowerCase()))
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Activity</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">What happened</h1>
      </header>
      <input className="field max-w-md" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the history" aria-label="Search activity" />
      {rows.length === 0 ? (
        <p className="text-sm text-muted">No history matches that search.</p>
      ) : (
        <ol className="border border-line bg-card">
          {rows.map((item) => (
            <li key={item.id} className="border-t border-line px-4 py-3 text-sm first:border-t-0">
              {item.requestId ? (
                <Link to={`${base}/requests/${item.requestId}`} className="text-ink underline decoration-line underline-offset-4">
                  {item.text}
                </Link>
              ) : (
                <span>{item.text}</span>
              )}
              <p className="text-muted">
                {item.actor} · {formatWhen(item.at)}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export function ReportsScreen() {
  const { state } = useClearRequest()
  const materials = materialsFor(state.companyId)
  const statuses: RequestStatus[] = ['pending', 'approved', 'partial', 'fulfilled', 'rejected']
  const issued = materials
    .map((material) => ({
      label: material.name,
      value: state.requests.reduce(
        (sum, request) => sum + (request.lines.find((line) => line.materialId === material.id)?.issued ?? 0),
        0,
      ),
    }))
    .filter((item) => item.value > 0)
  const stockBars = state.stock.map((item) => ({
    label: materialById(state.companyId, item.materialId)?.name ?? item.materialId,
    value: item.onHand,
  }))

  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Reports</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">A picture of the queue</h1>
        <p className="mt-3 max-w-2xl text-muted">These counts come from the requests and stock in this browser.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <Chart title="Requests by status" items={statuses.map((status) => ({ label: statusLabel(status), value: countStatus(state.requests, status) }))} />
        <Chart title="Quantity issued so far" items={issued.length ? issued : [{ label: 'Nothing issued yet', value: 0 }]} />
        <Chart title="Stock on hand" items={stockBars} />
      </div>
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
            <div className="flex justify-between gap-4 text-sm">
              <span>{item.label}</span>
              <span className="text-muted">{item.value}</span>
            </div>
            <div className="mt-1 h-2 bg-paper">
              <div className="h-2 bg-robes-fill" style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RequestTable({ rows, empty }: { rows: MaterialRequest[]; empty: string }) {
  const { state } = useClearRequest()
  if (rows.length === 0) return <p className="text-sm text-muted">{empty}</p>
  return (
    <div className="overflow-x-auto border border-line bg-card">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead className="bg-paper-2 text-muted">
          <tr>
            <th className="px-3 py-2 font-medium">Request</th>
            <th className="px-3 py-2 font-medium">Project</th>
            <th className="px-3 py-2 font-medium">Requester</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">When</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((request) => (
            <tr key={request.id} className="border-t border-line">
              <td className="px-3 py-3">
                <Link to={`${base}/requests/${request.id}`} className="font-medium text-ink underline decoration-line underline-offset-4">
                  {request.number}
                </Link>
              </td>
              <td className="px-3 py-3">{projectById(state.companyId, request.projectId)?.name}</td>
              <td className="px-3 py-3">{request.requesterName}</td>
              <td className="px-3 py-3">
                <StatusPill status={request.status} />
              </td>
              <td className="px-3 py-3 text-muted">{formatWhen(request.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function StatusPill({ status }: { status: RequestStatus }) {
  return (
    <span className="inline-flex items-center border border-line px-2 py-1 text-xs font-medium tracking-wide text-ink uppercase">
      {statusLabel(status)}
    </span>
  )
}

function EmptyTitle({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">{title}</h1>
      <p className="mt-3 max-w-xl text-muted">{text}</p>
    </div>
  )
}
