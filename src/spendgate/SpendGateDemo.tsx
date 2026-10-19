import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Seo } from '../components/Seo.tsx'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { SampleBusiness } from '../components/SampleBusiness.tsx'
import { demoCompany } from '../content/demoCompanies.ts'
import { actors, countStatus, type Role } from './model.ts'
import { SpendGateProvider } from './store.tsx'
import { useSpendGate } from './useSpendGate.ts'

const links = [
  { to: '/robes/demo/spendgate', label: 'Overview', end: true },
  { to: '/robes/demo/spendgate/claims', label: 'Sheets', end: false },
  { to: '/robes/demo/spendgate/review', label: 'Review', end: false },
  { to: '/robes/demo/spendgate/finance', label: 'Decisions', end: false },
  { to: '/robes/demo/spendgate/funding', label: 'Approved', end: false },
  { to: '/robes/demo/spendgate/activity', label: 'Activity', end: false },
]

export function SpendGateDemo() {
  return (
    <SpendGateProvider>
      <DemoFrame />
    </SpendGateProvider>
  )
}

function DemoFrame() {
  const { state, setRole, setCompany, reset, markNoticesRead } = useSpendGate()
  const business = demoCompany(state.companyId)
  const [open, setOpen] = useState(false)
  const [noticesOpen, setNoticesOpen] = useState(false)
  const unread = state.notices.filter((notice) => !notice.read).length
  const waiting = countStatus(state.sheets, 'submitted') + countStatus(state.sheets, 'review')

  return (
    <div className="min-h-svh bg-paper text-ink">
      <Seo title="Try the expense approval demo · SpendGate" description="Submit a site expense, then approve or reject it with a remark. Then ask Robes to build this control for your business." path="/robes/demo/spendgate" />
      <div className="flex min-h-svh">
        <aside className={`cr-no-print ${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-72 border-r border-line bg-paper-2 p-5 transition md:static md:translate-x-0`}>
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Robes demonstration</p>
          <p className="mt-2 font-serif text-3xl text-ink">SpendGate</p>
          <p className="mt-2 text-sm text-muted">{business.name}</p>
          <p className="text-sm text-muted">{business.trade}. One of four sample businesses.</p>
          <nav className="mt-8 grid gap-1" aria-label="SpendGate">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)} className={({ isActive }) => `flex min-h-11 items-center justify-between px-3 text-sm ${isActive ? 'bg-robes-fill text-robes-ink' : 'text-ink hover:bg-paper'}`}>
                <span>{link.label}</span>
                {link.label === 'Review' && waiting > 0 ? <span>{waiting}</span> : null}
              </NavLink>
            ))}
          </nav>
          <Link to="/robes/solutions/spendgate" className="mt-8 inline-flex text-sm text-robes underline underline-offset-4">Back to the showcase</Link>
        </aside>
        {open ? <button type="button" className="cr-no-print fixed inset-0 z-20 bg-band/40 md:hidden" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="cr-no-print flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-6">
            <button type="button" className="min-h-11 border border-line px-3 text-sm md:hidden" onClick={() => setOpen(true)}>Menu</button>
            <RoleSwitcher role={state.role} onChange={setRole} />
            <SampleBusiness value={state.companyId} onChange={setCompany} />
            <div className="ml-auto flex items-center gap-1">
              <button type="button" className="relative min-h-11 px-3 text-sm" aria-expanded={noticesOpen} onClick={() => { setNoticesOpen((current) => !current); markNoticesRead() }}>
                Notices{unread > 0 ? ` (${unread})` : ''}
              </button>
              <ThemeToggle />
              <button type="button" className="min-h-11 px-3 text-sm" onClick={() => { if (window.confirm('Reset the demonstration to the original sample records?')) reset() }}>Reset demo</button>
            </div>
          </header>
          {noticesOpen ? <div className="cr-no-print border-b border-line bg-card px-4 py-3 sm:px-6"><ul className="space-y-2 text-sm">{state.notices.slice(0, 6).map((notice) => <li key={notice.id}>{notice.text}</li>)}</ul></div> : null}
          <div className="px-4 py-6 sm:px-6">
            <Guide />
            <Outlet key={state.companyId} />
          </div>
        </div>
      </div>
    </div>
  )
}

function RoleSwitcher({ role, onChange }: { role: Role; onChange: (role: Role) => void }) {
  const roles: Role[] = ['submitter', 'approver']
  const labels: Record<Role, string> = { submitter: 'Submitter', approver: 'Approver' }
  return (
    <fieldset className="min-w-0">
      <legend className="text-xs text-muted">Demo role, not a login</legend>
      <div className="mt-1 flex flex-wrap gap-1">
        {roles.map((item) => (
          <label key={item} className={`inline-flex min-h-11 cursor-pointer items-center px-3 text-sm ${role === item ? 'bg-ink text-paper' : 'border border-line'}`}>
            <input className="sr-only" type="radio" name="spendgate-role" checked={role === item} onChange={() => onChange(item)} />
            {labels[item]}
          </label>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">Acting as {actors[role].name}, {actors[role].title}</p>
    </fieldset>
  )
}

function Guide() {
  const { state, dismissGuide, setRole } = useSpendGate()
  const navigate = useNavigate()
  if (!state.guide.active) return null
  const focus = state.sheets.find((sheet) => sheet.id === state.guide.focusId)
  const step = state.guide.step
  const path = focus ? `/robes/demo/spendgate/claims/${focus.id}` : '/robes/demo/spendgate/review'
  let title = 'Step 1 of 3. Submit the draft expense sheet.'
  let text = focus ? `Stay as Submitter and send ${focus.number}. Switch the sample business if you want another company's sites and expenses.` : 'Stay as Submitter and submit a draft sheet.'
  if (step === 2) {
    title = 'Step 2 of 3. Open it for review.'
    text = 'Switch to Approver and open the sheet. That moves it from submitted to under review.'
  }
  if (step === 3) {
    title = 'Step 3 of 3. Approve or reject it.'
    text = 'A remark is required either way. Rejection tells the submitter what to fix. Approval records who agreed.'
  }
  if (step === 4) {
    title = 'Imagine this level of visibility and control in your organization.'
    text = 'Robes Leadership | Technology helps businesses design software solutions tailored to their operational challenges.'
  }

  return (
    <section className="cr-no-print mb-6 border border-line border-l-4 border-l-robes-fill bg-card p-4">
      <p className="text-xs font-medium tracking-[0.14em] text-robes uppercase">Guided demonstration</p>
      <h2 className="mt-2 font-serif text-2xl text-ink">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted">{text}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {step === 1 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('submitter'); navigate(path) }}>Open the draft</button> : null}
        {step === 2 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('approver'); navigate(path) }}>Open as approver</button> : null}
        {step === 3 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('approver'); navigate(path) }}>Decide the sheet</button> : null}
        {step === 4 ? (
          <>
            <Link to="/robes/contact?service=spendgate&intent=similar" className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">Request this for your business</Link>
            <Link to="/robes/contact?service=spendgate&intent=workflow" className="inline-flex min-h-11 items-center border border-line px-4 text-sm">Discuss your business workflow</Link>
            <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Close guide</button>
          </>
        ) : (
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Explore freely</button>
        )}
      </div>
    </section>
  )
}
