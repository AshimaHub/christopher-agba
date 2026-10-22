import { Link, Outlet, useNavigate } from 'react-router-dom'
import { DemoShell } from '../components/DemoShell.tsx'
import { Seo } from '../components/Seo.tsx'
import { demoCompany } from '../content/demoCompanies.ts'
import { actors, assetName, earlierPatch, openJobs, type Role } from './model.ts'
import { RepairLogProvider } from './store.tsx'
import { useRepairLog } from './useRepairLog.ts'

const links = [
  { to: '/robes/demo/repairlog', label: 'Log', end: true },
  { to: '/robes/demo/repairlog/activity', label: 'Activity', end: false },
]

export function RepairLogDemo() {
  return (
    <RepairLogProvider>
      <DemoFrame />
    </RepairLogProvider>
  )
}

function DemoFrame() {
  const { state, setRole, setCompany, reset, markNoticesRead } = useRepairLog()
  const business = demoCompany(state.companyId)
  const open = openJobs(state.jobs).length
  const actor = actors[state.role]

  return (
    <>
      <Seo title="Try the repair log · RepairLog" description="Log a fault, see that the last fix was temporary, and book the proper repair with its cost. Then ask Robes to build this log for your business." path="/robes/demo/repairlog" />
      <DemoShell
        appName="RepairLog"
        mark="Rl"
        navLabel="Repairs"
        businessName={business.name}
        businessLine={`${business.trade}. Sample business.`}
        backTo="/robes/solutions/repairlog"
        links={links.map((link) => ({
          ...link,
          count: link.label === 'Log' ? open : undefined,
        }))}
        roleId={state.role}
        roles={[
          { id: 'mechanic', label: 'Mechanic' },
          { id: 'lead', label: 'Workshop lead' },
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
  const { state, dismissGuide, setRole } = useRepairLog()
  const navigate = useNavigate()
  if (!state.guide.active) return null
  const job = state.jobs.find((item) => item.id === 'job-22')
  const patch = job ? earlierPatch(state.jobs, job) : undefined
  const name = job ? assetName(state, job.assetId) : 'The asset'
  const step = state.guide.step
  let title = 'Step 1 of 3. File the fault that came back.'
  let text = patch
    ? `${name} was patched on ${patch.number}: ${patch.fix}. File ${job?.number ?? 'the draft'} so the repeat is on the record.`
    : 'File the draft fault.'
  if (step === 2) {
    title = 'Step 2 of 3. Open the repeat.'
    text = `${name} has the same fault again. The earlier job was a temporary repair, and its cost is already on the asset.`
  }
  if (step === 3) {
    title = 'Step 3 of 3. Book the proper repair.'
    text = 'Say what will actually be replaced, and enter the planned cost. That booking stays on the asset with the money.'
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
        {step === 1 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('mechanic'); navigate('/robes/demo/repairlog/jobs/job-22') }}>Open the returning fault</button> : null}
        {step === 2 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('lead'); navigate('/robes/demo/repairlog/jobs/job-22') }}>Open the repeat</button> : null}
        {step === 3 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('lead'); navigate('/robes/demo/repairlog/jobs/job-22') }}>Book the repair</button> : null}
        {step === 4 ? (
          <>
            <Link to="/robes/contact?service=repairlog&intent=similar" className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">Request this for your business</Link>
            <Link to="/robes/contact?service=repairlog&intent=workflow" className="inline-flex min-h-11 items-center border border-line px-4 text-sm">Discuss your business workflow</Link>
            <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Close guide</button>
          </>
        ) : (
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Explore freely</button>
        )}
      </div>
    </section>
  )
}
