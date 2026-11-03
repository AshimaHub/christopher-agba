import { Suspense, type ReactNode } from 'react'

export function RouteFallback() {
  return (
    <div className="grid min-h-[50vh] place-items-center px-5" role="status" aria-live="polite">
      <p className="text-sm text-muted">Loading…</p>
    </div>
  )
}

export function Load({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}
