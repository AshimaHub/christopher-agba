import { Link } from 'react-router-dom'
import { CaseStudyCard } from '../components/CaseStudyCard.tsx'
import { Container } from '../components/Layout.tsx'
import { OperationsVisual } from '../components/OperationsVisual.tsx'
import { Portrait } from '../components/Portrait.tsx'
import { RobesLogo } from '../components/RobesLogo.tsx'
import { SectionHeading } from '../components/SectionHeading.tsx'
import { Seo } from '../components/Seo.tsx'
import { getPublishedCaseStudies, personJsonLd, site } from '../content/site.ts'
import { robes } from '../content/robes.ts'
import { primaryAction, robesAction, robesLink, secondaryAction, textLink } from '../lib/styles.ts'

export function HomePage() {
  return (
    <>
      <Seo
        title={`${site.name} · ${robes.shortName}`}
        description="Christopher Agba is an enterprise software engineer. Robes Leadership | Technology is the business brand he is building."
        path="/"
        jsonLd={personJsonLd()}
      />
      <Hero />
      <Pathways />
      <SelectedWork />
      <Close />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 right-[-6rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_68%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--ink)_7%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--ink)_7%,transparent)_1px,transparent_1px)] bg-[size:84px_84px] [mask-image:radial-gradient(ellipse_at_75%_30%,black,transparent_72%)]" />
      </div>
      <Container className="relative grid items-center gap-14 py-16 lg:min-h-[calc(100svh-7.5rem)] lg:grid-cols-[1.12fr_0.88fr] lg:py-20">
        <div className="rise">
          <div className="flex items-center gap-4">
            <Portrait alt="" className="h-14 w-14" priority />
            <div>
              <p className="font-medium text-ink">{site.name}</p>
              <p className="text-sm text-muted">{site.role}</p>
            </div>
          </div>
          <h1 className="mt-8 max-w-3xl font-serif text-[clamp(2.8rem,6.4vw,5.3rem)] leading-[0.98] font-medium tracking-[-0.035em] text-ink">
            {site.hero.titleStart}{' '}
            <span className="text-accent italic">{site.hero.titleEmphasis}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{site.hero.support}</p>
          <p className="mt-4 max-w-xl text-muted">
            I am Christopher Agba. {robes.name} is the business brand I am building around that
            work: technology solutions now, and a leadership vision that is still taking shape.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/about" className={primaryAction}>
              Explore My Professional Portfolio
            </Link>
            <Link to="/robes" className={secondaryAction}>
              Discover Robes
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted">{site.hero.availability}</p>
        </div>
        <div className="rise rise-delay">
          <OperationsVisual />
        </div>
      </Container>
    </section>
  )
}

function Pathways() {
  return (
    <section className="border-b border-line" aria-labelledby="pathways-heading">
      <Container className="py-16 md:py-24">
        <h2 id="pathways-heading" className="max-w-2xl font-serif text-3xl leading-tight text-ink md:text-4xl">
          Two ways to read this website. One person behind both.
        </h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="flex flex-col border border-line bg-card p-6 sm:p-8">
            <Portrait
              alt="Christopher Agba"
              className="mb-5 aspect-[4/5] w-full max-w-[14rem] border border-line"
            />
            <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">
              Personal portfolio
            </p>
            <h3 className="mt-3 font-serif text-3xl leading-tight text-ink">Christopher Agba</h3>
            <p className="mt-4 leading-relaxed text-muted">
              For employers, recruiters, engineering teams, and people who want the individual
              behind the work: background, expertise, selected projects, and professional services.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-ink">
              <li>Computer Science background and enterprise software experience</li>
              <li>Selected work, told without invented results</li>
              <li>Consulting, collaboration, and career conversations</li>
            </ul>
            <Link to="/about" className={`${textLink} mt-6 inline-flex w-fit`}>
              Explore My Professional Portfolio
            </Link>
          </article>
          <article className="flex flex-col border border-line border-t-4 border-t-robes-fill bg-card p-6 sm:p-8">
            <RobesLogo variant="green" className="mb-5 h-24 w-auto max-w-[16rem] object-contain object-left" />
            <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">
              Business brand
            </p>
            <h3 className="mt-3 font-serif text-3xl leading-tight text-ink">{robes.name}</h3>
            <p className="mt-4 font-serif text-xl leading-snug text-ink">{robes.proposition}</p>
            <p className="mt-4 leading-relaxed text-muted">
              For organizations and partners looking at technology solutions, and at a leadership
              direction that is described as a vision rather than a finished service list.
            </p>
            <Link to="/robes" className={`${robesLink} mt-6 inline-flex w-fit`}>
              Discover Robes Leadership | Technology
            </Link>
          </article>
        </div>
      </Container>
    </section>
  )
}

function SelectedWork() {
  const studies = getPublishedCaseStudies().slice(0, 2)

  return (
    <section className="border-b border-line">
      <Container className="py-20 md:py-24">
        <SectionHeading
          index="01"
          eyebrow="Selected work"
          title="Capability, described honestly"
          text="These examples sit in the personal portfolio. They also show the kind of operational software Robes is being built to deliver. They are not a client roster."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {studies.map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>
        <Link to="/work" className={`${textLink} mt-8 inline-flex`}>
          View selected work
        </Link>
      </Container>
    </section>
  )
}

function Close() {
  return (
    <section className="bg-band text-band-ink">
      <Container className="grid gap-10 py-20 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-band-muted uppercase">
            Contact Christopher
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-tight">Professional opportunities</h2>
          <p className="mt-4 max-w-md text-band-muted">
            Employment, technical collaboration, individual consulting, and introductions.
          </p>
          <Link to="/contact" className={`${primaryAction} mt-6`}>
            Contact Christopher
          </Link>
        </div>
        <div>
          <RobesLogo surface="dark" variant="green" className="h-12 w-auto max-w-[14rem] object-contain object-left" />
          <h2 className="mt-4 font-serif text-4xl leading-tight">A business challenge</h2>
          <p className="mt-4 max-w-md text-band-muted">
            Software projects, operational problems, and commercial conversations under the Robes
            brand.
          </p>
          <Link to="/robes/contact" className={`${robesAction} mt-6`}>
            Request a Consultation
          </Link>
        </div>
      </Container>
    </section>
  )
}
