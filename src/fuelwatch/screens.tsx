import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { CompanyId } from '../content/demoCompanies.ts'
import {
  bookFor,
  formatDay,
  formatWhen,
  guideLitres,
  issueCost,
  machineById,
  naira,
  statusLabel,
  type Issue,
} from './model.ts'
import { useFuelWatch } from './useFuelWatch.ts'

const base = '/robes/demo/fuelwatch'

export function OverviewScreen() {
  const { state } = useFuelWatch()
  const open = state.issues.filter((issue) => issue.status === 'flagged')
  const postedLitres = state.issues.filter((issue) => issue.status !== 'draft').reduce((sum, issue) => sum + issue.litres, 0)
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Overview</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Which fuel issue does not match the hours</h1>
        <p className="mt-3 max-w-2xl text-muted">
          A fuel clerk posts litres against a machine and the hours it worked. A day is unusual when the litres are more than one and a half times that machine's guide. The guide is a sample rate, not a sensor.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Figure label="Unusual, unexplained" value={String(open.length)} href={`${base}/issues/issue-flag`} />
        <Figure label="Draft issues" value={String(state.issues.filter((issue) => issue.status === 'draft').length)} href={`${base}/issues/issue-draft`} />
        <Figure label="Litres posted" value={String(postedLitres)} href={`${base}/issues`} />
        <Figure label="Open exception" value={open[0] ? naira(issueCost(state.companyId, open[0].litres)) : 'None'} href={`${base}/issues/issue-flag`} />
      </div>
      <section className="border border-line bg-card p-5">
        <h2 className="font-serif text-2xl text-ink">Latest issues</h2>
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

export function IssuesScreen() {
  const { state } = useFuelWatch()
  const rows = state.issues.slice().sort((left, right) => right.date.localeCompare(left.date))
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Issues</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Fuel issues</h1>
      </header>
      <IssueTable rows={rows} companyId={state.companyId} />
    </div>
  )
}

