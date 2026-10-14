import type { ReactNode } from 'react'
import { Container } from './Layout.tsx'

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <header className="border-b border-line">
      <Container className="py-16 md:py-24">
        <p className="text-xs font-medium tracking-[0.18em] text-brass uppercase">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.6rem)] leading-[1.05] font-medium tracking-[-0.03em] text-ink">
          {title}
        </h1>
        <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{children}</div>
      </Container>
    </header>
  )
}
