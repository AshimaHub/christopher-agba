import type { CompanyId } from '../content/demoCompanies.ts'
import { hireSamples } from './samples.ts'

export type Role = 'clerk' | 'commercial'
export type DayStatus = 'draft' | 'logged' | 'disputed' | 'accepted' | 'queried'

export type HireDay = {
  id: string
  machineId: string
  date: string
  worked: number
  idle: number
  note: string
  status: DayStatus
  loggedBy?: string
  decision?: { by: string; at: string; action: 'accepted' | 'queried'; remark: string }
}

export type Activity = { id: string; at: string; actor: string; text: string }
export type Notice = { id: string; at: string; text: string; read: boolean }
export type GuideState = { active: boolean; step: 1 | 2 | 3 | 4; focusId: string }

export type DemoState = {
  companyId: CompanyId
  role: Role
  days: HireDay[]
  activity: Activity[]
  notices: Notice[]
  guide: GuideState
}

export const actors: Record<Role, { name: string; title: string }> = {
  clerk: { name: 'Jonah Hale', title: 'Plant clerk' },
  commercial: { name: 'Funke Adewale', title: 'Commercial manager' },
}

export function bookFor(companyId: CompanyId) {
  return hireSamples[companyId]
}

export function machineById(companyId: CompanyId, id: string) {
  return bookFor(companyId).machines.find((machine) => machine.id === id)
}

export function onSiteHours(day: HireDay) {
  return day.worked + day.idle
}

export function countsTowardCost(status: DayStatus) {
  return status === 'logged' || status === 'accepted'
}

export function dayCost(companyId: CompanyId, day: HireDay) {
  const machine = machineById(companyId, day.machineId)
  if (!machine || !countsTowardCost(day.status)) return 0
  return onSiteHours(day) * machine.rate
}

export function periodCost(companyId: CompanyId, days: HireDay[], machineId: string) {
  return days.filter((day) => day.machineId === machineId).reduce((sum, day) => sum + dayCost(companyId, day), 0)
}

export function naira(value: number) {
  return `₦${value.toLocaleString('en-GB')}`
}

export function statusLabel(status: DayStatus) {
  if (status === 'draft') return 'Draft'
  if (status === 'logged') return 'Logged'
  if (status === 'disputed') return 'Disputed'
  if (status === 'accepted') return 'Accepted'
  return 'Queried'
}

function at(date: string, hour: number) {
  return `${date}T${String(hour).padStart(2, '0')}:20:00.000Z`
}

export function createSeed(companyId: CompanyId = 'harbour'): DemoState {
  const sample = hireSamples[companyId]
  const days: HireDay[] = sample.days.map((day) => ({
    ...day,
    loggedBy: day.status === 'draft' ? undefined : actors.clerk.name,
  }))
  const activity: Activity[] = days
    .filter((day) => day.status !== 'draft')
    .map((day) => ({
      id: `${day.id}-seed`,
      at: at(day.date, 16),
      actor: actors.clerk.name,
      text: day.status === 'disputed'
        ? `Flagged ${formatDay(day.date)} as disputed. ${day.note}`
        : `Logged ${formatDay(day.date)}: ${day.worked} worked, ${day.idle} idle.`,
    }))
    .sort((left, right) => right.at.localeCompare(left.at))
  const notices: Notice[] = days.flatMap((day) => {
    if (day.status === 'draft') return [{ id: `${day.id}-n`, at: at(day.date, 8), text: `${formatDay(day.date)} is still a draft.`, read: false }]
    if (day.status === 'disputed') return [{ id: `${day.id}-n`, at: at(day.date, 16), text: `${formatDay(day.date)} is disputed and out of the agreed cost.`, read: false }]
    return []
  })
  return {
    companyId,
    role: 'clerk',
    days,
    activity,
    notices,
    guide: { active: true, step: 1, focusId: 'day-16' },
  }
}

function hoursOk(worked: number, idle: number) {
  return Number.isInteger(worked) && Number.isInteger(idle) && worked >= 0 && idle >= 0 && worked <= 12 && idle <= 12 && worked + idle >= 1 && worked + idle <= 14
}

function record(state: DemoState, next: HireDay, now: string, actor: string, text: string, guide = state.guide): DemoState {
  const exists = state.days.some((day) => day.id === next.id)
  return {
    ...state,
    days: exists ? state.days.map((day) => (day.id === next.id ? next : day)) : [next, ...state.days],
    activity: [{ id: `act-${now}-${next.id}`, at: now, actor, text }, ...state.activity],
    notices: [{ id: `n-${now}-${next.id}`, at: now, text, read: false }, ...state.notices],
    guide,
  }
}

