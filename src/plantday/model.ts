import type { CompanyId } from '../content/demoCompanies.ts'
import { shiftSamples, type SampleMachine, type ShiftStatus } from './samples.ts'

export type Role = 'lead' | 'supervisor'
export type { ShiftStatus }

export type Machine = SampleMachine & { reporter?: string; confirmedBy?: string }

export type Activity = { id: string; at: string; actor: string; text: string }
export type Notice = { id: string; at: string; text: string; read: boolean }
export type GuideState = { active: boolean; step: 1 | 2 | 3 | 4; focusId: string }

export type DemoState = {
  companyId: CompanyId
  role: Role
  machines: Machine[]
  activity: Activity[]
  notices: Notice[]
  guide: GuideState
}

export const actors: Record<Role, { name: string; title: string }> = {
  lead: { name: 'Jonah Hale', title: 'Shift lead' },
  supervisor: { name: 'Halima Yusuf', title: 'Plant supervisor' },
}

export function statusLabel(status: ShiftStatus) {
  if (status === 'open') return 'Not closed'
  if (status === 'worked') return 'Worked'
  if (status === 'idle') return 'Stood idle'
  return 'Broke down'
}

export function needsFollowUp(machine: Machine) {
  return machine.status === 'down' && machine.followUp.trim().length < 8
}

export function dayLine(machine: Machine) {
  if (machine.status === 'open') return `${machine.name} has not been closed for the shift.`
  const who = machine.reporter ? `${machine.reporter} reported it. ` : ''
  if (machine.status === 'worked') return `${machine.name} worked. ${who}${machine.note}`
  if (machine.status === 'idle') return `${machine.name} stood idle. ${who}${machine.note}`
  const follow = machine.followUp ? `Follow-up: ${machine.followUp}` : 'Repair follow-up is still open.'
  return `${machine.name} broke down. ${who}${machine.note} ${follow}`
}

const evening = '2026-10-22T17:10:00.000Z'

export function createSeed(companyId: CompanyId = 'harbour'): DemoState {
  const machines: Machine[] = shiftSamples[companyId].machines.map((machine) => ({
    ...machine,
    reporter: machine.status === 'open' ? undefined : actors.lead.name,
  }))
  const activity: Activity[] = machines
    .filter((machine) => machine.status !== 'open')
    .map((machine) => ({ id: `${machine.id}-seed`, at: evening, actor: actors.lead.name, text: dayLine(machine) }))
  const notices: Notice[] = machines.flatMap((machine) => {
    if (machine.status === 'open') return [{ id: `${machine.id}-n`, at: evening, text: `${machine.name} is still open.`, read: false }]
    if (needsFollowUp(machine)) return [{ id: `${machine.id}-n`, at: evening, text: `${machine.name} broke down and has no repair follow-up.`, read: false }]
    return []
  })
  return {
    companyId,
    role: 'lead',
    machines,
    activity,
    notices,
    guide: { active: true, step: 1, focusId: 'shift-3' },
  }
}

function record(state: DemoState, next: Machine, now: string, actor: string, text: string, guide = state.guide): DemoState {
  return {
    ...state,
    machines: state.machines.map((machine) => (machine.id === next.id ? next : machine)),
    activity: [{ id: `act-${now}-${next.id}`, at: now, actor, text }, ...state.activity],
    notices: [{ id: `n-${now}-${next.id}`, at: now, text, read: false }, ...state.notices],
    guide,
  }
}

export function closeMachine(
  state: DemoState,
  machineId: string,
  status: Exclude<ShiftStatus, 'open'>,
  note: string,
  now: string,
): { state: DemoState } | { error: string } {
  if (state.role !== 'lead') return { error: 'Switch to Shift lead to close this machine.' }
  const current = state.machines.find((machine) => machine.id === machineId)
  if (!current) return { error: 'That machine is no longer in this demonstration.' }
  if (current.status !== 'open') return { error: 'This machine is already closed.' }
  const trimmed = note.trim()
  if (trimmed.length < 8) return { error: 'Say how the shift went, in a short sentence.' }
  const next: Machine = { ...current, status, note: trimmed, reporter: actors.lead.name, followUp: '' }
  const guide = state.guide.active && state.guide.step === 1 && machineId === 'shift-3'
    ? { active: true as const, step: 2 as const, focusId: 'shift-4' }
    : state.guide
  return { state: record(state, next, now, actors.lead.name, dayLine(next), guide) }
}

export function followUp(state: DemoState, machineId: string, text: string, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'supervisor') return { error: 'Switch to Plant supervisor to record the repair follow-up.' }
  const current = state.machines.find((machine) => machine.id === machineId)
  if (!current) return { error: 'That machine is no longer in this demonstration.' }
  if (current.status !== 'down') return { error: 'Only a breakdown needs a repair follow-up.' }
  if (!needsFollowUp(current)) return { error: 'This breakdown already has a follow-up.' }
  const trimmed = text.trim()
  if (trimmed.length < 8) return { error: 'Say what happens next for the repair.' }
  const next: Machine = { ...current, followUp: trimmed, confirmedBy: actors.supervisor.name }
  const guide = state.guide.active && (state.guide.step === 2 || state.guide.step === 3) && machineId === 'shift-4'
    ? { active: true as const, step: 4 as const, focusId: machineId }
    : state.guide
  const line = `${actors.supervisor.name} confirmed the follow-up for ${current.name}. ${trimmed}`
  return { state: record(state, next, now, actors.supervisor.name, line, guide) }
}

export function reviewMachine(state: DemoState, machineId: string): DemoState {
  if (!state.guide.active || state.guide.step !== 2 || state.role !== 'supervisor') return state
  if (state.guide.focusId !== machineId) return state
  const machine = state.machines.find((item) => item.id === machineId)
  if (!machine || !needsFollowUp(machine)) return state
  return { ...state, guide: { active: true, step: 3, focusId: machineId } }
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
