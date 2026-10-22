import { createContext, useContext } from 'react'
import type { CompanyId } from '../content/demoCompanies.ts'
import type { DemoState, Role } from './model.ts'

export type WaitingStore = {
  state: DemoState
  setRole: (role: Role) => void
  setCompany: (companyId: CompanyId) => void
  send: (itemId: string) => { error: string } | null
  decide: (itemId: string, action: 'approved' | 'returned', remark: string) => { error: string } | null
  reviewItem: (itemId: string) => void
  dismissGuide: () => void
  markNoticesRead: () => void
  reset: () => void
}

export const WaitingContext = createContext<WaitingStore | null>(null)

export function useWaiting() {
  const store = useContext(WaitingContext)
  if (!store) throw new Error('Waiting store is missing')
  return store
}
