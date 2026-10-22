import { createContext, useContext } from 'react'
import type { CompanyId } from '../content/demoCompanies.ts'
import type { DayDraft, DemoState, Role } from './model.ts'

export type HireHoursStore = {
  state: DemoState
  setRole: (role: Role) => void
  setCompany: (companyId: CompanyId) => void
  log: (dayId: string, worked: number, idle: number, note: string) => { error: string } | null
  decide: (dayId: string, action: 'accepted' | 'queried', remark: string) => { error: string } | null
  add: (draft: DayDraft) => { id: string } | { error: string }
  reviewWeek: (machineId: string) => void
  dismissGuide: () => void
  markNoticesRead: () => void
  reset: () => void
}

export const HireHoursContext = createContext<HireHoursStore | null>(null)

export function useHireHours() {
  const store = useContext(HireHoursContext)
  if (!store) throw new Error('HireHours store is missing')
  return store
}
