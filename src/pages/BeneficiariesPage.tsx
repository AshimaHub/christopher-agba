import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const capabilities = [
  'A clerk enters the bank and account number. The account name comes from a check, not from typing.',
  'The payee is submitted only after that name is confirmed.',
  'A finance reviewer approves or returns the payee, and both decisions need a remark.',
  'A returned payee can be corrected and checked again.',
  'The approved list is who may be paid. The demo does not build a bank file or move money.',
]

const industries = ['Construction', 'Distribution', 'Manufacturing', 'Logistics', 'Any business that pays suppliers']

export function BeneficiariesPage() {
  return (
    <>
      <Seo
        title="Beneficiaries software demo · payee register"
        description="Check a payee account name, approve or return who can be paid, and keep one list. Try the live beneficiaries demo, then request it for your business."
        path="/robes/solutions/beneficiaries"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Beneficiaries software demo',
          description: 'A live demonstration of checking a payee account and approving who can be paid.',
        }}
      />
      <PageIntro eyebrow="Beneficiaries" title="Know who can be paid before the money moves.">
        <p>A new supplier should not be paid from a number written in a chat. Check the account name, then let a second person approve the payee.</p>
        <p>The demo is not one company. Choose construction, distribution, manufacturing, or logistics, then keep that company's payees.</p>
        <p>Try the check now. If your payee list still lives in a spreadsheet, request this module for your business.</p>
      </PageIntro>
      <Container className="grid gap-10 py-16 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm leading-relaxed text-muted">
              Every payee is a checked account, a category, and a decision. Approval is a recorded
              remark. The demonstration stops at the approved list.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/demo/beneficiaries" className={robesAction}>Try the live demo</Link>
              <Link to="/robes/contact?service=beneficiaries&intent=similar" className={secondaryAction}>Request this for your business</Link>
            </div>
          </div>
          <Preview />
        </div>
        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">
              Account names are typed by hand, and the person who adds a payee is sometimes the
              person who says they can be paid. A checked name and a second approval keep that list trustworthy.
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
              React, TypeScript, and data stored in this browser. Banks, names, and account numbers
              are fictional. There is no account check against a real bank, no payment file, and no
              money movement. Resetting the demo restores the sample for the business you picked.
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
        <p className="font-serif text-xl text-ink">Palmline Aggregates</p>
        <p className="text-xs tracking-wide text-robes uppercase">Checked</p>
      </div>
      <p className="mt-3 text-sm text-muted">Lekki Mercantile · 9001100440</p>
      <p className="mt-4 font-serif text-3xl text-ink">Waiting for approval</p>
      <p className="mt-2 text-sm text-muted">The name came from the account check, not from a typed line.</p>
    </div>
  )
}
