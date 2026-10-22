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
          Tell us what&apos;s slowing your business down. Let&apos;s explore how a custom software
          solution can simplify your operations, reduce costs, and help your business run smarter.
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
          <div className="mt-6 grid gap-3">
            <a
              href={`mailto:${site.contact.email}?subject=${encodeURIComponent('Conversation with Robes')}&body=${encodeURIComponent('Hello Robes,\n\n')}`}
              className="rounded-2xl border border-line bg-paper px-4 py-3 transition hover:border-robes"
            >
              <span className="block text-xs font-medium tracking-[0.12em] text-robes uppercase">Email</span>
              <span className="mt-1 block text-lg font-semibold text-ink">{site.contact.email}</span>
              <span className="mt-1 block text-sm text-muted">Click to start a conversation with Robes</span>
            </a>
            <a
              href={`${site.contact.whatsapp}?text=${encodeURIComponent('Hello Robes, I would like to start a conversation about a business challenge.')}`}
              className="rounded-2xl border border-line bg-paper px-4 py-3 transition hover:border-robes"
              target="_blank"
              rel="noreferrer"
            >
              <span className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-robes uppercase">
                <PhoneIcon />
                WhatsApp
              </span>
              <span className="mt-1 block text-lg font-semibold text-ink">{site.contact.phoneDisplay}</span>
              <span className="mt-1 block text-sm text-muted">Click to start a conversation with Robes</span>
            </a>
          </div>
          <p className="mt-4 text-sm text-muted">{site.contact.location}</p>
        </aside>
      </Container>
    </>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3.5h3.2l1.2 3.1-1.8 1.1a12.5 12.5 0 0 0 5.7 5.7l1.1-1.8 3.1 1.2V16a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 5 6.7 2 2 0 0 1 7 3.5Z"
      />
    </svg>
  )
}
