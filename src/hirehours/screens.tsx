import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  bookFor,
  countsTowardCost,
  dayCost,
  formatDay,
  formatWhen,
  machineById,
  naira,
  onSiteHours,
  periodCost,
  statusLabel,
  type HireDay,
} from './model.ts'
import { useHireHours } from './useHireHours.ts'

const base = '/robes/demo/hirehours'

export function OverviewScreen() {
  const { state } = useHireHours()
  const focus = machineById(state.companyId, 'focus')
  const drafts = state.days.filter((day) => day.status === 'draft').length
  const disputed = state.days.filter((day) => day.status === 'disputed').length
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Overview</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Which hired hours were worked, idle, or still in dispute</h1>
        <p className="mt-3 max-w-2xl text-muted">
          A plant clerk logs the day. On-site hours are worked hours plus idle hours, both at the hire rate. A disputed day stays out of the agreed cost until a commercial manager accepts it.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Figure label="Draft days" value={String(drafts)} href={`${base}/days`} />
        <Figure label="Disputed" value={String(disputed)} href={`${base}/days/day-15`} />
        <Figure label={focus ? `${focus.name} this week` : 'Period cost'} value={naira(periodCost(state.companyId, state.days, 'focus'))} href={`${base}/plant/focus`} />
        <Figure label="Machines" value={String(bookFor(state.companyId).machines.length)} href={`${base}/plant`} />
      </div>
      <section className="border border-line bg-card p-5">
        <h2 className="font-serif text-2xl text-ink">Latest hours</h2>
        <ol className="mt-4 space-y-3">
          {state.activity.slice(0, 5).map((item) => (
            <li key={item.id} className="border-t border-line pt-3 text-sm first:border-t-0 first:pt-0">
              <p className="text-ink">{item.text}</p>
              <p className="text-muted">{item.actor} · {formatWhen(item.at)}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

function Figure({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link to={href} className="border border-line bg-card p-5 transition hover:border-robes">
      <p className="font-serif text-3xl text-ink">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </Link>
  )
}

export function PlantScreen() {
  const { state } = useHireHours()
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Plant</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Hired machines</h1>
      </header>
      <div className="grid gap-3">
        {bookFor(state.companyId).machines.map((machine) => (
          <Link key={machine.id} to={`${base}/plant/${machine.id}`} className="border border-line bg-card p-5 transition hover:border-robes">
            <p className="font-medium text-ink">{machine.name}</p>
            <p className="mt-1 text-sm text-muted">{machine.supplier} · {machine.place} · {naira(machine.rate)} an on-site hour</p>
            <p className="mt-3 font-serif text-2xl text-ink">{naira(periodCost(state.companyId, state.days, machine.id))} agreed</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function MachineScreen() {
  const { machineId = '' } = useParams()
  const { state, add, reviewWeek } = useHireHours()
  const machine = machineById(state.companyId, machineId)
  const [date, setDate] = useState('2026-10-19')
  const [worked, setWorked] = useState('')
  const [idle, setIdle] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    reviewWeek(machineId)
  }, [reviewWeek, machineId, state.role])

  if (!machine) return <EmptyTitle title="Machine not found" text="It may belong to another sample business." />
  const days = state.days.filter((day) => day.machineId === machineId).slice().sort((left, right) => left.date.localeCompare(right.date))
  const agreed = periodCost(state.companyId, state.days, machineId)

  function onAdd(event: FormEvent) {
    event.preventDefault()
    const result = add({ machineId, date, worked, idle, note })
    if ('error' in result) {
      setError(result.error)
      return
    }
    setWorked('')
    setIdle('')
    setNote('')
    setError(null)
  }

  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">{machine.place}</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{machine.name}</h1>
        <p className="mt-3 text-muted">{machine.supplier}. {naira(machine.rate)} for each hour the machine is on site. Agreed this period: {naira(agreed)}.</p>
      </header>
      <div className="overflow-x-auto border border-line bg-card">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Day</th>
              <th className="px-4 py-3 font-medium">Worked</th>
              <th className="px-4 py-3 font-medium">Idle</th>
              <th className="px-4 py-3 font-medium">Agreed</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.id} className="border-t border-line">
                <td className="px-4 py-3"><Link className="font-medium text-robes" to={`${base}/days/${day.id}`}>{formatDay(day.date)}</Link></td>
                <td className="px-4 py-3">{day.worked}</td>
                <td className="px-4 py-3">{day.idle}</td>
                <td className="px-4 py-3">{countsTowardCost(day.status) ? naira(dayCost(state.companyId, day)) : 'Held'}</td>
                <td className="px-4 py-3"><span data-status={day.status} className="app-status">{statusLabel(day.status)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {state.role === 'clerk' ? (
        <form onSubmit={onAdd} className="grid max-w-xl gap-4 border border-line bg-card p-5" noValidate>
          <h2 className="font-serif text-2xl text-ink">Log another day</h2>
          {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
          <label className="grid gap-2 text-sm">Date
            <input className="field" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">Worked hours
              <input className="field" inputMode="numeric" value={worked} onChange={(event) => setWorked(event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm">Idle hours
              <input className="field" inputMode="numeric" value={idle} onChange={(event) => setIdle(event.target.value)} />
            </label>
          </div>
          <label className="grid gap-2 text-sm">What the machine did
            <input className="field" value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
          <button type="submit" className="inline-flex min-h-11 w-fit items-center bg-robes-fill px-5 text-sm font-medium text-robes-ink">Log day</button>
        </form>
      ) : (
        <p className="text-sm text-muted">Switch to Plant clerk to log another day.</p>
      )}
    </div>
  )
}

export function DaysScreen() {
  const { state } = useHireHours()
  const days = state.days.slice().sort((left, right) => right.date.localeCompare(left.date))
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Days</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Hour records</h1>
      </header>
      <div className="overflow-x-auto border border-line bg-card">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Day</th>
              <th className="px-4 py-3 font-medium">Machine</th>
              <th className="px-4 py-3 font-medium">On site</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.id} className="border-t border-line">
                <td className="px-4 py-3"><Link className="font-medium text-robes" to={`${base}/days/${day.id}`}>{formatDay(day.date)}</Link></td>
                <td className="px-4 py-3">{machineById(state.companyId, day.machineId)?.name}</td>
                <td className="px-4 py-3">{onSiteHours(day)} h</td>
                <td className="px-4 py-3"><span data-status={day.status} className="app-status">{statusLabel(day.status)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function DayScreen() {
  const { id = '' } = useParams()
  const { state } = useHireHours()
  const day = state.days.find((item) => item.id === id)
  if (!day) return <EmptyTitle title="Day not found" text="It may have been cleared when the demonstration was reset." />
  return <DayDetail day={day} />
}

function DayDetail({ day }: { day: HireDay }) {
  const { state, log, decide } = useHireHours()
  const machine = machineById(state.companyId, day.machineId)
  const [worked, setWorked] = useState(String(day.worked))
  const [idle, setIdle] = useState(String(day.idle))
  const [note, setNote] = useState(day.note)
  const [remark, setRemark] = useState('')
  const [error, setError] = useState<string | null>(null)
  const current = state.guide.active && state.guide.focusId === day.id

  function onLog(event: FormEvent) {
    event.preventDefault()
    const result = log(day.id, Number(worked), Number(idle), note)
    setError(result?.error ?? null)
  }

  function onDecide(action: 'accepted' | 'queried') {
    const result = decide(day.id, action, remark)
    setError(result?.error ?? null)
  }

  return (
    <article className="grid max-w-3xl gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">{machine?.name}</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{formatDay(day.date)}</h1>
        <p className="mt-3 text-muted">{day.worked} worked, {day.idle} idle. {countsTowardCost(day.status) ? naira(dayCost(state.companyId, day)) : 'Not in the agreed cost yet.'}</p>
        <p className="mt-2"><span data-status={day.status} className="app-status">{statusLabel(day.status)}{current ? ' · current step' : ''}</span></p>
      </header>
      <p className="text-sm text-ink">{day.note}</p>
      {day.decision ? <p className="border border-line bg-card p-4 text-sm text-ink">{day.decision.by}: {day.decision.remark}</p> : null}
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      {state.role === 'clerk' && day.status === 'draft' ? (
        <form onSubmit={onLog} className="grid gap-4 border border-line bg-card p-5" noValidate>
          <h2 className="font-serif text-2xl text-ink">Log this day</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">Worked hours
              <input className="field" inputMode="numeric" value={worked} onChange={(event) => setWorked(event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm">Idle hours
              <input className="field" inputMode="numeric" value={idle} onChange={(event) => setIdle(event.target.value)} />
            </label>
          </div>
          <label className="grid gap-2 text-sm">What the machine did
            <textarea className="field min-h-24" value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
          <button type="submit" className="inline-flex min-h-11 w-fit items-center bg-robes-fill px-5 text-sm font-medium text-robes-ink">Log hours</button>
        </form>
      ) : null}
      {state.role === 'commercial' && day.status === 'disputed' ? (
        <form className="grid gap-4 border border-line bg-card p-5" onSubmit={(event) => event.preventDefault()}>
          <h2 className="font-serif text-2xl text-ink">Accept or query</h2>
          <p className="text-sm text-muted">Accepting puts these on-site hours into the agreed cost. Querying keeps them out, with your remark on the day.</p>
          <label className="grid gap-2 text-sm">Remark
            <textarea className="field min-h-24" value={remark} onChange={(event) => setRemark(event.target.value)} />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => onDecide('accepted')}>Accept day</button>
            <button type="button" className="min-h-11 border border-line px-4 text-sm" onClick={() => onDecide('queried')}>Query day</button>
          </div>
        </form>
      ) : null}
      {state.role === 'clerk' && day.status === 'disputed' ? <p className="text-sm text-muted">Switch to Commercial manager to accept or query this day.</p> : null}
      {state.role === 'commercial' && day.status === 'draft' ? <p className="text-sm text-muted">Switch to Plant clerk to log this draft.</p> : null}
    </article>
  )
}

export function ActivityScreen() {
  const { state } = useHireHours()
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Activity</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Hour history</h1>
      </header>
      <ol className="space-y-3">
        {state.activity.map((item) => (
          <li key={item.id} className="border border-line bg-card p-4 text-sm">
            <p className="text-ink">{item.text}</p>
            <p className="text-muted">{item.actor} · {formatWhen(item.at)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function EmptyTitle({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">{title}</h1>
      <p className="mt-3 text-muted">{text}</p>
    </div>
  )
}
