import { Link } from 'react-router-dom'
import { Container } from '../components/Layout.tsx'
import { PageIntro } from '../components/PageIntro.tsx'
import { Seo } from '../components/Seo.tsx'
import { robesAction, secondaryAction } from '../lib/styles.ts'

export function KnowledgeDeskPage() {
  return (
    <>
      <Seo
        title="KnowledgeDesk AI · Christopher Agba"
        description="A concept for an enterprise knowledge assistant that answers from organizational documents and shows the source. No live assistant is available on this site."
        path="/robes/solutions/knowledgedesk"
      />
      <PageIntro eyebrow="Solution concept" title="KnowledgeDesk AI">
        <p>
          An AI-powered business knowledge concept: authorized staff ask a question and receive an
          answer grounded in the organization’s own documents, with the source shown. This page is
          not a working product, and it does not connect to anyone’s files.
        </p>
      </PageIntro>
      <Container className="grid gap-8 py-16 md:py-20">
        <section className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">The problem</h2>
            <p className="mt-4 text-muted">The answer already exists in a policy, a procedure, or a record, but people still interrupt a colleague to find it.</p>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-ink">What a future version would do</h2>
            <ul className="mt-4 space-y-2 text-muted">
              <li>Answer from documents the organization chooses.</li>
              <li>Show the source with the answer.</li>
              <li>Stay inside the permissions of the person asking.</li>
            </ul>
          </div>
        </section>
        <p className="max-w-3xl text-sm text-muted">There is no demo button because there is no assistant to try. A conversation can scope whether this is the right build.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/contact?service=custom-business-software" className={robesAction}>Request a Demo</Link>
          <Link to="/solutions" className={secondaryAction}>Back to solutions</Link>
        </div>
      </Container>
    </>
  )
}
