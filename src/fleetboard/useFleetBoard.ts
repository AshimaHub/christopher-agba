import { createContext, useContext } from 'react'
import type { CompanyId } from '../content/demoCompanies.ts'
import type { BoardStatus, DemoState, Role } from './model.ts'

export type FleetBoardStore = {
  state: DemoState
  setRole: (role: Role) => void
  setCompany: (companyId: CompanyId) => void
  callIn: (unitId: string, status: Exclude<BoardStatus, 'unreported'>, reported: string, hours: number) => { error: string } | null
  explain: (unitId: string, note: string) => { error: string } | null
  reviewUnit: (unitId: string) => void
  dismissGuide: () => void
  markNoticesRead: () => void
  reset: () => void
}

export const FleetBoardContext = createContext<FleetBoardStore | null>(null)

export function useFleetBoard() {
  const store = useContext(FleetBoardContext)
  if (!store) throw new Error('FleetBoard store is missing')
  return store
}
