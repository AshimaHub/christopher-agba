import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { isCompanyId } from '../content/demoCompanies.ts'
import { closeMachine, createSeed, followUp as saveFollowUp, reviewMachine, type DemoState } from './model.ts'
import { PlantDayContext, type PlantDayStore } from './usePlantDay.ts'

const storageKey = 'plantday-demo-v1'

function readState(): DemoState {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw) as DemoState
    if (!parsed?.machines || !parsed.guide) return createSeed()
    if (parsed.role !== 'lead' && parsed.role !== 'supervisor') return createSeed()
    if (!isCompanyId(parsed.companyId)) return createSeed()
    return parsed
  } catch {
    return createSeed()
  }
}

export function PlantDayProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => readState())

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // The demonstration still works for this visit if storage is blocked.
    }
  }, [state])

  const store = useMemo<PlantDayStore>(() => {
    const now = () => new Date().toISOString()
    return {
      state,
      setRole(role) {
        setState((current) => ({ ...current, role }))
      },
      setCompany(companyId) {
        setState(createSeed(companyId))
      },
      close(machineId, status, note) {
        const result = closeMachine(state, machineId, status, note, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      followUp(machineId, text) {
        const result = saveFollowUp(state, machineId, text, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      reviewMachine(machineId) {
        setState((current) => reviewMachine(current, machineId))
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

  return <PlantDayContext.Provider value={store}>{children}</PlantDayContext.Provider>
}
