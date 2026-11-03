type Plausible = ((event: string, options?: { props?: Record<string, string> }) => void) & { q?: unknown[] }

declare global {
  interface Window {
    plausible?: Plausible
  }
}

/** Loads Plausible only when VITE_PLAUSIBLE_DOMAIN is set at build time. No script is added otherwise. */
export function installAnalytics() {
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN?.trim()
  if (!domain || window.plausible) return
  const plausible = ((...args: unknown[]) => {
    const queue = (plausible.q = plausible.q || [])
    queue.push(args)
  }) as Plausible
  window.plausible = plausible
  const script = document.createElement('script')
  script.defer = true
  script.dataset.domain = domain
  script.src = 'https://plausible.io/js/script.js'
  document.head.appendChild(script)
}

export function track(event: string, props?: Record<string, string>) {
  if (!import.meta.env.VITE_PLAUSIBLE_DOMAIN?.trim()) return
  window.plausible?.(event, props ? { props } : undefined)
}
