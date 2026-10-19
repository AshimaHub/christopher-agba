import { type CompanyId } from '../content/demoCompanies.ts'
import { spendSamples } from './samples.ts'

export type { CompanyId }
export type Role = 'submitter' | 'approver'

export type SheetStatus = 'draft' | 'submitted' | 'review' | 'approved' | 'rejected'

export type Site = { id: string; name: string }

export type SheetLine = { category: string; description: string; amount: number }

export type Sheet = {
  id: string
  number: string
  siteId: string
  status: SheetStatus
  purpose: string
  submitterName: string
  lines: SheetLine[]
  createdAt: string
  decision?: { by: string; at: string; action: 'approved' | 'rejected'; remark: string }
}

export type Activity = { id: string; at: string; actor: string; text: string; sheetId?: string }
export type Notice = { id: string; at: string; text: string; read: boolean }
export type GuideState = { active: boolean; step: 1 | 2 | 3 | 4; focusId: string }

export type DemoState = {
  companyId: CompanyId
  role: Role
  sheets: Sheet[]
  activity: Activity[]
  notices: Notice[]
  guide: GuideState
}

export const actors: Record<Role, { name: string; title: string }> = {
  submitter: { name: 'Amaka Nwosu', title: 'Submitter' },
  approver: { name: 'Funke Adewale', title: 'Approver' },
}

export function sitesFor(companyId: CompanyId) {
  return spendSamples[companyId].sites
}

export function categoriesFor(companyId: CompanyId) {
  return spendSamples[companyId].categories
}

export function siteById(companyId: CompanyId, id: string) {
  return sitesFor(companyId).find((site) => site.id === id)
}

export function amount(sheet: Sheet) {
  return sheet.lines.reduce((sum, line) => sum + line.amount, 0)
}

export function naira(value: number) {
  return `₦${value.toLocaleString('en-GB')}`
}

export function statusLabel(status: SheetStatus) {
  if (status === 'draft') return 'Draft'
  if (status === 'submitted') return 'Submitted'
  if (status === 'review') return 'Under review'
  if (status === 'approved') return 'Approved'
  return 'Rejected'
}

export function countStatus(sheets: Sheet[], status: SheetStatus) {
  return sheets.filter((sheet) => sheet.status === status).length
}

function at(day: number, hour: number) {
  return `2026-10-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:20:00.000Z`
}

export function createSeed(companyId: CompanyId = 'harbour'): DemoState {
  const sample = spendSamples[companyId]
  const sheets: Sheet[] = sample.sheets.map((item) => ({
    id: item.id,
    number: item.number,
    siteId: item.siteId,
    status: item.status,
    purpose: item.purpose,
    submitterName: item.submitterName,
    lines: item.lines,
    createdAt: at(item.created[0], item.created[1]),
    decision: item.decision
      ? { by: actors.approver.name, at: at(item.decision.at[0], item.decision.at[1]), action: item.decision.action, remark: item.decision.remark }
      : undefined,
  }))
  const activity: Activity[] = sheets.flatMap((sheet) => {
    const source = sample.sheets.find((item) => item.id === sheet.id)
    const events: Activity[] = []
    if (sheet.status === 'draft') {
      events.push({ id: `${sheet.id}-draft`, at: sheet.createdAt, actor: sheet.submitterName, text: `Saved ${sheet.number} as a draft.`, sheetId: sheet.id })
    } else {
      events.push({ id: `${sheet.id}-sent`, at: sheet.createdAt, actor: sheet.submitterName, text: `Submitted ${sheet.number} for approval.`, sheetId: sheet.id })
    }
    if (sheet.status === 'review' && source?.reviewed) {
      events.push({ id: `${sheet.id}-review`, at: at(source.reviewed[0], source.reviewed[1]), actor: actors.approver.name, text: `Opened ${sheet.number} for review.`, sheetId: sheet.id })
    }
    if (sheet.decision) {
      const verb = sheet.decision.action === 'approved' ? 'Approved' : 'Rejected'
      events.push({ id: `${sheet.id}-decision`, at: sheet.decision.at, actor: sheet.decision.by, text: `${verb} ${sheet.number}. ${sheet.decision.remark}`, sheetId: sheet.id })
    }
    return events
  }).sort((left, right) => right.at.localeCompare(left.at))
  const notices: Notice[] = sheets.flatMap((sheet) => {
    if (sheet.status === 'draft') return [{ id: `${sheet.id}-n`, at: sheet.createdAt, text: `${sheet.number} is still a draft.`, read: false }]
    if (sheet.status === 'submitted') return [{ id: `${sheet.id}-n`, at: sheet.createdAt, text: `${sheet.number} is waiting for an approver.`, read: false }]
    return []
  })

  return {
    companyId,
    role: 'submitter',
    sheets,
    activity,
    notices,
    guide: { active: true, step: 1, focusId: 'sheet-220' },
  }
}

export type DraftLine = { category: string; description: string; amount: string }
export type SheetDraft = { siteId: string; purpose: string; lines: DraftLine[] }

function parseMoney(value: string) {
  const cleaned = value.replace(/[₦,\s]/g, '')
  if (!/^\d+$/.test(cleaned)) return null
  const amountValue = Number(cleaned)
  if (!Number.isInteger(amountValue) || amountValue < 1 || amountValue > 5_000_000) return null
  return amountValue
}

