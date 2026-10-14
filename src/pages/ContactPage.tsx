import { Link, useSearchParams } from 'react-router-dom'
import { ContactForm } from '../components/ContactForm.tsx'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { serviceChoices, site, socialLinks } from '../content/site.ts'
import { robesLink } from '../lib/styles.ts'

export function ContactPage() {
  const [params] = useSearchParams()

  return (
    <>
      <Seo
        title={`Contact Christopher · ${site.name}`}
        description="Contact Christopher Agba about employment, technical collaboration, individual consulting, or a professional introduction."
        path="/contact"
      />
      <PageIntro eyebrow="Contact Christopher" title="A conversation with me, not with a company inbox.">
        <p>
          Use this form for employment, technical collaboration, individual consulting, speaking,
          or a professional introduction. For a business software project under the Robes brand,{' '}
          <Link to="/robes/contact" className={robesLink}>
            contact Robes
          </Link>
          {'.'}
        </p>
      </PageIntro>
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr] md:py-20">
        <ContactForm
          key={params.get('service') ?? 'general'}
          pathway="personal"
          choices={serviceChoices()}
        />
        <aside className="h-fit border border-line bg-card p-6 sm:p-8">
          <h2 className="font-serif text-3xl text-ink">Direct contact</h2>
          <dl className="mt-6 space-y-5 text-sm">
            <div>
              <dt className="text-brass">Email</dt>
              <dd className="mt-1">
                <a className="text-ink underline underline-offset-4" href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-brass">Phone</dt>
              <dd className="mt-1">
                <a className="text-ink underline underline-offset-4" href={`tel:${site.contact.phoneTel}`}>
                  {site.contact.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-brass">WhatsApp</dt>
              <dd className="mt-1">
                <a
                  className="text-ink underline underline-offset-4"
                  href={`${site.contact.whatsapp}?text=${encodeURIComponent('Hello Christopher, I would like to discuss a business software need.')}`}
                >
                  Message on WhatsApp
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-brass">Location</dt>
              <dd className="mt-1 text-ink">{site.contact.location}</dd>
            </div>
          </dl>
          {socialLinks().length > 0 ? (
            <div className="mt-8 border-t border-line pt-6">
              <h3 className="text-sm font-medium text-ink">Elsewhere</h3>
              <ul className="mt-3 space-y-2">
                {socialLinks().map((profile) => (
                  <li key={profile.href}>
                    <a className="text-sm text-accent underline underline-offset-4" href={profile.href} target="_blank" rel="noreferrer">
                      {profile.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {site.contact.resumeUrl ? (
            <a className="mt-6 inline-flex text-sm font-medium text-accent underline underline-offset-4" href={site.contact.resumeUrl}>
              Download résumé
            </a>
          ) : null}
        </aside>
      </Container>
    </>
  )
}
