import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const capabilities = [
  'A sender writes the loading note and dispatches it. Until then it is a draft.',
  'The note waits as pending receipt at the destination.',
  'The receiver records the quantity and the condition of each line.',
  'A mismatch in quantity or condition marks the note disputed. A clean receipt can be completed.',
]

const industries = ['Construction', 'Distribution', 'Logistics', 'Manufacturing', 'Multi-site stores']

export function WaynotePage() {
  return (
    <>
      <Seo
        title="Loading note and goods receipt demo · Waynote"
        description="Send a loading note, record what arrived, and dispute a mismatch in quantity or condition. Try the live Waynote demo, then request it for your sites."
        path="/robes/solutions/waynote"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Loading note and goods receipt demo',
          description: 'A live demonstration of dispatching a loading note and disputing a mismatch on receipt.',
        }}
      />
      <PageIntro eyebrow="Waynote" title="Know what left, and what arrived.">
        <p>The sender dispatches the note. The receiver records quantity and condition. A mismatch stays on the note as a dispute.</p>
        <p>The demo is not one company. Choose construction, distribution, manufacturing, or logistics, then send and receive that company's goods.</p>
        <p>Try that handover now. If your sites argue about deliveries, request this module for your business.</p>
      </PageIntro>
      <Container className="grid gap-10 py-16 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm leading-relaxed text-muted">
              Give every load one note, from the yard that sent it to the place that counted it,
              including what was missing.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/demo/waynote" className={robesAction}>Try the live demo</Link>
              <Link to="/robes/contact?service=waynote&intent=similar" className={secondaryAction}>Request this for your business</Link>
            </div>
          </div>
          <Preview />
        </div>
        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">
              Goods leave one site and are received at another. Waynote keeps the quantity and the
              condition that were sent beside what the receiver actually found.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-ink">What you can try</h2>
            <ul className="mt-4 space-y-3 text-muted">
              {capabilities.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>
        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">Industries</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {industries.map((item) => <li key={item} className="border border-line px-3 py-2 text-sm">{item}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-ink">Built with</h2>
            <p className="mt-4 text-muted">
              React, TypeScript, and data stored in this browser. There is no account and no shared
              database. Resetting the demo restores the sample for the business you picked.
            </p>
          </div>
        </section>
      </Container>
    </>
  )
}

function Preview() {
  return (
    <div className="border border-line bg-card p-4" aria-hidden="true">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <p className="font-serif text-xl text-ink">WN-1804</p>
        <p className="text-xs tracking-wide text-robes uppercase">Disputed</p>
      </div>
      <p className="mt-3 text-sm text-muted">Same dispute, four sample businesses</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="border border-line px-2 py-3"><p className="font-serif text-2xl text-ink">8</p><p className="text-xs text-muted">Sent</p></div>
        <div className="border border-line px-2 py-3"><p className="font-serif text-2xl text-ink">6</p><p className="text-xs text-muted">Arrived</p></div>
        <div className="border border-line px-2 py-3"><p className="font-serif text-2xl text-ink">Bad</p><p className="text-xs text-muted">Condition</p></div>
      </div>
    </div>
  )
}
