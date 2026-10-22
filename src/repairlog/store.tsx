import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { isCompanyId } from '../content/demoCompanies.ts'
import { createSeed, fileFault, reviewJob, scheduleJob, type DemoState } from './model.ts'
import { RepairLogContext, type RepairLogStore } from './useRepairLog.ts'

const storageKey = 'repairlog-demo-v1'

function readState(): DemoState {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw) as DemoState
    if (!parsed?.jobs || !parsed.assets || !parsed.guide) return createSeed()
    if (parsed.role !== 'mechanic' && parsed.role !== 'lead') return createSeed()
    if (!isCompanyId(parsed.companyId)) return createSeed()
    return parsed
  } catch {
    return createSeed()
  }
}

export function RepairLogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => readState())

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // The demonstration still works for this visit if storage is blocked.
    }
  }, [state])

  const store = useMemo<RepairLogStore>(() => {
    const now = () => new Date().toISOString()
    return {
      state,
      setRole(role) {
        setState((current) => ({ ...current, role }))
      },
      setCompany(companyId) {
        setState(createSeed(companyId))
      },
      file(jobId) {
        const result = fileFault(state, jobId, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      schedule(jobId, plan, cost) {
        const result = scheduleJob(state, jobId, plan, cost, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      reviewJob(jobId) {
        setState((current) => reviewJob(current, jobId))
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

  return <RepairLogContext.Provider value={store}>{children}</RepairLogContext.Provider>
}
