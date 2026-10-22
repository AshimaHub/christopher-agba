import { Link, Outlet, useNavigate } from 'react-router-dom'
import { DemoShell } from '../components/DemoShell.tsx'
import { Seo } from '../components/Seo.tsx'
import { demoCompany } from '../content/demoCompanies.ts'
import { actors, type Role } from './model.ts'
import { SiteLedgerProvider } from './store.tsx'
import { useSiteLedger } from './useSiteLedger.ts'

const links = [
  { to: '/robes/demo/siteledger', label: 'Overview', end: true },
  { to: '/robes/demo/siteledger/stock', label: 'Stock', end: false },
  { to: '/robes/demo/siteledger/receipts', label: 'Receipts', end: false },
  { to: '/robes/demo/siteledger/issues', label: 'Issues', end: false },
  { to: '/robes/demo/siteledger/activity', label: 'Activity', end: false },
]

export function SiteLedgerDemo() {
  return (
    <SiteLedgerProvider>
      <DemoFrame />
    </SiteLedgerProvider>
  )
}

function DemoFrame() {
  const { state, setRole, setCompany, reset, markNoticesRead } = useSiteLedger()
  const business = demoCompany(state.companyId)
  const drafts = state.movements.filter((move) => move.status === 'draft').length
  const actor = actors[state.role]

  return (
    <>
      <Seo title="Try the stock ledger demo · SiteLedger" description="Post a receipt, issue stock to a job, and read a balance that the history explains. Then ask Robes to build this for your business." path="/robes/demo/siteledger" />
      <DemoShell
        appName="SiteLedger"
        mark="Sl"
        navLabel="SiteLedger"
        businessName={business.name}
        businessLine={`${business.trade}. Sample business.`}
        backTo="/robes/solutions/siteledger"
        links={links.map((link) => ({
          ...link,
          count: link.label === 'Stock' ? drafts : undefined,
        }))}
        roleId={state.role}
        roles={[
          { id: 'keeper', label: 'Storekeeper' },
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
  const { state, dismissGuide, setRole } = useSiteLedger()
  const navigate = useNavigate()
  if (!state.guide.active) return null
  const focus = state.movements.find((move) => move.id === state.guide.focusId) ?? state.movements.find((move) => move.id === 'move-1050')
  const step = state.guide.step
  const card = focus ? `/robes/demo/siteledger/stock/${focus.placeId}/${focus.itemId}` : '/robes/demo/siteledger/stock'
  let title = 'Step 1 of 3. Post the delivery into stock.'
  let text = focus ? `Stay as Storekeeper and post ${focus.number}. The balance does not change until a draft is posted.` : 'Stay as Storekeeper and post the draft receipt.'
  if (step === 2) {
    title = 'Step 2 of 3. Issue stock to the job.'
    text = 'Post the draft issue on the same stock card. An issue larger than the balance is refused.'
  }
  if (step === 3) {
    title = 'Step 3 of 3. Read the balance from the history.'
    text = 'Switch to Supervisor and open the stock card. Opening, receipts, and issues add up to what should still be there.'
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
        {step === 1 || step === 2 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('keeper'); navigate(card) }}>Open the stock card</button> : null}
        {step === 3 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('supervisor'); navigate(card) }}>Open as supervisor</button> : null}
        {step === 4 ? (
          <>
            <Link to="/robes/contact?service=siteledger&intent=similar" className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">Request this for your business</Link>
            <Link to="/robes/contact?service=siteledger&intent=workflow" className="inline-flex min-h-11 items-center border border-line px-4 text-sm">Discuss your business workflow</Link>
            <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Close guide</button>
          </>
        ) : (
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Explore freely</button>
        )}
      </div>
    </section>
  )
}
