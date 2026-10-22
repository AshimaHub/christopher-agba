import { Link, Outlet, useNavigate } from 'react-router-dom'
import { DemoShell } from '../components/DemoShell.tsx'
import { Seo } from '../components/Seo.tsx'
import { demoCompany } from '../content/demoCompanies.ts'
import { actors, ageLabel, waitingItems, type Role } from './model.ts'
import { WaitingProvider } from './store.tsx'
import { useWaiting } from './useWaiting.ts'

const links = [
  { to: '/robes/demo/waiting', label: 'Inbox', end: true },
  { to: '/robes/demo/waiting/activity', label: 'Activity', end: false },
]

export function WaitingDemo() {
  return (
    <WaitingProvider>
      <DemoFrame />
    </WaitingProvider>
  )
}

function DemoFrame() {
  const { state, setRole, setCompany, reset, markNoticesRead } = useWaiting()
  const business = demoCompany(state.companyId)
  const waiting = waitingItems(state.items).length
  const actor = actors[state.role]

  return (
    <>
      <Seo title="Try the waiting inbox · Waiting On You" description="See what is waiting, how old it is, and approve or return it in one action. Then ask Robes to build this inbox for your business." path="/robes/demo/waiting" />
      <DemoShell
        appName="Waiting On You"
        mark="Wo"
        navLabel="Waiting"
        businessName={business.name}
        businessLine={`${business.trade}. Sample business.`}
        backTo="/robes/solutions/waiting"
        links={links.map((link) => ({
          ...link,
          count: link.label === 'Inbox' ? waiting : undefined,
        }))}
        roleId={state.role}
        roles={[
          { id: 'requester', label: 'Requester' },
          { id: 'owner', label: 'Approver' },
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
  const { state, dismissGuide, setRole } = useWaiting()
  const navigate = useNavigate()
  if (!state.guide.active) return null
  const late = state.items.find((item) => item.id === 'wait-18')
  const step = state.guide.step
  let title = 'Step 1 of 3. Send the draft into the inbox.'
  let text = 'Stay as Requester and send WO-40. It joins the list as new. You cannot approve your own item.'
  if (step === 2) {
    title = 'Step 2 of 3. Open the late item.'
    text = late ? `${late.number} has been waiting ${ageLabel(late)}. It is the oldest thing still on the list.` : 'Open the oldest item.'
  }
  if (step === 3) {
    title = 'Step 3 of 3. Approve or return it.'
    text = 'Either action takes it out of the waiting list. A remark is required. What remains is no longer the late item.'
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
        {step === 1 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('requester'); navigate('/robes/demo/waiting/items/wait-40') }}>Open the draft</button> : null}
        {step === 2 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('owner'); navigate('/robes/demo/waiting/items/wait-18') }}>Open the late item</button> : null}
        {step === 3 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('owner'); navigate('/robes/demo/waiting/items/wait-18') }}>Decide it</button> : null}
        {step === 4 ? (
          <>
            <Link to="/robes/contact?service=waiting&intent=similar" className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">Request this for your business</Link>
            <Link to="/robes/contact?service=waiting&intent=workflow" className="inline-flex min-h-11 items-center border border-line px-4 text-sm">Discuss your business workflow</Link>
            <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Close guide</button>
          </>
        ) : (
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Explore freely</button>
        )}
      </div>
    </section>
  )
}
