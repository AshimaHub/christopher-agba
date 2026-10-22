import { createContext, useContext } from 'react'
import type { CompanyId } from '../content/demoCompanies.ts'
import type { DemoState, MoveDraft, Role } from './model.ts'

export type SiteLedgerStore = {
  state: DemoState
  setRole: (role: Role) => void
  setCompany: (companyId: CompanyId) => void
  post: (moveId: string) => { error: string } | null
  add: (draft: MoveDraft) => { id: string } | { error: string }
  reviewCard: (itemId: string) => void
  dismissGuide: () => void
  markNoticesRead: () => void
  reset: () => void
}

export const SiteLedgerContext = createContext<SiteLedgerStore | null>(null)

export function useSiteLedger() {
  const store = useContext(SiteLedgerContext)
  if (!store) throw new Error('SiteLedger store is missing')
  return store
}
