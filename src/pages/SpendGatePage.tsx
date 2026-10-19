import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const capabilities = [
  'A submitter drafts an expense sheet against a site and sends it for approval.',
  'An approver opens the sheet, which moves it under review.',
  'Approval and rejection both require a remark the submitter can read.',
  'The person who raised the sheet cannot approve it.',
  'Approved amounts are totalled by site. Rejected sheets stay out of that total.',
]

const industries = ['Construction', 'Field services', 'Project businesses', 'Professional firms', 'Multi-site operations']

export function SpendGatePage() {
  return (
    <>
      <Seo
        title="Expense approval software demo · SpendGate"
        description="Submit a site expense, review it, and approve or reject it with a remark. Try the live SpendGate demo, then request the same control for your business."
        path="/robes/solutions/spendgate"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Expense approval software demo',
          description: 'A live demonstration of submitting an expense sheet and approving or rejecting it.',
        }}
      />
      <PageIntro eyebrow="SpendGate" title="Approve the expense before it is treated as agreed.">
        <p>A site raises the sheet. An approver opens it, then approves or rejects it in writing. The person who raised it cannot approve it.</p>
        <p>The demo is not one company. Choose construction, distribution, manufacturing, or logistics, then approve that company's expenses.</p>
        <p>Try that decision now. If your expenses still live in chats, request this module for your business.</p>
      </PageIntro>
      <Container className="grid gap-10 py-16 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm leading-relaxed text-muted">
              Every expense is a sheet: lines, a site, and a decision. Approval is a recorded remark,
              not a conversation that disappears.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/demo/spendgate" className={robesAction}>Try the live demo</Link>
              <Link to="/robes/contact?service=spendgate&intent=similar" className={secondaryAction}>Request this for your business</Link>
            </div>
          </div>
          <Preview />
        </div>
        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">
              Site expenses wait in inboxes, and the person who spent the money is sometimes the person
              who approves it. SpendGate keeps the sheet, the reviewer, and the remark on one record.
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
              React, TypeScript, and data stored in this browser. Amounts are whole naira in a
              fictional sample. There is no account and no shared ledger. Resetting the demo restores
              the sample for the business you picked.
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
        <p className="font-serif text-xl text-ink">ES-210</p>
        <p className="text-xs tracking-wide text-robes uppercase">Approved</p>
      </div>
      <p className="mt-3 text-sm text-muted">Same approval, four sample businesses</p>
      <p className="mt-4 font-serif text-3xl text-ink">₦420,000</p>
      <p className="mt-2 text-sm text-muted">Approved. The haulage receipt is on the sheet.</p>
    </div>
  )
}
