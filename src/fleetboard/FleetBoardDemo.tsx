import { Link, Outlet, useNavigate } from 'react-router-dom'
import { DemoShell } from '../components/DemoShell.tsx'
import { Seo } from '../components/Seo.tsx'
import { demoCompany } from '../content/demoCompanies.ts'
import { actors, needsReason, type Role } from './model.ts'
import { FleetBoardProvider } from './store.tsx'
import { useFleetBoard } from './useFleetBoard.ts'

const links = [
  { to: '/robes/demo/fleetboard', label: 'Board', end: true },
  { to: '/robes/demo/fleetboard/activity', label: 'Activity', end: false },
]

export function FleetBoardDemo() {
  return (
    <FleetBoardProvider>
      <DemoFrame />
    </FleetBoardProvider>
  )
}

function DemoFrame() {
  const { state, setRole, setCompany, reset, markNoticesRead } = useFleetBoard()
  const business = demoCompany(state.companyId)
  const open = state.units.filter((unit) => needsReason(unit) || unit.status === 'unreported').length
  const actor = actors[state.role]

  return (
    <>
      <Seo title="Try the morning fleet board · FleetBoard" description="See which machines are working, idle, down, or off the site they were sent to. Then ask Robes to build this board for your business." path="/robes/demo/fleetboard" />
      <DemoShell
        appName="FleetBoard"
        mark="Fb"
        navLabel="FleetBoard"
        businessName={business.name}
        businessLine={`${business.trade}. Sample business.`}
        backTo="/robes/solutions/fleetboard"
        links={links.map((link) => ({
          ...link,
          count: link.label === 'Board' ? open : undefined,
        }))}
        roleId={state.role}
        roles={[
          { id: 'clerk', label: 'Yard clerk' },
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
  const { state, dismissGuide, setRole } = useFleetBoard()
  const navigate = useNavigate()
  if (!state.guide.active) return null
  const away = state.units.find((unit) => unit.id === 'unit-6')
  const step = state.guide.step
  let title = 'Step 1 of 3. Call in the missing machine.'
  let text = 'Stay as Yard clerk. One machine has not been reported this morning. Mark it working at the place it was sent to.'
  if (step === 2) {
    title = 'Step 2 of 3. Open the machine that is off site.'
    text = away ? `${away.name} was sent to ${away.assigned} and is reported at ${away.reported}. The reason is missing.` : 'Open the machine that is not where it was sent.'
  }
  if (step === 3) {
    title = 'Step 3 of 3. Write why it is not earning.'
    text = 'The place stays on the record. A short reason is what was missing.'
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
        {step === 1 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('clerk'); navigate('/robes/demo/fleetboard/units/unit-3') }}>Open the missing machine</button> : null}
        {step === 2 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('supervisor'); navigate('/robes/demo/fleetboard/units/unit-6') }}>Open the off-site machine</button> : null}
        {step === 3 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('supervisor'); navigate('/robes/demo/fleetboard/units/unit-6') }}>Write the reason</button> : null}
        {step === 4 ? (
          <>
            <Link to="/robes/contact?service=fleetboard&intent=similar" className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">Request this for your business</Link>
            <Link to="/robes/contact?service=fleetboard&intent=workflow" className="inline-flex min-h-11 items-center border border-line px-4 text-sm">Discuss your business workflow</Link>
            <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Close guide</button>
          </>
        ) : (
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Explore freely</button>
        )}
      </div>
    </section>
  )
}
