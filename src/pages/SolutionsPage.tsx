import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { site } from '../content/site.ts'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const solutions = [
  {
    name: 'ClearRequest',
    kind: 'Working demonstration',
    problem: 'Internal requests sit in inboxes, so nobody can see who is waiting or what was decided.',
    customers: 'Organizations with multilevel approvals and a need for a record.',
    features: ['Request, approve, and issue on one path', 'A status a manager can see', 'An activity trail'],
    benefit: 'Less chasing, and a record that does not depend on one person’s messages.',
    primary: { to: '/robes/solutions/clearrequest', label: 'Explore ClearRequest' },
    secondary: { to: '/robes/demo/clearrequest', label: 'Try the live demo' },
  },
  {
    name: 'Operations Hub',
    kind: 'Solution concept, with related demos',
    problem: 'Stock, requisitions, and movement across sites are hard to see when each book is separate.',
    customers: 'Construction, logistics, distribution, and multi-site operations.',
    features: ['Stock that explains its own balance', 'Related demos for fuel, fleet, and shift records', 'Fictional businesses only'],
    benefit: 'A way to discuss operational visibility before a full system is scoped.',
    primary: { to: '/robes/demo/siteledger', label: 'Try the stock demo' },
    secondary: { to: '/robes/solutions/operations-hub', label: 'Explore Operations Hub' },
  },
  {
    name: 'KnowledgeDesk AI',
    kind: 'Solution concept',
    problem: 'Staff cannot find an answer that already exists in the organization’s documents.',
    customers: 'Teams that want source-grounded answers for authorized staff.',
    features: ['Answers tied to a source', 'Designed for internal documents', 'No live assistant on this site yet'],
    benefit: 'A clear brief for an assistant that does not invent an unsupported answer.',
    primary: { to: '/robes/solutions/knowledgedesk', label: 'Request a Demo' },
    secondary: { to: '/contact?service=custom-business-software', label: 'Request a Consultation' },
  },
]

export function SolutionsPage() {
  return (
    <>
      <Seo
        title={`Solutions · ${site.name}`}
        description="ClearRequest, Operations Hub, and KnowledgeDesk AI. Working demos are labelled. Concepts without a demo do not pretend to be live products."
        path="/solutions"
      />
      <PageIntro eyebrow="Solutions" title="Solutions built around real business challenges.">
        <p>
          ClearRequest is the leading demonstration. Operations Hub groups related operational demos.
          KnowledgeDesk AI is a concept only. Commercial services are listed separately.
        </p>
      </PageIntro>
      <Container className="grid gap-6 py-16 md:py-20">
        {solutions.map((item) => (
          <article key={item.name} className="border border-line bg-card p-6 sm:p-8">
            <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">{item.kind}</p>
            <h2 className="mt-3 font-serif text-3xl text-ink">{item.name}</h2>
            <p className="mt-4 max-w-3xl text-muted">{item.problem}</p>
            <p className="mt-3 text-sm text-muted">For: {item.customers}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {item.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <p className="mt-4 text-muted">{item.benefit}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={item.primary.to} className={robesAction}>{item.primary.label}</Link>
              <Link to={item.secondary.to} className={secondaryAction}>{item.secondary.label}</Link>
            </div>
          </article>
        ))}
        <p className="text-sm text-muted">
          <Link to="/robes/solutions" className="text-accent underline underline-offset-4">All working demonstrations</Link>
          {' · '}
          <Link to="/services" className="text-accent underline underline-offset-4">Services and how an engagement starts</Link>
        </p>
      </Container>
    </>
  )
}
