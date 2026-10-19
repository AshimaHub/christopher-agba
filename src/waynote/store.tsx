import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { isCompanyId } from '../content/demoCompanies.ts'
import { completeNote, createSeed, receiveNote, sendDraft, submitNote, type DemoState } from './model.ts'
import { WaynoteContext, type WaynoteStore } from './useWaynote.ts'

const storageKey = 'waynote-demo-v3'

function readState(): DemoState {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw) as DemoState
    if (!parsed?.notes || !parsed.guide) return createSeed()
    if (parsed.role !== 'dispatcher' && parsed.role !== 'receiver') return createSeed()
    if (!isCompanyId(parsed.companyId)) return createSeed()
    return parsed
  } catch {
    return createSeed()
  }
}

export function WaynoteProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => readState())

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // The demonstration still works for this visit if storage is blocked.
    }
  }, [state])

  const store = useMemo<WaynoteStore>(() => {
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
        const result = submitNote(state, draft, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return { id: result.id }
      },
      send(noteId) {
        const result = sendDraft(state, noteId, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      receive(noteId, arrived, comment) {
        const result = receiveNote(state, noteId, arrived, comment, now())
        if ('error' in result) return { error: result.error }
        setState(result.state)
        return null
      },
      complete(noteId) {
        const result = completeNote(state, noteId, now())
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

  return <WaynoteContext.Provider value={store}>{children}</WaynoteContext.Provider>
}
