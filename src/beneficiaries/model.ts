import type { CompanyId } from '../content/demoCompanies.ts'
import { banks, payeeSamples, type BankId, type PayeeCategory, type PayeeStatus, type SamplePayee } from './samples.ts'

export type Role = 'clerk' | 'reviewer'
export type { BankId, PayeeCategory, PayeeStatus }

export type Payee = Omit<SamplePayee, 'decision'> & {
  createdAt: string
  decision?: { by: string; at: string; action: 'approved' | 'returned'; remark: string }
}

export type Activity = { id: string; at: string; actor: string; text: string }
export type Notice = { id: string; at: string; text: string; read: boolean }
export type GuideState = { active: boolean; step: 1 | 2 | 3 | 4; focusId: string }

export type DemoState = {
  companyId: CompanyId
  role: Role
  payees: Payee[]
  activity: Activity[]
  notices: Notice[]
  guide: GuideState
}

export const actors: Record<Role, { name: string; title: string }> = {
  clerk: { name: 'Ngozi Eze', title: 'Payee clerk' },
  reviewer: { name: 'Halima Yusuf', title: 'Finance reviewer' },
}

export const categoryLabel: Record<PayeeCategory, string> = {
  company: 'Company',
  business: 'Business name',
  individual: 'Individual',
}

export function bankById(id: string) {
  return banks.find((bank) => bank.id === id)
}

export function statusLabel(status: PayeeStatus) {
  if (status === 'draft') return 'Draft'
  if (status === 'pending') return 'Waiting for approval'
  if (status === 'approved') return 'Approved'
  return 'Returned'
}

function at(day: number, hour: number) {
  return `2026-10-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:20:00.000Z`
}

export function lookupAccount(companyId: CompanyId, bankId: string, accountNumber: string) {
  const match = payeeSamples[companyId].accounts.find(
    (account) => account.bankId === bankId && account.accountNumber === accountNumber,
  )
  return match?.accountName ?? null
}

export function createSeed(companyId: CompanyId = 'harbour'): DemoState {
  const sample = payeeSamples[companyId]
  const payees: Payee[] = sample.payees.map((payee) => ({
    ...payee,
    createdAt: at(payee.status === 'draft' ? 18 : 12, 9),
    decision: payee.decision
      ? { by: actors.reviewer.name, at: at(16, 15), action: payee.decision.action, remark: payee.decision.remark }
      : undefined,
  }))
  const activity: Activity[] = payees
    .filter((payee) => payee.status !== 'draft')
    .map((payee) => ({
      id: `${payee.id}-seed`,
      at: payee.decision?.at ?? payee.createdAt,
      actor: payee.decision ? payee.decision.by : actors.clerk.name,
      text: payee.decision
        ? `${payee.decision.action === 'approved' ? 'Approved' : 'Returned'} ${payee.number}. ${payee.decision.remark}`
        : `Submitted ${payee.number} for ${payee.accountName}.`,
    }))
    .sort((left, right) => right.at.localeCompare(left.at))
  const notices: Notice[] = payees.flatMap((payee) => {
    if (payee.status === 'draft') return [{ id: `${payee.id}-n`, at: payee.createdAt, text: `${payee.number} still needs an account check.`, read: false }]
    if (payee.status === 'pending') return [{ id: `${payee.id}-n`, at: payee.createdAt, text: `${payee.number} is waiting for approval.`, read: false }]
    return []
  })
  return {
    companyId,
    role: 'clerk',
    payees,
    activity,
    notices,
    guide: { active: true, step: 1, focusId: 'payee-440' },
  }
}

export type PayeeDraft = {
  bankId: string
  accountNumber: string
  category: PayeeCategory
  purpose: string
}

function cleanNumber(value: string) {
  return value.replace(/\s/g, '')
}

function validNumber(value: string) {
  return /^\d{10}$/.test(value)
}

function record(state: DemoState, next: Payee, now: string, actor: string, text: string, guide = state.guide): DemoState {
  const exists = state.payees.some((payee) => payee.id === next.id)
  return {
    ...state,
    payees: exists ? state.payees.map((payee) => (payee.id === next.id ? next : payee)) : [next, ...state.payees],
    activity: [{ id: `act-${now}-${next.id}`, at: now, actor, text }, ...state.activity],
    notices: [{ id: `n-${now}-${next.id}`, at: now, text, read: false }, ...state.notices],
    guide,
  }
}

function duplicate(state: DemoState, bankId: string, accountNumber: string, exceptId?: string) {
  return state.payees.some(
    (payee) => payee.id !== exceptId && payee.bankId === bankId && payee.accountNumber === accountNumber && payee.status !== 'returned',
  )
}

export function updateDraft(
  state: DemoState,
  payeeId: string,
  draft: PayeeDraft,
): { state: DemoState } | { error: string } {
  if (state.role !== 'clerk') return { error: 'Switch to Payee clerk to edit this payee.' }
  const current = state.payees.find((payee) => payee.id === payeeId)
  if (!current) return { error: 'That payee is no longer in this demonstration.' }
  if (current.status !== 'draft' && current.status !== 'returned') return { error: 'Only a draft or a returned payee can be edited.' }
  if (!bankById(draft.bankId)) return { error: 'Choose the bank.' }
  const accountNumber = cleanNumber(draft.accountNumber)
  if (!validNumber(accountNumber)) return { error: 'Enter the 10-digit sample account number.' }
  if (draft.purpose.trim().length < 8) return { error: 'Say why this payee should be on the list.' }
  const changed = current.bankId !== draft.bankId || current.accountNumber !== accountNumber
  const next: Payee = {
    ...current,
    bankId: draft.bankId as BankId,
    accountNumber,
    category: draft.category,
    purpose: draft.purpose.trim(),
    status: 'draft',
    verified: changed ? false : current.verified,
    accountName: changed ? '' : current.accountName,
    decision: undefined,
  }
  return { state: { ...state, payees: state.payees.map((payee) => (payee.id === next.id ? next : payee)) } }
}

