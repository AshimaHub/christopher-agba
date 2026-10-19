import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { Seo } from '../components/Seo.tsx'
import { SampleBusiness } from '../components/SampleBusiness.tsx'
import { demoCompany } from '../content/demoCompanies.ts'
import { actors, countStatus, type Role } from './model.ts'
import { ClearRequestProvider } from './store.tsx'
import { useClearRequest } from './useClearRequest.ts'

const links = [
  { to: '/robes/demo/clearrequest', label: 'Overview', end: true },
  { to: '/robes/demo/clearrequest/requests', label: 'Requests', end: false },
  { to: '/robes/demo/clearrequest/approvals', label: 'Approvals', end: false },
  { to: '/robes/demo/clearrequest/issuing', label: 'Issuing', end: false },
  { to: '/robes/demo/clearrequest/activity', label: 'Activity', end: false },
  { to: '/robes/demo/clearrequest/reports', label: 'Reports', end: false },
]

export function ClearRequestDemo() {
  return (
    <ClearRequestProvider>
      <DemoFrame />
    </ClearRequestProvider>
  )
}

function DemoFrame() {
  const { state, setRole, setCompany, reset, markNoticesRead } = useClearRequest()
  const business = demoCompany(state.companyId)
  const [open, setOpen] = useState(false)
  const [noticesOpen, setNoticesOpen] = useState(false)
  const unread = state.notices.filter((notice) => !notice.read).length
  const pending = countStatus(state.requests, 'pending')
  const issuing = countStatus(state.requests, 'approved') + countStatus(state.requests, 'partial')

  return (
    <div className="min-h-svh bg-paper text-ink">
      <Seo
        title="Try the material requisition demo · ClearRequest"
        description="Submit a material request, approve it, and issue it from the store. Then ask Robes to build this workflow for your business."
        path="/robes/demo/clearrequest"
      />
      <div className="flex min-h-svh">
        <aside className={`cr-no-print ${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-72 border-r border-line bg-paper-2 p-5 transition md:static md:translate-x-0`}>
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Robes demonstration</p>
          <p className="mt-2 font-serif text-3xl text-ink">ClearRequest</p>
          <p className="mt-2 text-sm text-muted">{business.name}</p>
          <p className="text-sm text-muted">{business.trade}. One of four sample businesses.</p>
          <nav className="mt-8 grid gap-1" aria-label="ClearRequest">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex min-h-11 items-center justify-between px-3 text-sm ${isActive ? 'bg-robes-fill text-robes-ink' : 'text-ink hover:bg-paper'}`
                }
              >
                <span>{link.label}</span>
                {link.label === 'Approvals' && pending > 0 ? <span>{pending}</span> : null}
                {link.label === 'Issuing' && issuing > 0 ? <span>{issuing}</span> : null}
              </NavLink>
            ))}
          </nav>
          <Link to="/robes/solutions/clearrequest" className="mt-8 inline-flex text-sm text-robes underline underline-offset-4">
            Back to the showcase
          </Link>
        </aside>
        {open ? <button type="button" className="cr-no-print fixed inset-0 z-20 bg-band/40 md:hidden" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="cr-no-print flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-6">
            <button type="button" className="min-h-11 border border-line px-3 text-sm md:hidden" onClick={() => setOpen(true)}>
              Menu
            </button>
            <RoleSwitcher role={state.role} onChange={setRole} />
            <SampleBusiness value={state.companyId} onChange={setCompany} />
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                className="relative min-h-11 px-3 text-sm"
                aria-expanded={noticesOpen}
                onClick={() => {
                  setNoticesOpen((current) => !current)
                  markNoticesRead()
                }}
              >
                Notices{unread > 0 ? ` (${unread})` : ''}
              </button>
              <ThemeToggle />
              <button
                type="button"
                className="min-h-11 px-3 text-sm"
                onClick={() => {
                  if (window.confirm('Reset the demonstration to the original sample records?')) reset()
                }}
              >
                Reset demo
              </button>
            </div>
          </header>
          {noticesOpen ? (
            <div className="cr-no-print border-b border-line bg-card px-4 py-3 sm:px-6">
              <ul className="space-y-2 text-sm">
                {state.notices.slice(0, 6).map((notice) => (
                  <li key={notice.id}>{notice.text}</li>
                ))}
              </ul>
            </div>
          ) : null}
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
  const roles: Role[] = ['requester', 'approver', 'storekeeper']
  return (
    <fieldset className="min-w-0">
      <legend className="text-xs text-muted">Demo role, not a login</legend>
      <div className="mt-1 flex flex-wrap gap-1">
        {roles.map((item) => (
          <label key={item} className={`inline-flex min-h-11 cursor-pointer items-center px-3 text-sm ${role === item ? 'bg-ink text-paper' : 'border border-line'}`}>
            <input className="sr-only" type="radio" name="demo-role" checked={role === item} onChange={() => onChange(item)} />
            {item === 'requester' ? 'Requester' : item === 'approver' ? 'Approver' : 'Storekeeper'}
          </label>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">
        Acting as {actors[role].name}, {actors[role].title}
      </p>
    </fieldset>
  )
}

function Guide() {
  const { state, dismissGuide, setRole } = useClearRequest()
  const navigate = useNavigate()
  if (!state.guide.active) return null
  const step = state.guide.step
  const focus = state.guide.focusId
  const focused = state.requests.find((request) => request.id === focus)

  let title = 'Step 1 of 4. Submit a material request.'
  let text = 'Stay as Requester, create a request, and submit it. Switch the sample business in the header if this company is not the one you want to see.'
  if (step === 2) {
    title = 'Step 2 of 4. Decide the request.'
    text = focused
      ? `Switch to Approver and open ${focused.number}. Approve it to continue to stores, or reject it with a reason.`
      : 'Switch to Approver and decide a pending request.'
  }
  if (step === 3) {
    title = focused?.status === 'rejected' ? 'Step 3 of 4. A rejection stops the issue.' : 'Step 3 of 4. Issue the approved materials.'
    text =
      focused?.status === 'rejected'
        ? 'Stores cannot issue a rejected request. Approve another pending request, then switch to Storekeeper.'
        : 'Switch to Storekeeper and issue some or all of the approved quantity. Try issuing more than the stock on hand to see the check.'
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
        {step === 1 ? (
          <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('requester'); navigate('/robes/demo/clearrequest/requests/new') }}>
            Create a request
          </button>
        ) : null}
        {step === 2 ? (
          <button
            type="button"
            className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink"
            onClick={() => {
              setRole('approver')
              navigate(focus ? `/robes/demo/clearrequest/requests/${focus}` : '/robes/demo/clearrequest/approvals')
            }}
          >
            Open as approver
          </button>
        ) : null}
        {step === 3 && focused?.status !== 'rejected' ? (
          <button
            type="button"
            className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink"
            onClick={() => {
              setRole('storekeeper')
              navigate(focus ? `/robes/demo/clearrequest/requests/${focus}` : '/robes/demo/clearrequest/issuing')
            }}
          >
            Open as storekeeper
          </button>
        ) : null}
        {step === 3 && focused?.status === 'rejected' ? (
          <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('approver'); navigate('/robes/demo/clearrequest/approvals') }}>
            Choose another request
          </button>
        ) : null}
        {step === 4 ? (
          <>
            <Link to="/robes/contact?service=clearrequest&intent=similar" className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">
              Request this for your business
            </Link>
            <Link to="/robes/contact?service=clearrequest&intent=workflow" className="inline-flex min-h-11 items-center border border-line px-4 text-sm">
              Discuss your business workflow
            </Link>
          </>
        ) : (
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>
            Explore freely
          </button>
        )}
        {step === 4 ? (
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>
            Close guide
          </button>
        ) : null}
      </div>
    </section>
  )
}
