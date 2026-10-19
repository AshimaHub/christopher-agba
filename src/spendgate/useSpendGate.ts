import { createContext, useContext } from 'react'
import type { CompanyId } from '../content/demoCompanies.ts'
import type { DemoState, Role, SheetDraft } from './model.ts'

export type SpendGateStore = {
  state: DemoState
  setRole: (role: Role) => void
  setCompany: (companyId: CompanyId) => void
  submit: (draft: SheetDraft) => { id: string } | { error: string }
  send: (sheetId: string) => { error: string } | null
  startReview: (sheetId: string) => { error: string } | null
  decide: (sheetId: string, action: 'approved' | 'rejected', remark: string) => { error: string } | null
  dismissGuide: () => void
  markNoticesRead: () => void
  reset: () => void
}

export const SpendGateContext = createContext<SpendGateStore | null>(null)

export function useSpendGate() {
  const store = useContext(SpendGateContext)
  if (!store) throw new Error('SpendGate store is missing')
  return store
}
