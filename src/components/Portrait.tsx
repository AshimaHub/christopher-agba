import { useState } from 'react'
import { site } from '../content/site.ts'

type PortraitProps = {
  alt: string
  className?: string
  priority?: boolean
}

export function Portrait({ alt, className = '', priority = false }: PortraitProps) {
  const [failed, setFailed] = useState(false)

  if (failed || !site.portrait) {
    return (
      <div
        className={`grid place-items-center bg-band font-serif text-2xl text-band-ink ${className}`}
        role="img"
        aria-label={alt || 'Christopher Agba'}
      >
        CA
      </div>
    )
  }

  return (
    <img
      src={site.portrait}
      alt={alt}
      width={800}
      height={1067}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setFailed(true)}
      className={`object-cover object-[center_30%] ${className}`}
    />
  )
}
