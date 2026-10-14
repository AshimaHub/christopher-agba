import { CtaBand } from '../components/CtaBand.tsx'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { ProblemsSection, ProcessSection, WhySection } from '../components/PracticeSections.tsx'
import { Seo } from '../components/Seo.tsx'
import { ServiceCard } from '../components/ServiceCard.tsx'
import { site } from '../content/site.ts'

export function SolutionsPage() {
  return (
    <>
      <Seo
        title={`Solutions · ${site.name}`}
        description="Custom business software, process automation, modernization, API integration, consulting, and backend engineering partnerships with Christopher Agba."
        path="/solutions"
      />
      <PageIntro eyebrow="Solutions" title="Services shaped around the business problem.">
        <p>
          Hire me to simplify an operation, modernize a system your team already depends on, or add
          backend capacity to an engineering group. Every engagement starts with the problem, then
          a scoped proposal.
        </p>
      </PageIntro>
      <ProblemsSection />
      <ProcessSection />
      <WhySection />
      <Container className="py-16 md:py-20">
        <div className="grid gap-5">
          {site.services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} variant="full" />
          ))}
        </div>
        <p className="mt-10 max-w-3xl border-t border-line pt-8 leading-relaxed text-muted">
          {site.serviceNote} Company projects can also be discussed through Robes Leadership |
          Technology.
        </p>
      </Container>
      <CtaBand />
    </>
  )
}
