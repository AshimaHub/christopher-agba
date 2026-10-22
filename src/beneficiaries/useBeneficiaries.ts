import { createContext, useContext } from 'react'
import type { CompanyId } from '../content/demoCompanies.ts'
import type { DemoState, PayeeDraft, Role } from './model.ts'

export type BeneficiariesStore = {
  state: DemoState
  setRole: (role: Role) => void
  setCompany: (companyId: CompanyId) => void
  update: (payeeId: string, draft: PayeeDraft) => { error: string } | null
  verify: (payeeId: string, draft: PayeeDraft) => { error: string } | null
  submit: (payeeId: string, draft: PayeeDraft) => { error: string } | null
  decide: (payeeId: string, action: 'approved' | 'returned', remark: string) => { error: string } | null
  add: (draft: PayeeDraft) => { id: string } | { error: string }
  reviewPayee: (payeeId: string) => void
  dismissGuide: () => void
  markNoticesRead: () => void
  reset: () => void
}

export const BeneficiariesContext = createContext<BeneficiariesStore | null>(null)

export function useBeneficiaries() {
  const store = useContext(BeneficiariesContext)
  if (!store) throw new Error('Beneficiaries store is missing')
  return store
}
