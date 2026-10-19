import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const capabilities = [
  'A requester submits materials, quantities, and a reason against a project.',
  'An approver sees the queue and approves or rejects with a note.',
  'A storekeeper issues all or part of an approved request, and stock stays in balance.',
  'Status, history, and simple reports update from the same records.',
]

const industries = ['Construction', 'Manufacturing', 'Distribution', 'Logistics', 'Growing SMEs']

export function ClearRequestPage() {
  return (
    <>
      <Seo
        title="Material requisition software demo · ClearRequest"
        description="Watch a material request get approved and issued from the store. Try the live ClearRequest demo, then ask Robes to build the same workflow for your business."
        path="/robes/solutions/clearrequest"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Material requisition software demo',
          description: 'A live demonstration of requesting materials, approving them, and issuing them from the store.',
        }}
      />
      <PageIntro eyebrow="ClearRequest" title="Approve the request before the store issues it.">
        <p>A requester asks. An approver decides. The store issues what was approved, including a partial issue.</p>
        <p>The demo is not one company. Choose construction, distribution, manufacturing, or logistics. The steps stay the same.</p>
        <p>Try that path now. If it matches how your business works, request the same module.</p>
      </PageIntro>
      <Container className="grid gap-10 py-16 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm leading-relaxed text-muted">
              Digitize material requests, streamline approvals, and manage fulfilment with greater
              visibility and accountability.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/demo/clearrequest" className={robesAction}>
                Try the live demo
              </Link>
              <Link to="/robes/contact?service=clearrequest&intent=similar" className={secondaryAction}>
                Request this for your business
              </Link>
            </div>
          </div>
          <Preview />
        </div>

        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">
              Material requests get lost in chat and paper. A manager cannot see what is waiting,
              and stores can issue something that was never approved. The demonstration shows one
              record moving through request, decision, and issue.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-ink">What you can try</h2>
            <ul className="mt-4 space-y-3 text-muted">
              {capabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">Industries</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {industries.map((item) => (
                <li key={item} className="border border-line px-3 py-2 text-sm">
                  {item}
                </li>
              ))}
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
        <p className="font-serif text-xl text-ink">ClearRequest</p>
        <p className="text-xs tracking-wide text-robes uppercase">Pending</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <PreviewStat value="2" label="Waiting" />
        <PreviewStat value="1" label="To issue" />
        <PreviewStat value="2" label="Done" />
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <PreviewRow code="Harbour Works" label="Construction" />
        <PreviewRow code="Mile 12 Provisions" label="Distribution" />
        <PreviewRow code="Lekki Stitch" label="Manufacturing" />
        <PreviewRow code="Sahel Haulage" label="Logistics" />
      </div>
    </div>
  )
}

function PreviewStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-line px-2 py-3">
      <p className="font-serif text-2xl text-ink">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  )
}

function PreviewRow({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex items-center justify-between border-t border-line pt-2">
      <span className="font-medium">{code}</span>
      <span className="text-muted">{label}</span>
    </div>
  )
}
