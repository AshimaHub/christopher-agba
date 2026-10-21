import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { Seo } from '../components/Seo.tsx'
import { WorkflowShowcase } from '../components/WorkflowShowcase.tsx'
import { site } from '../content/site.ts'
import { robes } from '../content/robes.ts'
import { robesAction, robesLink, secondaryAction } from '../lib/styles.ts'

const demos = [
  {
    name: 'ClearRequest',
    line: 'A material request is approved, then issued from the store.',
    demo: '/robes/demo/clearrequest',
    request: '/robes/contact?service=clearrequest&intent=similar',
  },
  {
    name: 'Waynote',
    line: 'A loading note is sent, received, and disputed when the goods do not match.',
    demo: '/robes/demo/waynote',
    request: '/robes/contact?service=waynote&intent=similar',
  },
  {
    name: 'SpendGate',
    line: 'An expense sheet is reviewed, then approved or rejected in writing.',
    demo: '/robes/demo/spendgate',
    request: '/robes/contact?service=spendgate&intent=similar',
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
      <Container className="grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="text-left">
          <h1 className="max-w-xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.05] font-bold tracking-[-0.03em] text-ink">
            {site.hero.title}
          </h1>
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
        <WorkflowShowcase />
      </Container>
    </section>
  )
}

function Demos() {
  return (
    <section className="border-b border-line" aria-labelledby="demo-heading">
      <Container className="py-16 md:py-20">
        <h2 id="demo-heading" className="max-w-2xl font-serif text-3xl leading-tight text-ink md:text-4xl">
          Open a workflow and run it.
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Each demo is one module. Switch the sample business — construction, distribution,
          manufacturing, or logistics — and the steps stay the same. Then ask for it in your own company.
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {demos.map((demo) => (
            <article key={demo.name} className="flex flex-col border border-line bg-card p-6">
              <h3 className="font-serif text-2xl text-ink">{demo.name}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-muted">{demo.line}</p>
              <div className="mt-6 flex flex-col items-start gap-3">
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

function Close() {
  return (
    <section className="bg-band text-band-ink">
      <Container className="py-16 md:py-20">
        <h2 className="max-w-2xl font-serif text-4xl leading-tight">
          If the demo matches how your business works, ask for it.
        </h2>
        <Link to="/robes/contact?intent=similar" className={`${robesAction} mt-8`}>
          Request this for your business
        </Link>
        <p className="mt-8 text-sm text-band-muted">
          <Link to="/about" className="underline underline-offset-4">
            Christopher Agba
          </Link>{' '}
          is the person who builds this work.
        </p>
      </Container>
    </section>
  )
}
