import { type CompanyId } from '../content/demoCompanies.ts'
import { waynoteSamples } from './samples.ts'

export type { CompanyId }
export type Role = 'dispatcher' | 'receiver'

export type NoteStatus = 'draft' | 'pending' | 'received' | 'disputed' | 'completed'

export type Condition = 'New' | 'Good' | 'Used' | 'Damaged'

export type Place = { id: string; name: string }

export type Goods = { id: string; name: string; unit: string }

export type NoteLine = {
  goodsId: string
  sent: number
  conditionSent: Condition
  arrived: number | null
  conditionReceived: Condition | null
}

export type DispatchNote = {
  id: string
  number: string
  originId: string
  destinationId: string
  carrier: string
  reference: string
  dispatcherName: string
  status: NoteStatus
  lines: NoteLine[]
  createdAt: string
  sentAt?: string
  receipt?: { by: string; at: string; comment: string }
}

export type Activity = { id: string; at: string; actor: string; text: string; noteId?: string }
export type Notice = { id: string; at: string; text: string; read: boolean }
export type GuideState = { active: boolean; step: 1 | 2 | 3 | 4; focusId: string | null }

export type DemoState = {
  companyId: CompanyId
  role: Role
  notes: DispatchNote[]
  activity: Activity[]
  notices: Notice[]
  guide: GuideState
}

export const conditions: Condition[] = ['New', 'Good', 'Used', 'Damaged']

export const actors: Record<Role, { name: string; title: string }> = {
  dispatcher: { name: 'Ngozi Eze', title: 'Sender' },
  receiver: { name: 'Halima Yusuf', title: 'Receiver' },
}

export function placesFor(companyId: CompanyId) {
  return waynoteSamples[companyId].places
}

export function goodsFor(companyId: CompanyId) {
  return waynoteSamples[companyId].goods
}

export function placeById(companyId: CompanyId, id: string) {
  return placesFor(companyId).find((place) => place.id === id)
}

export function goodsById(companyId: CompanyId, id: string) {
  return goodsFor(companyId).find((item) => item.id === id)
}

export function statusLabel(status: NoteStatus) {
  if (status === 'draft') return 'Draft'
  if (status === 'pending') return 'Pending receipt'
  if (status === 'received') return 'Received'
  if (status === 'disputed') return 'Disputed'
  return 'Completed'
}

export function lineDisputed(line: NoteLine) {
  if (line.arrived === null || !line.conditionReceived) return false
  return line.arrived !== line.sent || line.conditionReceived !== line.conditionSent
}

export function countStatus(notes: DispatchNote[], status: NoteStatus) {
  return notes.filter((note) => note.status === status).length
}

function at(day: number, hour: number) {
  return `2026-10-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:10:00.000Z`
}

function line(goodsId: string, sent: number, conditionSent: Condition, arrived: number | null = null, conditionReceived: Condition | null = null): NoteLine {
  return { goodsId, sent, conditionSent, arrived, conditionReceived }
}

