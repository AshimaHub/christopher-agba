import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { isCompanyId } from '../content/demoCompanies.ts'
import { createSeed, decideItem, reviewItem, sendItem, type DemoState } from './model.ts'
import { WaitingContext, type WaitingStore } from './useWaiting.ts'

const storageKey = 'waiting-demo-v1'

function readState(): DemoState {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw) as DemoState
    if (!parsed?.items || !parsed.guide) return createSeed()
    if (parsed.role !== 'requester' && parsed.role !== 'owner') return createSeed()
    if (!isCompanyId(parsed.companyId)) return createSeed()
    return parsed
  } catch {
    return createSeed()
  }
}

export function WaitingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => readState())

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // The demonstration still works for this visit if storage is blocked.
    }
  }, [state])

  const store = useMemo<WaitingStore>(() => {
    const now = () => new Date().toISOString()
    return {
      state,
      setRole(role) {
        setState((current) => ({ ...current, role }))
      },
      setCompany(companyId) {
        setState(createSeed(companyId))
      },
      send(itemId) {
        const result = sendItem(state, itemId, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      decide(itemId, action, remark) {
        const result = decideItem(state, itemId, action, remark, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      reviewItem(itemId) {
        setState((current) => reviewItem(current, itemId))
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

  return <WaitingContext.Provider value={store}>{children}</WaitingContext.Provider>
}
