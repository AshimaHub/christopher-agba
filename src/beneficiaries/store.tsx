import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { isCompanyId } from '../content/demoCompanies.ts'
import { addPayee, createSeed, decidePayee, reviewPayee, submitPayee, updateDraft, verifyPayee, type DemoState } from './model.ts'
import { BeneficiariesContext, type BeneficiariesStore } from './useBeneficiaries.ts'

const storageKey = 'beneficiaries-demo-v1'

function readState(): DemoState {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw) as DemoState
    if (!parsed?.payees || !parsed.guide) return createSeed()
    if (parsed.role !== 'clerk' && parsed.role !== 'reviewer') return createSeed()
    if (!isCompanyId(parsed.companyId)) return createSeed()
    return parsed
  } catch {
    return createSeed()
  }
}

export function BeneficiariesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => readState())

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // The demonstration still works for this visit if storage is blocked.
    }
  }, [state])

  const store = useMemo<BeneficiariesStore>(() => {
    const now = () => new Date().toISOString()
    return {
      state,
      setRole(role) {
        setState((current) => ({ ...current, role }))
      },
      setCompany(companyId) {
        setState(createSeed(companyId))
      },
      update(payeeId, draft) {
        const result = updateDraft(state, payeeId, draft)
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      verify(payeeId, draft) {
        const updated = updateDraft(state, payeeId, draft)
        if ('error' in updated) return { error: updated.error }
        const result = verifyPayee(updated.state, payeeId, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      submit(payeeId, draft) {
        const updated = updateDraft(state, payeeId, draft)
        if ('error' in updated) return { error: updated.error }
        const result = submitPayee(updated.state, payeeId, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      decide(payeeId, action, remark) {
        const result = decidePayee(state, payeeId, action, remark, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      add(draft) {
        const result = addPayee(state, draft, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return { id: result.id }
      },
      reviewPayee(payeeId) {
        setState((current) => reviewPayee(current, payeeId))
      },
      dismissGuide() {
        setState((current) => ({ ...current, guide: { ...current.guide, active: false } }))
      },
      markNoticesRead() {
        setState((current) => ({ ...current, notices: current.notices.map((notice) => ({ ...notice, read: true })) }))
      },
      reset() {
        const fresh = createSeed(state.companyId)
        setState(fresh)
        try {
          localStorage.setItem(storageKey, JSON.stringify(fresh))
        } catch {
          // Memory state is already reset.
        }
      },
    }
  }, [state])

  return <BeneficiariesContext.Provider value={store}>{children}</BeneficiariesContext.Provider>
}
