import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction, textLink } from '../lib/styles.ts'

const customers = [
  'Construction and engineering teams that request materials for a job',
  'Distribution and logistics operations with a store and an approver',
  'Growing companies whose requests still live in chat, paper, or email',
]

const capabilities = [
  'Submit a request with the materials, quantities, and a reason',
  'Approve or reject it in writing, so the decision has an owner',
  'Issue all or part of an approved request, without issuing a rejection',
  'See status, history, and a simple report from the same record',
]

const benefits = [
  'A manager can see what is waiting without calling the store',
  'Stores issue only what was approved',
  'The trail of the request does not depend on one person’s messages',
]

const experience = [
  'Choose one of four fictional sample businesses',
  'Act as requester, approver, or storekeeper',
  'Follow a short guided path, or explore the screens freely',
  'Reset the sample at any time. Nothing is saved to a server',
]

export function ClearRequestPage() {
  return (
    <>
      <Seo
        title="ClearRequest · Workflow and approval demonstration"
        description="ClearRequest is a working demonstration of material requests, multilevel approval, and store issue. Records are fictional. Ask Christopher Agba about an implementation for your operation."
        path="/robes/solutions/clearrequest"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'ClearRequest',
          description: 'A working demonstration of requesting materials, approving them, and issuing them from the store.',
        }}
      />
      <PageIntro eyebrow="Flagship demonstration" title="ClearRequest keeps a request visible until it is decided and issued.">
        <p>
          Internal requests get lost when they live in inboxes. ClearRequest is the working model of
          a better path: someone asks, someone decides, and the store issues only what was approved.
        </p>
        <p>
          This is a portfolio demonstration with fictional businesses and fictional records. It is
          not a client result, and it does not claim measured savings.
        </p>
      </PageIntro>
      <Container className="grid gap-12 py-16 md:py-20">
        <div className="flex flex-wrap gap-3">
          <Link to="/robes/demo/clearrequest" className={robesAction}>Try the live demo</Link>
          <Link to="/robes/contact?service=clearrequest&intent=similar" className={secondaryAction}>Request a Consultation</Link>
          <Link to="/contact" className={secondaryAction}>Discuss Your Project</Link>
        </div>

        <section className="grid gap-8 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The business problem</h2>
            <p className="mt-4 text-muted">
              A material request that sits in chat has no status. A manager cannot see what is
              waiting. A store can issue something that was never approved, or wait because nobody
              can find the decision.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-ink">Who it is for</h2>
            <ul className="mt-4 space-y-3 text-muted">
              {customers.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>

        <section className="grid gap-8 border-t border-line pt-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-serif text-3xl text-ink">Key capabilities</h2>
            <ul className="mt-4 space-y-3 text-muted">
              {capabilities.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <h2 className="mt-10 font-serif text-3xl text-ink">Business benefits</h2>
            <ul className="mt-4 space-y-3 text-muted">
              {benefits.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <Preview />
        </section>

        <section className="border-t border-line pt-10">
          <h2 className="font-serif text-3xl text-ink">How an organization commissions it</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-5">
            {[
              ['1', 'Explore', 'Read the problem this workflow is meant to solve.', '/robes/solutions/clearrequest'],
              ['2', 'Experience', 'Try the fictional demonstration.', '/robes/demo/clearrequest'],
              ['3', 'Discuss', 'Describe how requests move in your business.', '/robes/contact?service=clearrequest&intent=workflow'],
              ['4', 'Proposal', 'Receive a scope before any build starts.', '/robes/contact?service=clearrequest&intent=similar'],
              ['5', 'Paid pilot', 'A bounded build for one operation, if the proposal fits.', '/robes/contact?service=clearrequest&intent=pilot'],
            ].map(([step, title, text, to]) => (
              <li key={step} className="border border-line p-4">
                <p className="text-xs font-medium tracking-[0.14em] text-accent uppercase">{step}</p>
                <h3 className="mt-2 font-medium text-ink">{title}</h3>
                <p className="mt-2 text-sm text-muted">{text}</p>
                <Link to={to} className={`${textLink} mt-3 inline-flex text-sm`}>Continue</Link>
              </li>
            ))}
          </ol>
          <p className="mt-4 max-w-3xl text-sm text-muted">
            A paid pilot is a commissioned implementation of this kind of workflow. ClearRequest is not a commercially deployed subscription product.
          </p>
        </section>

        <section className="border-t border-line pt-10">
          <h2 className="font-serif text-3xl text-ink">Implementation process</h2>
          <ol className="mt-4 max-w-3xl space-y-3 text-muted">
            <li>Confirm the request, the approver, and what the store is allowed to issue.</li>
            <li>Agree the records, roles, and what is out of scope.</li>
            <li>Build the path on your data, not on the fictional sample businesses.</li>
            <li>Test the request, decision, and issue with the people who will use it.</li>
            <li>Hand over the system with a support period written into the proposal.</li>
          </ol>
        </section>

        <section className="border-t border-line pt-10">
          <h2 className="font-serif text-3xl text-ink">What you can experience in the demo</h2>
          <ul className="mt-4 max-w-3xl space-y-3 text-muted">
            {experience.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="mt-4 max-w-3xl text-sm text-muted">
            The demonstration runs in your browser. There is no account. Implementation for a real
            operation is a separate conversation, scoped to that business.
          </p>
        </section>

        <section className="border border-line bg-card p-6 sm:p-8">
          <h2 className="font-serif text-3xl text-ink">Ask about an implementation</h2>
          <p className="mt-4 max-w-3xl text-muted">
            If this path matches how your organization requests and issues materials, the next step
            is a consultation and, if it fits, a written proposal for a paid pilot. The inquiry is
            delivered only when the form confirms it, or when you send the email yourself.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/contact?service=clearrequest&intent=pilot" className={robesAction}>Request a paid pilot</Link>
            <Link to="/robes/contact?service=clearrequest&intent=similar" className={secondaryAction}>Request a Consultation</Link>
            <Link to="/work" className={secondaryAction}>View My Work</Link>
          </div>
          <p className="mt-6 text-sm text-muted">
            <Link to="/services" className={textLink}>See the services you can hire</Link>
          </p>
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
      <div className="mt-4 space-y-2 text-sm">
        <PreviewRow code="Requested" label="Waiting for a decision" />
        <PreviewRow code="Approved" label="Ready for the store" />
        <PreviewRow code="Issued" label="Recorded against stock" />
      </div>
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
