import { useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import type { CompanyId } from '../content/demoCompanies.ts'
import { SampleBusiness } from './SampleBusiness.tsx'
import { ThemeToggle } from './ThemeToggle.tsx'

export type DemoLink = {
  to: string
  label: string
  end?: boolean
  count?: number
}

export type DemoRoleOption = {
  id: string
  label: string
}

type Notice = {
  id: string
  text: string
  read: boolean
}

export function DemoShell({
  appName,
  mark,
  navLabel,
  businessName,
  businessLine,
  backTo,
  links,
  roleId,
  roles,
  actorName,
  actorTitle,
  onRole,
  companyId,
  onCompany,
  notices,
  onMarkNoticesRead,
  onReset,
  guide,
  children,
}: {
  appName: string
  mark: string
  navLabel: string
  businessName: string
  businessLine: string
  backTo: string
  links: DemoLink[]
  roleId: string
  roles: DemoRoleOption[]
  actorName: string
  actorTitle: string
  onRole: (id: string) => void
  companyId: CompanyId
  onCompany: (id: CompanyId) => void
  notices: Notice[]
  onMarkNoticesRead: () => void
  onReset: () => void
  guide?: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [noticesOpen, setNoticesOpen] = useState(false)
  const unread = notices.filter((notice) => !notice.read).length
  const initials = actorName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  return (
    <div className="flex h-svh overflow-hidden bg-[#e6efe8] text-ink dark:bg-[#07140f]">
      <aside
        className={`cr-no-print ${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#10281c] text-[#e7f6ee] transition md:static md:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-4 pt-5">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1b7a45] text-sm font-semibold text-white shadow-inner">
            {mark}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold tracking-tight">{appName}</span>
            <span className="block truncate text-xs text-white/60">{businessName}</span>
          </span>
        </div>
        <p className="mx-4 mt-4 rounded-xl bg-white/8 px-3 py-2 text-xs leading-relaxed text-white/70">
          {businessLine}
        </p>
        <nav className="mt-5 grid gap-1 px-3" aria-label={navLabel}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex min-h-11 items-center justify-between rounded-xl px-3 text-sm ${isActive ? 'bg-white/14 font-medium text-white' : 'text-white/75 hover:bg-white/8 hover:text-white'}`
              }
            >
              <span>{link.label}</span>
              {link.count && link.count > 0 ? (
                <span className="rounded-full bg-[#1b7a45] px-2 py-0.5 text-xs font-semibold text-white">{link.count}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>
        <Link to={backTo} className="mt-auto px-5 py-5 text-sm text-white/70 underline-offset-4 hover:text-white hover:underline">
          Back to the showcase
        </Link>
      </aside>
      {open ? (
        <button type="button" className="cr-no-print fixed inset-0 z-20 bg-black/45 md:hidden" aria-label="Close menu" onClick={() => setOpen(false)} />
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="cr-no-print relative z-20 flex flex-wrap items-center gap-3 border-b border-black/5 bg-white/75 px-3 py-2.5 backdrop-blur-xl sm:px-5 dark:border-white/10 dark:bg-[#0c1c16]/80">
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-xl border border-line bg-white/70 px-3 text-sm md:hidden dark:bg-white/5"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <div className="flex rounded-full bg-black/5 p-1 dark:bg-white/10" role="radiogroup" aria-label="Demo role, not a login">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                role="radio"
                aria-checked={roleId === role.id}
                className={`h-9 rounded-full px-3 text-sm ${roleId === role.id ? 'bg-[#1b7a45] font-medium text-white shadow-sm' : 'text-ink'}`}
                onClick={() => onRole(role.id)}
              >
                {role.label}
              </button>
            ))}
          </div>
          <SampleBusiness value={companyId} onChange={onCompany} />
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-white/80 text-ink dark:bg-white/5"
                aria-expanded={noticesOpen}
                aria-label={unread > 0 ? `Notices, ${unread} unread` : 'Notices'}
                onClick={() => {
                  setNoticesOpen((current) => !current)
                  onMarkNoticesRead()
                }}
              >
                <Bell />
                {unread > 0 ? (
                  <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#1b7a45] px-1 text-[10px] font-semibold text-white">
                    {unread}
                  </span>
                ) : null}
              </button>
              {noticesOpen ? (
                <div className="absolute right-0 z-30 mt-2 w-80 rounded-2xl border border-line bg-white p-3 text-ink shadow-xl dark:bg-[#102018]">
                  <p className="px-2 pb-2 text-xs font-semibold tracking-wide text-muted uppercase">Notices</p>
                  <ul className="max-h-72 space-y-2 overflow-auto">
                    {notices.slice(0, 6).map((notice) => (
                      <li key={notice.id} className="rounded-xl bg-black/4 px-3 py-2 text-sm dark:bg-white/6">
                        {notice.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <ThemeToggle />
            <button
              type="button"
              className="h-10 rounded-full px-3 text-sm text-muted hover:text-ink"
              onClick={() => {
                if (window.confirm('Reset the demonstration to the original sample records?')) onReset()
              }}
            >
              Reset
            </button>
            <span className="hidden items-center gap-2 rounded-full border border-line bg-white/80 py-1 pr-3 pl-1 sm:inline-flex dark:bg-white/5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1b7a45] text-xs font-semibold text-white">
                {initials}
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-medium">{actorName}</span>
                <span className="block text-[11px] text-muted">{actorTitle}</span>
              </span>
            </span>
          </div>
        </header>
        <div className="demo-app min-h-0 flex-1 overflow-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-5">
            {guide}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function Bell() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M6 9a6 6 0 1 1 12 0c0 7 2 7 2 7H4s2 0 2-7" strokeLinejoin="round" />
      <path d="M10 18a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  )
}
