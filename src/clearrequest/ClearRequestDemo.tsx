import { Link, Outlet, useNavigate } from 'react-router-dom'
import { DemoShell } from '../components/DemoShell.tsx'
import { Seo } from '../components/Seo.tsx'
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
  const pending = countStatus(state.requests, 'pending')
  const issuing = countStatus(state.requests, 'approved') + countStatus(state.requests, 'partial')
  const actor = actors[state.role]

  return (
    <>
      <Seo
        title="Try the material requisition demo · ClearRequest"
        description="Submit a material request, approve it, and issue it from the store. Then ask Robes to build this workflow for your business."
        path="/robes/demo/clearrequest"
      />
      <DemoShell
        appName="ClearRequest"
        mark="Rq"
        navLabel="ClearRequest"
        businessName={business.name}
        businessLine={`${business.trade}. Sample business.`}
        backTo="/robes/solutions/clearrequest"
        links={links.map((link) => ({
          ...link,
          count: link.label === 'Approvals' ? pending : link.label === 'Issuing' ? issuing : undefined,
        }))}
        roleId={state.role}
        roles={[
          { id: 'requester', label: 'Requester' },
          { id: 'approver', label: 'Approver' },
          { id: 'storekeeper', label: 'Storekeeper' },
        ]}
        actorName={actor.name}
        actorTitle={actor.title}
        onRole={(id) => setRole(id as Role)}
        companyId={state.companyId}
        onCompany={setCompany}
        notices={state.notices}
        onMarkNoticesRead={markNoticesRead}
        onReset={reset}
        guide={<Guide />}
      >
        <Outlet key={state.companyId} />
      </DemoShell>
    </>
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
    <section className="cr-no-print rounded-2xl border border-[#cfe3d6] bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-white/6">
      <p className="text-xs font-medium tracking-[0.14em] text-robes uppercase">Guided demonstration</p>
      <h2 className="mt-1 text-lg font-semibold text-ink">{title}</h2>
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
