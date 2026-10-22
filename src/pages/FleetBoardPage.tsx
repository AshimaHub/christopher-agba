import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const capabilities = [
  'A yard clerk calls each machine in for the morning.',
  'The board shows working, idle, down, and off the site it was sent to.',
  'Opening a machine reads the day in one sentence.',
  'Idle, down, and off-site machines stay open until a supervisor writes why.',
  'The same board runs for plant, delivery vans, a factory floor, or a haulage yard.',
]

const industries = ['Construction', 'Plant hire', 'Distribution', 'Manufacturing', 'Logistics']

export function FleetBoardPage() {
  return (
    <>
      <Seo
        title="Morning fleet board software demo · FleetBoard"
        description="See which machines are working, idle, down, or off the site they were sent to. Try the live FleetBoard demo, then request it for your business."
        path="/robes/solutions/fleetboard"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Morning fleet board software demo',
          description: 'A live demonstration of a morning board for machines that are working, idle, down, or off site.',
        }}
      />
      <PageIntro eyebrow="FleetBoard" title="See the morning before you start calling around.">
        <p>Six machines. Some are working. Some are standing. One never reached the place it was sent to.</p>
        <p>The demo is not one company. Choose construction, distribution, manufacturing, or logistics, then read that company's morning.</p>
        <p>Try the board now. If the first hour of the day is still a set of phone calls, request this module for your business.</p>
      </PageIntro>
      <Container className="grid gap-10 py-16 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm leading-relaxed text-muted">
              Every machine has a place it was sent to and a place it was reported. Hours earned
              are the working hours. A machine that is idle, down, or off site needs a written reason.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/demo/fleetboard" className={robesAction}>Try the live demo</Link>
              <Link to="/robes/contact?service=fleetboard&intent=similar" className={secondaryAction}>Request this for your business</Link>
            </div>
          </div>
          <Preview />
        </div>
        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">
              Managers cannot see, in one place, which machines are working, idle, down, or away
              from the site they were sent to. The board is that place. It is not a live tracking network.
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
              React, TypeScript, and data stored in this browser. Machines and places are fictional.
              There is no tracker, no map feed, and no outside fleet service. Resetting the demo
              restores the sample for the business you picked.
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
        <p className="font-serif text-xl text-ink">Lowbed</p>
        <p className="text-xs tracking-wide text-robes uppercase">Off site</p>
      </div>
      <p className="mt-3 text-sm text-muted">Sent to the access road. Reported at the central yard.</p>
      <p className="mt-4 font-serif text-3xl text-ink">13 / 48 hours</p>
      <p className="mt-2 text-sm text-muted">Two machines are idle. One has no reason yet.</p>
    </div>
  )
}
