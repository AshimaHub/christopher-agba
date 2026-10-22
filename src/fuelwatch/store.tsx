import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { isCompanyId } from '../content/demoCompanies.ts'
import { createSeed, explainIssue, postIssue, reviewIssue, type DemoState } from './model.ts'
import { FuelWatchContext, type FuelWatchStore } from './useFuelWatch.ts'

const storageKey = 'fuelwatch-demo-v1'

function readState(): DemoState {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw) as DemoState
    if (!parsed?.issues || !parsed.guide) return createSeed()
    if (parsed.role !== 'issuer' && parsed.role !== 'supervisor') return createSeed()
    if (!isCompanyId(parsed.companyId)) return createSeed()
    return parsed
  } catch {
    return createSeed()
  }
}

export function FuelWatchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => readState())

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // The demonstration still works for this visit if storage is blocked.
    }
  }, [state])

  const store = useMemo<FuelWatchStore>(() => {
    const now = () => new Date().toISOString()
    return {
      state,
      setRole(role) {
        setState((current) => ({ ...current, role }))
      },
      setCompany(companyId) {
        setState(createSeed(companyId))
      },
      post(issueId, litres, hours) {
        const result = postIssue(state, issueId, litres, hours, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      explain(issueId, explanation) {
        const result = explainIssue(state, issueId, explanation, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      reviewIssue(issueId) {
        setState((current) => reviewIssue(current, issueId))
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

  return <FuelWatchContext.Provider value={store}>{children}</FuelWatchContext.Provider>
}
