import { Link, Outlet, useNavigate } from 'react-router-dom'
import { DemoShell } from '../components/DemoShell.tsx'
import { Seo } from '../components/Seo.tsx'
import { demoCompany } from '../content/demoCompanies.ts'
import { actors, type Role } from './model.ts'
import { FuelWatchProvider } from './store.tsx'
import { useFuelWatch } from './useFuelWatch.ts'

const links = [
  { to: '/robes/demo/fuelwatch', label: 'Overview', end: true },
  { to: '/robes/demo/fuelwatch/issues', label: 'Issues', end: false },
  { to: '/robes/demo/fuelwatch/machines', label: 'Machines', end: false },
  { to: '/robes/demo/fuelwatch/activity', label: 'Activity', end: false },
]

export function FuelWatchDemo() {
  return (
    <FuelWatchProvider>
      <DemoFrame />
    </FuelWatchProvider>
  )
}

function DemoFrame() {
  const { state, setRole, setCompany, reset, markNoticesRead } = useFuelWatch()
  const business = demoCompany(state.companyId)
  const open = state.issues.filter((issue) => issue.status === 'flagged' || issue.status === 'draft').length
  const actor = actors[state.role]

  return (
    <>
      <Seo title="Try the fuel issue demo · FuelWatch" description="Issue fuel to a machine, compare it with the hours worked, and explain the day that is far above the guide. Then ask Robes to build this for your business." path="/robes/demo/fuelwatch" />
      <DemoShell
        appName="FuelWatch"
        mark="Fw"
        navLabel="FuelWatch"
        businessName={business.name}
        businessLine={`${business.trade}. Sample business.`}
        backTo="/robes/solutions/fuelwatch"
        links={links.map((link) => ({
          ...link,
          count: link.label === 'Issues' ? open : undefined,
        }))}
        roleId={state.role}
        roles={[
          { id: 'issuer', label: 'Fuel clerk' },
          { id: 'supervisor', label: 'Supervisor' },
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
  const { state, dismissGuide, setRole } = useFuelWatch()
  const navigate = useNavigate()
  if (!state.guide.active) return null
  const step = state.guide.step
  let title = 'Step 1 of 3. Post Friday’s fuel issue.'
  let text = 'Stay as Fuel clerk and post the draft. Litres are recorded against the machine and the hours it worked.'
  if (step === 2) {
    title = 'Step 2 of 3. Open the unusual day.'
    text = 'Switch to Plant supervisor. Thursday is far above the other issues, and the explanation is missing.'
  }
  if (step === 3) {
    title = 'Step 3 of 3. Explain that day.'
    text = 'The litres stay on the record. Write why they are above the guide. A short remark is required.'
  }
  if (step === 4) {
    title = 'Imagine this level of visibility and control in your organization.'
    text = 'Robes Leadership | Technology helps businesses design software solutions tailored to their operational challenges.'
  }

  return (
    <section className="cr-no-print rounded-2xl border border-[#cfe3d6] bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-white/6">
      <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Guided demonstration</p>
      <h2 className="mt-1 text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted">{text}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {step === 1 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('issuer'); navigate('/robes/demo/fuelwatch/issues/issue-draft') }}>Open Friday</button> : null}
        {step === 2 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('supervisor'); navigate('/robes/demo/fuelwatch/issues/issue-flag') }}>Open Thursday</button> : null}
        {step === 3 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('supervisor'); navigate('/robes/demo/fuelwatch/issues/issue-flag') }}>Explain the day</button> : null}
        {step === 4 ? (
          <>
            <Link to="/robes/contact?service=fuelwatch&intent=similar" className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">Request this for your business</Link>
            <Link to="/robes/contact?service=fuelwatch&intent=workflow" className="inline-flex min-h-11 items-center border border-line px-4 text-sm">Discuss your business workflow</Link>
            <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Close guide</button>
          </>
        ) : (
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Explore freely</button>
        )}
      </div>
    </section>
  )
}
