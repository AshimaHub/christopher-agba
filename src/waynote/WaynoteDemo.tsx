import { Link, Outlet, useNavigate } from 'react-router-dom'
import { DemoShell } from '../components/DemoShell.tsx'
import { Seo } from '../components/Seo.tsx'
import { demoCompany } from '../content/demoCompanies.ts'
import { actors, countStatus, type Role } from './model.ts'
import { WaynoteProvider } from './store.tsx'
import { useWaynote } from './useWaynote.ts'

const links = [
  { to: '/robes/demo/waynote', label: 'Overview', end: true },
  { to: '/robes/demo/waynote/notes', label: 'Notes', end: false },
  { to: '/robes/demo/waynote/release', label: 'Dispatch', end: false },
  { to: '/robes/demo/waynote/receive', label: 'Receive', end: false },
  { to: '/robes/demo/waynote/activity', label: 'Activity', end: false },
  { to: '/robes/demo/waynote/reports', label: 'Reports', end: false },
]

export function WaynoteDemo() {
  return (
    <WaynoteProvider>
      <DemoFrame />
    </WaynoteProvider>
  )
}

function DemoFrame() {
  const { state, setRole, setCompany, reset, markNoticesRead } = useWaynote()
  const business = demoCompany(state.companyId)
  const drafts = countStatus(state.notes, 'draft')
  const pending = countStatus(state.notes, 'pending')
  const actor = actors[state.role]

  return (
    <>
      <Seo title="Try the loading note demo · Waynote" description="Send a loading note, record what arrived, and dispute a mismatch. Then ask Robes to build this for your sites." path="/robes/demo/waynote" />
      <DemoShell
        appName="Waynote"
        mark="Wn"
        navLabel="Waynote"
        businessName={business.name}
        businessLine={`${business.trade}. Sample business.`}
        backTo="/robes/solutions/waynote"
        links={links.map((link) => ({
          ...link,
          count: link.label === 'Dispatch' ? drafts : link.label === 'Receive' ? pending : undefined,
        }))}
        roleId={state.role}
        roles={[
          { id: 'dispatcher', label: 'Sender' },
          { id: 'receiver', label: 'Receiver' },
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
  const { state, dismissGuide, setRole } = useWaynote()
  const navigate = useNavigate()
  if (!state.guide.active) return null
  const focus = state.notes.find((note) => note.id === state.guide.focusId)
  const step = state.guide.step
  let title = 'Step 1 of 3. Send the draft loading note.'
  let text = focus ? `Stay as Sender and send ${focus.number}. Switch the sample business if you want another company's goods and places.` : 'Stay as Sender and send a draft note.'
  if (step === 2) {
    title = 'Step 2 of 3. Record the receipt.'
    text = 'Switch to Receiver. If the quantity or the condition does not match what was sent, the note is disputed. Say what you found.'
  }
  if (step === 3) {
    title = focus?.status === 'disputed' ? 'Step 3 of 3. The dispute stays on the note.' : 'Step 3 of 3. Complete a clean receipt.'
    text = focus?.status === 'disputed'
      ? 'Both the sent line and the received line are on the same note. A buyer can see the mismatch without a phone call.'
      : 'The quantity and condition matched. Complete the note to close it.'
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
        {step === 1 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('dispatcher'); navigate(focus ? `/robes/demo/waynote/notes/${focus.id}` : '/robes/demo/waynote/release') }}>Open the draft</button> : null}
        {step === 2 ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('receiver'); navigate(focus ? `/robes/demo/waynote/notes/${focus.id}` : '/robes/demo/waynote/receive') }}>Open as receiver</button> : null}
        {step === 3 && focus?.status === 'received' ? <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => { setRole('receiver'); navigate(`/robes/demo/waynote/notes/${focus.id}`) }}>Complete the note</button> : null}
        {step === 4 ? (
          <>
            <Link to="/robes/contact?service=waynote&intent=similar" className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">Request this for your business</Link>
            <Link to="/robes/contact?service=waynote&intent=workflow" className="inline-flex min-h-11 items-center border border-line px-4 text-sm">Discuss your business workflow</Link>
            <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Close guide</button>
          </>
        ) : (
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={dismissGuide}>Explore freely</button>
        )}
      </div>
    </section>
  )
}
