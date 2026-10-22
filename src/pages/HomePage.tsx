import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { Seo } from '../components/Seo.tsx'
import { WorkflowShowcase } from '../components/WorkflowShowcase.tsx'
import { site } from '../content/site.ts'
import { robes } from '../content/robes.ts'
import { robesAction, robesLink, secondaryAction } from '../lib/styles.ts'

type DemoCard = {
  name: string
  system?: string
  line: string
  features?: { title: string; items: string[] }
  demo: string
  request: string
}

const demos: DemoCard[] = [
  {
    name: 'Material Requisition (Store)',
    system: 'Material Requisition, Approval & Store Issuance System',
    line: 'Stop chasing material requests, delayed approvals, and missing records. Request materials, approve requests, issue from stores, and track every step in one centralized system.',
    features: {
      title: 'Material Requisition:',
      items: ['Request materials from store', 'Approve materials requested', 'Issue it from the store.'],
    },
    demo: '/robes/demo/clearrequest',
    request: '/robes/contact?service=clearrequest&intent=similar',
  },
  {
    name: 'Waynote',
    system: 'Send, Receive & Dispute a Loading Note',
    line: 'A loading note is sent, received, and disputed when the goods do not match.',
    features: {
      title: 'Waynote:',
      items: ['Send a loading note', 'Receive the quantity and condition', 'Dispute the note when the goods do not match.'],
    },
    demo: '/robes/demo/waynote',
    request: '/robes/contact?service=waynote&intent=similar',
  },
  {
    name: 'SpendGate',
    system: 'Submit, Review & Decide an Expense',
    line: 'An expense sheet is reviewed, then approved or rejected in writing.',
    features: {
      title: 'SpendGate:',
      items: ['Submit an expense sheet', 'Review it before it is decided', 'Approve or reject it in writing.'],
    },
    demo: '/robes/demo/spendgate',
    request: '/robes/contact?service=spendgate&intent=similar',
  },
  {
    name: 'Stock Ledger (Site)',
    system: 'Receipts, Issues & a Balance That Explains Itself',
    line: 'Stop arguing about what should still be in the store. Record what came in, what went out, and read the balance from the same history.',
    features: {
      title: 'Stock Ledger:',
      items: ['Record a receipt into the store', 'Issue stock to a job', 'See the balance explained by the history.'],
    },
    demo: '/robes/demo/siteledger',
    request: '/robes/contact?service=siteledger&intent=similar',
  },
  {
    name: 'Plant Hire Hours',
    system: 'Worked Hours, Idle Time & Period Cost',
    line: 'Stop paying hired machines from memory. Log the hours worked, flag idle time, and see what the period should cost.',
    features: {
      title: 'Plant Hire Hours:',
      items: ['Log hours worked and idle', 'Accept or query a disputed day', 'See the period cost.'],
    },
    demo: '/robes/demo/hirehours',
    request: '/robes/contact?service=hirehours&intent=similar',
  },
  {
    name: 'Beneficiaries',
    system: 'Payee Register, Account Check & Approval',
    line: 'Stop paying from a notebook. Check the account name, approve the payee, and keep one list of who can be paid.',
    features: {
      title: 'Beneficiaries:',
      items: ['Check an account name before it is saved', 'Approve or return the payee', 'See who is ready to be paid.'],
    },
    demo: '/robes/demo/beneficiaries',
    request: '/robes/contact?service=beneficiaries&intent=similar',
  },
  {
    name: 'Fuel Issues',
    system: 'Issue Fuel, Compare Hours & Flag an Unusual Day',
    line: 'Stop losing diesel in the yard. Issue fuel to a machine, compare it with the hours worked, and see the day that does not add up.',
    features: {
      title: 'Fuel Issues:',
      items: ['Issue fuel to a machine', 'Compare litres with hours worked', 'Explain or hold an unusual day.'],
    },
    demo: '/robes/demo/fuelwatch',
    request: '/robes/contact?service=fuelwatch&intent=similar',
  },
  {
    name: 'Morning Fleet Board',
    system: 'Working, Idle, Down & Off the Site',
    line: 'Stop calling around to find the machines. See which are working, which are idle, and which never reached the site they were sent to.',
    features: {
      title: 'Morning Fleet Board:',
      items: ['See the morning board', 'Open a machine and read its day', 'Record why a machine did not earn its place.'],
    },
    demo: '/robes/demo/fleetboard',
    request: '/robes/contact?service=fleetboard&intent=similar',
  },
  {
    name: 'Shift Close',
    system: 'Worked, Stood Idle, Broke Down & Repair Follow-up',
    line: 'Stop ending the day from memory. Mark what worked, what stood idle, what broke down, and who still owes a repair.',
    features: {
      title: 'Shift Close:',
      items: ['Close each machine for the shift', 'Keep the name of who reported it', 'Write the repair follow-up for a breakdown.'],
    },
    demo: '/robes/demo/plantday',
    request: '/robes/contact?service=plantday&intent=similar',
  },
  {
    name: 'Waiting On You',
    system: 'One Inbox for What Is Stuck',
    line: 'Stop learning about a stuck approval when someone calls. See what is waiting, how old it is, and clear it in one action.',
    features: {
      title: 'Waiting On You:',
      items: ['See everything waiting on you', 'The oldest item is marked late', 'Approve or return it, and it leaves the inbox.'],
    },
    demo: '/robes/demo/waiting',
    request: '/robes/contact?service=waiting&intent=similar',
  },
  {
    name: 'Repair Log',
    system: 'Faults, Fixes & the Cost of a Repeat',
    line: 'Stop remembering breakdowns in the mechanic\'s head. Log the fault, keep the cost, and see when the same fault comes back.',
    features: {
      title: 'Repair Log:',
      items: ['File a fault against an asset', 'See that the last fix was temporary', 'Book the proper repair and its cost.'],
    },
    demo: '/robes/demo/repairlog',
    request: '/robes/contact?service=repairlog&intent=similar',
  },
  {
    name: 'Receive Check',
    system: 'Bill, Yard Count & a Hold on a Mismatch',
    line: 'Stop paying a supplier bill that does not match what arrived. Compare the bill with the yard count, hold the difference, and accept it when the supplier corrects it.',
    features: {
      title: 'Receive Check:',
      items: ['Compare the bill with what arrived', 'Hold a bill that does not match', 'Accept it after the supplier corrects it.'],
    },
    demo: '/robes/demo/receivecheck',
    request: '/robes/contact?service=receivecheck&intent=similar',
  },
]

