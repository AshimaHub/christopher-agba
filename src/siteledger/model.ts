import type { CompanyId } from '../content/demoCompanies.ts'
import { ledgerSamples } from './samples.ts'

export type Role = 'keeper' | 'supervisor'
export type MoveKind = 'receipt' | 'issue'
export type MoveStatus = 'draft' | 'posted'

export type Movement = {
  id: string
  number: string
  placeId: string
  itemId: string
  kind: MoveKind
  quantity: number
  reference: string
  status: MoveStatus
  createdAt: string
  postedAt?: string
}

export type Activity = { id: string; at: string; actor: string; text: string }
export type Notice = { id: string; at: string; text: string; read: boolean }
export type GuideState = { active: boolean; step: 1 | 2 | 3 | 4; focusId: string }

export type DemoState = {
  companyId: CompanyId
  role: Role
  movements: Movement[]
  activity: Activity[]
  notices: Notice[]
  guide: GuideState
}

export const actors: Record<Role, { name: string; title: string }> = {
  keeper: { name: 'Ifeoma Bassey', title: 'Storekeeper' },
  supervisor: { name: 'Malik Adeyemi', title: 'Supervisor' },
}

export function bookFor(companyId: CompanyId) {
  return ledgerSamples[companyId]
}

export function itemById(companyId: CompanyId, id: string) {
  return bookFor(companyId).items.find((item) => item.id === id)
}

export function placeById(companyId: CompanyId, id: string) {
  return bookFor(companyId).places.find((place) => place.id === id)
}

export function onHand(companyId: CompanyId, movements: Movement[], placeId: string, itemId: string) {
  const card = bookFor(companyId).cards.find((item) => item.placeId === placeId && item.itemId === itemId)
  const opening = card?.opening ?? 0
  return movements.reduce((total, move) => {
    if (move.status !== 'posted' || move.placeId !== placeId || move.itemId !== itemId) return total
    return total + (move.kind === 'receipt' ? move.quantity : -move.quantity)
  }, opening)
}

export function statusLabel(status: MoveStatus) {
  return status === 'draft' ? 'Draft' : 'Posted'
}

export function kindLabel(kind: MoveKind) {
  return kind === 'receipt' ? 'Receipt' : 'Issue'
}

function at(day: number, hour: number) {
  return `2026-10-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:20:00.000Z`
}

export function createSeed(companyId: CompanyId = 'harbour'): DemoState {
  const sample = ledgerSamples[companyId]
  const movements: Movement[] = sample.moves.map((move) => ({
    id: move.id,
    number: move.number,
    placeId: move.placeId,
    itemId: move.itemId,
    kind: move.kind,
    quantity: move.quantity,
    reference: move.reference,
    status: move.status,
    createdAt: at(move.created[0], move.created[1]),
    postedAt: move.posted ? at(move.posted[0], move.posted[1]) : undefined,
  }))
  const activity: Activity[] = movements
    .filter((move) => move.status === 'posted')
    .map((move) => ({
      id: `${move.id}-posted`,
      at: move.postedAt ?? move.createdAt,
      actor: actors.keeper.name,
      text: `${kindLabel(move.kind)} ${move.number} posted. ${move.quantity} · ${move.reference}`,
    }))
    .sort((left, right) => right.at.localeCompare(left.at))
  const notices: Notice[] = movements
    .filter((move) => move.status === 'draft')
    .map((move) => ({
      id: `${move.id}-n`,
      at: move.createdAt,
      text: `${move.number} is still a draft ${move.kind}.`,
      read: false,
    }))
  return {
    companyId,
    role: 'keeper',
    movements,
    activity,
    notices,
    guide: { active: true, step: 1, focusId: 'move-1048' },
  }
}

export type MoveDraft = {
  placeId: string
  itemId: string
  kind: MoveKind
  quantity: string
  reference: string
}

function parseQty(value: string) {
  if (!/^\d+$/.test(value.trim())) return null
  const quantity = Number(value)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000) return null
  return quantity
}

