import { SectionHeading } from './SectionHeading.tsx'
import { Container } from './Layout.tsx'
import { site } from '../content/site.ts'

export function ProblemsSection() {
  return (
    <section className="border-b border-line" aria-labelledby="problems-heading">
      <Container className="py-20 md:py-28">
        <SectionHeading
          id="problems-heading"
          index="01"
          eyebrow="Problems I solve"
          title="Where operations start to drag"
          text="These are the situations I am hired to untangle. Each one has a business cost before it has a technical one."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {site.problems.map((problem) => (
            <article key={problem.title} className="flex h-full flex-col border border-line bg-card p-6 sm:p-7">
              <h3 className="font-serif text-[1.55rem] leading-tight text-ink">{problem.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{problem.detail}</p>
              <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-ink">
                <span className="font-medium text-brass">Value. </span>
                {problem.value}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

export function ProcessSection() {
  return (
    <section id="process" className="scroll-mt-28 border-b border-line">
      <Container className="grid gap-12 py-20 md:py-28 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          index="02"
          eyebrow="How I work"
          title="A clear engagement, from problem to handover"
          text="The process is deliberately simple. It keeps scope, responsibility, and maintenance visible."
        />
        <ol className="space-y-6">
          {site.process.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-line pt-6">
              <span className="font-serif text-2xl text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-medium text-ink">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

export function WhySection() {
  return (
    <section id="why" className="scroll-mt-28 border-b border-line">
      <Container className="py-20 md:py-28">
        <SectionHeading
          index="03"
          eyebrow="Why work with me"
          title="A practical partner for serious operational software"
          text="No manufactured testimonials. These are the standards I work to."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {site.reasons.map((reason, index) => (
            <article key={reason.title} className="border border-line p-6">
              <p className="font-serif text-sm text-accent">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 font-serif text-2xl leading-tight text-ink">{reason.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{reason.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
