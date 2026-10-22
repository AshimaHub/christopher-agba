import { createContext, useContext } from 'react'
import type { CompanyId } from '../content/demoCompanies.ts'
import type { DemoState, Role } from './model.ts'

export type FuelWatchStore = {
  state: DemoState
  setRole: (role: Role) => void
  setCompany: (companyId: CompanyId) => void
  post: (issueId: string, litres: number, hours: number) => { error: string } | null
  explain: (issueId: string, explanation: string) => { error: string } | null
  reviewIssue: (issueId: string) => void
  dismissGuide: () => void
  markNoticesRead: () => void
  reset: () => void
}

export const FuelWatchContext = createContext<FuelWatchStore | null>(null)

export function useFuelWatch() {
  const store = useContext(FuelWatchContext)
  if (!store) throw new Error('FuelWatch store is missing')
  return store
}
