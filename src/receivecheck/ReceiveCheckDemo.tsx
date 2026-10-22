import { Link, Outlet, useNavigate } from 'react-router-dom'
import { DemoShell } from '../components/DemoShell.tsx'
import { Seo } from '../components/Seo.tsx'
import { demoCompany } from '../content/demoCompanies.ts'
import { actors, openBills, type Role } from './model.ts'
import { ReceiveCheckProvider } from './store.tsx'
import { useReceiveCheck } from './useReceiveCheck.ts'

const links = [
  { to: '/robes/demo/receivecheck', label: 'Bills', end: true },
  { to: '/robes/demo/receivecheck/activity', label: 'Activity', end: false },
]

export function ReceiveCheckDemo() {
  return (
    <ReceiveCheckProvider>
      <DemoFrame />
    </ReceiveCheckProvider>
  )
}

function DemoFrame() {
  const { state, setRole, setCompany, reset, markNoticesRead } = useReceiveCheck()
  const business = demoCompany(state.companyId)
  const open = openBills(state.bills).length
  const actor = actors[state.role]
  const focus = state.bills.find((bill) => bill.id === 'bill-100')

  return (
    <>
      <Seo title="Try the bill check · ReceiveCheck" description="Compare a supplier bill with the yard count, hold a mismatch, and accept the bill after the supplier corrects it. Then ask Robes to build this for your business." path="/robes/demo/receivecheck" />
      <DemoShell
        appName="ReceiveCheck"
        mark="Rc"
        navLabel="Bills"
        businessName={business.name}
        businessLine={`${business.trade}. Sample business.`}
        backTo="/robes/solutions/receivecheck"
        links={links.map((link) => ({
          ...link,
          count: link.label === 'Bills' ? open : undefined,
        }))}
        roleId={state.role}
        roles={[
          { id: 'clerk', label: 'Receiving clerk' },
          { id: 'accounts', label: 'Accounts' },
        ]}
        actorName={actor.name}
        actorTitle={actor.title}
        onRole={(id) => setRole(id as Role)}
        companyId={state.companyId}
        onCompany={setCompany}
        notices={state.notices}
        onMarkNoticesRead={markNoticesRead}
        onReset={reset}
        guide={<Guide billed={focus?.billedQty ?? 100} yard={focus?.yardQty ?? 90} goods={focus?.goods ?? 'the goods'} />}
      >
        <Outlet key={state.companyId} />
      </DemoShell>
    </>
  )
}

function Guide({ billed, yard, goods }: { billed: number; yard: number; goods: string }) {
  const { state, dismissGuide, setRole } = useReceiveCheck()
  const navigate = useNavigate()
  if (!state.guide.active) return null
  const step = state.guide.step
  let title = 'Step 1 of 3. Record what the yard counted.'
  let text = `Stay as Receiving clerk. The bill says ${billed} ${goods.toLowerCase()}. The yard counted ${yard}.`
  if (step === 2) {
    title = 'Step 2 of 3. Hold the short bill.'
    text = `Billed ${billed}, received ${yard}. Hold it so it cannot be treated as agreed. Holding it does not pay the supplier.`
  }
  if (step === 3) {
    title = 'Step 3 of 3. Accept the corrected bill.'
    text = `Enter ${yard}, the quantity the yard received, and note that the supplier corrected the bill.`
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
        {step === 1 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('clerk'); navigate('/robes/demo/receivecheck/bills/bill-100') }}>Open the open bill</button> : null}
        {step === 2 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('accounts'); navigate('/robes/demo/receivecheck/bills/bill-100') }}>Open the short bill</button> : null}
        {step === 3 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('accounts'); navigate('/robes/demo/receivecheck/bills/bill-100') }}>Accept the correction</button> : null}
        {step === 4 ? (
          <>
            <Link to="/robes/contact?service=receivecheck&intent=similar" className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">Request this for your business</Link>
            <Link to="/robes/contact?service=receivecheck&intent=workflow" className="inline-flex min-h-11 items-center border border-line px-4 text-sm">Discuss your business workflow</Link>
            <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Close guide</button>
          </>
        ) : (
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Explore freely</button>
        )}
      </div>
    </section>
  )
}
