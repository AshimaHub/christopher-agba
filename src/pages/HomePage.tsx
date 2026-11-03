import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { Portrait } from '../components/Portrait.tsx'
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
        title={`${site.name} · Enterprise Software and AI Automation`}
        description={site.hero.support}
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          name: site.name,
          description: site.valueProposition,
        }}
      />
      <Hero />
      <Value />
      <Featured />
      <Audiences />
      <Expertise />
      <AboutPreview />
      <Demos />
      <Close />
    </>
  )
}

function Hero() {
  return (
    <section className="border-b border-line">
      <Container className="grid items-center gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
        <div>
          <p className="text-sm font-medium tracking-[0.14em] text-accent uppercase">{site.hero.positioning}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.1rem)] leading-[1.05] font-bold tracking-[-0.03em] text-ink">
            {site.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{site.hero.support}</p>
          <p className="mt-4 text-sm text-muted">{site.name} · {site.role}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/solutions" className={robesAction}>Explore My Solutions</Link>
            <Link to="/contact" className={secondaryAction}>Discuss Your Project</Link>
          </div>
        </div>
        <figure>
          <Portrait
            alt="Portrait of Christopher Agba"
            priority
            className="aspect-[4/5] w-full max-w-md border border-line lg:ml-auto"
          />
          <figcaption className="mt-3 max-w-md text-sm text-muted lg:ml-auto">
            {site.name} · {site.location}. {robes.shortName} is the emerging company brand.
          </figcaption>
        </figure>
      </Container>
    </section>
  )
}

const capabilities = [
  { title: 'Enterprise Software Engineering', text: 'Reliable applications for complex business operations.' },
  { title: 'AI & Intelligent Automation', text: 'Smart systems that make information accessible and reduce repetitive work.' },
  { title: 'Business Workflow Optimization', text: 'Digital processes that improve transparency, accountability, and efficiency.' },
  { title: 'Systems & API Integration', text: 'Connecting applications, data, and services into dependable business solutions.' },
]

