import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const capabilities = [
  'A plant clerk logs worked hours and idle hours for a hired machine.',
  'On-site hours are charged at one hire rate. Idle time is visible, not folded into a single day rate.',
  'A disputed day stays out of the agreed period cost until it is accepted.',
  'Querying a day keeps it out and stores the remark with the record.',
  'The same week runs for construction plant, a hired truck, a factory generator, or a haulage trailer.',
]

const industries = ['Construction', 'Plant hire', 'Distribution', 'Manufacturing', 'Logistics']

export function HireHoursPage() {
  return (
    <>
      <Seo
        title="Plant hire hours software demo · HireHours"
        description="Log worked and idle hours for a hired machine, accept or query a disputed day, and see the period cost. Try the live HireHours demo, then request it for your business."
        path="/robes/solutions/hirehours"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Plant hire hours software demo',
          description: 'A live demonstration of hired-machine hours, idle time, and a period cost.',
        }}
      />
      <PageIntro eyebrow="HireHours" title="See which hired hours you should pay.">
        <p>The machine was on site. Some of those hours were worked, and some were idle. A disputed day should not slip into the bill unnoticed.</p>
        <p>The demo is not one company. Choose construction, distribution, manufacturing, or logistics, then keep that company's hired hours.</p>
        <p>Try the week now. If hired machines are still paid from a phone call, request this module for your business.</p>
      </PageIntro>
      <Container className="grid gap-10 py-16 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm leading-relaxed text-muted">
              Every day is a record: worked hours, idle hours, and a status. Logged days and
              accepted days make the agreed total. Drafts, disputes, and queries do not.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/demo/hirehours" className={robesAction}>Try the live demo</Link>
              <Link to="/robes/contact?service=hirehours&intent=similar" className={secondaryAction}>Request this for your business</Link>
            </div>
          </div>
          <Preview />
        </div>
        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">
              Hired machines are paid by the hour, but the hirer cannot see which hours were
              worked, idle, or disputed. HireHours keeps that week on one card.
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
              React, TypeScript, and data stored in this browser. Rates and hours are fictional.
              There is no account and no connection to a plant register. Resetting the demo
              restores the sample for the business you picked.
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
        <p className="font-serif text-xl text-ink">Excavator · Thu</p>
        <p className="text-xs tracking-wide text-robes uppercase">Disputed</p>
      </div>
      <p className="mt-3 text-sm text-muted">6 worked · 4 idle · held out of the total</p>
      <p className="mt-4 font-serif text-3xl text-ink">₦1,170,000</p>
      <p className="mt-2 text-sm text-muted">Agreed so far. Friday is still a draft.</p>
    </div>
  )
}
