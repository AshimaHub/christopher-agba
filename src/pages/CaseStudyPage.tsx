import { Link, useParams } from 'react-router-dom'
import { CtaBand } from '../components/CtaBand.tsx'
import { Container } from '../components/Layout.tsx'
import { Seo } from '../components/Seo.tsx'
import { getCaseStudy, site } from '../content/site.ts'
import { textLink } from '../lib/styles.ts'
import { NotFoundPage } from './NotFoundPage.tsx'

export function CaseStudyPage() {
  const { slug } = useParams()
  const study = slug ? getCaseStudy(slug) : undefined

  if (!study) return <NotFoundPage />

  return (
    <>
      <Seo title={`${study.title} · ${site.name}`} description={study.summary} path={`/work/${study.slug}`} />
      <article>
        <Container className="py-16 md:py-24">
          <Link to="/work" className={textLink}>
            Back to selected work
          </Link>
          <p className="mt-8 text-xs font-medium tracking-[0.16em] text-brass uppercase">
            {study.statusLabel}
          </p>
          <p className="mt-3 text-sm text-muted">{study.sector}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.05] font-medium tracking-[-0.03em] text-ink">
            {study.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{study.summary}</p>

          <div className="mt-12 grid gap-8 border-t border-line pt-10 md:grid-cols-3">
            <Section label="The challenge" text={study.challenge} />
            <Section label="My responsibility" text={study.responsibility} />
            <Section label="The approach" text={study.approach} />
          </div>

          <div className="mt-12 border-t border-line pt-10">
            <h2 className="text-xs font-medium tracking-[0.16em] text-brass uppercase">Technologies</h2>
            <p className="mt-3 max-w-3xl text-ink">{study.technologies.join(' · ')}</p>
          </div>

          <div className="mt-12 border-t border-line pt-10">
            <h2 className="font-serif text-3xl text-ink">{study.outcomesLabel}</h2>
            <ul className="mt-5 max-w-3xl space-y-3">
              {study.outcomes.map((outcome) => (
                <li key={outcome} className="border-l border-accent pl-4 text-muted">
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          <aside className="mt-12 border border-line bg-card p-6 text-sm leading-relaxed text-muted">
            {study.note}
          </aside>
        </Container>
      </article>
      <CtaBand />
    </>
  )
}

function Section({ label, text }: { label: string; text: string }) {
  return (
    <section>
      <h2 className="text-xs font-medium tracking-[0.16em] text-brass uppercase">{label}</h2>
      <p className="mt-3 leading-relaxed text-muted">{text}</p>
    </section>
  )
}
