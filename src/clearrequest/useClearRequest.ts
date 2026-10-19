import { createContext, useContext } from 'react'
import type { CompanyId } from '../content/demoCompanies.ts'
import type { DemoState, IssueInput, RequestDraft, Role } from './model.ts'

export type ClearRequestStore = {
  state: DemoState
  setRole: (role: Role) => void
  setCompany: (companyId: CompanyId) => void
  submit: (draft: RequestDraft) => { id: string } | { error: string }
  decide: (requestId: string, action: 'approved' | 'rejected', comment: string) => { error: string } | null
  issue: (requestId: string, inputs: IssueInput[]) => { error: string } | null
  dismissGuide: () => void
  markNoticesRead: () => void
  reset: () => void
}

export const ClearRequestContext = createContext<ClearRequestStore | null>(null)

export function useClearRequest() {
  const store = useContext(ClearRequestContext)
  if (!store) throw new Error('ClearRequest store is missing')
  return store
}
