import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { isCompanyId } from '../content/demoCompanies.ts'
import { acceptCorrection, createSeed, holdBill, recordCount, type DemoState } from './model.ts'
import { ReceiveCheckContext, type ReceiveCheckStore } from './useReceiveCheck.ts'

const storageKey = 'receivecheck-demo-v1'

function readState(): DemoState {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw) as DemoState
    if (!parsed?.bills || !parsed.guide) return createSeed()
    if (parsed.role !== 'clerk' && parsed.role !== 'accounts') return createSeed()
    if (!isCompanyId(parsed.companyId)) return createSeed()
    return parsed
  } catch {
    return createSeed()
  }
}

export function ReceiveCheckProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => readState())

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // The demonstration still works for this visit if storage is blocked.
    }
  }, [state])

  const store = useMemo<ReceiveCheckStore>(() => {
    const now = () => new Date().toISOString()
    return {
      state,
      setRole(role) {
        setState((current) => ({ ...current, role }))
      },
      setCompany(companyId) {
        setState(createSeed(companyId))
      },
      record(billId) {
        const result = recordCount(state, billId, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      hold(billId) {
        const result = holdBill(state, billId, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      accept(billId, quantity, note) {
        const result = acceptCorrection(state, billId, quantity, note, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
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

  return <ReceiveCheckContext.Provider value={store}>{children}</ReceiveCheckContext.Provider>
}