function nextNumber(movements: Movement[]) {
  const highest = movements.reduce((max, move) => {
    const value = Number(move.number.replace('SL-', ''))
    return Number.isFinite(value) ? Math.max(max, value) : max
  }, 1000)
  return `SL-${highest + 1}`
}

function record(state: DemoState, next: Movement, now: string, text: string, guide = state.guide): DemoState {
  const exists = state.movements.some((move) => move.id === next.id)
  return {
    ...state,
    movements: exists ? state.movements.map((move) => (move.id === next.id ? next : move)) : [next, ...state.movements],
    activity: [{ id: `act-${now}-${next.id}`, at: now, actor: actors.keeper.name, text }, ...state.activity],
    notices: [{ id: `n-${now}-${next.id}`, at: now, text, read: false }, ...state.notices],
    guide,
  }
}

function guardIssue(state: DemoState, placeId: string, itemId: string, quantity: number) {
  const available = onHand(state.companyId, state.movements, placeId, itemId)
  if (quantity > available) return `Only ${available} can be issued. The balance would go below zero.`
  return null
}

export function postMovement(state: DemoState, moveId: string, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'keeper') return { error: 'Switch to Storekeeper to post this movement.' }
  const current = state.movements.find((move) => move.id === moveId)
  if (!current) return { error: 'That movement is no longer in this demonstration.' }
  if (current.status !== 'draft') return { error: 'Only a draft can be posted.' }
  if (current.kind === 'issue') {
    const blocked = guardIssue(state, current.placeId, current.itemId, current.quantity)
    if (blocked) return { error: blocked }
  }
  const next: Movement = { ...current, status: 'posted', postedAt: now }
  let guide = state.guide
  if (state.guide.active && state.guide.step === 1 && moveId === 'move-1048') {
    const issue = state.movements.find((move) => move.id === 'move-1050')
    guide = issue?.status === 'posted'
      ? { active: true, step: 3, focusId: current.itemId }
      : { active: true, step: 2, focusId: 'move-1050' }
  } else if (state.guide.active && state.guide.step === 2 && moveId === 'move-1050') {
    guide = { active: true, step: 3, focusId: current.itemId }
  }
  const text = `Posted ${kindLabel(current.kind).toLowerCase()} ${current.number}.`
  return { state: record(state, next, now, text, guide) }
}

export function addMovement(state: DemoState, draft: MoveDraft, now: string): { state: DemoState; id: string } | { error: string } {
  if (state.role !== 'keeper') return { error: 'Switch to Storekeeper to record stock.' }
  if (!placeById(state.companyId, draft.placeId)) return { error: 'Choose the store.' }
  if (!itemById(state.companyId, draft.itemId)) return { error: 'Choose the item.' }
  const quantity = parseQty(draft.quantity)
  if (quantity === null) return { error: 'Enter a whole quantity from 1 to 10,000.' }
  if (draft.reference.trim().length < 8) return { error: 'Say where it came from, or which job it is for.' }
  if (draft.kind === 'issue') {
    const blocked = guardIssue(state, draft.placeId, draft.itemId, quantity)
    if (blocked) return { error: blocked }
  }
  const id = `move-${Date.now()}`
  const created: Movement = {
    id,
    number: nextNumber(state.movements),
    placeId: draft.placeId,
    itemId: draft.itemId,
    kind: draft.kind,
    quantity,
    reference: draft.reference.trim(),
    status: 'posted',
    createdAt: now,
    postedAt: now,
  }
  const text = `Posted ${kindLabel(draft.kind).toLowerCase()} ${created.number} for ${quantity}.`
  return { id, state: record(state, created, now, text) }
}

export function reviewCard(state: DemoState, itemId: string): DemoState {
  if (!state.guide.active || state.guide.step !== 3 || state.role !== 'supervisor') return state
  if (state.guide.focusId !== itemId) return state
  return { ...state, guide: { active: true, step: 4, focusId: state.guide.focusId } }
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
