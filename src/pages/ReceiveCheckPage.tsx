import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const capabilities = [
  'A bill shows the quantity the supplier charged for.',
  'The yard count is recorded beside it, without changing the bill.',
  'A short delivery can be held so it is not treated as agreed.',
  'A corrected bill is accepted only when its quantity matches what arrived.',
  'The person who counted the goods cannot hold or accept the bill.',
]

const industries = ['Importers', 'Distributors', 'Contractors', 'Manufacturers', 'Any team that pays from a supplier bill']

export function ReceiveCheckPage() {
  return (
    <>
      <Seo
        title="Supplier bill check demo · ReceiveCheck"
        description="Compare a supplier bill with what arrived, hold a mismatch, and accept the bill after the supplier corrects it. Try the live demo, then request it for your business."
        path="/robes/solutions/receivecheck"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Supplier bill check demo',
          description: 'A live demonstration of holding a supplier bill that does not match the yard count.',
        }}
      />
      <PageIntro eyebrow="ReceiveCheck" title="Hold the bill that does not match what arrived.">
        <p>A supplier bill can be paid while the yard received less than it says. This check puts the bill and the yard count side by side.</p>
        <p>The demo is not one company. Choose construction, distribution, manufacturing, or logistics, then hold that company's short bill.</p>
        <p>Try the check now. If a short delivery can still be paid as if it matched, request this module for your business.</p>
      </PageIntro>
      <Container className="grid gap-10 py-16 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm leading-relaxed text-muted">
              The sample bill says 100. The yard counted 90. Holding the bill keeps that difference
              visible. After the supplier corrects it to 90, the bill can be accepted. The demo does
              not pay a supplier or calculate tax.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/demo/receivecheck" className={robesAction}>Try the live demo</Link>
              <Link to="/robes/contact?service=receivecheck&intent=similar" className={secondaryAction}>Request this for your business</Link>
            </div>
          </div>
          <Preview />
        </div>
        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">
              The bill and the delivery live in different places. The difference shows up after the
              money has moved, or it does not show up at all.
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
              React, TypeScript, and data stored in this browser. The suppliers, goods, and prices
              are fictional. Resetting the demo restores the sample for the business you picked.
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
        <p className="font-serif text-xl text-ink">RC-100</p>
        <p className="text-xs tracking-wide text-robes uppercase">Short</p>
      </div>
      <p className="mt-3 text-sm text-muted">Northwharf Cement · Cement bags</p>
      <p className="mt-4 font-serif text-3xl text-ink">100 vs 90</p>
      <p className="mt-2 text-sm text-muted">The bill is held until the supplier corrects the quantity.</p>
    </div>
  )
}