export function validateDraft(companyId: CompanyId, draft: SheetDraft): string | null {
  if (!siteById(companyId, draft.siteId)) return 'Choose the site this expense belongs to.'
  if (draft.purpose.trim().length < 12) return 'Say what the money is for, in a short sentence.'
  if (draft.lines.length === 0) return 'Add at least one line.'
  for (const line of draft.lines) {
    if (!categoriesFor(companyId).includes(line.category)) return 'Choose a category for every line.'
    if (line.description.trim().length < 3) return 'Describe each line.'
    if (parseMoney(line.amount) === null) return 'Enter each amount in whole naira, up to ₦5,000,000.'
  }
  return null
}

function nextNumber(sheets: Sheet[]) {
  const highest = sheets.reduce((max, item) => {
    const value = Number(item.number.replace('ES-', ''))
    return Number.isFinite(value) ? Math.max(max, value) : max
  }, 200)
  return `ES-${highest + 1}`
}

function record(state: DemoState, next: Sheet, now: string, actor: string, text: string, notice: string, guide = state.guide): DemoState {
  const exists = state.sheets.some((item) => item.id === next.id)
  return {
    ...state,
    sheets: exists ? state.sheets.map((item) => (item.id === next.id ? next : item)) : [next, ...state.sheets],
    activity: [{ id: `act-${Date.now()}`, at: now, actor, text, sheetId: next.id }, ...state.activity],
    notices: [{ id: `n-${Date.now()}`, at: now, text: notice, read: false }, ...state.notices],
    guide,
  }
}

export function submitSheet(state: DemoState, draft: SheetDraft, now: string): { state: DemoState; id: string } | { error: string } {
  if (state.role !== 'submitter') return { error: 'Switch to Submitter to send an expense sheet.' }
  const error = validateDraft(state.companyId, draft)
  if (error) return { error }
  const id = `sheet-${Date.now()}`
  const number = nextNumber(state.sheets)
  const created: Sheet = {
    id,
    number,
    siteId: draft.siteId,
    status: 'submitted',
    purpose: draft.purpose.trim(),
    submitterName: actors.submitter.name,
    lines: draft.lines.map((line) => ({ category: line.category, description: line.description.trim(), amount: parseMoney(line.amount) ?? 0 })),
    createdAt: now,
  }
  const guide = state.guide.active && state.guide.step === 1 ? { active: true as const, step: 2 as const, focusId: id } : state.guide
  return { id, state: record(state, created, now, actors.submitter.name, `Submitted ${number} for ${naira(amount(created))}.`, `${number} is waiting for an approver.`, guide) }
}

export function sendDraft(state: DemoState, sheetId: string, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'submitter') return { error: 'Switch to Submitter to send this sheet.' }
  const current = state.sheets.find((item) => item.id === sheetId)
  if (!current) return { error: 'That sheet is no longer in this demonstration.' }
  if (current.status !== 'draft') return { error: 'Only a draft can be submitted.' }
  const next: Sheet = { ...current, status: 'submitted' }
  const guide = state.guide.active && state.guide.step === 1 && state.guide.focusId === sheetId
    ? { active: true as const, step: 2 as const, focusId: sheetId }
    : state.guide
  return { state: record(state, next, now, actors.submitter.name, `Submitted ${current.number} for ${naira(amount(current))}.`, `${current.number} is waiting for an approver.`, guide) }
}

export function startReview(state: DemoState, sheetId: string, now: string): { state: DemoState } | { error: string } {
  if (state.role !== 'approver') return { error: 'Switch to Approver to open this sheet.' }
  const current = state.sheets.find((item) => item.id === sheetId)
  if (!current) return { error: 'That sheet is no longer in this demonstration.' }
  if (current.submitterName === actors.approver.name) return { error: 'You cannot review a sheet you submitted.' }
  if (current.status !== 'submitted') return { error: 'Only a submitted sheet can be opened for review.' }
  const next: Sheet = { ...current, status: 'review' }
  const guide = state.guide.active && state.guide.step === 2 && state.guide.focusId === sheetId
    ? { active: true as const, step: 3 as const, focusId: sheetId }
    : state.guide
  return { state: record(state, next, now, actors.approver.name, `Opened ${current.number} for review.`, `${current.number} is under review.`, guide) }
}

export function decideSheet(
  state: DemoState,
  sheetId: string,
  action: 'approved' | 'rejected',
  remark: string,
  now: string,
): { state: DemoState } | { error: string } {
  if (state.role !== 'approver') return { error: 'Switch to Approver to decide this sheet.' }
  const current = state.sheets.find((item) => item.id === sheetId)
  if (!current) return { error: 'That sheet is no longer in this demonstration.' }
  if (current.submitterName === actors.approver.name) return { error: 'You cannot approve a sheet you submitted.' }
  if (current.status !== 'submitted' && current.status !== 'review') return { error: 'This sheet is no longer waiting for a decision.' }
  const trimmed = remark.trim()
  if (trimmed.length < 8) return { error: action === 'approved' ? 'An approval remark is required.' : 'Say why this sheet is rejected.' }
  const next: Sheet = { ...current, status: action, decision: { by: actors.approver.name, at: now, action, remark: trimmed } }
  const guide = state.guide.active && state.guide.step === 3 && state.guide.focusId === sheetId
    ? { active: true as const, step: 4 as const, focusId: sheetId }
    : state.guide
  const text = action === 'approved' ? `Approved ${current.number}. ${trimmed}` : `Rejected ${current.number}. ${trimmed}`
  return { state: record(state, next, now, actors.approver.name, text, text, guide) }
}

export function approvedTotal(sheets: Sheet[], siteId?: string) {
  return sheets
    .filter((sheet) => sheet.status === 'approved' && (!siteId || sheet.siteId === siteId))
    .reduce((sum, sheet) => sum + amount(sheet), 0)
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
