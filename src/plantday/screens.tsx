import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  dayLine,
  formatWhen,
  needsFollowUp,
  statusLabel,
  type Machine,
  type ShiftStatus,
} from './model.ts'
import { usePlantDay } from './usePlantDay.ts'

const base = '/robes/demo/plantday'

export function ShiftScreen() {
  const { state } = usePlantDay()
  const open = state.machines.filter((machine) => machine.status === 'open').length
  const down = state.machines.filter(needsFollowUp).length
  const closed = state.machines.filter((machine) => machine.status !== 'open').length
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Shift close</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Who worked, who stood, and what broke</h1>
        <p className="mt-3 max-w-2xl text-muted">
          The shift lead closes each machine: worked, stood idle, or broke down, and their name stays on the record. A breakdown stays open until a supervisor writes the repair follow-up.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        <Figure label="Closed" value={String(closed)} href={`${base}`} />
        <Figure label="Still open" value={String(open)} href={`${base}/machines/shift-3`} />
        <Figure label="Repair still open" value={String(down)} href={`${base}/machines/shift-4`} />
      </div>
      <div className="grid gap-3">
        {state.machines.map((machine) => (
          <Link key={machine.id} to={`${base}/machines/${machine.id}`} className="border border-line bg-card p-5 transition hover:border-robes">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-ink">{machine.name}</p>
              <Tone machine={machine} />
            </div>
            <p className="mt-2 text-sm text-muted">{dayLine(machine)}</p>
          </Link>
        ))}
      </div>
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

export function MachineScreen() {
  const { id = '' } = useParams()
  const { state, reviewMachine } = usePlantDay()
  const machine = state.machines.find((item) => item.id === id)
  useEffect(() => {
    reviewMachine(id)
  }, [reviewMachine, id, state.role, machine?.followUp, machine?.status])
  if (!machine) return <EmptyTitle title="Machine not found" text="It may belong to another sample business." />
  return <MachineDetail machine={machine} />
}

function MachineDetail({ machine }: { machine: Machine }) {
  const { state, close, followUp } = usePlantDay()
  const [status, setStatus] = useState<Exclude<ShiftStatus, 'open'>>('worked')
  const [note, setNote] = useState('')
  const [repair, setRepair] = useState('')
  const [error, setError] = useState<string | null>(null)
  const current = state.guide.active && state.guide.focusId === machine.id

  function onClose(event: FormEvent) {
    event.preventDefault()
    const result = close(machine.id, status, note)
    setError(result?.error ?? null)
  }

  function onFollow(event: FormEvent) {
    event.preventDefault()
    const result = followUp(machine.id, repair)
    setError(result?.error ?? null)
  }

  return (
    <article className="grid max-w-3xl gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">{machine.reporter ? `Reported by ${machine.reporter}` : 'Not closed'}</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{machine.name}</h1>
        <p className="mt-3 text-muted">{dayLine(machine)}</p>
        <p className="mt-2"><Tone machine={machine} />{current ? <span className="ml-2 text-sm text-muted">Current step</span> : null}</p>
      </header>
      {machine.confirmedBy ? <p className="border border-line bg-card p-4 text-sm text-ink">Confirmed by {machine.confirmedBy}. {machine.followUp}</p> : null}
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      {state.role === 'lead' && machine.status === 'open' ? (
        <form onSubmit={onClose} className="grid gap-4 border border-line bg-card p-5" noValidate>
          <h2 className="font-serif text-2xl text-ink">Close this machine</h2>
          <label className="grid gap-2 text-sm">The shift
            <select className="field" value={status} onChange={(event) => setStatus(event.target.value as Exclude<ShiftStatus, 'open'>)}>
              <option value="worked">Worked</option>
              <option value="idle">Stood idle</option>
              <option value="down">Broke down</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">What happened
            <textarea className="field min-h-24" value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
          <button type="submit" className="inline-flex min-h-11 w-fit items-center bg-robes-fill px-5 text-sm font-medium text-robes-ink">Close the shift</button>
        </form>
      ) : null}
      {state.role === 'supervisor' && needsFollowUp(machine) ? (
        <form onSubmit={onFollow} className="grid gap-4 border border-line bg-card p-5" noValidate>
          <h2 className="font-serif text-2xl text-ink">Repair follow-up</h2>
          <p className="text-sm text-muted">{machine.reporter} reported the breakdown. The follow-up is still missing.</p>
          <label className="grid gap-2 text-sm">What happens next
            <textarea className="field min-h-24" value={repair} onChange={(event) => setRepair(event.target.value)} />
          </label>
          <button type="submit" className="inline-flex min-h-11 w-fit items-center bg-robes-fill px-5 text-sm font-medium text-robes-ink">Save the follow-up</button>
        </form>
      ) : null}
      {state.role === 'lead' && needsFollowUp(machine) ? <p className="text-sm text-muted">Switch to Plant supervisor to record the repair follow-up.</p> : null}
      {state.role === 'supervisor' && machine.status === 'open' ? <p className="text-sm text-muted">Switch to Shift lead to close this machine.</p> : null}
    </article>
  )
}

function Tone({ machine }: { machine: Machine }) {
  const tone = machine.status === 'worked' ? 'completed' : machine.status === 'idle' ? 'submitted' : machine.status === 'down' ? 'disputed' : 'draft'
  return <span data-status={tone} className="app-status">{statusLabel(machine.status)}</span>
}

export function ActivityScreen() {
  const { state } = usePlantDay()
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Activity</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Shift record</h1>
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
