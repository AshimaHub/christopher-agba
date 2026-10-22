import { Link, Outlet, useNavigate } from 'react-router-dom'
import { DemoShell } from '../components/DemoShell.tsx'
import { Seo } from '../components/Seo.tsx'
import { demoCompany } from '../content/demoCompanies.ts'
import { actors, needsFollowUp, type Role } from './model.ts'
import { PlantDayProvider } from './store.tsx'
import { usePlantDay } from './usePlantDay.ts'

const links = [
  { to: '/robes/demo/plantday', label: 'Shift', end: true },
  { to: '/robes/demo/plantday/activity', label: 'Activity', end: false },
]

export function PlantDayDemo() {
  return (
    <PlantDayProvider>
      <DemoFrame />
    </PlantDayProvider>
  )
}

function DemoFrame() {
  const { state, setRole, setCompany, reset, markNoticesRead } = usePlantDay()
  const business = demoCompany(state.companyId)
  const open = state.machines.filter((machine) => machine.status === 'open' || needsFollowUp(machine)).length
  const actor = actors[state.role]

  return (
    <>
      <Seo title="Try the shift close demo · PlantDay" description="Close a shift: mark what worked, what stood idle, and what broke down, then record the repair follow-up. Then ask Robes to build this for your business." path="/robes/demo/plantday" />
      <DemoShell
        appName="PlantDay"
        mark="Pd"
        navLabel="PlantDay"
        businessName={business.name}
        businessLine={`${business.trade}. Sample business.`}
        backTo="/robes/solutions/plantday"
        links={links.map((link) => ({
          ...link,
          count: link.label === 'Shift' ? open : undefined,
        }))}
        roleId={state.role}
        roles={[
          { id: 'lead', label: 'Shift lead' },
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
  const { state, dismissGuide, setRole } = usePlantDay()
  const navigate = useNavigate()
  if (!state.guide.active) return null
  const down = state.machines.find((machine) => machine.id === 'shift-4')
  const step = state.guide.step
  let title = 'Step 1 of 3. Close the open machine.'
  let text = 'Stay as Shift lead. One machine has not been closed. Mark how the shift went. Your name stays on the record.'
  if (step === 2) {
    title = 'Step 2 of 3. Open the breakdown.'
    text = down ? `${down.name} broke down. ${down.reporter ?? 'The shift lead'} reported it, and the repair follow-up is missing.` : 'Open the machine that broke down.'
  }
  if (step === 3) {
    title = 'Step 3 of 3. Write the repair follow-up.'
    text = 'The breakdown stays on the record. Say what happens next.'
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
        {step === 1 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('lead'); navigate('/robes/demo/plantday/machines/shift-3') }}>Close the remaining machine</button> : null}
        {step === 2 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('supervisor'); navigate('/robes/demo/plantday/machines/shift-4') }}>Open the breakdown</button> : null}
        {step === 3 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('supervisor'); navigate('/robes/demo/plantday/machines/shift-4') }}>Write the follow-up</button> : null}
        {step === 4 ? (
          <>
            <Link to="/robes/contact?service=plantday&intent=similar" className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">Request this for your business</Link>
            <Link to="/robes/contact?service=plantday&intent=workflow" className="inline-flex min-h-11 items-center border border-line px-4 text-sm">Discuss your business workflow</Link>
            <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Close guide</button>
          </>
        ) : (
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Explore freely</button>
        )}
      </div>
    </section>
  )
}
