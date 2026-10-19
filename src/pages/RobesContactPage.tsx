import { useSearchParams } from 'react-router-dom'
import { ContactForm } from '../components/ContactForm.tsx'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robes, robesServiceChoices } from '../content/robes.ts'
import { site } from '../content/site.ts'

export function RobesContactPage() {
  const [params] = useSearchParams()

  return (
    <>
      <Seo
        title={`Contact Robes · ${robes.name}`}
        description="Request a consultation with Robes Leadership | Technology about business software, integrations, or an operational challenge."
        path="/robes/contact"
      />
      <PageIntro eyebrow="Work with Robes" title="Discuss your business challenge.">
        <p>
          Use this form for software projects, enterprise solutions, and commercial inquiries under
          the Robes brand. Employment and personal collaborations belong on Contact Christopher.
          The message is prepared for {site.contact.email}. It is not stored on a server.
        </p>
      </PageIntro>
      <Container className="grid gap-12 py-16 md:py-20 lg:grid-cols-[1.2fr_0.8fr]">
        <ContactForm
          key={`${params.get('service') ?? 'robes'}-${params.get('intent') ?? ''}`}
          pathway="robes"
          choices={robesServiceChoices()}
        />
        <aside className="h-fit border border-line border-t-4 border-t-robes-fill bg-card p-6 sm:p-8">
          <h2 className="font-serif text-3xl text-ink">What happens next</h2>
          <ol className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
            <li>You describe the operational problem.</li>
            <li>Christopher replies with a practical next step.</li>
            <li>If the work fits, you receive a scoped proposal. There is no public price list.</li>
          </ol>
          <p className="mt-6 text-sm text-ink">{site.contact.email}</p>
          <p className="mt-1 text-sm text-ink">{site.contact.phoneDisplay}</p>
          <p className="mt-1 text-sm text-muted">{site.contact.location}</p>
        </aside>
      </Container>
    </>
  )
}
