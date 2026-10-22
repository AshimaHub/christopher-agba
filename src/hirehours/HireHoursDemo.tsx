import { Link, Outlet, useNavigate } from 'react-router-dom'
import { DemoShell } from '../components/DemoShell.tsx'
import { Seo } from '../components/Seo.tsx'
import { demoCompany } from '../content/demoCompanies.ts'
import { actors, type Role } from './model.ts'
import { HireHoursProvider } from './store.tsx'
import { useHireHours } from './useHireHours.ts'

const links = [
  { to: '/robes/demo/hirehours', label: 'Overview', end: true },
  { to: '/robes/demo/hirehours/plant', label: 'Plant', end: false },
  { to: '/robes/demo/hirehours/days', label: 'Days', end: false },
  { to: '/robes/demo/hirehours/activity', label: 'Activity', end: false },
]

export function HireHoursDemo() {
  return (
    <HireHoursProvider>
      <DemoFrame />
    </HireHoursProvider>
  )
}

function DemoFrame() {
  const { state, setRole, setCompany, reset, markNoticesRead } = useHireHours()
  const business = demoCompany(state.companyId)
  const waiting = state.days.filter((day) => day.status === 'disputed').length
  const actor = actors[state.role]

  return (
    <>
      <Seo title="Try the plant hire hours demo · HireHours" description="Log worked and idle hours for a hired machine, then accept or query a disputed day. Then ask Robes to build this for your business." path="/robes/demo/hirehours" />
      <DemoShell
        appName="HireHours"
        mark="Hh"
        navLabel="HireHours"
        businessName={business.name}
        businessLine={`${business.trade}. Sample business.`}
        backTo="/robes/solutions/hirehours"
        links={links.map((link) => ({
          ...link,
          count: link.label === 'Days' ? waiting : undefined,
        }))}
        roleId={state.role}
        roles={[
          { id: 'clerk', label: 'Plant clerk' },
          { id: 'commercial', label: 'Commercial' },
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
  const { state, dismissGuide, setRole } = useHireHours()
  const navigate = useNavigate()
  if (!state.guide.active) return null
  const step = state.guide.step
  let title = 'Step 1 of 3. Log Friday’s hours.'
  let text = 'Stay as Plant clerk and log the draft day. Worked hours and idle hours both count once the day is logged.'
  if (step === 2) {
    title = 'Step 2 of 3. Decide the disputed day.'
    text = 'Switch to Commercial manager. Accept the day to add it to the cost, or query it and leave it out. A remark is required either way.'
  }
  if (step === 3) {
    title = 'Step 3 of 3. Read the period cost.'
    text = 'Open the machine. Logged days and accepted days are in the agreed total. A queried day stays out.'
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
        {step === 1 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('clerk'); navigate('/robes/demo/hirehours/days/day-16') }}>Open Friday</button> : null}
        {step === 2 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('commercial'); navigate('/robes/demo/hirehours/days/day-15') }}>Open the disputed day</button> : null}
        {step === 3 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('commercial'); navigate('/robes/demo/hirehours/plant/focus') }}>Open the period</button> : null}
        {step === 4 ? (
          <>
            <Link to="/robes/contact?service=hirehours&intent=similar" className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">Request this for your business</Link>
            <Link to="/robes/contact?service=hirehours&intent=workflow" className="inline-flex min-h-11 items-center border border-line px-4 text-sm">Discuss your business workflow</Link>
            <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Close guide</button>
          </>
        ) : (
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Explore freely</button>
        )}
      </div>
    </section>
  )
}