export function logDay(
  state: DemoState,
  dayId: string,
  worked: number,
  idle: number,
  note: string,
  now: string,
): { state: DemoState } | { error: string } {
  if (state.role !== 'clerk') return { error: 'Switch to Plant clerk to log these hours.' }
  const current = state.days.find((day) => day.id === dayId)
  if (!current) return { error: 'That day is no longer in this demonstration.' }
  if (current.status !== 'draft') return { error: 'Only a draft day can be logged.' }
  if (!hoursOk(worked, idle)) return { error: 'Enter whole hours. Worked and idle are each 0 to 12, and the day must total 1 to 14.' }
  if (note.trim().length < 8) return { error: 'Say what the machine did, in a short sentence.' }
  const next: HireDay = { ...current, worked, idle, note: note.trim(), status: 'logged', loggedBy: actors.clerk.name }
  const guide = state.guide.active && state.guide.step === 1 && dayId === 'day-16'
    ? { active: true as const, step: 2 as const, focusId: 'day-15' }
    : state.guide
  const text = `Logged ${formatDay(current.date)}: ${worked} worked, ${idle} idle.`
  return { state: record(state, next, now, actors.clerk.name, text, guide) }
}

export function decideDay(
  state: DemoState,
  dayId: string,
  action: 'accepted' | 'queried',
  remark: string,
  now: string,
): { state: DemoState } | { error: string } {
  if (state.role !== 'commercial') return { error: 'Switch to Commercial manager to decide this day.' }
  const current = state.days.find((day) => day.id === dayId)
  if (!current) return { error: 'That day is no longer in this demonstration.' }
  if (current.loggedBy === actors.commercial.name) return { error: 'You cannot decide a day you logged.' }
  if (current.status !== 'disputed') return { error: 'Only a disputed day can be accepted or queried.' }
  const trimmed = remark.trim()
  if (trimmed.length < 8) return { error: action === 'accepted' ? 'An acceptance remark is required.' : 'Say why this day is queried.' }
  const next: HireDay = {
    ...current,
    status: action,
    decision: { by: actors.commercial.name, at: now, action, remark: trimmed },
  }
  const guide = state.guide.active && state.guide.step === 2 && dayId === 'day-15'
    ? { active: true as const, step: 3 as const, focusId: current.machineId }
    : state.guide
  const verb = action === 'accepted' ? 'Accepted' : 'Queried'
  const text = `${verb} ${formatDay(current.date)}. ${trimmed}`
  return { state: record(state, next, now, actors.commercial.name, text, guide) }
}

export function reviewWeek(state: DemoState, machineId: string): DemoState {
  if (!state.guide.active || state.guide.step !== 3 || state.role !== 'commercial') return state
  if (state.guide.focusId !== machineId) return state
  return { ...state, guide: { active: true, step: 4, focusId: machineId } }
}

export type DayDraft = { machineId: string; date: string; worked: string; idle: string; note: string }

function parseHour(value: string) {
  if (!/^\d+$/.test(value.trim())) return null
  return Number(value)
}

export function addDay(state: DemoState, draft: DayDraft, now: string): { state: DemoState; id: string } | { error: string } {
  if (state.role !== 'clerk') return { error: 'Switch to Plant clerk to log a day.' }
  if (!machineById(state.companyId, draft.machineId)) return { error: 'Choose the machine.' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) return { error: 'Choose the date.' }
  if (state.days.some((day) => day.machineId === draft.machineId && day.date === draft.date)) return { error: 'That machine already has a record for this date.' }
  const worked = parseHour(draft.worked)
  const idle = parseHour(draft.idle)
  if (worked === null || idle === null || !hoursOk(worked, idle)) return { error: 'Enter whole hours. Worked and idle are each 0 to 12, and the day must total 1 to 14.' }
  if (draft.note.trim().length < 8) return { error: 'Say what the machine did, in a short sentence.' }
  const id = `day-${Date.now()}`
  const created: HireDay = {
    id,
    machineId: draft.machineId,
    date: draft.date,
    worked,
    idle,
    note: draft.note.trim(),
    status: 'logged',
    loggedBy: actors.clerk.name,
  }
  const text = `Logged ${formatDay(draft.date)}: ${worked} worked, ${idle} idle.`
  return { id, state: record(state, created, now, actors.clerk.name, text) }
}

export function formatDay(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${iso}T12:00:00`))
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