export function verifyPayee(state: DemoState, payeeId: string, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'clerk') return { error: 'Switch to Payee clerk to check this account.' }
  const current = state.payees.find((payee) => payee.id === payeeId)
  if (!current) return { error: 'That payee is no longer in this demonstration.' }
  if (current.status !== 'draft') return { error: 'Only a draft can be checked.' }
  const name = lookupAccount(state.companyId, current.bankId, current.accountNumber)
  if (!name) return { error: 'This sample account could not be confirmed for that bank. Use the account number already on the draft.' }
  const next: Payee = { ...current, accountName: name, verified: true }
  const text = `Checked ${current.number}. The account name is ${name}.`
  return { state: record(state, next, now, actors.clerk.name, text) }
}

export function submitPayee(state: DemoState, payeeId: string, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'clerk') return { error: 'Switch to Payee clerk to submit this payee.' }
  const current = state.payees.find((payee) => payee.id === payeeId)
  if (!current) return { error: 'That payee is no longer in this demonstration.' }
  if (current.status !== 'draft') return { error: 'Only a checked draft can be submitted.' }
  if (!current.verified || !current.accountName) return { error: 'Check the account before submitting. The name has to come from the check.' }
  if (duplicate(state, current.bankId, current.accountNumber, current.id)) return { error: 'That account is already on the list.' }
  const next: Payee = { ...current, status: 'pending' }
  const guide = state.guide.active && state.guide.step === 1 && payeeId === 'payee-440'
    ? { active: true as const, step: 2 as const, focusId: payeeId }
    : state.guide
  const text = `Submitted ${current.number} for ${current.accountName}.`
  return { state: record(state, next, now, actors.clerk.name, text, guide) }
}

export function decidePayee(
  state: DemoState,
  payeeId: string,
  action: 'approved' | 'returned',
  remark: string,
  now: string,
): { state: DemoState } | { error: string } {
  if (state.role !== 'reviewer') return { error: 'Switch to Finance reviewer to decide this payee.' }
  const current = state.payees.find((payee) => payee.id === payeeId)
  if (!current) return { error: 'That payee is no longer in this demonstration.' }
  if (current.status !== 'pending') return { error: 'Only a payee waiting for approval can be decided.' }
  const trimmed = remark.trim()
  if (trimmed.length < 8) return { error: action === 'approved' ? 'An approval remark is required.' : 'Say why this payee is returned.' }
  const next: Payee = { ...current, status: action, decision: { by: actors.reviewer.name, at: now, action, remark: trimmed } }
  const guide = state.guide.active && state.guide.step === 2 && payeeId === 'payee-440'
    ? { active: true as const, step: 3 as const, focusId: payeeId }
    : state.guide
  const verb = action === 'approved' ? 'Approved' : 'Returned'
  const text = `${verb} ${current.number}. ${trimmed}`
  return { state: record(state, next, now, actors.reviewer.name, text, guide) }
}

export function reviewPayee(state: DemoState, payeeId: string): DemoState {
  if (!state.guide.active || state.guide.step !== 3 || state.role !== 'reviewer') return state
  if (state.guide.focusId !== payeeId) return state
  const status = state.payees.find((payee) => payee.id === payeeId)?.status
  if (status !== 'approved' && status !== 'returned') return state
  return { ...state, guide: { active: true, step: 4, focusId: payeeId } }
}

export function addPayee(state: DemoState, draft: PayeeDraft, now: string): { state: DemoState; id: string } | { error: string } {
  if (state.role !== 'clerk') return { error: 'Switch to Payee clerk to add a payee.' }
  if (!bankById(draft.bankId)) return { error: 'Choose the bank.' }
  const accountNumber = cleanNumber(draft.accountNumber)
  if (!validNumber(accountNumber)) return { error: 'Enter a 10-digit sample account number.' }
  if (draft.purpose.trim().length < 8) return { error: 'Say why this payee should be on the list.' }
  const name = lookupAccount(state.companyId, draft.bankId, accountNumber)
  if (!name) return { error: 'This sample account could not be confirmed for that bank.' }
  if (duplicate(state, draft.bankId, accountNumber)) return { error: 'That account is already on the list.' }
  const highest = state.payees.reduce((max, payee) => {
    const value = Number(payee.number.replace('PB-', ''))
    return Number.isFinite(value) ? Math.max(max, value) : max
  }, 400)
  const id = `payee-${Date.now()}`
  const created: Payee = {
    id,
    number: `PB-${highest + 1}`,
    accountNumber,
    accountName: name,
    verified: true,
    bankId: draft.bankId as BankId,
    category: draft.category,
    status: 'pending',
    purpose: draft.purpose.trim(),
    createdAt: now,
  }
  const text = `Submitted ${created.number} for ${name}.`
  return { id, state: record(state, created, now, actors.clerk.name, text) }
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
