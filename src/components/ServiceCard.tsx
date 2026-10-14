import { Link } from 'react-router-dom'
import type { Service } from '../content/site.ts'
import { textLink } from '../lib/styles.ts'

export function ServiceCard({
  service,
  index,
  variant = 'compact',
}: {
  service: Service
  index: number
  variant?: 'compact' | 'full'
}) {
  return (
    <article
      id={service.id}
      className="scroll-mt-28 flex h-full flex-col border border-line bg-card p-6 sm:p-8"
    >
      <p className="font-serif text-sm text-accent">{String(index + 1).padStart(2, '0')}</p>
      <h3 className="mt-3 font-serif text-[1.7rem] leading-tight text-ink">{service.title}</h3>
      <p className="mt-3 leading-relaxed text-muted">{service.summary}</p>
      {variant === 'full' ? (
        <>
          <p className="mt-4 leading-relaxed text-ink">{service.details}</p>
          <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink">
            <span className="font-medium text-brass">Value. </span>
            {service.value}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            <span className="font-medium text-ink">A fit for. </span>
            {service.suitedTo}
          </p>
        </>
      ) : null}
      <Link
        to={`/contact?service=${service.id}`}
        className={`${textLink} mt-6 inline-flex w-fit`}
      >
        Discuss this service
      </Link>
    </article>
  )
}
