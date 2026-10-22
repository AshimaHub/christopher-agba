import type { CompanyId } from '../content/demoCompanies.ts'
import { repairSamples, type FixKind, type JobStatus, type SampleJob } from './samples.ts'

export type Role = 'mechanic' | 'lead'
export type { FixKind, JobStatus }

export type Job = SampleJob
export type Activity = { id: string; at: string; actor: string; text: string }
export type Notice = { id: string; at: string; text: string; read: boolean }
export type GuideState = { active: boolean; step: 1 | 2 | 3 | 4; focusId: string }

export type DemoState = {
  companyId: CompanyId
  role: Role
  assets: { id: string; name: string }[]
  jobs: Job[]
  activity: Activity[]
  notices: Notice[]
  guide: GuideState
}

export const actors: Record<Role, { name: string; title: string }> = {
  mechanic: { name: 'Jonah Hale', title: 'Mechanic' },
  lead: { name: 'Malik Adeyemi', title: 'Workshop lead' },
}

export function naira(value: number) {
  return `₦${value.toLocaleString('en-GB')}`
}

export function assetName(state: DemoState, assetId: string) {
  return state.assets.find((asset) => asset.id === assetId)?.name ?? 'Asset'
}

export function sameFault(left: Job, right: Job) {
  return left.assetId === right.assetId && left.fault.trim().toLowerCase() === right.fault.trim().toLowerCase()
}

export function earlierPatch(jobs: Job[], job: Job) {
  return jobs.find((other) => other.id !== job.id && sameFault(other, job) && other.status === 'closed' && other.fixKind === 'temporary' && other.opened < job.opened)
}

export function isRepeat(jobs: Job[], job: Job) {
  return Boolean(earlierPatch(jobs, job)) && (job.status === 'draft' || job.status === 'open' || job.status === 'scheduled')
}

export function statusLabel(job: Job) {
  if (job.status === 'draft') return 'Draft'
  if (job.status === 'open') return 'Open'
  if (job.status === 'scheduled') return 'Booked'
  if (job.fixKind === 'temporary') return 'Patched'
  return 'Repaired'
}

export function spentOn(jobs: Job[], assetId?: string) {
  return jobs
    .filter((job) => (assetId ? job.assetId === assetId : true) && job.status === 'closed' && typeof job.cost === 'number')
    .reduce((sum, job) => sum + (job.cost ?? 0), 0)
}

export function plannedOn(jobs: Job[], assetId?: string) {
  return jobs
    .filter((job) => (assetId ? job.assetId === assetId : true) && job.status === 'scheduled' && typeof job.cost === 'number')
    .reduce((sum, job) => sum + (job.cost ?? 0), 0)
}

function at(date: string) {
  return `${date}T09:20:00.000Z`
}

export function createSeed(companyId: CompanyId = 'harbour'): DemoState {
  const sample = repairSamples[companyId]
  const assets = sample.assets.map((asset) => ({ ...asset }))
  const jobs = sample.jobs.map((job) => ({ ...job }))
  const named = (assetId: string) => assets.find((asset) => asset.id === assetId)?.name ?? 'Asset'
  const activity: Activity[] = jobs
    .filter((job) => job.status === 'closed')
    .map((job) => ({
      id: `${job.id}-seed`,
      at: at(job.opened),
      actor: job.by ?? actors.mechanic.name,
      text: `${job.number} closed on ${named(job.assetId)}. ${job.fix}`,
    }))
    .sort((left, right) => right.at.localeCompare(left.at))
  const draft = jobs.find((job) => job.id === 'job-22')
  const patch = earlierPatch(jobs, draft ?? jobs[0])
  const notices: Notice[] = draft
    ? [{ id: 'job-22-n', at: at(draft.opened), text: `${draft.number} is still a draft. ${named(draft.assetId)} had a temporary repair on ${patch?.number ?? 'an earlier job'}.`, read: false }]
    : []
  return {
    companyId,
    role: 'mechanic',
    assets,
    jobs,
    activity,
    notices,
    guide: { active: true, step: 1, focusId: 'job-22' },
  }
}

function record(state: DemoState, next: Job, now: string, actor: string, text: string, guide = state.guide): DemoState {
  return {
    ...state,
    jobs: state.jobs.map((job) => (job.id === next.id ? next : job)),
    activity: [{ id: `act-${now}-${next.id}`, at: now, actor, text }, ...state.activity],
    notices: [{ id: `n-${now}-${next.id}`, at: now, text, read: false }, ...state.notices],
    guide,
  }
}

export function fileFault(state: DemoState, jobId: string, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'mechanic') return { error: 'Switch to Mechanic to file this fault.' }
  const current = state.jobs.find((job) => job.id === jobId)
  if (!current) return { error: 'That job is no longer in this demonstration.' }
  if (current.status !== 'draft') return { error: 'Only a draft fault can be filed.' }
  const next: Job = { ...current, status: 'open', by: actors.mechanic.name }
  const guide = state.guide.active && state.guide.step === 1 && jobId === 'job-22'
    ? { active: true as const, step: 2 as const, focusId: 'job-22' }
    : state.guide
  const patch = earlierPatch(state.jobs, current)
  const text = patch
    ? `Filed ${current.number} on ${assetName(state, current.assetId)}. Same fault as ${patch.number}, which was only a temporary repair.`
    : `Filed ${current.number} on ${assetName(state, current.assetId)}.`
  return { state: record(state, next, now, actors.mechanic.name, text, guide) }
}

export function scheduleJob(state: DemoState, jobId: string, plan: string, cost: number, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'lead') return { error: 'Switch to Workshop lead to book the proper repair.' }
  const current = state.jobs.find((job) => job.id === jobId)
  if (!current) return { error: 'That job is no longer in this demonstration.' }
  if (current.by === actors.lead.name) return { error: 'You cannot book a repair you filed.' }
  if (current.status !== 'open') return { error: 'File the fault before booking a repair.' }
  const patch = earlierPatch(state.jobs, current)
  if (!patch) return { error: 'Book a proper repair when the same fault has already been patched.' }
  const trimmed = plan.trim()
  if (trimmed.length < 8) return { error: 'Say what the proper repair will do.' }
  if (!Number.isInteger(cost) || cost < 1000 || cost > 5_000_000) return { error: 'Enter the planned cost in naira, from 1,000 to 5,000,000, without commas.' }
  const next: Job = { ...current, status: 'scheduled', fixKind: 'proper', fix: trimmed, cost, by: actors.lead.name }
  const guide = state.guide.active && (state.guide.step === 2 || state.guide.step === 3) && jobId === 'job-22'
    ? { active: true as const, step: 4 as const, focusId: jobId }
    : state.guide
  const text = `Booked a proper repair for ${current.number}. ${trimmed} Planned cost ${naira(cost)}.`
  return { state: record(state, next, now, actors.lead.name, text, guide) }
}

export function reviewJob(state: DemoState, jobId: string): DemoState {
  if (!state.guide.active || state.guide.step !== 2 || state.role !== 'lead') return state
  if (state.guide.focusId !== jobId) return state
  if (state.jobs.find((job) => job.id === jobId)?.status !== 'open') return state
  return { ...state, guide: { active: true, step: 3, focusId: jobId } }
}

export function openJobs(jobs: Job[]) {
  return jobs.filter((job) => job.status === 'draft' || job.status === 'open')
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
