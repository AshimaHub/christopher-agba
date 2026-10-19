import { type CompanyId } from '../content/demoCompanies.ts'
import { clearSamples } from './samples.ts'

export type { CompanyId }
export type Role = 'requester' | 'approver' | 'storekeeper'

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'partial' | 'fulfilled'

export type Material = {
  id: string
  name: string
  unit: string
  reorder: number
}

export type Project = { id: string; name: string }

export type RequestLine = {
  materialId: string
  quantity: number
  issued: number
}

export type IssueRecord = {
  at: string
  by: string
  lines: { materialId: string; quantity: number }[]
}

export type MaterialRequest = {
  id: string
  number: string
  projectId: string
  requesterName: string
  reason: string
  status: RequestStatus
  lines: RequestLine[]
  createdAt: string
  decision?: {
    by: string
    at: string
    action: 'approved' | 'rejected'
    comment: string
  }
  issues: IssueRecord[]
}

export type StockItem = { materialId: string; onHand: number }

export type Activity = {
  id: string
  at: string
  actor: string
  text: string
  requestId?: string
}

export type Notice = {
  id: string
  at: string
  text: string
  read: boolean
}

export type GuideState = {
  active: boolean
  step: 1 | 2 | 3 | 4
  focusId: string | null
}

export type DemoState = {
  companyId: CompanyId
  role: Role
  requests: MaterialRequest[]
  stock: StockItem[]
  activity: Activity[]
  notices: Notice[]
  guide: GuideState
}

export const actors: Record<Role, { name: string; title: string }> = {
  requester: { name: 'Adaeze Okonkwo', title: 'Requester' },
  approver: { name: 'Malik Adeyemi', title: 'Approver' },
  storekeeper: { name: 'Ifeoma Bassey', title: 'Storekeeper' },
}

export function projectsFor(companyId: CompanyId) {
  return clearSamples[companyId].projects
}

export function materialsFor(companyId: CompanyId) {
  return clearSamples[companyId].materials
}

export function materialById(companyId: CompanyId, id: string) {
  return materialsFor(companyId).find((item) => item.id === id)
}

export function projectById(companyId: CompanyId, id: string) {
  return projectsFor(companyId).find((item) => item.id === id)
}

export function stockOf(stock: StockItem[], materialId: string) {
  return stock.find((item) => item.materialId === materialId)?.onHand ?? 0
}

export function remaining(line: RequestLine) {
  return line.quantity - line.issued
}

export function statusLabel(status: RequestStatus) {
  if (status === 'pending') return 'Pending approval'
  if (status === 'approved') return 'Approved'
  if (status === 'rejected') return 'Rejected'
  if (status === 'partial') return 'Partly issued'
  return 'Fulfilled'
}

function at(day: number, hour: number) {
  return `2026-10-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:20:00.000Z`
}


export function createSeed(companyId: CompanyId = 'harbour'): DemoState {
  const sample = clearSamples[companyId]
  const requests: MaterialRequest[] = sample.requests.map((item) => ({
    id: item.id,
    number: item.number,
    projectId: item.projectId,
    requesterName: item.requesterName,
    reason: item.reason,
    status: item.status,
    lines: item.lines.map((entry) => ({ materialId: entry.materialId, quantity: entry.quantity, issued: entry.issued ?? 0 })),
    createdAt: at(item.created[0], item.created[1]),
    decision: item.decision
      ? { by: actors.approver.name, at: at(item.decision.at[0], item.decision.at[1]), action: item.decision.action, comment: item.decision.comment }
      : undefined,
    issues: (item.issues ?? []).map((issue) => ({
      at: at(issue.at[0], issue.at[1]),
      by: actors.storekeeper.name,
      lines: issue.lines,
    })),
  }))
  const activity = requests.flatMap((request) => {
    const project = projectById(companyId, request.projectId)?.name ?? 'a project'
    const events: Activity[] = [
      { id: `${request.id}-open`, at: request.createdAt, actor: request.requesterName, text: `Submitted ${request.number} for ${project}.`, requestId: request.id },
    ]
    if (request.decision) {
      const verb = request.decision.action === 'approved' ? 'Approved' : 'Rejected'
      events.push({ id: `${request.id}-decision`, at: request.decision.at, actor: request.decision.by, text: `${verb} ${request.number}. ${request.decision.comment}`, requestId: request.id })
    }
    request.issues.forEach((issue, index) => {
      const summary = issue.lines.map((entry) => `${entry.quantity} ${materialById(companyId, entry.materialId)?.name ?? entry.materialId}`).join(', ')
      const text = request.status === 'fulfilled' ? `Fulfilled ${request.number}: ${summary}.` : `Issued ${summary} on ${request.number}.`
      events.push({ id: `${request.id}-issue-${index}`, at: issue.at, actor: issue.by, text, requestId: request.id })
    })
    return events
  }).sort((left, right) => right.at.localeCompare(left.at))
  const notices: Notice[] = requests.flatMap((request) => {
    if (request.status === 'pending') return [{ id: `${request.id}-n`, at: request.createdAt, text: `${request.number} is waiting for approval.`, read: false }]
    if (request.status === 'approved') return [{ id: `${request.id}-n`, at: request.decision?.at ?? request.createdAt, text: `${request.number} is approved and waiting to be issued.`, read: false }]
    if (request.status === 'partial') {
      const remain = request.lines.filter((entry) => remaining(entry) > 0).map((entry) => `${remaining(entry)} ${materialById(companyId, entry.materialId)?.name ?? entry.materialId}`).join(', ')
      return [{ id: `${request.id}-n`, at: request.issues.at(-1)?.at ?? request.createdAt, text: `${request.number} was only partly issued. ${remain} remain.`, read: true }]
    }
    return []
  }).sort((left, right) => right.at.localeCompare(left.at))

  return {
    companyId,
    role: 'requester',
    requests,
    stock: sample.stock,
    activity,
    notices,
    guide: { active: true, step: 1, focusId: null },
  }
}

