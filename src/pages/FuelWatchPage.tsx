import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

const capabilities = [
  'A fuel clerk posts litres against a machine and the hours that machine worked.',
  'Each machine has a sample guide in litres per hour.',
  'An issue above one and a half times that guide is marked unusual.',
  'The unusual day stays open until a supervisor writes why.',
  'The same week runs for plant, delivery trucks, a factory generator, or a haulage yard.',
]

const industries = ['Construction', 'Plant hire', 'Distribution', 'Manufacturing', 'Logistics']

export function FuelWatchPage() {
  return (
    <>
      <Seo
        title="Fuel issue software demo · FuelWatch"
        description="Issue fuel to a machine, compare the litres with the hours worked, and explain the day that is far above the guide. Try the live FuelWatch demo, then request it for your business."
        path="/robes/solutions/fuelwatch"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Fuel issue software demo',
          description: 'A live demonstration of fuel issues compared with machine hours.',
        }}
      />
      <PageIntro eyebrow="FuelWatch" title="See the fuel issue that does not match the work.">
        <p>Diesel leaves the store. The record should say which machine took it, how long that machine worked, and which day needs an explanation.</p>
        <p>The demo is not one company. Choose construction, distribution, manufacturing, or logistics, then keep that company's fuel issues.</p>
        <p>Try the week now. If fuel is still a dipstick and a notebook, request this module for your business.</p>
      </PageIntro>
      <Container className="grid gap-10 py-16 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm leading-relaxed text-muted">
              Every issue is litres, a machine, and hours. The guide is a sample rate. Anything
              above one and a half times that rate stays open until someone explains it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/robes/demo/fuelwatch" className={robesAction}>Try the live demo</Link>
              <Link to="/robes/contact?service=fuelwatch&intent=similar" className={secondaryAction}>Request this for your business</Link>
            </div>
          </div>
          <Preview />
        </div>
        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">
              Fuel leaves the yard, but nobody can tie each issue to a machine, the hours it worked,
              and a reason when the quantity is far above the rest of the week.
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
              React, TypeScript, and data stored in this browser. Machines, litres, and the price
              per litre are fictional. There is no sensor, no tank gauge, and no supplier account.
              Resetting the demo restores the sample for the business you picked.
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
        <p className="font-serif text-xl text-ink">FL-220 · Thursday</p>
        <p className="text-xs tracking-wide text-robes uppercase">Unusual</p>
      </div>
      <p className="mt-3 text-sm text-muted">180 litres · 2 hours · guide 16 litres</p>
      <p className="mt-4 font-serif text-3xl text-ink">₦216,000</p>
      <p className="mt-2 text-sm text-muted">Explanation missing. The other machines that week stayed near their guide.</p>
    </div>
  )
}
