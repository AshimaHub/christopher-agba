import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robes } from '../content/robes.ts'
import { robesAction, robesLink, secondaryAction } from '../lib/styles.ts'

export function RobesSolutionsPage() {
  return (
    <>
      <Seo
        title={`Material requests, loading notes, expenses, stock, hire hours, payees, fuel, fleet, shift close, a waiting inbox, a repair log, and a bill check · ${robes.name}`}
        description="Try a live demo of material requisitions, loading notes, expense approval, a stock ledger, plant hire hours, a payee register, fuel issues, a morning fleet board, a shift close, a waiting inbox, a repair log, or a supplier bill check. Then ask Robes Leadership | Technology to build that workflow for your business."
        path="/robes/solutions"
      />
      <PageIntro eyebrow="Technology" title="Try the workflow. Then ask for it in your business.">
        <p>
          Christopher Agba leads this work under the Robes brand. Each solution is framed as a
          business outcome. Scope and fees are proposed after the problem is clear. Nothing here is
          a fixed package or a claimed result from a client list.
        </p>
      </PageIntro>
      <Container className="grid gap-5 py-16 md:py-20">
        <section id="interactive-solutions" className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">Material Requisition (Store)</h2>
          <p className="mt-2 text-sm text-muted">(Material Requisition, Approval & Store Issuance System)</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Stop chasing material requests, delayed approvals, and missing records. Request materials, approve requests, issue from stores, and track every step in one centralized system.
          </p>
          <SeeMore
            title="Material Requisition:"
            items={['Request materials from store', 'Approve materials requested', 'Issue it from the store.']}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/clearrequest" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/clearrequest" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=clearrequest&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        <section className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">Waynote</h2>
          <p className="mt-2 text-sm text-muted">(Send, Receive & Dispute a Loading Note)</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            A loading note: send it, receive the quantity and condition, and dispute a mismatch.
          </p>
          <SeeMore title="Waynote:" items={['Send a loading note', 'Receive the quantity and condition', 'Dispute the note when the goods do not match.']} />
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The records are fictional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/waynote" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/waynote" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=waynote&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        <section className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">SpendGate</h2>
          <p className="mt-2 text-sm text-muted">(Submit, Review & Decide an Expense)</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            An expense sheet: submit it, review it, and approve or reject it with a remark. The
            submitter cannot approve their own sheet.
          </p>
          <SeeMore title="SpendGate:" items={['Submit an expense sheet', 'Review it before it is decided', 'Approve or reject it in writing.']} />
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The records are fictional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/spendgate" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/spendgate" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=spendgate&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        <section className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">Stock Ledger (Site)</h2>
          <p className="mt-2 text-sm text-muted">(Receipts, Issues & a Balance That Explains Itself)</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Stop arguing about what should still be in the store. Record what came in, what went out, and read the balance from the same history.
          </p>
          <SeeMore title="Stock Ledger:" items={['Record a receipt into the store', 'Issue stock to a job', 'See the balance explained by the history.']} />
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The records are fictional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/siteledger" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/siteledger" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=siteledger&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        <section className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">Plant Hire Hours</h2>
          <p className="mt-2 text-sm text-muted">(Worked Hours, Idle Time & Period Cost)</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Stop paying hired machines from memory. Log the hours worked, flag idle time, and see what the period should cost.
          </p>
          <SeeMore title="Plant Hire Hours:" items={['Log hours worked and idle', 'Accept or query a disputed day', 'See the period cost.']} />
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The records are fictional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/hirehours" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/hirehours" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=hirehours&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        <section className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">Beneficiaries</h2>
          <p className="mt-2 text-sm text-muted">(Payee Register, Account Check & Approval)</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Stop paying from a notebook. Check the account name, approve the payee, and keep one list of who can be paid.
          </p>
          <SeeMore title="Beneficiaries:" items={['Check an account name before it is saved', 'Approve or return the payee', 'See who is ready to be paid.']} />
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The records are fictional. No bank file is created.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/beneficiaries" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/beneficiaries" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=beneficiaries&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        <section className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">Fuel Issues</h2>
          <p className="mt-2 text-sm text-muted">(Issue Fuel, Compare Hours & Flag an Unusual Day)</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Stop losing diesel in the yard. Issue fuel to a machine, compare it with the hours worked, and see the day that does not add up.
          </p>
          <SeeMore title="Fuel Issues:" items={['Issue fuel to a machine', 'Compare litres with hours worked', 'Explain or hold an unusual day.']} />
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The litres and rates are fictional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/fuelwatch" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/fuelwatch" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=fuelwatch&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        <section className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">Morning Fleet Board</h2>
          <p className="mt-2 text-sm text-muted">(Working, Idle, Down & Off the Site)</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Stop calling around to find the machines. See which are working, which are idle, and which never reached the site they were sent to.
          </p>
          <SeeMore title="Morning Fleet Board:" items={['See the morning board', 'Open a machine and read its day', 'Record why a machine did not earn its place.']} />
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The machines are fictional. This is not a live tracker.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/fleetboard" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/fleetboard" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=fleetboard&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        <section className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">Shift Close</h2>
          <p className="mt-2 text-sm text-muted">(Worked, Stood Idle, Broke Down & Repair Follow-up)</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Stop ending the day from memory. Mark what worked, what stood idle, what broke down, and who still owes a repair.
          </p>
          <SeeMore title="Shift Close:" items={['Close each machine for the shift', 'Keep the name of who reported it', 'Write the repair follow-up for a breakdown.']} />
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The machines are fictional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/plantday" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/plantday" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=plantday&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        <section className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">Waiting On You</h2>
          <p className="mt-2 text-sm text-muted">(One Inbox for What Is Stuck)</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Stop learning about a stuck approval when someone calls. See what is waiting, how old it is, and clear it in one action.
          </p>
          <SeeMore title="Waiting On You:" items={['See everything waiting on you', 'The oldest item is marked late', 'Approve or return it, and it leaves the inbox.']} />
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The items are fictional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/waiting" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/waiting" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=waiting&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        <section className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">Repair Log</h2>
          <p className="mt-2 text-sm text-muted">(Faults, Fixes & the Cost of a Repeat)</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Stop remembering breakdowns in the mechanic's head. Log the fault, keep the cost, and see when the same fault comes back.
          </p>
          <SeeMore title="Repair Log:" items={['File a fault against an asset', 'See that the last fix was temporary', 'Book the proper repair and its cost.']} />
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The assets and costs are fictional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/repairlog" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/repairlog" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=repairlog&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        <section className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">Receive Check</h2>
          <p className="mt-2 text-sm text-muted">(Bill, Yard Count & a Hold on a Mismatch)</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Stop paying a supplier bill that does not match what arrived. Compare the bill with the yard count, hold the difference, and accept it when the supplier corrects it.
          </p>
          <SeeMore title="Receive Check:" items={['Compare the bill with what arrived', 'Hold a bill that does not match', 'Accept it after the supplier corrects it.']} />
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The suppliers and prices are fictional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/receivecheck" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/receivecheck" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=receivecheck&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        {robes.solutions.map((solution, index) => (
          <article
            key={solution.id}
            id={solution.id}
            className="scroll-mt-28 border border-line bg-card p-6 sm:p-8"
          >
            <p className="font-serif text-sm text-robes">{String(index + 1).padStart(2, '0')}</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">{solution.title}</h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">{solution.summary}</p>
            <p className="mt-4 max-w-3xl border-t border-line pt-4 text-ink">
              <span className="font-medium text-robes">Value. </span>
              {solution.outcome}
            </p>
            <Link
              to={`/robes/contact?service=${solution.id}`}
              className={`${robesLink} mt-6 inline-flex`}
            >
              Discuss this solution
            </Link>
          </article>
        ))}
      </Container>
    </>
  )
}

function SeeMore({ title, items }: { title: string; items: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-4 max-w-3xl">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="font-semibold text-ink">{title}</span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-robes">
          {open ? 'See less' : 'See more'}
          <svg viewBox="0 0 20 20" className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open ? (
        <ul className="mt-3 space-y-2 border-t border-line pt-3 text-sm text-muted">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
