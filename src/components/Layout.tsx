import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SiteFooter } from './SiteFooter.tsx'
import { SiteHeader } from './SiteHeader.tsx'

export function Layout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) {
        target.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <div className="flex min-h-svh flex-col bg-paper text-ink">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="content" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

export function Container({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>
}
