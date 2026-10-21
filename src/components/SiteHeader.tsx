import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navigation } from '../content/site.ts'
import { robes } from '../content/robes.ts'
import { primaryAction, primaryLook, robesAction, robesLook } from '../lib/styles.ts'
import { Portrait } from './Portrait.tsx'
import { RobesLogo } from './RobesLogo.tsx'
import { ThemeToggle } from './ThemeToggle.tsx'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const inRobes = pathname.startsWith('/robes')
  const businessChrome = onHome || inRobes
  const links = businessChrome ? robes.navigation : navigation
  const cta = onHome
    ? { to: '/robes/solutions', label: 'Try a live demo', className: robesLook }
    : inRobes
      ? { to: '/robes/contact', label: 'Request a Consultation', className: robesLook }
      : { to: '/contact', label: 'Contact Christopher', className: primaryLook }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (media.matches) setOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-white/25 bg-paper/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-paper/45 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="border-b border-line">
        <nav
          aria-label="Identity"
          className="mx-auto flex w-full max-w-6xl items-center gap-1 px-5 py-2 sm:px-8"
        >
          <IdentityLink to="/" current={pathname === '/'}>
            Home
          </IdentityLink>
          <IdentityLink to="/about" current={pathname.startsWith('/about')}>
            Christopher Agba
          </IdentityLink>
          <IdentityLink to="/robes" current={inRobes} accent="robes">
            <span className="sm:hidden">Robes</span>
            <span className="hidden sm:inline">Robes Leadership | Technology</span>
          </IdentityLink>
        </nav>
      </div>
      <div className="mx-auto flex min-h-[4.5rem] w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to={inRobes ? '/robes' : '/'} className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          {businessChrome ? (
            <RobesLogo className="h-16 w-auto object-contain object-left" />
          ) : (
            <>
              <Portrait alt="" className="h-10 w-10 shrink-0 rounded-full border border-line" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium leading-tight text-ink">
                  Christopher Agba
                </span>
                <span className="hidden text-xs text-muted sm:block">Personal portfolio</span>
              </span>
            </>
          )}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label={businessChrome ? 'Robes' : 'Portfolio'}>
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/robes' || item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? (businessChrome ? 'text-robes' : 'text-accent') : 'text-ink hover:text-accent'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link to={cta.to} className={`hidden lg:inline-flex ${cta.className}`}>
            {cta.label}
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-navigation" aria-label="Mobile" className="border-t border-line bg-paper/70 px-5 py-4 backdrop-blur-xl lg:hidden">
          <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">
            {businessChrome ? 'Robes Leadership | Technology' : 'Christopher Agba'}
          </p>
          <ul className="mt-2 space-y-1">
            {links.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/robes'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center text-lg ${isActive ? (businessChrome ? 'text-robes' : 'text-accent') : 'text-ink'}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link
            to={cta.to}
            onClick={() => setOpen(false)}
            className={`${businessChrome ? robesAction : primaryAction} mt-4 w-full`}
          >
            {cta.label}
          </Link>
        </nav>
      ) : null}
    </header>
  )
}

function IdentityLink({
  to,
  current,
  accent = 'navy',
  children,
}: {
  to: string
  current: boolean
  accent?: 'navy' | 'robes'
  children: ReactNode
}) {
  const active = accent === 'robes' ? 'border-robes text-robes' : 'border-accent text-accent'
  return (
    <Link
      to={to}
      aria-current={current ? 'page' : undefined}
      className={`border-b-2 px-2 py-1 text-sm font-medium ${current ? active : 'border-transparent text-muted hover:text-ink'}`}
    >
      {children}
    </Link>
  )
}
