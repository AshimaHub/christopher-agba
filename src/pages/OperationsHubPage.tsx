import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const related = [
  ['Stock ledger', '/robes/demo/siteledger'],
  ['Fuel issues', '/robes/demo/fuelwatch'],
  ['Morning fleet board', '/robes/demo/fleetboard'],
  ['Shift close', '/robes/demo/plantday'],
]

export function OperationsHubPage() {
  return (
    <>
      <Seo
        title="Operations Hub · Christopher Agba"
        description="A solution concept for stock visibility, requisitions, and multi-site operations. Related demos use fictional records."
        path="/robes/solutions/operations-hub"
      />
      <PageIntro eyebrow="Solution concept" title="Operations Hub">
        <p>
          An enterprise software concept for stock visibility, requisitions, dispatch coordination,
          and multi-site operations. It is not a single finished product. The demos below are
          separate working models with fictional businesses.
        </p>
      </PageIntro>
      <Container className="grid gap-8 py-16 md:py-20">
        <section className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">Materials, issues, and machine time are argued about because each record lives somewhere else.</p>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-ink">Who it is for</h2>
            <p className="mt-4 text-muted">Construction, logistics, distribution, and any operation that runs more than one site or store.</p>
          </div>
        </section>
        <div className="flex flex-wrap gap-3">
          {related.map(([label, to]) => (
            <Link key={to} to={to} className={secondaryAction}>{label}</Link>
          ))}
        </div>
        <Link to="/contact?service=custom-business-software" className={robesAction}>Discuss this for your business</Link>
      </Container>
    </>
  )
}
