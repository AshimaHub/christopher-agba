import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { isCompanyId } from '../content/demoCompanies.ts'
import { createSeed, decideSheet, sendDraft, startReview, submitSheet, type DemoState } from './model.ts'
import { SpendGateContext, type SpendGateStore } from './useSpendGate.ts'

const storageKey = 'spendgate-demo-v3'

function readState(): DemoState {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw) as DemoState
    if (!parsed?.sheets || !parsed.guide) return createSeed()
    if (parsed.role !== 'submitter' && parsed.role !== 'approver') return createSeed()
    if (!isCompanyId(parsed.companyId)) return createSeed()
    return parsed
  } catch {
    return createSeed()
  }
}

export function SpendGateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => readState())

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // The demonstration still works for this visit if storage is blocked.
    }
  }, [state])

  const store = useMemo<SpendGateStore>(() => {
    const now = () => new Date().toISOString()
    return {
      state,
      setRole(role) {
        setState((current) => ({ ...current, role }))
      },
      setCompany(companyId) {
        setState(createSeed(companyId))
      },
      submit(draft) {
        const result = submitSheet(state, draft, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return { id: result.id }
      },
      send(sheetId) {
        const result = sendDraft(state, sheetId, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      startReview(sheetId) {
        const result = startReview(state, sheetId, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      decide(sheetId, action, remark) {
        const result = decideSheet(state, sheetId, action, remark, now())
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

  return <SpendGateContext.Provider value={store}>{children}</SpendGateContext.Provider>
}