export function createSeed(companyId: CompanyId = 'harbour'): DemoState {
  const sample = waynoteSamples[companyId]
  const notes: DispatchNote[] = sample.notes.map((item) => ({
    id: item.id,
    number: item.number,
    originId: item.originId,
    destinationId: item.destinationId,
    carrier: item.carrier,
    reference: item.reference,
    dispatcherName: item.dispatcherName,
    status: item.status,
    lines: item.lines.map((entry) => ({
      goodsId: entry.goodsId,
      sent: entry.sent,
      conditionSent: entry.conditionSent,
      arrived: entry.arrived ?? null,
      conditionReceived: entry.conditionReceived ?? null,
    })),
    createdAt: at(item.created[0], item.created[1]),
    sentAt: item.sent ? at(item.sent[0], item.sent[1]) : undefined,
    receipt: item.receipt ? { by: item.receipt.by, at: at(item.receipt.at[0], item.receipt.at[1]), comment: item.receipt.comment } : undefined,
  }))
  const activity: Activity[] = notes.flatMap((note) => {
    const events: Activity[] = []
    if (note.status === 'draft') {
      events.push({ id: `${note.id}-draft`, at: note.createdAt, actor: note.dispatcherName, text: `Saved ${note.number} as a draft.`, noteId: note.id })
    } else {
      events.push({ id: `${note.id}-sent`, at: note.sentAt ?? note.createdAt, actor: note.dispatcherName, text: `Sent ${note.number}. It is pending receipt.`, noteId: note.id })
    }
    if (note.receipt && note.status === 'disputed') {
      events.push({ id: `${note.id}-receipt`, at: note.receipt.at, actor: note.receipt.by, text: `Disputed ${note.number}. ${note.receipt.comment}`, noteId: note.id })
    } else if (note.receipt && note.status === 'received') {
      events.push({ id: `${note.id}-receipt`, at: note.receipt.at, actor: note.receipt.by, text: `Received ${note.number}. Quantity and condition match.`, noteId: note.id })
    } else if (note.status === 'completed' && note.receipt) {
      events.push({ id: `${note.id}-done`, at: note.receipt.at, actor: note.receipt.by, text: `Completed ${note.number}.`, noteId: note.id })
    }
    return events
  }).sort((left, right) => right.at.localeCompare(left.at))
  const notices: Notice[] = notes.flatMap((note): Notice[] => {
    const destination = placeById(companyId, note.destinationId)?.name ?? 'the destination'
    if (note.status === 'draft') return [{ id: `${note.id}-n`, at: note.createdAt, text: `${note.number} is still a draft.`, read: false }]
    if (note.status === 'pending') return [{ id: `${note.id}-n`, at: note.sentAt ?? note.createdAt, text: `${note.number} is pending receipt at ${destination}.`, read: false }]
    if (note.status === 'disputed') return [{ id: `${note.id}-n`, at: note.receipt?.at ?? note.createdAt, text: `${note.number} was disputed on receipt.`, read: true }]
    return []
  })

  return {
    companyId,
    role: 'dispatcher',
    notes,
    activity,
    notices,
    guide: { active: true, step: 1, focusId: 'note-1807' },
  }
}

export type DraftLine = { goodsId: string; quantity: string; condition: Condition }
export type NoteDraft = { originId: string; destinationId: string; carrier: string; reference: string; lines: DraftLine[] }

export function validateDraft(companyId: CompanyId, draft: NoteDraft): string | null {
  if (!placeById(companyId, draft.originId) || !placeById(companyId, draft.destinationId)) return 'Choose both places.'
  if (draft.originId === draft.destinationId) return 'The load must leave one place and arrive at another.'
  if (draft.carrier.trim().length < 2) return 'Name the carrier or the truck.'
  if (draft.reference.trim().length < 12) return 'Say what the load is for, in a short sentence.'
  const chosen = draft.lines.filter((item) => item.goodsId)
  if (chosen.length === 0) return 'Add at least one item.'
  const seen = new Set<string>()
  for (const item of chosen) {
    if (seen.has(item.goodsId)) return 'Each item can appear once on a note.'
    seen.add(item.goodsId)
    if (!conditions.includes(item.condition)) return 'Choose the condition of each item as it leaves.'
    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) return 'Enter a whole quantity from 1 to 999.'
  }
  return null
}

function nextNumber(notes: DispatchNote[]) {
  const highest = notes.reduce((max, note) => {
    const value = Number(note.number.replace('WN-', ''))
    return Number.isFinite(value) ? Math.max(max, value) : max
  }, 1800)
  return `WN-${highest + 1}`
}

function record(state: DemoState, next: DispatchNote, now: string, actor: string, text: string, notice: string, guide = state.guide): DemoState {
  return {
    ...state,
    notes: state.notes.some((item) => item.id === next.id) ? state.notes.map((item) => (item.id === next.id ? next : item)) : [next, ...state.notes],
    activity: [{ id: `act-${Date.now()}`, at: now, actor, text, noteId: next.id }, ...state.activity],
    notices: [{ id: `n-${Date.now()}`, at: now, text: notice, read: false }, ...state.notices],
    guide,
  }
}

