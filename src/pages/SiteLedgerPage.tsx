import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const capabilities = [
  'A storekeeper posts a receipt, and the on-hand quantity rises.',
  'An issue to a job reduces the same card, and cannot take the balance below zero.',
  'Draft movements stay out of the balance until they are posted.',
  'The stock card shows opening, receipts, and issues, so the balance explains itself.',
  'The same steps run for a construction site, a warehouse, a factory floor, or a haulage yard.',
]

const industries = ['Construction', 'Distribution', 'Manufacturing', 'Logistics', 'Multi-site stores']

export function SiteLedgerPage() {
  return (
    <>
      <Seo
        title="Stock ledger software demo · SiteLedger"
        description="Record what came into a store, what went out to a job, and read a balance the history explains. Try the live SiteLedger demo, then request it for your business."
        path="/robes/solutions/siteledger"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Stock ledger software demo',
          description: 'A live demonstration of receipts, issues, and a stock balance that explains itself.',
        }}
      />
      <PageIntro eyebrow="SiteLedger" title="Know what should still be in the store.">
        <p>Goods come in. Goods go out to a job. The card keeps both, so the quantity on hand is the sum of the history.</p>
        <p>The demo is not one company. Choose construction, distribution, manufacturing, or logistics, then keep that company's stock.</p>
        <p>Try the card now. If your stores still argue from memory, request this module for your business.</p>
      </PageIntro>
      <Container className="grid gap-10 py-16 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm leading-relaxed text-muted">
              Every movement is a receipt or an issue against one item in one store. Posting it
              changes the balance. Leaving it as a draft does not.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/demo/siteledger" className={robesAction}>Try the live demo</Link>
              <Link to="/robes/contact?service=siteledger&intent=similar" className={secondaryAction}>Request this for your business</Link>
            </div>
          </div>
          <Preview />
        </div>
        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">
              Site stores cannot say, on one screen, what came in, what went out, and what should
              still be there. SiteLedger keeps that card in one place.
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
              React, TypeScript, and data stored in this browser. Quantities are fictional. There
              is no account and no connection to a live warehouse. Resetting the demo restores the
              sample for the business you picked.
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
        <p className="font-serif text-xl text-ink">Cement · bags</p>
        <p className="text-xs tracking-wide text-robes uppercase">On hand</p>
      </div>
      <p className="mt-3 text-sm text-muted">Opening 20 + 40 − 12</p>
      <p className="mt-4 font-serif text-3xl text-ink">48 bags</p>
      <p className="mt-2 text-sm text-muted">The next receipt is still a draft, so it is not in this balance yet.</p>
    </div>
  )
}
