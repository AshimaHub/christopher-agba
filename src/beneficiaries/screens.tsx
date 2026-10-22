import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  actors,
  bankById,
  categoryLabel,
  formatWhen,
  statusLabel,
  type Payee,
  type PayeeCategory,
} from './model.ts'
import { banks } from './samples.ts'
import { useBeneficiaries } from './useBeneficiaries.ts'

const base = '/robes/demo/beneficiaries'

export function OverviewScreen() {
  const { state } = useBeneficiaries()
  const drafts = state.payees.filter((payee) => payee.status === 'draft').length
  const pending = state.payees.filter((payee) => payee.status === 'pending').length
  const approved = state.payees.filter((payee) => payee.status === 'approved').length
  const returned = state.payees.filter((payee) => payee.status === 'returned').length
  return (
    <div className="grid gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Overview</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Who can be paid, and who is still unchecked</h1>
        <p className="mt-3 max-w-2xl text-muted">
          A payee clerk checks the account name, then submits the payee. A finance reviewer approves or returns it. Only an approved payee is ready to be paid. This demonstration does not create a bank file or move money.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Figure label="Needs a check" value={String(drafts)} href={`${base}/payees/payee-440`} />
        <Figure label="Waiting" value={String(pending)} href={`${base}/payees`} />
        <Figure label="Approved" value={String(approved)} href={`${base}/payees`} />
        <Figure label="Returned" value={String(returned)} href={`${base}/payees`} />
      </div>
      <section className="border border-line bg-card p-5">
        <h2 className="font-serif text-2xl text-ink">Latest payee changes</h2>
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

export function PayeesScreen() {
  const { state } = useBeneficiaries()
  const [query, setQuery] = useState('')
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return state.payees.filter((payee) => {
      if (!needle) return true
      const bank = bankById(payee.bankId)?.name ?? ''
      return `${payee.number} ${payee.accountName} ${payee.accountNumber} ${bank} ${payee.purpose}`.toLowerCase().includes(needle)
    })
  }, [query, state.payees])
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <header>
          <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Payees</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Beneficiaries</h1>
        </header>
        {state.role === 'clerk' ? (
          <Link to={`${base}/payees/new`} className="inline-flex min-h-11 items-center bg-robes-fill px-4 text-sm font-medium text-robes-ink">New payee</Link>
        ) : (
          <p className="max-w-xs text-sm text-muted">Switch to Payee clerk to add a payee.</p>
        )}
      </div>
      <input className="field max-w-md" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, account, or bank" aria-label="Search payees" />
      <div className="overflow-x-auto border border-line bg-card">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Payee</th>
              <th className="px-4 py-3 font-medium">Account</th>
              <th className="px-4 py-3 font-medium">Bank</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((payee) => (
              <tr key={payee.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <Link className="font-medium text-robes" to={`${base}/payees/${payee.id}`}>{payee.accountName || payee.number}</Link>
                  <p className="text-muted">{categoryLabel[payee.category]}</p>
                </td>
                <td className="px-4 py-3">{payee.accountNumber}</td>
                <td className="px-4 py-3">{bankById(payee.bankId)?.name}</td>
                <td className="px-4 py-3"><Status payee={payee} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function NewPayeeScreen() {
  const { state, add } = useBeneficiaries()
  const navigate = useNavigate()
  const [bankId, setBankId] = useState<string>(banks[0].id)
  const [accountNumber, setAccountNumber] = useState('')
  const [category, setCategory] = useState<PayeeCategory>('company')
  const [purpose, setPurpose] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (state.role !== 'clerk') {
    return <EmptyTitle title="Payee clerks add the record" text="Switch the demonstration role to Payee clerk before a new payee is written." />
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const result = add({ bankId, accountNumber, category, purpose })
    if ('error' in result) {
      setError(result.error)
      return
    }
    navigate(`${base}/payees/${result.id}`)
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-4" noValidate>
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">New payee</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Check an account, then submit it</h1>
        <p className="mt-3 text-muted">The account name comes from the sample book for this business. A name typed by hand is not accepted. Submitting sends the payee to finance.</p>
      </header>
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      <PayeeFields bankId={bankId} accountNumber={accountNumber} category={category} purpose={purpose} onBank={setBankId} onAccount={setAccountNumber} onCategory={setCategory} onPurpose={setPurpose} />
      <button type="submit" className="inline-flex min-h-11 w-fit items-center bg-robes-fill px-5 text-sm font-medium text-robes-ink">Check and submit</button>
    </form>
  )
}

export function PayeeScreen() {
  const { id = '' } = useParams()
  const { state, reviewPayee } = useBeneficiaries()
  const payee = state.payees.find((item) => item.id === id)
  useEffect(() => {
    reviewPayee(id)
  }, [reviewPayee, id, state.role, payee?.status])
  if (!payee) return <EmptyTitle title="Payee not found" text="It may have been cleared when the demonstration was reset." />
  return <PayeeDetail payee={payee} />
}

function PayeeDetail({ payee }: { payee: Payee }) {
  const { state, verify, submit, decide } = useBeneficiaries()
  const [bankId, setBankId] = useState<string>(payee.bankId)
  const [accountNumber, setAccountNumber] = useState(payee.accountNumber)
  const [category, setCategory] = useState<PayeeCategory>(payee.category)
  const [purpose, setPurpose] = useState(payee.purpose)
  const [remark, setRemark] = useState('')
  const [error, setError] = useState<string | null>(null)
  const editable = state.role === 'clerk' && (payee.status === 'draft' || payee.status === 'returned')
  const current = state.guide.active && state.guide.focusId === payee.id

  function onVerify() {
    const result = verify(payee.id, { bankId, accountNumber, category, purpose })
    setError(result?.error ?? null)
  }

  function onSubmit() {
    const result = submit(payee.id, { bankId, accountNumber, category, purpose })
    setError(result?.error ?? null)
  }

  function onDecide(action: 'approved' | 'returned') {
    const result = decide(payee.id, action, remark)
    setError(result?.error ?? null)
  }

  return (
    <article className="grid max-w-3xl gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">{payee.number}</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{payee.accountName || 'Account not checked yet'}</h1>
        <p className="mt-3 text-muted">{bankById(payee.bankId)?.name} · {payee.accountNumber} · {categoryLabel[payee.category]}</p>
        <p className="mt-2"><Status payee={payee} />{current ? <span className="ml-2 text-sm text-muted">Current step</span> : null}</p>
      </header>
      <p className="text-sm text-ink">{payee.purpose}</p>
      {payee.verified ? <p className="border border-line bg-card p-4 text-sm text-ink">Checked name: {payee.accountName}. Raised by {actors.clerk.name}.</p> : <p className="text-sm text-muted">The account name stays blank until the sample book confirms it.</p>}
      {payee.decision ? <p className="border border-line bg-card p-4 text-sm text-ink">{payee.decision.by}: {payee.decision.remark}</p> : null}
      {error ? <p className="border border-danger px-3 py-2 text-sm text-danger">{error}</p> : null}
      {editable ? (
        <form className="grid gap-4 border border-line bg-card p-5" onSubmit={(event) => event.preventDefault()}>
          <h2 className="font-serif text-2xl text-ink">{payee.status === 'returned' ? 'Correct and check again' : 'Check this account'}</h2>
          <PayeeFields bankId={bankId} accountNumber={accountNumber} category={category} purpose={purpose} onBank={setBankId} onAccount={setAccountNumber} onCategory={setCategory} onPurpose={setPurpose} />
          <div className="flex flex-wrap gap-3">
            <button type="button" className="min-h-11 border border-line px-4 text-sm" onClick={onVerify}>Check account</button>
            <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={onSubmit}>Submit for approval</button>
          </div>
        </form>
      ) : null}
      {state.role === 'reviewer' && payee.status === 'pending' ? (
        <form className="grid gap-4 border border-line bg-card p-5" onSubmit={(event) => event.preventDefault()}>
          <h2 className="font-serif text-2xl text-ink">Approve or return</h2>
          <p className="text-sm text-muted">Approval means this payee may be paid. Returning it sends the record back to the clerk. A remark is required either way.</p>
          <label className="grid gap-2 text-sm">Remark
            <textarea className="field min-h-24" value={remark} onChange={(event) => setRemark(event.target.value)} />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="min-h-11 bg-robes-fill px-4 text-sm font-medium text-robes-ink" onClick={() => onDecide('approved')}>Approve payee</button>
            <button type="button" className="min-h-11 border border-line px-4 text-sm" onClick={() => onDecide('returned')}>Return payee</button>
          </div>
        </form>
      ) : null}
      {state.role === 'reviewer' && payee.status === 'draft' ? <p className="text-sm text-muted">Switch to Payee clerk to check and submit this draft.</p> : null}
      {state.role === 'clerk' && payee.status === 'pending' ? <p className="text-sm text-muted">Switch to Finance reviewer to approve or return this payee.</p> : null}
    </article>
  )
}

function PayeeFields({
  bankId,
  accountNumber,
  category,
  purpose,
  onBank,
  onAccount,
  onCategory,
  onPurpose,
}: {
  bankId: string
  accountNumber: string
  category: PayeeCategory
  purpose: string
  onBank: (value: string) => void
  onAccount: (value: string) => void
  onCategory: (value: PayeeCategory) => void
  onPurpose: (value: string) => void
}) {
  return (
    <>
      <label className="grid gap-2 text-sm">Bank
        <select className="field" value={bankId} onChange={(event) => onBank(event.target.value)}>
          {banks.map((bank) => <option key={bank.id} value={bank.id}>{bank.name}</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-sm">Account number
        <input className="field" inputMode="numeric" value={accountNumber} onChange={(event) => onAccount(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm">Category
        <select className="field" value={category} onChange={(event) => onCategory(event.target.value as PayeeCategory)}>
          <option value="company">Company</option>
          <option value="business">Business name</option>
          <option value="individual">Individual</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm">Why they should be paid
        <textarea className="field min-h-24" value={purpose} onChange={(event) => onPurpose(event.target.value)} />
      </label>
    </>
  )
}

function Status({ payee }: { payee: Payee }) {
  const tone = payee.status === 'pending' ? 'submitted' : payee.status === 'returned' ? 'rejected' : payee.status
  return <span data-status={tone} className="app-status">{statusLabel(payee.status)}</span>
}

export function ActivityScreen() {
  const { state } = useBeneficiaries()
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-robes uppercase">Activity</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Payee history</h1>
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
