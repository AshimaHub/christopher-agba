import type { CompanyId } from '../content/demoCompanies.ts'
import { fuelSamples, type IssueStatus, type SampleIssue } from './samples.ts'

export type Role = 'issuer' | 'supervisor'
export type { IssueStatus }

export type Issue = SampleIssue & { createdAt: string }

export type Activity = { id: string; at: string; actor: string; text: string }
export type Notice = { id: string; at: string; text: string; read: boolean }
export type GuideState = { active: boolean; step: 1 | 2 | 3 | 4; focusId: string }

export type DemoState = {
  companyId: CompanyId
  role: Role
  issues: Issue[]
  activity: Activity[]
  notices: Notice[]
  guide: GuideState
}

export const actors: Record<Role, { name: string; title: string }> = {
  issuer: { name: 'Seyi Adebanjo', title: 'Fuel clerk' },
  supervisor: { name: 'Malik Adeyemi', title: 'Plant supervisor' },
}

export function bookFor(companyId: CompanyId) {
  return fuelSamples[companyId]
}

export function machineById(companyId: CompanyId, id: string) {
  return bookFor(companyId).machines.find((machine) => machine.id === id)
}

export function guideLitres(companyId: CompanyId, machineId: string, hours: number) {
  const machine = machineById(companyId, machineId)
  return (machine?.litresPerHour ?? 0) * hours
}

export function isUnusual(companyId: CompanyId, machineId: string, litres: number, hours: number) {
  const guide = guideLitres(companyId, machineId, hours)
  return litres > Math.round(guide * 1.5)
}

export function issueCost(companyId: CompanyId, litres: number) {
  return litres * bookFor(companyId).price
}

export function naira(value: number) {
  return `₦${value.toLocaleString('en-GB')}`
}

export function statusLabel(status: IssueStatus) {
  if (status === 'draft') return 'Draft'
  if (status === 'posted') return 'Posted'
  if (status === 'flagged') return 'Unusual'
  return 'Explained'
}

function at(date: string, hour: number) {
  return `${date}T${String(hour).padStart(2, '0')}:20:00.000Z`
}

export function createSeed(companyId: CompanyId = 'harbour'): DemoState {
  const issues: Issue[] = fuelSamples[companyId].issues.map((issue) => ({
    ...issue,
    createdAt: at(issue.date, issue.status === 'draft' ? 8 : 16),
  }))
  const activity: Activity[] = issues
    .filter((issue) => issue.status !== 'draft')
    .map((issue) => ({
      id: `${issue.id}-seed`,
      at: issue.createdAt,
      actor: actors.issuer.name,
      text: issue.status === 'flagged'
        ? `Flagged ${issue.number}: ${issue.litres} litres for ${issue.hours} hours. No explanation yet.`
        : `Posted ${issue.number}: ${issue.litres} litres for ${issue.hours} hours.`,
    }))
    .sort((left, right) => right.at.localeCompare(left.at))
  const notices: Notice[] = issues.flatMap((issue) => {
    if (issue.status === 'draft') return [{ id: `${issue.id}-n`, at: issue.createdAt, text: `${issue.number} is still a draft issue.`, read: false }]
    if (issue.status === 'flagged') return [{ id: `${issue.id}-n`, at: issue.createdAt, text: `${issue.number} is unusual and has no explanation.`, read: false }]
    return []
  })
  return {
    companyId,
    role: 'issuer',
    issues,
    activity,
    notices,
    guide: { active: true, step: 1, focusId: 'issue-draft' },
  }
}

function record(state: DemoState, next: Issue, now: string, actor: string, text: string, guide = state.guide): DemoState {
  return {
    ...state,
    issues: state.issues.map((issue) => (issue.id === next.id ? next : issue)),
    activity: [{ id: `act-${now}-${next.id}`, at: now, actor, text }, ...state.activity],
    notices: [{ id: `n-${now}-${next.id}`, at: now, text, read: false }, ...state.notices],
    guide,
  }
}

export function postIssue(
  state: DemoState,
  issueId: string,
  litres: number,
  hours: number,
  now: string,
): { state: DemoState } | { error: string } {
  if (state.role !== 'issuer') return { error: 'Switch to Fuel clerk to post this issue.' }
  const current = state.issues.find((issue) => issue.id === issueId)
  if (!current) return { error: 'That issue is no longer in this demonstration.' }
  if (current.status !== 'draft') return { error: 'Only a draft can be posted.' }
  if (!Number.isInteger(litres) || litres < 1 || litres > 2000) return { error: 'Enter whole litres from 1 to 2,000.' }
  if (!Number.isInteger(hours) || hours < 0 || hours > 14) return { error: 'Enter whole hours from 0 to 14.' }
  const unusual = isUnusual(state.companyId, current.machineId, litres, hours)
  const next: Issue = { ...current, litres, hours, status: unusual ? 'flagged' : 'posted' }
  const guide = state.guide.active && state.guide.step === 1 && issueId === 'issue-draft'
    ? { active: true as const, step: 2 as const, focusId: 'issue-flag' }
    : state.guide
  const text = unusual
    ? `Flagged ${current.number}: ${litres} litres for ${hours} hours.`
    : `Posted ${current.number}: ${litres} litres for ${hours} hours.`
  return { state: record(state, next, now, actors.issuer.name, text, guide) }
}

export function explainIssue(state: DemoState, issueId: string, explanation: string, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'supervisor') return { error: 'Switch to Plant supervisor to explain this day.' }
  const current = state.issues.find((issue) => issue.id === issueId)
  if (!current) return { error: 'That issue is no longer in this demonstration.' }
  if (current.status !== 'flagged') return { error: 'Only an unusual issue can be explained.' }
  const trimmed = explanation.trim()
  if (trimmed.length < 8) return { error: 'Say why this issue is above the guide.' }
  const next: Issue = { ...current, status: 'explained', explanation: trimmed }
  const guide = state.guide.active && (state.guide.step === 2 || state.guide.step === 3) && issueId === 'issue-flag'
    ? { active: true as const, step: 4 as const, focusId: issueId }
    : state.guide
  const text = `Explained ${current.number}. ${trimmed}`
  return { state: record(state, next, now, actors.supervisor.name, text, guide) }
}

export function reviewIssue(state: DemoState, issueId: string): DemoState {
  if (!state.guide.active || state.guide.step !== 2 || state.role !== 'supervisor') return state
  if (state.guide.focusId !== issueId) return state
  if (state.issues.find((issue) => issue.id === issueId)?.status !== 'flagged') return state
  return { ...state, guide: { active: true, step: 3, focusId: issueId } }
}

export function formatDay(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${iso}T12:00:00`))
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
