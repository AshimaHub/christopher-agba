import { Link } from 'react-router-dom'
import { site } from '../content/site.ts'
import { bandAction } from '../lib/styles.ts'
import { Container } from './Layout.tsx'

export function CtaBand() {
  return (
    <section className="bg-band text-band-ink" aria-labelledby="final-cta">
      <Container className="py-20 md:py-24">
        <p className="text-xs font-medium tracking-[0.18em] text-band-muted uppercase">
          Next conversation
        </p>
        <h2
          id="final-cta"
          className="mt-4 max-w-3xl font-serif text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.08] font-medium tracking-[-0.03em]"
        >
          {site.ctas.finalTitle}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-band-muted">{site.ctas.finalText}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link to="/contact" className={bandAction}>
            {site.ctas.finalButton}
          </Link>
          <a className="text-sm text-band-ink underline underline-offset-4" href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>
        </div>
      </Container>
    </section>
  )
}
