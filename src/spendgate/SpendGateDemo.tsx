import { Link, Outlet, useNavigate } from 'react-router-dom'
import { DemoShell } from '../components/DemoShell.tsx'
import { Seo } from '../components/Seo.tsx'
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
  const waiting = countStatus(state.sheets, 'submitted') + countStatus(state.sheets, 'review')
  const actor = actors[state.role]

  return (
    <>
      <Seo title="Try the expense approval demo · SpendGate" description="Submit a site expense, then approve or reject it with a remark. Then ask Robes to build this control for your business." path="/robes/demo/spendgate" />
      <DemoShell
        appName="SpendGate"
        mark="Sg"
        navLabel="SpendGate"
        businessName={business.name}
        businessLine={`${business.trade}. Sample business.`}
        backTo="/robes/solutions/spendgate"
        links={links.map((link) => ({
          ...link,
          count: link.label === 'Review' ? waiting : undefined,
        }))}
        roleId={state.role}
        roles={[
          { id: 'submitter', label: 'Submitter' },
          { id: 'approver', label: 'Approver' },
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
    <section className="cr-no-print rounded-2xl border border-[#cfe3d6] bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-white/6">
      <p className="text-xs font-medium tracking-[0.14em] text-robes uppercase">Guided demonstration</p>
      <h2 className="mt-1 text-lg font-semibold text-ink">{title}</h2>
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
