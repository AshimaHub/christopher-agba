import type { CompanyId } from '../content/demoCompanies.ts'
import { waitSamples, type SampleItem, type WaitStatus } from './samples.ts'

export type Role = 'requester' | 'owner'
export type { WaitStatus }

export type Item = SampleItem & {
  decision?: { by: string; at: string; action: 'approved' | 'returned'; remark: string }
}

export type Activity = { id: string; at: string; actor: string; text: string }
export type Notice = { id: string; at: string; text: string; read: boolean }
export type GuideState = { active: boolean; step: 1 | 2 | 3 | 4; focusId: string }

export type DemoState = {
  companyId: CompanyId
  role: Role
  items: Item[]
  activity: Activity[]
  notices: Notice[]
  guide: GuideState
}

export const demoToday = '2026-10-22'

export const actors: Record<Role, { name: string; title: string }> = {
  requester: { name: 'Adaeze Okonkwo', title: 'Requester' },
  owner: { name: 'Malik Adeyemi', title: 'Approver' },
}

export function ageDays(raised: string) {
  const start = new Date(`${raised}T12:00:00`).getTime()
  const end = new Date(`${demoToday}T12:00:00`).getTime()
  return Math.max(0, Math.round((end - start) / 86_400_000))
}

export function isLate(item: Item) {
  return item.status === 'waiting' && ageDays(item.raised) >= 5
}

export function statusLabel(status: WaitStatus) {
  if (status === 'draft') return 'Draft'
  if (status === 'waiting') return 'Waiting'
  if (status === 'approved') return 'Approved'
  return 'Returned'
}

export function ageLabel(item: Item) {
  const days = ageDays(item.raised)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day'
  return `${days} days`
}

function at(date: string) {
  return `${date}T09:20:00.000Z`
}

export function createSeed(companyId: CompanyId = 'harbour'): DemoState {
  const items: Item[] = waitSamples[companyId].items.map((item) => ({ ...item }))
  const activity: Activity[] = items
    .filter((item) => item.status === 'waiting')
    .map((item) => ({
      id: `${item.id}-seed`,
      at: at(item.raised),
      actor: item.raisedBy,
      text: `Sent ${item.number} to ${actors.owner.name}. ${item.title}`,
    }))
    .sort((left, right) => right.at.localeCompare(left.at))
  const notices: Notice[] = items
    .filter((item) => item.status === 'waiting')
    .map((item) => ({
      id: `${item.id}-n`,
      at: at(item.raised),
      text: isLate(item) ? `${item.number} is late. It has been waiting ${ageLabel(item)}.` : `${item.number} is waiting on you.`,
      read: false,
    }))
  return {
    companyId,
    role: 'requester',
    items,
    activity,
    notices,
    guide: { active: true, step: 1, focusId: 'wait-40' },
  }
}

function record(state: DemoState, next: Item, now: string, actor: string, text: string, guide = state.guide): DemoState {
  return {
    ...state,
    items: state.items.map((item) => (item.id === next.id ? next : item)),
    activity: [{ id: `act-${now}-${next.id}`, at: now, actor, text }, ...state.activity],
    notices: [{ id: `n-${now}-${next.id}`, at: now, text, read: false }, ...state.notices],
    guide,
  }
}

export function sendItem(state: DemoState, itemId: string, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'requester') return { error: 'Switch to Requester to send this item.' }
  const current = state.items.find((item) => item.id === itemId)
  if (!current) return { error: 'That item is no longer in this demonstration.' }
  if (current.status !== 'draft') return { error: 'Only a draft can be sent.' }
  if (current.raisedBy !== actors.requester.name) return { error: 'You can only send an item you raised.' }
  const next: Item = { ...current, status: 'waiting' }
  const guide = state.guide.active && state.guide.step === 1 && itemId === 'wait-40'
    ? { active: true as const, step: 2 as const, focusId: 'wait-18' }
    : state.guide
  const text = `Sent ${current.number} to ${actors.owner.name}. ${current.title}`
  return { state: record(state, next, now, actors.requester.name, text, guide) }
}

export function decideItem(
  state: DemoState,
  itemId: string,
  action: 'approved' | 'returned',
  remark: string,
  now: string,
): { state: DemoState } | { error: string } {
  if (state.role !== 'owner') return { error: 'Switch to Approver. This inbox is waiting on you.' }
  const current = state.items.find((item) => item.id === itemId)
  if (!current) return { error: 'That item is no longer in this demonstration.' }
  if (current.raisedBy === actors.owner.name) return { error: 'You cannot decide an item you raised.' }
  if (current.status !== 'waiting') return { error: 'This item is no longer waiting.' }
  const trimmed = remark.trim()
  if (trimmed.length < 8) return { error: action === 'approved' ? 'An approval remark is required.' : 'Say why this item is returned.' }
  const next: Item = { ...current, status: action, decision: { by: actors.owner.name, at: now, action, remark: trimmed } }
  const guide = state.guide.active && (state.guide.step === 2 || state.guide.step === 3) && itemId === 'wait-18'
    ? { active: true as const, step: 4 as const, focusId: itemId }
    : state.guide
  const verb = action === 'approved' ? 'Approved' : 'Returned'
  const text = `${verb} ${current.number}. ${trimmed}`
  return { state: record(state, next, now, actors.owner.name, text, guide) }
}

export function reviewItem(state: DemoState, itemId: string): DemoState {
  if (!state.guide.active || state.guide.step !== 2 || state.role !== 'owner') return state
  if (state.guide.focusId !== itemId) return state
  if (state.items.find((item) => item.id === itemId)?.status !== 'waiting') return state
  return { ...state, guide: { active: true, step: 3, focusId: itemId } }
}

export function waitingItems(items: Item[]) {
  return items.filter((item) => item.status === 'waiting').sort((left, right) => left.raised.localeCompare(right.raised))
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
