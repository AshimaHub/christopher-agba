import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  assetName,
  earlierPatch,
  formatWhen,
  isRepeat,
  naira,
  openJobs,
  plannedOn,
  spentOn,
  statusLabel,
  type Job,
} from './model.ts'
import { useRepairLog } from './useRepairLog.ts'

const base = '/robes/demo/repairlog'

export function LogScreen() {
  const { state } = useRepairLog()
  const open = openJobs(state.jobs)
  const repeats = state.assets.filter((asset) => state.jobs.some((job) => job.assetId === asset.id && isRepeat(state.jobs, job))).length
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Repair log</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Faults, fixes, and what they cost</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Each fault stays on the asset. A temporary repair stays visible when the same fault comes back, with the money already spent.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        <Figure label="Still open" value={String(open.length)} href={`${base}/jobs/job-22`} />
        <Figure label="Repeat faults" value={String(repeats)} href={`${base}/assets/asset-1`} />
        <Figure label="Spent so far" value={naira(spentOn(state.jobs))} href={`${base}/assets/asset-1`} />
      </div>
      <ol className="grid gap-3">
        {state.jobs
          .slice()
          .sort((left, right) => left.opened.localeCompare(right.opened))
          .map((job) => (
            <li key={job.id}>
              <Link to={`${base}/jobs/${job.id}`} className="flex flex-wrap items-center justify-between gap-3 border border-line bg-card p-5 transition hover:border-robes">
                <div>
                  <p className="font-medium text-ink">{job.number} · {job.fault}</p>
                  <p className="mt-1 text-sm text-muted">{assetName(state, job.assetId)} · {job.opened}{typeof job.cost === 'number' ? ` · ${naira(job.cost)}` : ''}</p>
                </div>
                <Tone job={job} />
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

export function JobScreen() {
  const { id = '' } = useParams()
  const { state, reviewJob } = useRepairLog()
  const job = state.jobs.find((entry) => entry.id === id)
  useEffect(() => {
    reviewJob(id)
  }, [reviewJob, id, state.role, job?.status])
  if (!job) return <EmptyTitle title="Job not found" text="It may have been cleared when the demonstration was reset." />
  return <JobDetail job={job} />
}

function JobDetail({ job }: { job: Job }) {
  const { state, file, schedule } = useRepairLog()
  const [plan, setPlan] = useState('')
  const [cost, setCost] = useState('')
  const [error, setError] = useState<string | null>(null)
  const patch = earlierPatch(state.jobs, job)
  const current = state.guide.active && state.guide.focusId === job.id
  const name = assetName(state, job.assetId)

  function onFile() {
    const result = file(job.id)
    setError(result?.error ?? null)
  }

  function onSchedule(event: FormEvent) {
    event.preventDefault()
    const amount = Number(cost.trim())
    const result = schedule(job.id, plan, amount)
    setError(result?.error ?? null)
  }

  return (
    <article className="grid max-w-3xl gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">{name}</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{job.fault}</h1>
        <p className="mt-3 text-muted">{job.number} · opened {job.opened}</p>
        <p className="mt-2"><Tone job={job} />{current ? <span className="ml-2 text-sm text-muted">Current step</span> : null}</p>
      </header>
      {patch && isRepeat(state.jobs, job) ? (
        <p className="border border-line bg-card p-4 text-sm text-ink">
          This fault came back. {patch.number} on {patch.opened} was a temporary repair: {patch.fix}. That cost {naira(patch.cost ?? 0)}.
        </p>
      ) : null}
      {job.fix && job.status !== 'draft' ? <p className="border border-line bg-card p-4 text-sm text-ink">{job.by}: {job.fix}{typeof job.cost === 'number' ? ` · ${naira(job.cost)}` : ''}</p> : null}
      <p className="text-sm text-muted">
        <Link to={`${base}/assets/${job.assetId}`} className="underline">All jobs on {name}</Link>
        {' · '}spent {naira(spentOn(state.jobs, job.assetId))}
        {plannedOn(state.jobs, job.assetId) > 0 ? ` · planned ${naira(plannedOn(state.jobs, job.assetId))}` : ''}
      </p>
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      {state.role === 'mechanic' && job.status === 'draft' ? (
        <div className="border border-line bg-card p-5">
          <h2 className="font-serif text-2xl text-ink">File the return</h2>
          <p className="mt-2 text-sm text-muted">Filing puts this fault on the asset again. You record it. The workshop lead books the proper repair.</p>
          <button type="button" className="mt-4 min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={onFile}>File {job.number}</button>
        </div>
      ) : null}
      {state.role === 'lead' && job.status === 'open' ? (
        <form className="grid gap-4 border border-line bg-card p-5" onSubmit={onSchedule}>
          <h2 className="font-serif text-2xl text-ink">Book the proper repair</h2>
          <p className="text-sm text-muted">Say what will be replaced, and the planned cost. Another patch leaves the same fault on the asset.</p>
          <label className="grid gap-2 text-sm">What the repair will do
            <textarea className="field min-h-24" value={plan} onChange={(event) => setPlan(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm">Planned cost (naira)
            <input className="field" inputMode="numeric" value={cost} onChange={(event) => setCost(event.target.value)} />
          </label>
          <button type="submit" className="min-h-11 justify-self-start bg-robes-fill px-4 text-sm font-medium text-robes-ink">Book the proper repair</button>
        </form>
      ) : null}
      {state.role === 'mechanic' && job.status === 'open' ? <p className="text-sm text-muted">Switch to Workshop lead. The mechanic files the fault. The lead books the repair.</p> : null}
      {state.role === 'lead' && job.status === 'draft' ? <p className="text-sm text-muted">Switch to Mechanic to file this draft.</p> : null}
    </article>
  )
}

export function AssetScreen() {
  const { id = '' } = useParams()
  const { state } = useRepairLog()
  const asset = state.assets.find((entry) => entry.id === id)
  if (!asset) return <EmptyTitle title="Asset not found" text="It may have been cleared when the demonstration was reset." />
  const jobs = state.jobs.filter((job) => job.assetId === asset.id).slice().sort((left, right) => left.opened.localeCompare(right.opened))
  const repeat = jobs.some((job) => isRepeat(state.jobs, job))
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Asset</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{asset.name}</h1>
        <p className="mt-3 text-muted">Spent {naira(spentOn(state.jobs, asset.id))}{plannedOn(state.jobs, asset.id) > 0 ? ` · planned ${naira(plannedOn(state.jobs, asset.id))}` : ''} across {jobs.length} jobs.</p>
      </header>
      {repeat ? <p className="border border-line bg-card p-4 text-sm text-ink">The same fault has come back. The earlier job was a temporary repair.</p> : null}
      <ol className="grid gap-3">
        {jobs.map((job) => (
          <li key={job.id}>
            <Link to={`${base}/jobs/${job.id}`} className="flex flex-wrap items-center justify-between gap-3 border border-line bg-card p-5 transition hover:border-robes">
              <div>
                <p className="font-medium text-ink">{job.number} · {job.fault}</p>
                <p className="mt-1 text-sm text-muted">{job.fix ?? 'No repair booked yet'}{typeof job.cost === 'number' ? ` · ${naira(job.cost)}` : ''}</p>
              </div>
              <Tone job={job} />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Tone({ job }: { job: Job }) {
  const tone = job.status === 'scheduled' ? 'accepted' : job.status === 'open' ? 'disputed' : job.fixKind === 'proper' ? 'completed' : job.fixKind === 'temporary' ? 'submitted' : 'draft'
  return <span data-status={tone} className="app-status">{statusLabel(job)}</span>
}

export function ActivityScreen() {
  const { state } = useRepairLog()
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Activity</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Repair history</h1>
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
