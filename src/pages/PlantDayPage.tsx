import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const capabilities = [
  'A shift lead closes each machine as worked, stood idle, or broke down.',
  'The person who reported it stays on the record.',
  'A breakdown stays open until a supervisor writes the repair follow-up.',
  'The closed shift can be read back in one list.',
  'The same close runs for plant, delivery vehicles, a factory floor, or a haulage yard.',
]

const industries = ['Construction', 'Plant hire', 'Distribution', 'Manufacturing', 'Logistics']

export function PlantDayPage() {
  return (
    <>
      <Seo
        title="Shift close software demo · PlantDay"
        description="Close a shift by marking what worked, what stood idle, and what broke down, then record the repair follow-up. Try the live PlantDay demo, then request it for your business."
        path="/robes/solutions/plantday"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Shift close software demo',
          description: 'A live demonstration of closing a shift and recording a repair follow-up.',
        }}
      />
      <PageIntro eyebrow="PlantDay" title="Close the shift before the day disappears.">
        <p>At the end of the day someone should be able to say which machines worked, which stood idle, and which broke down, and who said so.</p>
        <p>The demo is not one company. Choose construction, distribution, manufacturing, or logistics, then close that company's shift.</p>
        <p>Try the close now. If the day still ends in a phone call, request this module for your business.</p>
      </PageIntro>
      <Container className="grid gap-10 py-16 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm leading-relaxed text-muted">
              Every machine gets one close: worked, idle, or broken. A breakdown is not finished
              until the repair follow-up is written.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/demo/plantday" className={robesAction}>Try the live demo</Link>
              <Link to="/robes/contact?service=plantday&intent=similar" className={secondaryAction}>Request this for your business</Link>
            </div>
          </div>
          <Preview />
        </div>
        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">
              At the end of the day nobody has a reliable list of which machines worked, stood idle,
              or broke down, or who confirmed that. The repair then waits until someone remembers it.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-ink">What you can try</h2>
            <ul className="mt-4 space-y-3 text-muted">
              {capabilities.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>
        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">Industries</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {industries.map((item) => <li key={item} className="border border-line px-3 py-2 text-sm">{item}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-ink">Built with</h2>
            <p className="mt-4 text-muted">
              React, TypeScript, and data stored in this browser. Machines and notes are fictional.
              There is no workshop system behind the follow-up. Resetting the demo restores the
              sample for the business you picked.
            </p>
          </div>
        </section>
      </Container>
    </>
  )
}

function Preview() {
  return (
    <div className="border border-line bg-card p-4" aria-hidden="true">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <p className="font-serif text-xl text-ink">Pump</p>
        <p className="text-xs tracking-wide text-robes uppercase">Broke down</p>
      </div>
      <p className="mt-3 text-sm text-muted">Jonah Hale reported a hydraulic leak from midday.</p>
      <p className="mt-4 font-serif text-3xl text-ink">Follow-up open</p>
      <p className="mt-2 text-sm text-muted">The shift is not closed until someone writes what happens next.</p>
    </div>
  )
}
