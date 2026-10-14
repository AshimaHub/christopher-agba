import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robes } from '../content/robes.ts'
import { robesAction } from '../lib/styles.ts'

export function RobesLeadershipPage() {
  return (
    <>
      <Seo
        title={`Leadership direction · ${robes.name}`}
        description="The leadership vision of Robes Leadership | Technology. These areas are a direction for the brand, not programmes currently offered for sale."
        path="/robes/leadership"
      />
      <PageIntro eyebrow="Leadership" title="A direction for the brand, not a catalogue you can buy.">
        <p>
          Leadership is the second pillar of Robes. The areas below describe where Christopher Agba
          intends to take the brand. They are not established, paid services, and this page does
          not imply a faculty, a cohort, or a finished curriculum.
        </p>
      </PageIntro>
      <Container className="py-16 md:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {robes.leadership.map((item, index) => (
            <article key={item.title} className="border border-line p-6">
              <p className="font-serif text-sm text-robes">{String(index + 1).padStart(2, '0')}</p>
              <h2 className="mt-3 font-serif text-2xl text-ink">{item.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{item.text}</p>
            </article>
          ))}
        </div>
        <aside className="mt-10 border border-line bg-card p-6 text-sm leading-relaxed text-muted">
          If your organization cares about this direction, the useful next step is a conversation
          about the business problem in front of you. It is not a booking for a leadership product.
        </aside>
        <Link to="/robes/contact" className={`${robesAction} mt-8`}>
          Start a conversation
        </Link>
      </Container>
    </>
  )
}
