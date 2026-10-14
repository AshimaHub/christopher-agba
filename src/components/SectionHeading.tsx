export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  text,
}: {
  id?: string
  index: string
  eyebrow: string
  title: string
  text?: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium tracking-[0.18em] text-brass uppercase">
        <span className="mr-3 font-serif text-base tracking-normal text-accent normal-case">
          {index}
        </span>
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 font-serif text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] font-medium tracking-[-0.03em] text-ink"
      >
        {title}
      </h2>
      {text ? <p className="mt-4 text-lg leading-relaxed text-muted">{text}</p> : null}
    </div>
  )
}
