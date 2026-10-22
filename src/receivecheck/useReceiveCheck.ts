import { createContext, useContext } from 'react'
import type { CompanyId } from '../content/demoCompanies.ts'
import type { DemoState, Role } from './model.ts'

export type ReceiveCheckStore = {
  state: DemoState
  setRole: (role: Role) => void
  setCompany: (companyId: CompanyId) => void
  record: (billId: string) => { error: string } | null
  hold: (billId: string) => { error: string } | null
  accept: (billId: string, quantity: number, note: string) => { error: string } | null
  dismissGuide: () => void
  markNoticesRead: () => void
  reset: () => void
}

export const ReceiveCheckContext = createContext<ReceiveCheckStore | null>(null)

export function useReceiveCheck() {
  const store = useContext(ReceiveCheckContext)
  if (!store) throw new Error('Receive check store is missing')
  return store
}
