import { Link, Outlet, useNavigate } from 'react-router-dom'
import { DemoShell } from '../components/DemoShell.tsx'
import { Seo } from '../components/Seo.tsx'
import { demoCompany } from '../content/demoCompanies.ts'
import { actors, type Role } from './model.ts'
import { BeneficiariesProvider } from './store.tsx'
import { useBeneficiaries } from './useBeneficiaries.ts'

const links = [
  { to: '/robes/demo/beneficiaries', label: 'Overview', end: true },
  { to: '/robes/demo/beneficiaries/payees', label: 'Payees', end: false },
  { to: '/robes/demo/beneficiaries/activity', label: 'Activity', end: false },
]

export function BeneficiariesDemo() {
  return (
    <BeneficiariesProvider>
      <DemoFrame />
    </BeneficiariesProvider>
  )
}

function DemoFrame() {
  const { state, setRole, setCompany, reset, markNoticesRead } = useBeneficiaries()
  const business = demoCompany(state.companyId)
  const waiting = state.payees.filter((payee) => payee.status === 'pending' || payee.status === 'draft').length
  const actor = actors[state.role]

  return (
    <>
      <Seo title="Try the beneficiaries demo" description="Check a payee account name, then approve or return who can be paid. Then ask Robes to build this register for your business." path="/robes/demo/beneficiaries" />
      <DemoShell
        appName="Beneficiaries"
        mark="Bn"
        navLabel="Beneficiaries"
        businessName={business.name}
        businessLine={`${business.trade}. Sample business.`}
        backTo="/robes/solutions/beneficiaries"
        links={links.map((link) => ({
          ...link,
          count: link.label === 'Payees' ? waiting : undefined,
        }))}
        roleId={state.role}
        roles={[
          { id: 'clerk', label: 'Payee clerk' },
          { id: 'reviewer', label: 'Finance' },
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
  const { state, dismissGuide, setRole } = useBeneficiaries()
  const navigate = useNavigate()
  if (!state.guide.active) return null
  const step = state.guide.step
  const path = '/robes/demo/beneficiaries/payees/payee-440'
  let title = 'Step 1 of 3. Check the account, then submit it.'
  let text = 'Stay as Payee clerk. Check the draft account so the name is filled from the sample book, then submit the payee.'
  if (step === 2) {
    title = 'Step 2 of 3. Approve or return the payee.'
    text = 'Switch to Finance reviewer. Approval means this payee may be paid. Returning it sends the record back. A remark is required either way.'
  }
  if (step === 3) {
    const decided = state.payees.find((payee) => payee.id === 'payee-440')
    title = 'Step 3 of 3. Read the decision.'
    text = decided?.status === 'returned'
      ? 'Open the payee. The return remark stays on the record, and the clerk can correct it.'
      : 'Open the payee. The checked name, the bank, and the approval remark stay on one record.'
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
        {step === 1 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('clerk'); navigate(path) }}>Open the draft</button> : null}
        {step === 2 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('reviewer'); navigate(path) }}>Open as finance</button> : null}
        {step === 3 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('reviewer'); navigate(path) }}>Open the payee</button> : null}
        {step === 4 ? (
          <>
            <Link to="/robes/contact?service=beneficiaries&intent=similar" className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">Request this for your business</Link>
            <Link to="/robes/contact?service=beneficiaries&intent=workflow" className="inline-flex min-h-11 items-center border border-line px-4 text-sm">Discuss your business workflow</Link>
            <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Close guide</button>
          </>
        ) : (
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Explore freely</button>
        )}
      </div>
    </section>
  )
}