function Value() {
  return (
    <section className="border-b border-line" aria-labelledby="value-heading">
      <Container className="py-16 md:py-20">
        <h2 id="value-heading" className="max-w-2xl font-serif text-3xl text-ink md:text-4xl">Technology That Solves Real Business Problems</h2>
        <p className="mt-4 max-w-2xl text-muted">{site.valueProposition}</p>
        <p className="mt-4">
          <Link to="/services" className={robesLink}>See the services you can hire</Link>
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {capabilities.map((item) => (
            <article key={item.title} className="border border-line bg-card p-6">
              <h3 className="font-serif text-2xl text-ink">{item.title}</h3>
              <p className="mt-3 text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

function Featured() {
  return (
    <section className="border-b border-line" aria-labelledby="featured-heading">
      <Container className="py-16 md:py-20">
        <h2 id="featured-heading" className="max-w-2xl font-serif text-3xl text-ink md:text-4xl">Solutions Built Around Real Business Challenges</h2>
        <p className="mt-4 max-w-2xl text-muted">These are portfolio solution concepts. A working demo is shown only where one exists. Records inside the demos are fictional.</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="border border-line bg-card p-6 sm:p-8">
            <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">Leading solution</p>
            <h3 className="mt-3 font-serif text-3xl text-ink">ClearRequest</h3>
            <p className="mt-2 text-sm text-muted">Intelligent workflow and approval management</p>
            <p className="mt-4 text-muted">A digital platform concept for managing internal requests, multilevel approvals, documentation, an audit trail, and operational reporting.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/solutions/clearrequest" className={robesAction}>Explore ClearRequest</Link>
              <Link to="/robes/demo/clearrequest" className={secondaryAction}>Try the live demo</Link>
            </div>
          </article>
          <WorkflowShowcase />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <article className="border border-line bg-card p-6">
            <h3 className="font-serif text-2xl text-ink">Operations Hub</h3>
            <p className="mt-2 text-sm text-muted">Inventory and operational management</p>
            <p className="mt-4 text-muted">An enterprise software concept for stock visibility, requisitions, dispatch coordination, and multi-site operations. Related working demos use fictional businesses.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/demo/siteledger" className={robesAction}>Try the stock demo</Link>
              <Link to="/robes/solutions/operations-hub" className={secondaryAction}>Explore Operations Hub</Link>
            </div>
          </article>
          <article className="border border-line bg-card p-6">
            <h3 className="font-serif text-2xl text-ink">KnowledgeDesk AI</h3>
            <p className="mt-2 text-sm text-muted">Enterprise knowledge assistant</p>
            <p className="mt-4 text-muted">A concept for source-grounded answers from organizational documents. There is no live assistant on this site yet.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/solutions/knowledgedesk" className={secondaryAction}>Read the concept</Link>
              <Link to="/contact?service=custom-business-software" className={secondaryAction}>Request a Consultation</Link>
            </div>
          </article>
        </div>
      </Container>
    </section>
  )
}

function Audiences() {
  return (
    <section className="border-b border-line" aria-labelledby="audiences-heading">
      <Container className="py-16 md:py-20">
        <h2 id="audiences-heading" className="font-serif text-3xl text-ink md:text-4xl">Who I Help</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {site.audiences.map((item) => (
            <li key={item.title} className="border border-line bg-card p-6">
              <h3 className="font-medium text-ink">{item.title}</h3>
              <p className="mt-3 text-sm text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function Expertise() {
  return (
    <section className="border-b border-line" aria-labelledby="expertise-home-heading">
      <Container className="py-16 md:py-20">
        <h2 id="expertise-home-heading" className="font-serif text-3xl text-ink md:text-4xl">Professional expertise</h2>
        <p className="mt-4 max-w-2xl text-muted">Grouped by the kind of engineering problem, not by a list of unrelated tools. AI items are capabilities I am prepared to design. They are not claimed client deliveries.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {site.expertise.map((group) => (
            <article key={group.title} className="border border-line p-6">
              <h3 className="font-medium text-ink">{group.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

function AboutPreview() {
  return (
    <section className="border-b border-line">
      <Container className="grid items-center gap-8 py-16 md:grid-cols-[0.7fr_1.3fr] md:py-20">
        <Portrait alt="" className="aspect-[4/5] w-full max-w-xs border border-line" />
        <div>
          <h2 className="font-serif text-3xl text-ink md:text-4xl">About Christopher</h2>
          <p className="mt-4 max-w-2xl text-muted">{site.about.lead}</p>
          <p className="mt-4 max-w-2xl text-muted">{site.about.paragraphs[0]}</p>
          <Link to="/about" className={`${robesLink} mt-6 inline-flex`}>Read the full profile</Link>
        </div>
      </Container>
    </section>
  )
}

function Demos() {
  return (
    <section className="border-b border-line" aria-labelledby="demo-heading">
      <Container className="py-16 md:py-20">
        <DemoReel />
      </Container>
    </section>
  )
}

function DemoReel() {
  const scroller = useRef<HTMLDivElement>(null)
  const hold = useRef(false)
  const rewinding = useRef(false)
  const [playing, setPlaying] = useState(true)
  const [page, setPage] = useState(0)
  const reduced = useRef(false)

  function metrics() {
    const el = scroller.current
    const card = el?.querySelector('article')
    if (!el || !(card instanceof HTMLElement)) return null
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || '0') || 0
    return { el, step: card.offsetWidth + gap }
  }

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const current = metrics()
    if (!current) return
    const loopAt = demos.length * current.step
    const behavior = reduced.current ? 'auto' : 'smooth'
    if (direction === -1 && current.el.scrollLeft < current.step / 2) {
      rewinding.current = true
      current.el.scrollTo({ left: loopAt, behavior: 'auto' })
      window.requestAnimationFrame(() => {
        current.el.scrollTo({ left: loopAt - current.step, behavior })
        window.setTimeout(() => { rewinding.current = false }, reduced.current ? 0 : 700)
      })
      return
    }
    const left = current.el.scrollLeft + direction * current.step
    current.el.scrollTo({ left, behavior })
  }, [])

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current) setPlaying(false)
  }, [])

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    let settleTimer = 0
    const read = () => {
      const current = metrics()
      if (!current || current.step <= 0) return null
      return current
    }
    const mark = () => {
      const current = read()
      if (!current) return
      setPage(Math.round(current.el.scrollLeft / current.step) % demos.length)
    }
    const settle = () => {
      const current = read()
      if (!current || rewinding.current) return
      const loopAt = demos.length * current.step
      if (current.el.scrollLeft >= loopAt - 1) {
        current.el.scrollTo({ left: current.el.scrollLeft - loopAt, behavior: 'auto' })
      }
      mark()
    }
    const onScroll = () => {
      mark()
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(settle, 140)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('scrollend', settle)
    return () => {
      window.clearTimeout(settleTimer)
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('scrollend', settle)
    }
  }, [])

  useEffect(() => {
    if (!playing || reduced.current) return
    const id = window.setInterval(() => {
      if (!hold.current) scrollByCard(1)
    }, 5200)
    return () => window.clearInterval(id)
  }, [playing, scrollByCard])

  function scrollToPage(index: number) {
    const current = metrics()
    if (!current) return
    current.el.scrollTo({ left: index * current.step, behavior: reduced.current ? 'auto' : 'smooth' })
  }

  return (
    <div
      onMouseEnter={() => { hold.current = true }}
      onMouseLeave={() => { hold.current = false }}
      onFocusCapture={() => { hold.current = true }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hold.current = false
      }}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h2 id="demo-heading" className="font-serif text-3xl leading-tight text-ink md:text-4xl">
            Working demonstrations
          </h2>
          <p className="mt-4 text-muted">
            Original interfaces with fictional records. Slide through them here. They are not client projects and they do not claim measured results.
          </p>
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-lg font-semibold">
            <Link to="/robes/solutions" className="text-robes underline-offset-4 hover:underline">
              Try a Live Demo →
            </Link>
            <span className="text-muted" aria-hidden="true">|</span>
            <Link to="/robes/contact?intent=similar" className="text-ink underline-offset-4 hover:underline">
              Request a Consultation →
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="reel-control" aria-pressed={!playing} onClick={() => setPlaying((current) => !current)}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button type="button" className="reel-control reel-control-icon" aria-label="Previous demo" onClick={() => scrollByCard(-1)}>
            <Chevron direction="left" />
          </button>
          <button type="button" className="reel-control reel-control-icon" aria-label="Next demo" onClick={() => scrollByCard(1)}>
            <Chevron direction="right" />
          </button>
        </div>
      </div>
      <div
        ref={scroller}
        className="demo-reel mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Business demos"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            scrollByCard(1)
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            scrollByCard(-1)
          }
        }}
      >
        {demos.map((demo) => (
          <DemoCard key={demo.name} demo={demo} />
        ))}
        {demos.slice(0, 3).map((demo) => (
          <DemoCard key={`next-${demo.name}`} demo={demo} copy />
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2" role="tablist" aria-label="Choose a demo">
        {demos.map((demo, index) => (
          <button
            key={demo.name}
            type="button"
            role="tab"
            aria-selected={page === index}
            aria-label={demo.name}
            className={`h-1.5 rounded-full transition-all ${page === index ? 'w-8 bg-robes-fill' : 'w-2.5 bg-line'}`}
            onClick={() => scrollToPage(index)}
          />
        ))}
      </div>
    </div>
  )
}

function DemoCard({ demo, copy = false }: { demo: DemoCard; copy?: boolean }) {
  return (
    <article
      className="flex w-[86%] shrink-0 snap-start flex-col border border-line bg-card p-6 sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
      aria-hidden={copy || undefined}
    >
      <h3 className="font-serif text-2xl text-ink">{demo.name}</h3>
      {demo.system ? <p className="mt-2 text-sm text-muted">({demo.system})</p> : null}
      <p className="mt-3 leading-relaxed text-muted">{demo.line}</p>
      {demo.features ? <SeeMore title={demo.features.title} items={demo.features.items} muted={copy} /> : null}
      <div className="mt-6 flex flex-1 flex-col items-start justify-end gap-3">
        <Link to={demo.demo} tabIndex={copy ? -1 : undefined} className={robesAction}>
          Try the live demo
        </Link>
        <Link to={demo.request} tabIndex={copy ? -1 : undefined} className={robesLink}>
          Request this for your business
        </Link>
      </div>
    </article>
  )
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      {direction === 'left' ? <path d="M12.5 4.5 7 10l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M7.5 4.5 13 10l-5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}

function SeeMore({ title, items, muted = false }: { title: string; items: string[]; muted?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-4">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
        tabIndex={muted ? -1 : undefined}
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
            {site.ctas.finalTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{site.ctas.finalText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className={robesAction}>Discuss Your Project</Link>
            <Link to="/work" className={secondaryAction}>View My Work</Link>
          </div>
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
