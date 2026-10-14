import { Link } from 'react-router-dom'
import { CaseStudyCard } from '../components/CaseStudyCard.tsx'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { RobesLogo } from '../components/RobesLogo.tsx'
import { Seo } from '../components/Seo.tsx'
import { getPublishedCaseStudies } from '../content/site.ts'
import { brandJsonLd, robes } from '../content/robes.ts'
import { robesAction, robesLink, textLink } from '../lib/styles.ts'

export function RobesHomePage() {
  const studies = getPublishedCaseStudies()

  return (
    <>
      <Seo
        title={`${robes.name}`}
        description={robes.proposition}
        path="/robes"
        jsonLd={brandJsonLd()}
      />
      <PageIntro eyebrow={robes.name} title={robes.proposition}>
        <p>{robes.status}</p>
      </PageIntro>
      <Container className="grid items-center gap-10 border-b border-line py-14 md:grid-cols-[auto_1fr]">
        <RobesLogo variant="green" className="h-20 w-auto max-w-[16rem] object-contain object-left" />
        <p className="max-w-2xl text-lg leading-relaxed text-muted">
          Christopher Agba is the technology professional behind Robes. The brand is being built so
          it can grow beyond one person: its own clients, and in time its own people and products.
          Today the commercial work is technology. The leadership work is a direction, not a menu
          of programmes.
        </p>
      </Container>

      <section className="border-b border-line">
        <Container className="grid gap-8 py-16 md:grid-cols-2 md:py-20">
          <article>
            <h2 className="font-serif text-3xl text-ink">Vision</h2>
            <p className="mt-4 leading-relaxed text-muted">{robes.vision}</p>
          </article>
          <article>
            <h2 className="font-serif text-3xl text-ink">Mission</h2>
            <p className="mt-4 leading-relaxed text-muted">{robes.mission}</p>
          </article>
        </Container>
      </section>

      <section className="border-b border-line">
        <Container className="grid gap-6 py-16 md:grid-cols-2 md:py-20">
          <article className="border border-line p-6 sm:p-8">
            <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Pillar 1</p>
            <h2 className="mt-3 font-serif text-3xl text-ink">Technology</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Software and consulting a business can hire now: systems, automation, modernization,
              integrations, and support. The point is efficiency, visibility, reliability, and room
              to grow.
            </p>
            <Link to="/robes/solutions" className={`${robesLink} mt-6 inline-flex`}>
              Explore Our Solutions
            </Link>
          </article>
          <article className="border border-line p-6 sm:p-8">
            <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Pillar 2</p>
            <h2 className="mt-3 font-serif text-3xl text-ink">Leadership</h2>
            <p className="mt-4 leading-relaxed text-muted">
              The future development of Robes: leadership, technology judgment, and the growth of
              people inside organizations. This pillar is a vision. It is not a list of courses or
              retainers on sale today.
            </p>
            <Link to="/robes/leadership" className={`${robesLink} mt-6 inline-flex`}>
              Read the leadership direction
            </Link>
          </article>
        </Container>
      </section>

      <section className="border-b border-line" aria-labelledby="robes-problems">
        <Container className="py-16 md:py-20">
          <h2 id="robes-problems" className="max-w-2xl font-serif text-4xl leading-tight text-ink">
            Business problems Robes is here to work on
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {robes.problems.map((problem) => (
              <article key={problem.title} className="border border-line bg-card p-6">
                <h3 className="font-serif text-2xl leading-tight text-ink">{problem.title}</h3>
                <p className="mt-3 text-muted">{problem.detail}</p>
                <p className="mt-4 border-t border-line pt-4 text-sm text-ink">
                  <span className="font-medium text-robes">Value. </span>
                  {problem.value}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line" id="approach">
        <Container className="grid gap-10 py-16 md:py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Our approach</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-ink">
              From the operational problem to a scoped piece of work
            </h2>
          </div>
          <ol className="space-y-6">
            {robes.approach.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line pt-6">
                <span className="font-serif text-2xl text-robes">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-medium text-ink">{step.title}</h3>
                  <p className="mt-2 text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-line">
        <Container className="py-16 md:py-20">
          <h2 className="max-w-2xl font-serif text-4xl leading-tight text-ink">
            Projects and capabilities
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            These come from Christopher Agba’s professional work. They show the kind of systems
            Robes is being built to deliver. They are not a client list, and they do not include
            private company detail.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {studies.map((study) => (
              <CaseStudyCard key={study.slug} study={study} level={3} />
            ))}
          </div>
          <Link to="/work" className={`${textLink} mt-8 inline-flex`}>
            Read the case studies in the portfolio
          </Link>
        </Container>
      </section>

      <section className="border-b border-line">
        <Container className="py-16 md:py-20">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">
            Future initiatives
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink">{robes.productVision.title}</h2>
          <p className="mt-4 max-w-2xl text-muted">{robes.productVision.text}</p>
        </Container>
      </section>

      <section className="bg-band text-band-ink">
        <Container className="py-16 md:py-20">
          <h2 className="max-w-2xl font-serif text-4xl leading-tight">
            Have a business challenge? Start with the operation, not a feature list.
          </h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/robes/contact" className={robesAction}>
              Discuss Your Business Challenge
            </Link>
            <Link to="/robes/solutions" className="inline-flex min-h-11 items-center text-sm font-medium text-band-ink underline underline-offset-4">
              Explore Our Solutions
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
