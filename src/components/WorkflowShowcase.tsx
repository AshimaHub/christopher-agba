import { useEffect, useRef, useState, type ReactNode } from 'react'

type Motion = 'slide-right' | 'slide-left' | 'flip-up' | 'roll-down'

const scenes: { motion: Motion; lines: [string, string]; board: ReactNode }[] = [
  {
    motion: 'slide-right',
    lines: ['Streamline operations', 'Eliminate manual work'],
    board: <RequestBoard />,
  },
  {
    motion: 'slide-left',
    lines: ['Boost productivity', 'Save time'],
    board: <ReceiptBoard />,
  },
  {
    motion: 'flip-up',
    lines: ['Reduce costs', 'Minimize errors'],
    board: <ExpenseBoard />,
  },
  {
    motion: 'roll-down',
    lines: ['Drive business growth', 'Run your business better'],
    board: <BoardBoard />,
  },
]

const HOLD_MS = 4200
const MOVE_MS = 780

export function WorkflowShowcase() {
  const [active, setActive] = useState(0)
  const [leaving, setLeaving] = useState<number | null>(null)
  const activeRef = useRef(0)
  const paused = useRef(false)
  const leaveTimer = useRef(0)
  const reduced = useRef(false)

  function show(next: number) {
    const current = activeRef.current
    const index = (next + scenes.length) % scenes.length
    if (index === current) return
    activeRef.current = index
    setActive(index)
    if (reduced.current) return
    setLeaving(current)
    window.clearTimeout(leaveTimer.current)
    leaveTimer.current = window.setTimeout(() => setLeaving(null), MOVE_MS)
  }

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current) return
    const id = window.setInterval(() => {
      if (!paused.current) show((activeRef.current + 1) % scenes.length)
    }, HOLD_MS + MOVE_MS)
    return () => {
      window.clearInterval(id)
      window.clearTimeout(leaveTimer.current)
    }
  }, [])

  function pauseFromPointer(value: boolean) {
    paused.current = value
  }

  return (
    <div
      className="flow-stage"
      onMouseEnter={() => pauseFromPointer(true)}
      onMouseLeave={() => pauseFromPointer(false)}
      onFocus={() => pauseFromPointer(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) pauseFromPointer(false)
      }}
    >
      <div className="relative h-[22rem] overflow-hidden rounded-[1.7rem] border border-line bg-card shadow-[0_24px_60px_rgba(12,30,51,0.12)] sm:h-[20rem] lg:h-[23rem]">
        {leaving !== null && (
          <article key={`leave-${leaving}`} className={`flow-board is-leave flow-${scenes[leaving].motion}`} aria-hidden>
            {scenes[leaving].board}
          </article>
        )}
        <article
          key={`active-${active}`}
          className={`flow-board ${leaving === null ? 'is-hold' : 'is-enter'} flow-${scenes[active].motion}`}
          aria-label={scenes[active].lines.join('. ')}
        >
          {scenes[active].board}
        </article>
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <p className="font-serif text-[1.65rem] leading-[1.12] font-bold tracking-[-0.03em] text-ink sm:text-[2rem]" aria-live="polite">
          <span className="block">{scenes[active].lines[0]}</span>
          <span className="mt-1 block text-robes">{scenes[active].lines[1]}</span>
        </p>
        <div className="flex gap-2 pb-1">
          {scenes.map((scene, index) => (
            <button
              key={scene.motion}
              type="button"
              className={`h-2.5 rounded-full transition-[width,background-color] ${index === active ? 'w-6 bg-[#1b7a45]' : 'w-2.5 bg-[#c5e0d0]'}`}
              aria-label={`Show workflow ${index + 1}`}
              aria-current={index === active}
              onClick={() => show(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function RequestBoard() {
  return (
    <Frame>
      <Pill className="top-4 left-5 bg-[#1b7a45] lg:top-6 lg:left-8">Request approved</Pill>
      <div className="absolute top-1/2 left-4 w-[min(16.5rem,68%)] -translate-y-1/2 rounded-2xl blend-panel p-4 shadow-[0_16px_40px_rgba(14,78,44,0.12)] sm:left-8 lg:w-[18rem]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#3d7a56] uppercase">REQ-2408</p>
        <p className="mt-1 font-serif text-lg leading-tight text-[#10261c]">Harbour Pump Station</p>
        <ul className="mt-3 space-y-2 text-sm text-[#1e3a2f]">
          <li className="flex justify-between gap-3"><span>Cement</span><span>40 bags</span></li>
          <li className="flex justify-between gap-3"><span>Cable, 2.5 mm</span><span>120 m</span></li>
          <li className="flex justify-between gap-3"><span>Safety gloves</span><span>12 pairs</span></li>
        </ul>
        <ol className="mt-4 flex items-center gap-1.5 text-[11px] font-medium">
          <Step>Requested</Step>
          <Step>Approved</Step>
          <Step current>Issued</Step>
        </ol>
      </div>
      <Face initials="AO" tone="bg-[#1b7a45]" className="top-5 right-4 hidden sm:grid lg:top-1/2 lg:right-[22%] lg:-translate-y-1/2" name="Adaeze" />
      <Face initials="MA" tone="bg-[#3d6fd4]" className="top-5 right-[22%] hidden sm:grid lg:top-1/2 lg:right-[12%] lg:-translate-y-1/2" name="Malik" />
      <Face initials="IB" tone="bg-[#d07a2a]" className="right-4 bottom-5 hidden sm:grid lg:top-1/2 lg:right-[2%] lg:bottom-auto lg:-translate-y-1/2" name="Ifeoma" />
      <Pill className="bottom-4 left-5 bg-[#1b7a45] lg:bottom-6 lg:left-8">Issued from the store</Pill>
    </Frame>
  )
}

function ReceiptBoard() {
  return (
    <Frame>
      <Pill className="top-4 left-5 bg-[#1b7a45] lg:top-6 lg:left-8">Receipt recorded</Pill>
      <div className="absolute top-4 right-4 hidden w-[9.5rem] rounded-2xl blend-panel p-3 shadow-[0_16px_40px_rgba(14,78,44,0.12)] sm:block lg:top-1/2 lg:right-8 lg:-translate-y-1/2">
        <p className="text-center text-xs font-semibold text-[#1b7a45]">October</p>
        <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] text-[#5f7d6c]">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
          {Array.from({ length: 28 }, (_, index) => {
            const day = index + 1
            const marked = day === 21
            return (
              <span
                key={day}
                className={marked ? 'rounded-full bg-[#1b7a45] text-white' : ''}
              >
                {day}
              </span>
            )
          })}
        </div>
      </div>
      <div className="absolute top-1/2 left-4 w-[min(16.5rem,70%)] -translate-y-1/2 rounded-2xl blend-panel p-4 shadow-[0_16px_40px_rgba(14,78,44,0.12)] sm:left-8 lg:w-[18rem]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#3d7a56] uppercase">WN-1804</p>
        <p className="mt-1 font-serif text-lg leading-tight text-[#10261c]">Tarpaulins · yard to Enugu</p>
        <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <Count label="Sent" value="8" />
          <Count label="Arrived" value="6" />
          <Count label="Condition" value="Damaged" />
        </dl>
        <p className="mt-3 rounded-full bg-[#f4e4ea] px-3 py-1 text-center text-xs font-medium text-[#8d2b4b]">
          Mismatch · disputed
        </p>
      </div>
      <Face initials="NE" tone="bg-[#1b7a45]" className="right-[28%] bottom-4 hidden sm:grid lg:top-1/2 lg:right-[28%] lg:bottom-auto lg:-translate-y-1/2" name="Ngozi" />
      <Face initials="HY" tone="bg-[#0e4e2c]" className="right-[16%] bottom-4 hidden md:grid lg:top-1/2 lg:right-[20%] lg:bottom-auto lg:-translate-y-1/2" name="Halima" />
    </Frame>
  )
}

function ExpenseBoard() {
  return (
    <Frame>
      <Pill className="top-4 left-5 bg-[#1b7a45] lg:top-6 lg:left-8">Under review</Pill>
      <div className="absolute top-1/2 left-4 w-[min(17rem,72%)] -translate-y-1/2 rounded-2xl blend-panel p-5 shadow-[0_18px_44px_rgba(14,78,44,0.14)] sm:left-[18%] lg:left-[22%]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#3d7a56] uppercase">ES-220</p>
        <p className="mt-1 font-serif text-3xl text-[#10261c]">₦186,000</p>
        <p className="mt-1 text-sm text-[#1e3a2f]">Diesel, standby generator</p>
        <p className="mt-3 text-sm text-[#3f6452]">Remark required before a decision.</p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-full bg-[#1b7a45] px-3 py-1 text-xs font-medium text-white">Approve</span>
          <span className="rounded-full bg-[#f4e4ea] px-3 py-1 text-xs font-medium text-[#8d2b4b]">Reject</span>
        </div>
      </div>
      <div className="absolute top-4 right-4 hidden gap-2 sm:flex lg:top-1/2 lg:right-8 lg:-translate-y-1/2">
        <Tile label="Request" mark="Rq" />
        <Tile label="Note" mark="Nt" />
      </div>
      <Face initials="AN" tone="bg-[#3d6fd4]" className="bottom-4 left-5 hidden md:grid lg:top-auto lg:bottom-6 lg:left-8" name="Amaka" />
      <Face initials="MA" tone="bg-[#1b7a45]" className="right-5 bottom-4 hidden md:grid lg:right-8 lg:bottom-6" name="Malik" />
    </Frame>
  )
}

function BoardBoard() {
  return (
    <Frame>
      <Pill className="top-4 left-5 bg-[#1b7a45] lg:top-5 lg:left-8">One record for the work</Pill>
      <div className="absolute top-14 right-4 left-4 grid grid-cols-3 gap-3 lg:top-16 lg:right-8 lg:left-8">
        <Stack title="Waiting" count="4" items={['REQ-2411', 'WN-1807', 'ES-218']} />
        <Stack title="Arrived" count="2" items={['WN-1802', 'REQ-2404']} />
        <Stack title="Approved" count="6" items={['ES-210', 'REQ-2408', 'WN-1801']} />
      </div>
      <div className="absolute right-[5%] bottom-[7%] left-[5%] flex flex-wrap gap-2">
        {['Harbour Works', 'Mile 12', 'Lekki Stitch', 'Sahel Haulage'].map((name) => (
          <span key={name} className="rounded-full blend-panel px-3 py-1 text-xs text-[#1e3a2f] shadow-sm">
            {name}
          </span>
        ))}
      </div>
    </Frame>
  )
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 960 320" preserveAspectRatio="none" aria-hidden="true">
        <rect x="16" y="14" width="928" height="292" rx="36" stroke="#8fb4c4" strokeWidth="1.6" fill="none" />
        <rect x="36" y="32" width="888" height="256" rx="28" stroke="#1b7a45" strokeOpacity="0.35" strokeWidth="1.6" fill="none" />
        <path d="M24 150C180 70 320 230 480 150s250 40 456-20" stroke="#1a4578" strokeOpacity="0.28" strokeWidth="1.6" fill="none" />
        <path d="M24 210C220 250 420 90 640 180s180 20 300-30" stroke="#1b7a45" strokeOpacity="0.28" strokeWidth="1.6" fill="none" />
      </svg>
      {children}
    </div>
  )
}

function Pill({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={`absolute rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-md ${className}`}>
      {children}
    </span>
  )
}

function Step({ children, current = false }: { children: ReactNode; current?: boolean }) {
  return (
    <li className={`rounded-full px-2 py-1 ${current ? 'bg-[#1b7a45] text-white' : 'bg-[#d5e6ee] text-[#1a4578]'}`}>
      {children}
    </li>
  )
}

function Face({
  initials,
  tone,
  className,
  name,
}: {
  initials: string
  tone: string
  className: string
  name: string
}) {
  return (
    <span
      className={`absolute h-12 w-12 place-items-center rounded-full text-sm font-semibold text-white shadow-[0_10px_24px_rgba(14,78,44,0.18)] ring-4 ring-[#d7e6ee] lg:h-14 lg:w-14 ${tone} ${className}`}
      title={name}
    >
      {initials}
    </span>
  )
}

function Count({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#d5e6ee] px-1 py-2">
      <p className="font-semibold text-[#10261c]">{value}</p>
      <p className="text-[10px] text-[#5f7d6c]">{label}</p>
    </div>
  )
}

function Tile({ label, mark }: { label: string; mark: string }) {
  return (
    <span className="grid h-14 w-14 place-items-center rounded-2xl blend-panel text-sm font-semibold text-[#1b7a45] shadow-md">
      <span className="sr-only">{label}</span>
      {mark}
    </span>
  )
}

function Stack({ title, count, items }: { title: string; count: string; items: string[] }) {
  return (
    <div className="rounded-2xl blend-panel p-3 shadow-[0_12px_30px_rgba(14,78,44,0.1)]">
      <p className="text-[11px] font-medium text-[#5f7d6c]">{title}</p>
      <p className="font-serif text-2xl text-[#10261c]">{count}</p>
      <ul className="mt-2 space-y-1 text-[11px] text-[#1e3a2f]">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-[#d5e6ee] px-2 py-1">{item}</li>
        ))}
      </ul>
    </div>
  )
}

