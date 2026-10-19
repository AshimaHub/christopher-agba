import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { isCompanyId } from '../content/demoCompanies.ts'
import {
  createSeed,
  decideRequest,
  issueRequest,
  submitRequest,
  type DemoState,
} from './model.ts'
import { ClearRequestContext, type ClearRequestStore } from './useClearRequest.ts'

const storageKey = 'clearrequest-demo-v2'

function readState(): DemoState {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw) as DemoState
    if (!parsed || !Array.isArray(parsed.requests) || !Array.isArray(parsed.stock) || !parsed.guide) {
      return createSeed()
    }
    if (parsed.role !== 'requester' && parsed.role !== 'approver' && parsed.role !== 'storekeeper') {
      return createSeed()
    }
    if (!isCompanyId(parsed.companyId)) return createSeed()
    return parsed
  } catch {
    return createSeed()
  }
}

export function ClearRequestProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => readState())

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // The demonstration still works for this visit if storage is blocked.
    }
  }, [state])

  const store = useMemo<ClearRequestStore>(() => {
    return {
      state,
      setRole(role) {
        setState((current) => ({ ...current, role }))
      },
      setCompany(companyId) {
        setState(createSeed(companyId))
      },
      submit(draft) {
        const result = submitRequest(state, draft, new Date().toISOString())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return { id: result.id }
      },
      decide(requestId, action, comment) {
        const result = decideRequest(state, requestId, action, comment, new Date().toISOString())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      issue(requestId, inputs) {
        const result = issueRequest(state, requestId, inputs, new Date().toISOString())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      dismissGuide() {
        setState((current) => ({ ...current, guide: { ...current.guide, active: false } }))
      },
      markNoticesRead() {
        setState((current) => ({
          ...current,
          notices: current.notices.map((notice) => ({ ...notice, read: true })),
        }))
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

  return <ClearRequestContext.Provider value={store}>{children}</ClearRequestContext.Provider>
}
