import { createContext, useContext } from 'react'
import type { CompanyId } from '../content/demoCompanies.ts'
import type { Condition, DemoState, NoteDraft, Role } from './model.ts'

export type WaynoteStore = {
  state: DemoState
  setRole: (role: Role) => void
  setCompany: (companyId: CompanyId) => void
  submit: (draft: NoteDraft) => { id: string } | { error: string }
  send: (noteId: string) => { error: string } | null
  receive: (noteId: string, arrived: { goodsId: string; quantity: number; condition: Condition }[], comment: string) => { error: string } | null
  complete: (noteId: string) => { error: string } | null
  dismissGuide: () => void
  markNoticesRead: () => void
  reset: () => void
}

export const WaynoteContext = createContext<WaynoteStore | null>(null)

export function useWaynote() {
  const store = useContext(WaynoteContext)
  if (!store) throw new Error('Waynote store is missing')
  return store
}
