import { Link } from 'react-router-dom'
import type { CaseStudy } from '../content/site.ts'
import { textLink } from '../lib/styles.ts'

export function CaseStudyCard({
  study,
  level = 3,
}: {
  study: CaseStudy
  level?: 2 | 3
}) {
  const Title = level === 2 ? 'h2' : 'h3'

  return (
    <article className="flex h-full flex-col border border-line bg-card p-6 sm:p-8">
      <p className="text-xs font-medium tracking-[0.16em] text-brass uppercase">
        {study.statusLabel}
      </p>
      <p className="mt-3 text-sm text-muted">{study.sector}</p>
      <Title className="mt-2 font-serif text-[1.7rem] leading-tight text-ink">{study.title}</Title>
      <p className="mt-3 flex-1 leading-relaxed text-muted">{study.summary}</p>
      <p className="mt-5 text-sm text-ink">{study.technologies.join(' · ')}</p>
      <Link to={`/work/${study.slug}`} className={`${textLink} mt-6 inline-flex w-fit`}>
        Read the case study
      </Link>
    </article>
  )
}
