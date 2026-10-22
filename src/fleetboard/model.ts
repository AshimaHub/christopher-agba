import type { CompanyId } from '../content/demoCompanies.ts'
import { fleetSamples, type BoardStatus, type SampleUnit } from './samples.ts'

export type Role = 'clerk' | 'supervisor'
export type { BoardStatus }

export type Unit = SampleUnit

export type Activity = { id: string; at: string; actor: string; text: string }
export type Notice = { id: string; at: string; text: string; read: boolean }
export type GuideState = { active: boolean; step: 1 | 2 | 3 | 4; focusId: string }

export type DemoState = {
  companyId: CompanyId
  role: Role
  units: Unit[]
  activity: Activity[]
  notices: Notice[]
  guide: GuideState
}

export const actors: Record<Role, { name: string; title: string }> = {
  clerk: { name: 'Amaka Nwosu', title: 'Yard clerk' },
  supervisor: { name: 'Malik Adeyemi', title: 'Operations supervisor' },
}

export function statusLabel(status: BoardStatus) {
  if (status === 'unreported') return 'Not called in'
  if (status === 'working') return 'Working'
  if (status === 'idle') return 'Idle'
  if (status === 'down') return 'Down'
  return 'Off site'
}

export function needsReason(unit: Unit) {
  return (unit.status === 'idle' || unit.status === 'down' || unit.status === 'away') && unit.note.trim().length < 8
}

export function dayLine(unit: Unit) {
  if (unit.status === 'unreported') return `${unit.name} has not been called in. It was sent to ${unit.assigned}.`
  if (unit.status === 'working') return `${unit.name} is working at ${unit.reported}. ${unit.hours} hours so far today.`
  if (unit.status === 'idle') return `${unit.name} is at ${unit.reported} and standing idle. ${unit.note || 'No reason has been written.'}`
  if (unit.status === 'down') return `${unit.name} is down at ${unit.reported}. ${unit.note || 'No fault has been written.'}`
  return `${unit.name} was sent to ${unit.assigned} and is reported at ${unit.reported}. ${unit.note || 'No reason has been written.'}`
}

export function earnedHours(units: Unit[]) {
  return units.reduce((sum, unit) => sum + unit.hours, 0)
}

const morning = '2026-10-22T07:40:00.000Z'

export function createSeed(companyId: CompanyId = 'harbour'): DemoState {
  const units = fleetSamples[companyId].units.map((unit) => ({ ...unit }))
  const activity: Activity[] = units
    .filter((unit) => unit.status !== 'unreported')
    .map((unit) => ({
      id: `${unit.id}-seed`,
      at: morning,
      actor: actors.clerk.name,
      text: dayLine(unit),
    }))
  const notices: Notice[] = units.flatMap((unit) => {
    if (unit.status === 'unreported') return [{ id: `${unit.id}-n`, at: morning, text: `${unit.name} has not been called in.`, read: false }]
    if (needsReason(unit)) return [{ id: `${unit.id}-n`, at: morning, text: `${unit.name} has no reason for ${statusLabel(unit.status).toLowerCase()}.`, read: false }]
    return []
  })
  return {
    companyId,
    role: 'clerk',
    units,
    activity,
    notices,
    guide: { active: true, step: 1, focusId: 'unit-3' },
  }
}

function record(state: DemoState, next: Unit, now: string, actor: string, text: string, guide = state.guide): DemoState {
  return {
    ...state,
    units: state.units.map((unit) => (unit.id === next.id ? next : unit)),
    activity: [{ id: `act-${now}-${next.id}`, at: now, actor, text }, ...state.activity],
    notices: [{ id: `n-${now}-${next.id}`, at: now, text, read: false }, ...state.notices],
    guide,
  }
}

export function callIn(
  state: DemoState,
  unitId: string,
  status: Exclude<BoardStatus, 'unreported'>,
  reported: string,
  hours: number,
  now: string,
): { state: DemoState } | { error: string } {
  if (state.role !== 'clerk') return { error: 'Switch to Yard clerk to call this machine in.' }
  const current = state.units.find((unit) => unit.id === unitId)
  if (!current) return { error: 'That machine is no longer in this demonstration.' }
  if (current.status !== 'unreported') return { error: 'This machine has already been called in.' }
  const place = reported.trim()
  if (status === 'away') {
    if (place.length < 3) return { error: 'Say where the machine actually is.' }
    if (place.toLowerCase() === current.assigned.toLowerCase()) return { error: 'Off site means it is not at the place it was sent to.' }
  }
  if (status === 'working' && (!Number.isInteger(hours) || hours < 1 || hours > 12)) return { error: 'Enter whole hours from 1 to 12.' }
  const next: Unit = {
    ...current,
    status,
    reported: status === 'away' ? place : current.assigned,
    hours: status === 'working' ? hours : 0,
    note: status === 'working' ? 'Called in and working.' : '',
  }
  const guide = state.guide.active && state.guide.step === 1 && unitId === 'unit-3'
    ? { active: true as const, step: 2 as const, focusId: 'unit-6' }
    : state.guide
  return { state: record(state, next, now, actors.clerk.name, dayLine(next), guide) }
}

export function explainUnit(state: DemoState, unitId: string, note: string, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'supervisor') return { error: 'Switch to Operations supervisor to explain this machine.' }
  const current = state.units.find((unit) => unit.id === unitId)
  if (!current) return { error: 'That machine is no longer in this demonstration.' }
  if (!needsReason(current)) return { error: 'This machine does not need an explanation.' }
  const trimmed = note.trim()
  if (trimmed.length < 8) return { error: 'Say why this machine is not earning its place.' }
  const next: Unit = { ...current, note: trimmed }
  const guide = state.guide.active && (state.guide.step === 2 || state.guide.step === 3) && unitId === 'unit-6'
    ? { active: true as const, step: 4 as const, focusId: unitId }
    : state.guide
  return { state: record(state, next, now, actors.supervisor.name, `${current.name}: ${trimmed}`, guide) }
}

export function reviewUnit(state: DemoState, unitId: string): DemoState {
  if (!state.guide.active || state.guide.step !== 2 || state.role !== 'supervisor') return state
  if (state.guide.focusId !== unitId) return state
  const unit = state.units.find((item) => item.id === unitId)
  if (!unit || !needsReason(unit)) return state
  return { ...state, guide: { active: true, step: 3, focusId: unitId } }
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
