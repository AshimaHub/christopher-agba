import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { isCompanyId } from '../content/demoCompanies.ts'
import { addMovement, createSeed, postMovement, reviewCard, type DemoState } from './model.ts'
import { SiteLedgerContext, type SiteLedgerStore } from './useSiteLedger.ts'

const storageKey = 'siteledger-demo-v1'

function readState(): DemoState {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw) as DemoState
    if (!parsed?.movements || !parsed.guide) return createSeed()
    if (parsed.role !== 'keeper' && parsed.role !== 'supervisor') return createSeed()
    if (!isCompanyId(parsed.companyId)) return createSeed()
    return parsed
  } catch {
    return createSeed()
  }
}

export function SiteLedgerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => readState())

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // The demonstration still works for this visit if storage is blocked.
    }
  }, [state])

  const store = useMemo<SiteLedgerStore>(() => {
    const now = () => new Date().toISOString()
    return {
      state,
      setRole(role) {
        setState((current) => ({ ...current, role }))
      },
      setCompany(companyId) {
        setState(createSeed(companyId))
      },
      post(moveId) {
        const result = postMovement(state, moveId, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      add(draft) {
        const result = addMovement(state, draft, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return { id: result.id }
      },
      reviewCard(itemId) {
        setState((current) => reviewCard(current, itemId))
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

  return <SiteLedgerContext.Provider value={store}>{children}</SiteLedgerContext.Provider>
}
