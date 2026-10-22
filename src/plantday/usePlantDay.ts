import { createContext, useContext } from 'react'
import type { CompanyId } from '../content/demoCompanies.ts'
import type { DemoState, Role, ShiftStatus } from './model.ts'

export type PlantDayStore = {
  state: DemoState
  setRole: (role: Role) => void
  setCompany: (companyId: CompanyId) => void
  close: (machineId: string, status: Exclude<ShiftStatus, 'open'>, note: string) => { error: string } | null
  followUp: (machineId: string, text: string) => { error: string } | null
  reviewMachine: (machineId: string) => void
  dismissGuide: () => void
  markNoticesRead: () => void
  reset: () => void
}

export const PlantDayContext = createContext<PlantDayStore | null>(null)

export function usePlantDay() {
  const store = useContext(PlantDayContext)
  if (!store) throw new Error('PlantDay store is missing')
  return store
}