export type DraftLine = { materialId: string; quantity: string }

export type RequestDraft = {
  projectId: string
  reason: string
  lines: DraftLine[]
}

export function validateDraft(companyId: CompanyId, draft: RequestDraft): string | null {
  if (!projectById(companyId, draft.projectId)) return 'Choose a project.'
  if (draft.reason.trim().length < 12) return 'Give a short reason, at least a sentence.'
  const chosen = draft.lines.filter((item) => item.materialId)
  if (chosen.length === 0) return 'Add at least one material.'
  const seen = new Set<string>()
  for (const item of chosen) {
    if (seen.has(item.materialId)) return 'Each material can appear once on a request.'
    seen.add(item.materialId)
    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < 1) return 'Enter a whole quantity of at least 1.'
    if (quantity > 999) return 'Quantity cannot exceed 999 on this demonstration.'
  }
  return null
}

export function nextNumber(requests: MaterialRequest[]) {
  const highest = requests.reduce((max, request) => {
    const value = Number(request.number.replace('CR-', ''))
    return Number.isFinite(value) ? Math.max(max, value) : max
  }, 2400)
  return `CR-${highest + 1}`
}

function line(materialId: string, quantity: number, issued = 0): RequestLine {
  return { materialId, quantity, issued }
}

export function submitRequest(state: DemoState, draft: RequestDraft, now: string): { state: DemoState; id: string } | { error: string } {
  const error = validateDraft(state.companyId, draft)
  if (error) return { error }
  const id = `req-${Date.now()}`
  const number = nextNumber(state.requests)
  const project = projectById(state.companyId, draft.projectId)
  const request: MaterialRequest = {
    id,
    number,
    projectId: draft.projectId,
    requesterName: actors.requester.name,
    reason: draft.reason.trim(),
    status: 'pending',
    lines: draft.lines
      .filter((item) => item.materialId)
      .map((item) => line(item.materialId, Number(item.quantity))),
    createdAt: now,
    issues: [],
  }
  const text = `Submitted ${number} for ${project?.name ?? 'a project'}.`
  const guide =
    state.guide.active && state.guide.step === 1
      ? { active: true as const, step: 2 as const, focusId: id }
      : state.guide
  return {
    id,
    state: {
      ...state,
      requests: [request, ...state.requests],
      activity: [{ id: `act-${Date.now()}`, at: now, actor: actors.requester.name, text, requestId: id }, ...state.activity],
      notices: [{ id: `note-${Date.now()}`, at: now, text: `${number} is waiting for approval.`, read: false }, ...state.notices],
      guide,
    },
  }
}