export function submitNote(state: DemoState, draft: NoteDraft, now: string): { state: DemoState; id: string } | { error: string } {
  const error = validateDraft(state.companyId, draft)
  if (error) return { error }
  const id = `note-${Date.now()}`
  const number = nextNumber(state.notes)
  const origin = placeById(state.companyId, draft.originId)?.name
  const destination = placeById(state.companyId, draft.destinationId)?.name
  const note: DispatchNote = {
    id,
    number,
    originId: draft.originId,
    destinationId: draft.destinationId,
    carrier: draft.carrier.trim(),
    reference: draft.reference.trim(),
    dispatcherName: actors.dispatcher.name,
    status: 'pending',
    lines: draft.lines.filter((item) => item.goodsId).map((item) => line(item.goodsId, Number(item.quantity), item.condition)),
    createdAt: now,
    sentAt: now,
  }
  const guide = state.guide.active && state.guide.step === 1 ? { active: true as const, step: 2 as const, focusId: id } : state.guide
  return { id, state: record(state, note, now, actors.dispatcher.name, `Sent ${number} from ${origin} to ${destination}. Pending receipt.`, `${number} is pending receipt.`, guide) }
}

export function sendDraft(state: DemoState, noteId: string, now: string): { state: DemoState } | { error: string } {
  const note = state.notes.find((item) => item.id === noteId)
  if (!note) return { error: 'That note is no longer in this demonstration.' }
  if (note.status !== 'draft') return { error: 'Only a draft can be sent.' }
  const next: DispatchNote = { ...note, status: 'pending', sentAt: now }
  const guide = state.guide.active && state.guide.step === 1 && state.guide.focusId === noteId
    ? { active: true as const, step: 2 as const, focusId: noteId }
    : state.guide
  return { state: record(state, next, now, actors.dispatcher.name, `Sent ${note.number}. It is pending receipt.`, `${note.number} is pending receipt.`, guide) }
}

export function receiveNote(
  state: DemoState,
  noteId: string,
  arrived: { goodsId: string; quantity: number; condition: Condition }[],
  comment: string,
  now: string,
): { state: DemoState } | { error: string } {
  const note = state.notes.find((item) => item.id === noteId)
  if (!note) return { error: 'That note is no longer in this demonstration.' }
  if (note.status !== 'pending') return { error: 'Receive a note only while it is pending receipt.' }
  if (arrived.length !== note.lines.length) return { error: 'Enter a received quantity and condition for every line.' }
  for (const lineItem of note.lines) {
    const input = arrived.find((item) => item.goodsId === lineItem.goodsId)
    if (!input || !Number.isInteger(input.quantity) || input.quantity < 0) return { error: 'Received quantities must be whole numbers, including zero.' }
    if (input.quantity > lineItem.sent) {
      const name = goodsById(state.companyId, lineItem.goodsId)?.name ?? 'That item'
      return { error: `${name} cannot arrive as more than the ${lineItem.sent} that were sent.` }
    }
    if (!conditions.includes(input.condition)) return { error: 'Choose the condition received for every line.' }
  }
  const lines = note.lines.map((item) => {
    const input = arrived.find((row) => row.goodsId === item.goodsId)
    return { ...item, arrived: input?.quantity ?? 0, conditionReceived: input?.condition ?? item.conditionSent }
  })
  const disputed = lines.some(lineDisputed)
  const trimmed = comment.trim()
  if (disputed && trimmed.length < 8) return { error: 'The quantity or condition does not match. Say what the receiver found.' }
  const status: NoteStatus = disputed ? 'disputed' : 'received'
  const text = disputed ? `Disputed ${note.number}. ${trimmed}` : `Received ${note.number}. Quantity and condition match.`
  const guide = state.guide.active && state.guide.step === 2 && (!state.guide.focusId || state.guide.focusId === noteId)
    ? { active: true as const, step: (disputed ? 4 : 3) as 3 | 4, focusId: noteId }
    : state.guide
  return {
    state: record(state, { ...note, lines, status, receipt: { by: actors.receiver.name, at: now, comment: trimmed || 'Quantity and condition match the note.' } }, now, actors.receiver.name, text, text, guide),
  }
}

export function completeNote(state: DemoState, noteId: string, now: string): { state: DemoState } | { error: string } {
  const note = state.notes.find((item) => item.id === noteId)
  if (!note) return { error: 'That note is no longer in this demonstration.' }
  if (note.status !== 'received') return { error: 'Complete a note only after it has been received without a dispute.' }
  const guide = state.guide.active && state.guide.step === 3 && state.guide.focusId === noteId
    ? { active: true as const, step: 4 as const, focusId: noteId }
    : state.guide
  const text = `Completed ${note.number}.`
  return { state: record(state, { ...note, status: 'completed' }, now, actors.receiver.name, text, text, guide) }
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