export function MachinesScreen() {
  const { state } = useFuelWatch()
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Machines</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Litres against hours</h1>
        <p className="mt-3 max-w-2xl text-muted">Posted issues only. Drafts are not in these totals. {naira(bookFor(state.companyId).price)} per litre in this sample.</p>
      </header>
      <div className="grid gap-3">
        {bookFor(state.companyId).machines.map((machine) => {
          const issues = state.issues.filter((issue) => issue.machineId === machine.id && issue.status !== 'draft')
          const litres = issues.reduce((sum, issue) => sum + issue.litres, 0)
          const hours = issues.reduce((sum, issue) => sum + issue.hours, 0)
          const unusual = issues.some((issue) => issue.status === 'flagged')
          return (
            <article key={machine.id} className="border border-line bg-card p-5">
              <p className="font-medium text-ink">{machine.name}</p>
              <p className="mt-1 text-sm text-muted">{machine.place} · guide {machine.litresPerHour} litres an hour</p>
              <p className="mt-3 font-serif text-2xl text-ink">{litres} L · {hours} h</p>
              <p className="mt-1 text-sm text-muted">{unusual ? 'One day on this machine is still unexplained.' : 'No open exception.'}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export function IssueScreen() {
  const { id = '' } = useParams()
  const { state, reviewIssue } = useFuelWatch()
  const issue = state.issues.find((item) => item.id === id)
  useEffect(() => {
    reviewIssue(id)
  }, [reviewIssue, id, state.role, issue?.status])
  if (!issue) return <EmptyTitle title="Issue not found" text="It may have been cleared when the demonstration was reset." />
  return <IssueDetail issue={issue} />
}

function IssueDetail({ issue }: { issue: Issue }) {
  const { state, post, explain } = useFuelWatch()
  const machine = machineById(state.companyId, issue.machineId)
  const [litres, setLitres] = useState(String(issue.litres))
  const [hours, setHours] = useState(String(issue.hours))
  const [explanation, setExplanation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const guide = guideLitres(state.companyId, issue.machineId, issue.hours)
  const current = state.guide.active && state.guide.focusId === issue.id

  function onPost(event: FormEvent) {
    event.preventDefault()
    const result = post(issue.id, Number(litres), Number(hours))
    setError(result?.error ?? null)
  }

  function onExplain(event: FormEvent) {
    event.preventDefault()
    const result = explain(issue.id, explanation)
    setError(result?.error ?? null)
  }

  return (
    <article className="grid max-w-3xl gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">{machine?.name}</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{issue.number} · {formatDay(issue.date)}</h1>
        <p className="mt-3 text-muted">{issue.litres} litres · {issue.hours} hours worked · guide {guide} litres · {naira(issueCost(state.companyId, issue.litres))}</p>
        <p className="mt-2"><Status issue={issue} />{current ? <span className="ml-2 text-sm text-muted">Current step</span> : null}</p>
      </header>
      <p className="text-sm text-ink">{issue.note}</p>
      {issue.status === 'flagged' ? <p className="border border-line bg-card p-4 text-sm text-ink">This issue is above the guide, and the explanation is missing.</p> : null}
      {issue.explanation ? <p className="border border-line bg-card p-4 text-sm text-ink">{issue.explanation}</p> : null}
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      {state.role === 'issuer' && issue.status === 'draft' ? (
        <form onSubmit={onPost} className="grid gap-4 border border-line bg-card p-5" noValidate>
          <h2 className="font-serif text-2xl text-ink">Post this issue</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">Litres
              <input className="field" inputMode="numeric" value={litres} onChange={(event) => setLitres(event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm">Hours worked
              <input className="field" inputMode="numeric" value={hours} onChange={(event) => setHours(event.target.value)} />
            </label>
          </div>
          <button type="submit" className="inline-flex min-h-11 w-fit items-center bg-robes-fill px-5 text-sm font-medium text-robes-ink">Post issue</button>
        </form>
      ) : null}
      {state.role === 'supervisor' && issue.status === 'flagged' ? (
        <form onSubmit={onExplain} className="grid gap-4 border border-line bg-card p-5" noValidate>
          <h2 className="font-serif text-2xl text-ink">Explain this day</h2>
          <p className="text-sm text-muted">The litres stay on the record. The explanation is what was missing.</p>
          <label className="grid gap-2 text-sm">Why it is above the guide
            <textarea className="field min-h-24" value={explanation} onChange={(event) => setExplanation(event.target.value)} />
          </label>
          <button type="submit" className="inline-flex min-h-11 w-fit items-center bg-robes-fill px-5 text-sm font-medium text-robes-ink">Save explanation</button>
        </form>
      ) : null}
      {state.role === 'issuer' && issue.status === 'flagged' ? <p className="text-sm text-muted">Switch to Plant supervisor to explain this day.</p> : null}
      {state.role === 'supervisor' && issue.status === 'draft' ? <p className="text-sm text-muted">Switch to Fuel clerk to post this draft.</p> : null}
    </article>
  )
}

function IssueTable({ rows, companyId }: { rows: Issue[]; companyId: CompanyId }) {
  return (
    <div className="overflow-x-auto border border-line bg-card">
      <table className="w-full min-w-[42rem] text-left text-sm">
        <thead className="border-b border-line text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Issue</th>
            <th className="px-4 py-3 font-medium">Machine</th>
            <th className="px-4 py-3 font-medium">Litres</th>
            <th className="px-4 py-3 font-medium">Hours</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((issue) => (
            <tr key={issue.id} className="border-t border-line">
              <td className="px-4 py-3"><Link className="font-medium text-robes" to={`${base}/issues/${issue.id}`}>{issue.number}</Link><p className="text-muted">{formatDay(issue.date)}</p></td>
              <td className="px-4 py-3">{machineById(companyId, issue.machineId)?.name}</td>
              <td className="px-4 py-3">{issue.litres}</td>
              <td className="px-4 py-3">{issue.hours}</td>
              <td className="px-4 py-3"><Status issue={issue} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Status({ issue }: { issue: Issue }) {
  const tone = issue.status === 'posted' ? 'completed' : issue.status === 'flagged' ? 'disputed' : issue.status === 'explained' ? 'approved' : issue.status
  return <span data-status={tone} className="app-status">{statusLabel(issue.status)}</span>
}

export function ActivityScreen() {
  const { state } = useFuelWatch()
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Activity</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Issue history</h1>
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
