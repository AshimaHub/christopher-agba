import { Link } from 'react-router-dom'
import { CtaBand } from '../components/CtaBand.tsx'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Portrait } from '../components/Portrait.tsx'
import { Seo } from '../components/Seo.tsx'
import { site } from '../content/site.ts'
import { robesLink, textLink } from '../lib/styles.ts'

export function AboutPage() {
  return (
    <>
      <Seo
        title={`About · ${site.name}`}
        description="Christopher Agba is an enterprise software engineer and business systems consultant based in Abuja, Nigeria."
        path="/about"
      />
      <PageIntro eyebrow="About" title="Technology, applied to how a business actually runs.">
        <p>{site.about.lead}</p>
      </PageIntro>
      <Container className="grid gap-12 py-16 md:grid-cols-[0.85fr_1.15fr] md:py-20">
        <figure>
          <Portrait
            alt="Portrait of Christopher Agba"
            priority
            className="aspect-[4/5] w-full border border-line"
          />
          <figcaption className="mt-3 text-sm text-muted">
            {site.name} · {site.location}
          </figcaption>
        </figure>
        <div className="space-y-5 text-lg leading-relaxed text-muted">
          {site.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            <Link to="/solutions#process" className={textLink}>
              See how an engagement works
            </Link>
          </p>
          <p>
            <Link to="/robes" className={robesLink}>
              Robes Leadership | Technology
            </Link>
          </p>
        </div>
      </Container>
      <section className="border-t border-line" aria-labelledby="expertise-heading">
        <Container className="py-16 md:py-20">
          <h2 id="expertise-heading" className="font-serif text-4xl text-ink">
            Technical expertise
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            The first three groups are the core of my client work. The last group is broader
            background, not a separate service line.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {site.expertise.map((group) => (
              <article key={group.title} className="border border-line p-6">
                <h3 className="font-medium text-ink">{group.title}</h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  )
}
