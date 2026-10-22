import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const capabilities = [
  'Requests, expenses, dispatches, and fuel issues sit in one waiting list.',
  'Each row shows who raised it and how many days it has been waiting.',
  'Anything waiting five days or more is marked late.',
  'Approve or return takes that item out of the list. A remark is required.',
  'The person who raised an item cannot clear it.',
]

const industries = ['Construction', 'Distribution', 'Manufacturing', 'Logistics', 'Any firm with more than one approver']

export function WaitingPage() {
  return (
    <>
      <Seo
        title="Waiting inbox software demo · Waiting On You"
        description="See what is waiting on you, which item is late, and approve or return it in one action. Try the live demo, then request it for your business."
        path="/robes/solutions/waiting"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Waiting inbox software demo',
          description: 'A live demonstration of one inbox for items waiting on an approver.',
        }}
      />
      <PageIntro eyebrow="Waiting On You" title="See what is stuck before someone calls.">
        <p>Approvals live in separate books. This inbox puts them in one list, oldest first, and a late item stays visible until it is cleared.</p>
        <p>The demo is not one company. Choose construction, distribution, manufacturing, or logistics, then clear that company's waiting list.</p>
        <p>Try the inbox now. If stuck work still surfaces in a phone call, request this module for your business.</p>
      </PageIntro>
      <Container className="grid gap-10 py-16 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm leading-relaxed text-muted">
              Every waiting item has an owner, an age, and one action. Approving it or returning it
              removes it from the list. The demo does not replace the request, expense, or dispatch record behind it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/demo/waiting" className={robesAction}>Try the live demo</Link>
              <Link to="/robes/contact?service=waiting&intent=similar" className={secondaryAction}>Request this for your business</Link>
            </div>
          </div>
          <Preview />
        </div>
        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">
              A manager learns about a stuck request only when someone calls. The age of the work
              is hidden inside whichever book it was raised in.
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
              React, TypeScript, and data stored in this browser. The items are fictional and the
              clock is fixed on 22 October 2026 so the late item stays late. Resetting the demo
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
        <p className="font-serif text-xl text-ink">WO-18</p>
        <p className="text-xs tracking-wide text-robes uppercase">Late</p>
      </div>
      <p className="mt-3 text-sm text-muted">Cement for the pump station · Adaeze Okonkwo</p>
      <p className="mt-4 font-serif text-3xl text-ink">6 days</p>
      <p className="mt-2 text-sm text-muted">Two newer items are also waiting. This one is the oldest.</p>
    </div>
  )
}