export function HomePage() {
  return (
    <>
      <Seo
        title={`${robes.shortName} · Custom business systems`}
        description="Build and automate custom business systems. Streamline operations, boost productivity, and drive business growth."
        path="/"
      />
      <Hero />
      <Demos />
      <Close />
    </>
  )
}

function Hero() {
  return (
    <section className="border-b border-line">
      <Container className="grid items-start gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-12">
        <div className="flex text-left lg:h-[32rem] lg:items-center">
          <div>
            <SwitchingTitle />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{site.hero.support}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/robes/solutions" className={robesAction}>
                Try a live demo
              </Link>
              <Link to="/robes/contact?intent=similar" className={secondaryAction}>
                Request this for your business
              </Link>
            </div>
          </div>
        </div>
        <WorkflowShowcase />
      </Container>
    </section>
  )
}

function SwitchingTitle() {
  const [swapped, setSwapped] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setSwapped((current) => !current), 3200)
    return () => window.clearInterval(id)
  }, [])

  const first = swapped ? 'Automate' : 'Build'
  const second = swapped ? 'Build' : 'Automate'

  return (
    <h1 className="max-w-xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.05] font-bold tracking-[-0.03em] text-ink">
      <span key={`${first}-lead`} className="hero-swap inline-block">
        {first}
      </span>
      {' and '}
      <span key={`${second}-follow`} className="hero-swap inline-block">
        {second}
      </span>
      {' Custom Business Systems'}
    </h1>
  )
}

function Demos() {
  return (
    <section className="border-b border-line" aria-labelledby="demo-heading">
      <Container className="py-16 md:py-20">
        <h2 id="demo-heading" className="max-w-2xl font-serif text-3xl leading-tight text-ink md:text-4xl">
          See How Your Business Can Run Smarter.
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Explore our interactive business automation demos for construction, distribution, manufacturing, and
          logistics. Experience simpler workflows, less manual work, and better control.
        </p>
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-lg font-semibold">
          <Link to="/robes/solutions" className="text-robes underline-offset-4 hover:underline">
            Try a Live Demo →
          </Link>
          <span className="text-muted" aria-hidden="true">
            |
          </span>
          <Link to="/robes/contact?intent=similar" className="text-ink underline-offset-4 hover:underline">
            Build Yours →
          </Link>
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {demos.map((demo) => (
            <article key={demo.name} className="flex flex-col border border-line bg-card p-6">
              <h3 className="font-serif text-2xl text-ink">{demo.name}</h3>
              {demo.system ? <p className="mt-2 text-sm text-muted">({demo.system})</p> : null}
              <p className="mt-3 leading-relaxed text-muted">{demo.line}</p>
              {demo.features ? <SeeMore title={demo.features.title} items={demo.features.items} /> : null}
              <div className="mt-6 flex flex-1 flex-col items-start justify-end gap-3">
                <Link to={demo.demo} className={robesAction}>
                  Try the live demo
                </Link>
                <Link to={demo.request} className={robesLink}>
                  Request this for your business
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

function SeeMore({ title, items }: { title: string; items: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-4">
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

function Close() {
  return (
    <section className="border-t border-line">
      <Container className="py-16 md:py-20">
        <div className="rounded-3xl border border-[#c9e4d4] bg-[#f3faf6] px-6 py-12 text-ink sm:px-10 dark:border-[#1b7a45]/40 dark:bg-[#123024]">
          <h2 className="max-w-2xl font-serif text-4xl leading-tight text-ink">
            If the demo matches how your business works, ask for it.
          </h2>
          <Link to="/robes/contact?intent=similar" className={`${robesAction} mt-8`}>
            Request this for your business
          </Link>
          <p className="mt-8 text-sm text-muted">
            <Link to="/about" className="underline underline-offset-4">
              Christopher Agba
            </Link>{' '}
            is the person who builds this work.
          </p>
        </div>
      </Container>
    </section>
  )
}
