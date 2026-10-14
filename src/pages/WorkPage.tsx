import { CaseStudyCard } from '../components/CaseStudyCard.tsx'
import { CtaBand } from '../components/CtaBand.tsx'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { getPublishedCaseStudies, site } from '../content/site.ts'

export function WorkPage() {
  const studies = getPublishedCaseStudies()

  return (
    <>
      <Seo
        title={`Selected Work · ${site.name}`}
        description="Selected professional experience and clearly labelled demonstrations from Christopher Agba. Confidential details and unverified results are not published."
        path="/work"
      />
      <PageIntro eyebrow="Selected work" title="What I have done, and what is only a demonstration.">
        <p>
          Professional experience describes real responsibility, with confidential details withheld.
          Independent demonstrations show how I approach a business problem. They are not client
          projects, and they do not claim measured results.
        </p>
      </PageIntro>
      <Container className="py-16 md:py-20">
        {studies.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {studies.map((study) => (
              <CaseStudyCard key={study.slug} study={study} level={2} />
            ))}
          </div>
        ) : (
          <p className="max-w-2xl text-muted">
            Case studies will appear here when they are marked published in the site content file.
          </p>
        )}
      </Container>
      <CtaBand />
    </>
  )
}
