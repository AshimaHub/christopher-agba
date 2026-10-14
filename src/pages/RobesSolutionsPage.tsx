import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robes } from '../content/robes.ts'
import { robesLink } from '../lib/styles.ts'

export function RobesSolutionsPage() {
  return (
    <>
      <Seo
        title={`Technology solutions · ${robes.name}`}
        description="Enterprise software, automation, custom applications, modernization, integrations, consulting, and support from Robes Leadership | Technology."
        path="/robes/solutions"
      />
      <PageIntro eyebrow="Technology" title="Solutions a business can discuss now.">
        <p>
          Christopher Agba leads this work under the Robes brand. Each solution is framed as a
          business outcome. Scope and fees are proposed after the problem is clear. Nothing here is
          a fixed package or a claimed result from a client list.
        </p>
      </PageIntro>
      <Container className="grid gap-5 py-16 md:py-20">
        {robes.solutions.map((solution, index) => (
          <article
            key={solution.id}
            id={solution.id}
            className="scroll-mt-28 border border-line bg-card p-6 sm:p-8"
          >
            <p className="font-serif text-sm text-robes">{String(index + 1).padStart(2, '0')}</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">{solution.title}</h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">{solution.summary}</p>
            <p className="mt-4 max-w-3xl border-t border-line pt-4 text-ink">
              <span className="font-medium text-robes">Value. </span>
              {solution.outcome}
            </p>
            <Link
              to={`/robes/contact?service=${solution.id}`}
              className={`${robesLink} mt-6 inline-flex`}
            >
              Discuss this solution
            </Link>
          </article>
        ))}
      </Container>
    </>
  )
}
