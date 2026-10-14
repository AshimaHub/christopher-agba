import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { Seo } from '../components/Seo.tsx'
import { site } from '../content/site.ts'
import { primaryAction } from '../lib/styles.ts'

export function NotFoundPage() {
  return (
    <>
      <Seo
        title={`Page not found · ${site.name}`}
        description="The page you requested is not on this website."
        path="/404"
      />
      <Container className="py-24">
        <p className="text-xs font-medium tracking-[0.18em] text-brass uppercase">404</p>
        <h1 className="mt-4 font-serif text-5xl text-ink">This page is not here.</h1>
        <p className="mt-4 max-w-xl text-muted">
          The link may be out of date. You can return home or go straight to a project conversation.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/" className={primaryAction}>
            Back home
          </Link>
          <Link to="/contact" className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline underline-offset-4">
            Discuss your project
          </Link>
        </div>
      </Container>
    </>
  )
}
