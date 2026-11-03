import { Link } from 'react-router-dom'
import { CtaBand } from '../components/CtaBand.tsx'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Portrait } from '../components/Portrait.tsx'
import { Seo } from '../components/Seo.tsx'
import { personJsonLd, site } from '../content/site.ts'
import { robesLink, textLink } from '../lib/styles.ts'

export function AboutPage() {
  return (
    <>
      <Seo
        title={`About · ${site.name}`}
        description="Christopher Agba is an enterprise software engineer, AI and business automation specialist, and technology founder based in Abuja, Nigeria."
        path="/about"
        jsonLd={personJsonLd()}
      />
      <PageIntro eyebrow="Christopher Agba" title="The person behind the systems.">
        <p>
          Enterprise software engineer, based in Abuja. Background, expertise, and the professional
          record live on this page.
        </p>
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
          <section>
            <h2 className="font-serif text-3xl text-ink">Engineering approach</h2>
            <p className="mt-3">{site.about.approach}</p>
          </section>
          <section>
            <h2 className="font-serif text-3xl text-ink">Leadership philosophy</h2>
            <p className="mt-3">{site.about.leadership}</p>
          </section>
          <section>
            <h2 className="font-serif text-3xl text-ink">Career direction and founder vision</h2>
            <p className="mt-3">{site.about.direction}</p>
          </section>
          <p>
            <Link to="/services" className={textLink}>
              See how an engagement works
            </Link>
          </p>
          <p>
            <Link to="/robes" className={robesLink}>
              Robes Leadership & Technology
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
            PHP, MySQL, and enterprise operational systems are the confirmed base. AI and
            source-grounded assistants are a direction being designed, not a list of delivered products.
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