export function decideRequest(
  state: DemoState,
  requestId: string,
  action: 'approved' | 'rejected',
  comment: string,
  now: string,
): { state: DemoState } | { error: string } {
  const request = state.requests.find((item) => item.id === requestId)
  if (!request) return { error: 'That request is no longer in this demonstration.' }
  if (request.status !== 'pending') return { error: 'Only a pending request can be approved or rejected.' }
  const trimmed = comment.trim()
  if (action === 'rejected' && trimmed.length < 8) {
    return { error: 'Add a rejection reason the requester can act on.' }
  }
  const stored = trimmed || 'Approved.'
  const text =
    action === 'approved'
      ? `Approved ${request.number}. ${stored}`
      : `Rejected ${request.number}. ${stored}`
  const guide = advanceGuideOnDecision(state.guide, requestId, action)
  return {
    state: {
      ...state,
      requests: state.requests.map((item) =>
        item.id === requestId
          ? {
              ...item,
              status: action,
              decision: { by: actors.approver.name, at: now, action, comment: stored },
            }
          : item,
      ),
      activity: [{ id: `act-${Date.now()}`, at: now, actor: actors.approver.name, text, requestId }, ...state.activity],
      notices: [
        {
          id: `note-${Date.now()}`,
          at: now,
          text: action === 'approved' ? `${request.number} is approved and waiting to be issued.` : `${request.number} was rejected.`,
          read: false,
        },
        ...state.notices,
      ],
      guide,
    },
  }
}

function advanceGuideOnDecision(guide: GuideState, requestId: string, action: 'approved' | 'rejected'): GuideState {
  if (!guide.active) return guide
  if (action === 'approved' && (guide.step === 2 || guide.step === 3)) {
    return { active: true, step: 3, focusId: requestId }
  }
  if (guide.step === 2 && action === 'rejected' && (!guide.focusId || guide.focusId === requestId)) {
    return { active: true, step: 3, focusId: requestId }
  }
  return guide
}

export type IssueInput = { materialId: string; quantity: number }

export function issueRequest(
  state: DemoState,
  requestId: string,
  inputs: IssueInput[],
  now: string,
): { state: DemoState } | { error: string } {
  const request = state.requests.find((item) => item.id === requestId)
  if (!request) return { error: 'That request is no longer in this demonstration.' }
  if (request.status === 'rejected') return { error: 'A rejected request cannot be issued.' }
  if (request.status !== 'approved' && request.status !== 'partial') {
    return { error: 'Materials can be issued only after approval.' }
  }
  const positive = inputs.filter((item) => item.quantity > 0)
  if (positive.length === 0) return { error: 'Enter a quantity to issue.' }
  for (const input of positive) {
    if (!Number.isInteger(input.quantity)) return { error: 'Issue whole quantities only.' }
    const requestLine = request.lines.find((item) => item.materialId === input.materialId)
    if (!requestLine) return { error: 'That material is not on this request.' }
    if (input.quantity > remaining(requestLine)) {
      const name = materialById(state.companyId, input.materialId)?.name ?? 'That material'
      return { error: `${name} has ${remaining(requestLine)} still to issue.` }
    }
    if (input.quantity > stockOf(state.stock, input.materialId)) {
      const name = materialById(state.companyId, input.materialId)?.name ?? 'That material'
      const available = stockOf(state.stock, input.materialId)
      return { error: `Only ${available} in stock for ${name}. Reduce the quantity.` }
    }
  }
  const lines = request.lines.map((item) => {
    const input = positive.find((entry) => entry.materialId === item.materialId)
    return input ? { ...item, issued: item.issued + input.quantity } : item
  })
  const status: RequestStatus = lines.every((item) => remaining(item) === 0) ? 'fulfilled' : 'partial'
  const summary = positive
    .map((item) => `${item.quantity} ${materialById(state.companyId, item.materialId)?.name ?? item.materialId}`)
    .join(', ')
  const text = status === 'fulfilled' ? `Fulfilled ${request.number}: ${summary}.` : `Issued ${summary} on ${request.number}.`
  const guide =
    state.guide.active && state.guide.step === 3
      ? { active: true as const, step: 4 as const, focusId: requestId }
      : state.guide
  return {
    state: {
      ...state,
      requests: state.requests.map((item) =>
        item.id === requestId
          ? { ...item, lines, status, issues: [...item.issues, { at: now, by: actors.storekeeper.name, lines: positive }] }
          : item,
      ),
      stock: state.stock.map((item) => {
        const input = positive.find((entry) => entry.materialId === item.materialId)
        return input ? { ...item, onHand: item.onHand - input.quantity } : item
      }),
      activity: [{ id: `act-${Date.now()}`, at: now, actor: actors.storekeeper.name, text, requestId }, ...state.activity],
      notices: [{ id: `note-${Date.now()}`, at: now, text, read: false }, ...state.notices],
      guide,
    },
  }
}

export function countStatus(requests: MaterialRequest[], status: RequestStatus) {
  return requests.filter((item) => item.status === status).length
}

export function lowStock(companyId: CompanyId, stock: StockItem[]) {
  return stock.filter((item) => {
    const material = materialById(companyId, item.materialId)
    return material ? item.onHand <= material.reorder : false
  })
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}
