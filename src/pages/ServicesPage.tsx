import { Link } from 'react-router-dom'
import { CtaBand } from '../components/CtaBand.tsx'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { ProblemsSection, ProcessSection } from '../components/PracticeSections.tsx'
import { Seo } from '../components/Seo.tsx'
import { site } from '../content/site.ts'
import { secondaryAction } from '../lib/styles.ts'

const offers = [
  {
    title: 'Business Process & Automation Consultation',
    text: 'A direct look at the workflow, the current tools, and where manual work is slowing the operation. You leave with a recommendation a decision-maker can use, not a fixed package.',
    deliverables: ['A walkthrough of the current process', 'The points where work waits or gets re-entered', 'A written recommendation and, if a build is justified, a proposed scope'],
    suited: 'Owners and operations managers who need a clear choice before commissioning software.',
    href: '/contact?service=technical-consulting-support',
  },
  {
    title: 'Custom Enterprise Software Implementation',
    text: 'A workflow application, operational system, dashboard, or integration designed around one business. ClearRequest is an example of the kind of workflow that can be commissioned. It is not a product you subscribe to today.',
    deliverables: ['An agreed scope for one operation', 'A working application or module your staff can use', 'Handover notes another developer can maintain'],
    suited: 'Growing companies, construction and logistics operations, and teams whose process does not fit a generic product.',
    href: '/contact?service=custom-business-software',
  },
  {
    title: 'AI Integration & Software Support',
    text: 'Source-grounded assistants where documents are the real problem, plus care for software after delivery. AI work is scoped as engineering. No assistant is offered here as a finished product.',
    deliverables: ['A design for answers that show their source, when that is the problem', 'Fixes, small improvements, and support within an agreed scope', 'A path to keep a live system changeable'],
    suited: 'Teams that already depend on internal software, or that want staff to find answers in their own documents.',
    href: '/contact?service=technical-consulting-support',
  },
]

export function ServicesPage() {
  return (
    <>
      <Seo
        title={`Services · ${site.name}`}
        description="Consultation, custom enterprise software, and ongoing support from Christopher Agba. No fixed prices are published."
        path="/services"
      />
      <PageIntro eyebrow="Services" title="Three ways to start.">
        <p>
          Fees are proposed after the problem is clear. Nothing on this page is a fixed package or a
          claimed result from a client list.
        </p>
      </PageIntro>
      <Container className="grid gap-5 py-16 md:py-20">
        {offers.map((offer) => (
          <article key={offer.title} className="border border-line bg-card p-6 sm:p-8">
            <h2 className="font-serif text-3xl text-ink">{offer.title}</h2>
            <p className="mt-4 max-w-3xl text-muted">{offer.text}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {offer.deliverables.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="mt-4 text-sm text-muted">{offer.suited}</p>
            <Link to={offer.href} className={`${secondaryAction} mt-6`}>Discuss this service</Link>
          </article>
        ))}
        <p className="max-w-3xl text-sm text-muted">{site.serviceNote}</p>
      </Container>
      <ProblemsSection />
      <ProcessSection />
      <CtaBand />
    </>
  )
}
