import type { CompanyId } from '../content/demoCompanies.ts'
import { receiveSamples, type BillStatus, type SampleBill } from './samples.ts'

export type Role = 'clerk' | 'accounts'
export type { BillStatus }

export type Bill = SampleBill
export type Activity = { id: string; at: string; actor: string; text: string }
export type Notice = { id: string; at: string; text: string; read: boolean }
export type GuideState = { active: boolean; step: 1 | 2 | 3 | 4; focusId: string }

export type DemoState = {
  companyId: CompanyId
  role: Role
  bills: Bill[]
  activity: Activity[]
  notices: Notice[]
  guide: GuideState
}

export const actors: Record<Role, { name: string; title: string }> = {
  clerk: { name: 'Ifeoma Bassey', title: 'Receiving clerk' },
  accounts: { name: 'Funke Adewale', title: 'Accounts' },
}

export function naira(value: number) {
  return `₦${value.toLocaleString('en-GB')}`
}

export function lineAmount(bill: Bill) {
  return bill.billedQty * bill.rate
}

export function statusLabel(status: BillStatus) {
  if (status === 'waiting') return 'To count'
  if (status === 'mismatch') return 'Short'
  if (status === 'held') return 'Held'
  if (status === 'accepted') return 'Accepted'
  return 'Matched'
}

function at(date: string) {
  return `${date}T09:20:00.000Z`
}

export function createSeed(companyId: CompanyId = 'harbour'): DemoState {
  const bills = receiveSamples[companyId].bills.map((bill) => ({ ...bill }))
  const matched = bills.find((bill) => bill.status === 'matched')
  const open = bills.find((bill) => bill.id === 'bill-100')
  const activity: Activity[] = matched
    ? [{ id: 'bill-80-seed', at: at(matched.opened), actor: actors.clerk.name, text: `${matched.number} matched. ${matched.receivedQty} ${matched.goods.toLowerCase()} received.` }]
    : []
  const notices: Notice[] = open
    ? [{ id: 'bill-100-n', at: at(open.opened), text: `${open.number} still needs a yard count. The bill says ${open.billedQty}.`, read: false }]
    : []
  return {
    companyId,
    role: 'clerk',
    bills,
    activity,
    notices,
    guide: { active: true, step: 1, focusId: 'bill-100' },
  }
}

function record(state: DemoState, next: Bill, now: string, actor: string, text: string, guide = state.guide): DemoState {
  return {
    ...state,
    bills: state.bills.map((bill) => (bill.id === next.id ? next : bill)),
    activity: [{ id: `act-${now}-${next.id}`, at: now, actor, text }, ...state.activity],
    notices: [{ id: `n-${now}-${next.id}`, at: now, text, read: false }, ...state.notices],
    guide,
  }
}

export function recordCount(state: DemoState, billId: string, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'clerk') return { error: 'Switch to Receiving clerk to record the yard count.' }
  const current = state.bills.find((bill) => bill.id === billId)
  if (!current) return { error: 'That bill is no longer in this demonstration.' }
  if (current.status !== 'waiting' || current.yardQty == null) return { error: 'This bill already has a yard count.' }
  const received = current.yardQty
  const mismatch = received !== current.billedQty
  const next: Bill = { ...current, receivedQty: received, status: mismatch ? 'mismatch' : 'matched', recordedBy: actors.clerk.name }
  const guide = state.guide.active && state.guide.step === 1 && billId === 'bill-100' && mismatch
    ? { active: true as const, step: 2 as const, focusId: 'bill-100' }
    : state.guide
  const text = mismatch
    ? `Recorded ${received} on ${current.number}. The bill says ${current.billedQty}.`
    : `Recorded ${received} on ${current.number}. It matches the bill.`
  return { state: record(state, next, now, actors.clerk.name, text, guide) }
}

export function holdBill(state: DemoState, billId: string, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'accounts') return { error: 'Switch to Accounts to hold this bill.' }
  const current = state.bills.find((bill) => bill.id === billId)
  if (!current) return { error: 'That bill is no longer in this demonstration.' }
  if (current.recordedBy === actors.accounts.name) return { error: 'You cannot hold a count you recorded.' }
  if (current.status !== 'mismatch') return { error: 'Only a short delivery can be held.' }
  const next: Bill = { ...current, status: 'held' }
  const guide = state.guide.active && state.guide.step === 2 && billId === 'bill-100'
    ? { active: true as const, step: 3 as const, focusId: billId }
    : state.guide
  const text = `Held ${current.number}. Billed ${current.billedQty}, received ${current.receivedQty}.`
  return { state: record(state, next, now, actors.accounts.name, text, guide) }
}

export function acceptCorrection(state: DemoState, billId: string, quantity: number, note: string, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'accounts') return { error: 'Switch to Accounts to accept the corrected bill.' }
  const current = state.bills.find((bill) => bill.id === billId)
  if (!current) return { error: 'That bill is no longer in this demonstration.' }
  if (current.recordedBy === actors.accounts.name) return { error: 'You cannot accept a count you recorded.' }
  if (current.status !== 'held') return { error: 'Hold the bill before accepting a correction.' }
  if (!Number.isInteger(quantity) || quantity < 1) return { error: 'Enter the corrected quantity as a whole number.' }
  if (quantity !== current.receivedQty) return { error: `The yard received ${current.receivedQty}. A corrected bill has to match that count.` }
  const trimmed = note.trim()
  if (trimmed.length < 8) return { error: 'Note what the supplier corrected.' }
  const next: Bill = { ...current, billedQty: quantity, status: 'accepted', note: trimmed }
  const guide = state.guide.active && state.guide.step === 3 && billId === 'bill-100'
    ? { active: true as const, step: 4 as const, focusId: billId }
    : state.guide
  const text = `Accepted ${current.number} at ${quantity}. ${trimmed}`
  return { state: record(state, next, now, actors.accounts.name, text, guide) }
}

export function openBills(bills: Bill[]) {
  return bills.filter((bill) => bill.status === 'waiting' || bill.status === 'mismatch' || bill.status === 'held')
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
