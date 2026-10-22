import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { isCompanyId } from '../content/demoCompanies.ts'
import { addDay, createSeed, decideDay, logDay, reviewWeek, type DemoState } from './model.ts'
import { HireHoursContext, type HireHoursStore } from './useHireHours.ts'

const storageKey = 'hirehours-demo-v2'

function readState(): DemoState {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw) as DemoState
    if (!parsed?.days || !parsed.guide) return createSeed()
    if (parsed.role !== 'clerk' && parsed.role !== 'commercial') return createSeed()
    if (!isCompanyId(parsed.companyId)) return createSeed()
    return parsed
  } catch {
    return createSeed()
  }
}

export function HireHoursProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => readState())

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // The demonstration still works for this visit if storage is blocked.
    }
  }, [state])

  const store = useMemo<HireHoursStore>(() => {
    const now = () => new Date().toISOString()
    return {
      state,
      setRole(role) {
        setState((current) => ({ ...current, role }))
      },
      setCompany(companyId) {
        setState(createSeed(companyId))
      },
      log(dayId, worked, idle, note) {
        const result = logDay(state, dayId, worked, idle, note, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      decide(dayId, action, remark) {
        const result = decideDay(state, dayId, action, remark, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      add(draft) {
        const result = addDay(state, draft, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return { id: result.id }
      },
      reviewWeek(machineId) {
        setState((current) => reviewWeek(current, machineId))
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

  return <HireHoursContext.Provider value={store}>{children}</HireHoursContext.Provider>
}
