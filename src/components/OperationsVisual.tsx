const lanes = [
  { label: 'Request', detail: 'One place to start the work' },
  { label: 'Review', detail: 'A named owner and a visible status' },
  { label: 'Record', detail: 'A single version of what happened' },
  { label: 'Report', detail: 'A view leadership can actually use' },
]

export function OperationsVisual() {
  return (
    <figure className="relative">
      <div
        className="absolute -top-10 -left-8 hidden h-40 w-40 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_28%,transparent),transparent_70%)] lg:block"
        aria-hidden="true"
      />
      <div className="panel-shadow relative border border-line bg-card p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-serif text-[1.7rem] leading-tight text-ink">How work can move</p>
          <p className="text-[0.7rem] font-medium tracking-[0.16em] text-brass uppercase">
            Illustration
          </p>
        </div>
        <figcaption className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          A picture of an operational flow. Not a screenshot of a client system.
        </figcaption>
        <ol className="mt-8">
          {lanes.map((lane, index) => (
            <li key={lane.label} className="grid grid-cols-[2.5rem_1fr] gap-4">
              <div className="flex h-full flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center border border-line font-serif text-sm text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {index < lanes.length - 1 ? <span className="my-1 w-px flex-1 bg-line" /> : null}
              </div>
              <div className={index < lanes.length - 1 ? 'pb-6' : 'pb-1'}>
                <p className="font-medium text-ink">{lane.label}</p>
                <p className="text-sm leading-relaxed text-muted">{lane.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  )
}
