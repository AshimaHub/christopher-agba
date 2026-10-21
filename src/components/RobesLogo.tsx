import { useEffect, useState } from 'react'
import { robes } from '../content/robes.ts'

type Variant = 'green' | 'contrast' | 'mark'

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      setDark(root.classList.contains('dark'))
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return dark
}

function srcFor(variant: Variant, dark: boolean) {
  if (variant === 'mark') return robes.logos.mark
  if (variant === 'green') return dark ? robes.logos.white : robes.logos.green
  return dark ? robes.logos.white : robes.logos.black
}

export function RobesLogo({
  variant = 'contrast',
  className = 'h-12 w-auto',
  surface = 'auto',
}: {
  variant?: Variant
  className?: string
  surface?: 'auto' | 'dark'
}) {
  const dark = useDark()
  const onDark = surface === 'dark' || dark
  const src = srcFor(variant, onDark)

  return <RobesLogoImage key={src} src={src} className={className} onDark={onDark} />
}

function RobesLogoImage({
  src,
  className,
  onDark,
}: {
  src: string
  className: string
  onDark: boolean
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span className="inline-flex flex-col leading-none">
        <span className={`font-serif text-[1.65rem] ${onDark ? 'text-band-ink' : 'text-ink'}`}>
          Robes
        </span>
        <span
          className={`mt-1 text-[0.68rem] font-medium tracking-[0.16em] uppercase ${onDark ? 'text-robes-ink' : 'text-robes'}`}
        >
          Leadership | Technology
        </span>
      </span>
    )
  }

  return (
    <span className={`inline-flex ${className}`}>
      <img
        src={src}
        alt="Robes Leadership | Technology"
        className="h-full w-auto max-w-full object-contain object-left"
        onError={() => setFailed(true)}
      />
    </span>
  )
}
