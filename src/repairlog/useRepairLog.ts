import { createContext, useContext } from 'react'
import type { CompanyId } from '../content/demoCompanies.ts'
import type { DemoState, Role } from './model.ts'

export type RepairLogStore = {
  state: DemoState
  setRole: (role: Role) => void
  setCompany: (companyId: CompanyId) => void
  file: (jobId: string) => { error: string } | null
  schedule: (jobId: string, plan: string, cost: number) => { error: string } | null
  reviewJob: (jobId: string) => void
  dismissGuide: () => void
  markNoticesRead: () => void
  reset: () => void
}

export const RepairLogContext = createContext<RepairLogStore | null>(null)

export function useRepairLog() {
  const store = useContext(RepairLogContext)
  if (!store) throw new Error('Repair log store is missing')
  return store
}
