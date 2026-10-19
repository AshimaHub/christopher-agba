import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robes } from '../content/robes.ts'
import { robesAction, robesLink, secondaryAction } from '../lib/styles.ts'

export function RobesSolutionsPage() {
  return (
    <>
      <Seo
        title={`Material requests, loading notes, and expense approval · ${robes.name}`}
        description="Try a live demo of material requisitions, loading notes, or expense approval. Then ask Robes Leadership | Technology to build that workflow for your business."
        path="/robes/solutions"
      />
      <PageIntro eyebrow="Technology" title="Try the workflow. Then ask for it in your business.">
        <p>
          Christopher Agba leads this work under the Robes brand. Each solution is framed as a
          business outcome. Scope and fees are proposed after the problem is clear. Nothing here is
          a fixed package or a claimed result from a client list.
        </p>
      </PageIntro>
      <Container className="grid gap-5 py-16 md:py-20">
        <section id="interactive-solutions" className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">ClearRequest</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Material requisition: request it, approve it, then issue it from the store.
          </p>
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The records are fictional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/clearrequest" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/clearrequest" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=clearrequest&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        <section className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">Waynote</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            A loading note: send it, receive the quantity and condition, and dispute a mismatch.
          </p>
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The records are fictional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/waynote" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/waynote" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=waynote&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        <section className="scroll-mt-28 border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Interactive business solutions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">SpendGate</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            An expense sheet: submit it, review it, and approve or reject it with a remark. The
            submitter cannot approve their own sheet.
          </p>
          <p className="mt-4 max-w-3xl text-sm text-muted">
            Pick a sample business inside the demo: construction, distribution, manufacturing, or logistics. The records are fictional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/robes/demo/spendgate" className={robesAction}>
              Try the live demo
            </Link>
            <Link to="/robes/solutions/spendgate" className={secondaryAction}>
              View the showcase
            </Link>
            <Link to="/robes/contact?service=spendgate&intent=similar" className={`${robesLink} inline-flex min-h-11 items-center`}>
              Request this for your business
            </Link>
          </div>
        </section>
        {robes.solutions.map((solution, index) => (
          <article
            key={solution.id}
            id={solution.id}
            className="scroll-mt-28 border border-line bg-card p-6 sm:p-8"
          >
            <p className="font-serif text-sm text-robes">{String(index + 1).padStart(2, '0')}</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">{solution.title}</h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">{solution.summary}</p>
            <p className="mt-4 max-w-3xl border-t border-line pt-4 text-ink">
              <span className="font-medium text-robes">Value. </span>
              {solution.outcome}
            </p>
            <Link
              to={`/robes/contact?service=${solution.id}`}
              className={`${robesLink} mt-6 inline-flex`}
            >
              Discuss this solution
            </Link>
          </article>
        ))}
      </Container>
    </>
  )
}
