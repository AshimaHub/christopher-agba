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
      <div className="relative h-[28rem] overflow-hidden rounded-[1.7rem] border border-[#c9e4d4] bg-[#f3faf6] shadow-[0_24px_60px_rgba(14,78,44,0.08)] sm:h-[32rem]">
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
      <div className="mt-5">
        <p className="font-serif text-[1.65rem] leading-[1.12] font-bold tracking-[-0.03em] text-ink sm:text-[2rem]" aria-live="polite">
          <span className="block">{scenes[active].lines[0]}</span>
          <span className="mt-1 block text-robes">{scenes[active].lines[1]}</span>
        </p>
        <div className="mt-4 flex gap-2">
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
      <Pill className="top-[7%] left-[6%] bg-[#1b7a45]">Request approved</Pill>
      <div className="absolute top-[18%] left-[6%] w-[min(15.5rem,62%)] rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(14,78,44,0.12)]">
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
      <Face initials="AO" tone="bg-[#1b7a45]" className="top-[16%] right-[16%]" name="Adaeze" />
      <Face initials="MA" tone="bg-[#3d6fd4]" className="top-[34%] right-[5%]" name="Malik" />
      <Face initials="IB" tone="bg-[#d07a2a]" className="top-[52%] right-[16%]" name="Ifeoma" />
      <Pill className="bottom-[8%] left-[6%] bg-[#1b7a45]">Issued from the store</Pill>
    </Frame>
  )
}

function ReceiptBoard() {
  return (
    <Frame>
      <Pill className="top-[7%] left-[6%] bg-[#1b7a45]">Receipt recorded</Pill>
      <div className="absolute top-[6%] right-[5%] w-[9.5rem] rounded-2xl bg-white p-3 shadow-[0_16px_40px_rgba(14,78,44,0.12)]">
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
      <div className="absolute top-[28%] left-[6%] w-[min(16rem,60%)] rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(14,78,44,0.12)]">
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
      <Face initials="NE" tone="bg-[#1b7a45]" className="right-[22%] bottom-[16%]" name="Ngozi" />
      <Face initials="HY" tone="bg-[#0e4e2c]" className="right-[6%] bottom-[28%]" name="Halima" />
    </Frame>
  )
}

function ExpenseBoard() {
  return (
    <Frame>
      <Pill className="top-8 left-8 bg-[#1b7a45]">Under review</Pill>
      <div className="absolute top-[22%] left-1/2 w-[min(17rem,78%)] -translate-x-1/2 rounded-2xl bg-white p-5 shadow-[0_18px_44px_rgba(14,78,44,0.14)]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#3d7a56] uppercase">ES-220</p>
        <p className="mt-1 font-serif text-3xl text-[#10261c]">₦186,000</p>
        <p className="mt-1 text-sm text-[#1e3a2f]">Diesel, standby generator</p>
        <p className="mt-3 text-sm text-[#3f6452]">Remark required before a decision.</p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-full bg-[#1b7a45] px-3 py-1 text-xs font-medium text-white">Approve</span>
          <span className="rounded-full bg-[#f4e4ea] px-3 py-1 text-xs font-medium text-[#8d2b4b]">Reject</span>
        </div>
      </div>
      <div className="absolute top-8 right-8 flex gap-2">
        <Tile label="Request" mark="Rq" />
        <Tile label="Note" mark="Nt" />
      </div>
      <Face initials="AN" tone="bg-[#3d6fd4]" className="bottom-[8%] left-[8%]" name="Amaka" />
      <Face initials="MA" tone="bg-[#1b7a45]" className="right-[8%] bottom-[12%]" name="Malik" />
    </Frame>
  )
}

function BoardBoard() {
  return (
    <Frame>
      <Pill className="top-8 left-8 bg-[#1b7a45]">One record for the work</Pill>
      <div className="absolute top-20 right-6 left-6 grid grid-cols-3 gap-3">
        <Stack title="Waiting" count="4" items={['REQ-2411', 'WN-1807', 'ES-218']} />
        <Stack title="Arrived" count="2" items={['WN-1802', 'REQ-2404']} />
        <Stack title="Approved" count="6" items={['ES-210', 'REQ-2408', 'WN-1801']} />
      </div>
      <div className="absolute right-[5%] bottom-[7%] left-[5%] flex flex-wrap gap-2">
        {['Harbour Works', 'Mile 12', 'Lekki Stitch', 'Sahel Haulage'].map((name) => (
          <span key={name} className="rounded-full bg-white px-3 py-1 text-xs text-[#1e3a2f] shadow-sm">
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
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 480 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect x="22" y="24" width="436" height="512" rx="58" stroke="#b7dcc6" strokeWidth="1.6" fill="none" />
        <rect x="54" y="56" width="372" height="448" rx="48" stroke="#d4eddf" strokeWidth="1.6" fill="none" />
        <path d="M18 250C110 170 190 190 250 240s120 90 220-10" stroke="#c5e4d2" strokeWidth="1.6" fill="none" />
        <path d="M10 360c120-70 200 80 470-20" stroke="#e3f3ea" strokeWidth="1.6" fill="none" />
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
    <li className={`rounded-full px-2 py-1 ${current ? 'bg-[#1b7a45] text-white' : 'bg-[#e7f5ec] text-[#1d5c38]'}`}>
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
      className={`absolute grid h-14 w-14 place-items-center rounded-full text-sm font-semibold text-white shadow-[0_10px_24px_rgba(14,78,44,0.18)] ring-4 ring-white sm:h-16 sm:w-16 ${tone} ${className}`}
      title={name}
    >
      {initials}
    </span>
  )
}

function Count({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#eef8f2] px-1 py-2">
      <p className="font-semibold text-[#10261c]">{value}</p>
      <p className="text-[10px] text-[#5f7d6c]">{label}</p>
    </div>
  )
}

function Tile({ label, mark }: { label: string; mark: string }) {
  return (
    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-sm font-semibold text-[#1b7a45] shadow-md">
      <span className="sr-only">{label}</span>
      {mark}
    </span>
  )
}

function Stack({ title, count, items }: { title: string; count: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-[0_12px_30px_rgba(14,78,44,0.1)]">
      <p className="text-[11px] font-medium text-[#5f7d6c]">{title}</p>
      <p className="font-serif text-2xl text-[#10261c]">{count}</p>
      <ul className="mt-2 space-y-1 text-[11px] text-[#1e3a2f]">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-[#eef8f2] px-2 py-1">{item}</li>
        ))}
      </ul>
    </div>
  )
}

