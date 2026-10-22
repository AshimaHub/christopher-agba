import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const capabilities = [
  'A fault is filed against one asset, with the date and the person who filed it.',
  'A closed job records what was done and what it cost.',
  'A temporary repair stays visible when the same fault comes back.',
  'The workshop lead books the proper repair and a planned cost.',
  'The mechanic who filed the fault cannot book it.',
]

const industries = ['Workshops', 'Contractors', 'Transport firms', 'Factories', 'Any team that repeats the same repair']

export function RepairLogPage() {
  return (
    <>
      <Seo
        title="Repair log software demo · RepairLog"
        description="See a fault come back after a temporary fix, then book the proper repair and its cost. Try the live demo, then request it for your business."
        path="/robes/solutions/repairlog"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Repair log software demo',
          description: 'A live demonstration of a maintenance log that shows repeat faults and repair cost.',
        }}
      />
      <PageIntro eyebrow="RepairLog" title="See the fault that came back, and what the first fix cost.">
        <p>Breakdowns live in the mechanic's memory. This log keeps the fault, the fix, and the cost on the asset, so a temporary repair is obvious when the same fault returns.</p>
        <p>The demo is not one company. Choose construction, distribution, manufacturing, or logistics, then book that company's proper repair.</p>
        <p>Try the log now. If the same breakdown keeps returning, request this module for your business.</p>
      </PageIntro>
      <Container className="grid gap-10 py-16 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm leading-relaxed text-muted">
              The sample pump was clamped, not rebuilt. When the leak returns, the earlier cost is
              already on the asset. Booking the proper repair adds the planned cost beside it.
              The demo does not raise a purchase order or pay a supplier.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/demo/repairlog" className={robesAction}>Try the live demo</Link>
              <Link to="/robes/contact?service=repairlog&intent=similar" className={secondaryAction}>Request this for your business</Link>
            </div>
          </div>
          <Preview />
        </div>
        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">
              The same fault returns, and nobody can see that the last visit was a patch. The cost
              shows up later, on an invoice, with no link to the asset.
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
              React, TypeScript, and data stored in this browser. The assets, faults, and costs are
              fictional. Resetting the demo restores the sample for the business you picked.
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
        <p className="font-serif text-xl text-ink">RL-22</p>
        <p className="text-xs tracking-wide text-robes uppercase">Came back</p>
      </div>
      <p className="mt-3 text-sm text-muted">Concrete pump · Hydraulic leak</p>
      <p className="mt-4 font-serif text-3xl text-ink">₦45,000</p>
      <p className="mt-2 text-sm text-muted">Already spent on a clamp. The proper repair is not booked yet.</p>
    </div>
  )
}
