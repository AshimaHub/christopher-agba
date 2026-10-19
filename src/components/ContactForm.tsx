import { useId, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { site } from '../content/site.ts'
import { primaryAction, robesAction } from '../lib/styles.ts'

type Choice = { id: string; title: string }
type Pathway = 'personal' | 'robes'

type FieldName = 'name' | 'organization' | 'email' | 'service' | 'challenge'
type Errors = Partial<Record<FieldName, string>>

type FormState = {
  name: string
  organization: string
  email: string
  service: string
  challenge: string
  budget: string
  companyWebsite: string
}

function initialService(requested: string | null, choices: Choice[]) {
  if (!requested) return ''
  return choices.some((choice) => choice.id === requested) ? requested : ''
}

function initialChallenge(service: string | null, intent: string | null) {
  if (service === 'clearrequest' && intent === 'similar') {
    return 'I would like a material-request and approval solution similar to the ClearRequest demonstration, adapted to our operation.'
  }
  if (service === 'clearrequest' && intent === 'workflow') {
    return 'I would like to discuss a business workflow. The ClearRequest demonstration is close to the visibility we need.'
  }
  if (service === 'waynote' && intent === 'similar') {
    return 'I would like a loading-note solution similar to the Waynote demonstration, adapted to our operation.'
  }
  if (service === 'waynote' && intent === 'workflow') {
    return 'I would like to discuss a business workflow. The Waynote demonstration is close to the loading-note visibility we need.'
  }
  if (service === 'spendgate' && intent === 'similar') {
    return 'I would like an expense-sheet solution similar to the SpendGate demonstration, adapted to our operation.'
  }
  if (service === 'spendgate' && intent === 'workflow') {
    return 'I would like to discuss a business workflow. The SpendGate demonstration is close to the expense approval we need.'
  }
  return ''
}

function validate(values: FormState): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (values.organization.trim().length < 2) {
    errors.organization = 'Enter your business or organization.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!values.service) errors.service = 'Select the type of service you need.'
  if (values.challenge.trim().length < 20) {
    errors.challenge = 'Describe the challenge in at least a short paragraph.'
  }
  return errors
}

function buildMessage(values: FormState, choices: Choice[], pathway: Pathway) {
  const service = choices.find((choice) => choice.id === values.service)?.title ?? values.service
  const recipient = pathway === 'robes' ? 'Robes Leadership | Technology' : 'Christopher Agba'
  const subject = `${pathway === 'robes' ? 'Robes consultation' : 'Professional inquiry'} from ${values.organization.trim()} — ${service}`
  const body = [
    `Inquiry for: ${recipient}`,
    `Name: ${values.name.trim()}`,
    `Organization: ${values.organization.trim()}`,
    `Email: ${values.email.trim()}`,
    `Topic: ${service}`,
    `Budget or timeline: ${values.budget.trim() || 'Not specified'}`,
    '',
    'Challenge:',
    values.challenge.trim(),
  ].join('\n')
  return { subject, body }
}

export function ContactForm({
  pathway = 'personal',
  choices,
}: {
  pathway?: Pathway
  choices: Choice[]
}) {
  const formId = useId()
  const [params] = useSearchParams()
  const [values, setValues] = useState<FormState>({
    name: '',
    organization: '',
    email: '',
    service: initialService(params.get('service'), choices),
    challenge: initialChallenge(params.get('service'), params.get('intent')),
    budget: '',
    companyWebsite: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [prepared, setPrepared] = useState<{ subject: string; body: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [blocked, setBlocked] = useState(false)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    if (key !== 'budget' && key !== 'companyWebsite' && key in errors) {
      setErrors((current) => {
        const next = { ...current }
        delete next[key as FieldName]
        return next
      })
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCopied(false)
    setCopyFailed(false)
    setBlocked(false)

    if (values.companyWebsite.trim()) {
      setBlocked(true)
      setPrepared(null)
      return
    }

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setPrepared(null)
      return
    }

    const message = buildMessage(values, choices, pathway)
    setPrepared({ subject: message.subject, body: message.body })
    const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(message.body)}`
    if (mailto.length < 1800) {
      window.location.href = mailto
    }
  }

  async function copyMessage() {
    if (!prepared) return
    const text = `To: ${site.contact.email}\nSubject: ${prepared.subject}\n\n${prepared.body}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setCopyFailed(false)
    } catch {
      setCopied(false)
      setCopyFailed(true)
    }
  }

  const errorCount = Object.keys(errors).length

  return (
    <form
      className="relative space-y-5"
      onSubmit={onSubmit}
      noValidate
      aria-describedby={`${formId}-note`}
    >
      <p id={`${formId}-note`} className="text-sm leading-relaxed text-muted">
        This inquiry is for {pathway === 'robes' ? 'Robes Leadership | Technology' : 'Christopher Agba'}.
        Both pathways use {site.contact.email} while the brand is being built. This site does not
        store the message. It prepares an email for you to send, or to copy if your email app does
        not open.
      </p>

      {errorCount > 0 ? (
        <div role="alert" className="border border-danger px-4 py-3 text-sm text-danger">
          Check the {errorCount === 1 ? 'highlighted field' : `${errorCount} highlighted fields`}{' '}
          before preparing the email.
        </div>
      ) : null}

      {blocked ? (
        <p role="alert" className="border border-danger px-4 py-3 text-sm text-danger">
          This inquiry could not be prepared.
        </p>
      ) : null}

      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Company website</label>
        <input
          id={`${formId}-website`}
          tabIndex={-1}
          autoComplete="off"
          value={values.companyWebsite}
          onChange={(event) => update('companyWebsite', event.target.value)}
        />
      </div>

      <Field
        id={`${formId}-name`}
        label="Full name"
        error={errors.name}
        value={values.name}
        autoComplete="name"
        onChange={(value) => update('name', value)}
      />
      <Field
        id={`${formId}-organization`}
        label="Business or organization"
        error={errors.organization}
        value={values.organization}
        autoComplete="organization"
        onChange={(value) => update('organization', value)}
      />
      <Field
        id={`${formId}-email`}
        label="Email address"
        type="email"
        error={errors.email}
        value={values.email}
        autoComplete="email"
        onChange={(value) => update('email', value)}
      />

      <div>
        <label htmlFor={`${formId}-service`} className="mb-2 block text-sm font-medium text-ink">
          {pathway === 'robes' ? 'Type of solution needed' : 'What do you want to discuss?'}
        </label>
        <select
          id={`${formId}-service`}
          className="field"
          value={values.service}
          aria-invalid={Boolean(errors.service)}
          aria-describedby={errors.service ? `${formId}-service-error` : undefined}
          onChange={(event) => update('service', event.target.value)}
        >
          <option value="">Select one</option>
          {choices.map((choice) => (
            <option key={choice.id} value={choice.id}>
              {choice.title}
            </option>
          ))}
        </select>
        {errors.service ? (
          <p id={`${formId}-service-error`} className="mt-2 text-sm text-danger">
            {errors.service}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${formId}-challenge`} className="mb-2 block text-sm font-medium text-ink">
          Brief description of the challenge
        </label>
        <textarea
          id={`${formId}-challenge`}
          className="field min-h-36 resize-y"
          value={values.challenge}
          aria-invalid={Boolean(errors.challenge)}
          aria-describedby={errors.challenge ? `${formId}-challenge-error` : undefined}
          onChange={(event) => update('challenge', event.target.value)}
        />
        {errors.challenge ? (
          <p id={`${formId}-challenge-error`} className="mt-2 text-sm text-danger">
            {errors.challenge}
          </p>
        ) : null}
      </div>

      <Field
        id={`${formId}-budget`}
        label="Project budget or timeline (optional)"
        error={undefined}
        value={values.budget}
        onChange={(value) => update('budget', value)}
        hint="For example: this quarter, or a range you already have in mind."
      />

      <button type="submit" className={pathway === 'robes' ? robesAction : primaryAction}>
        {pathway === 'robes' ? 'Request a consultation' : 'Prepare email inquiry'}
      </button>

      {prepared ? (
        <div className="border border-line bg-paper-2 p-5" aria-live="polite">
          <h3 className="font-serif text-2xl text-ink">Your inquiry is ready to send</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            If your email app opened, review the message and send it. If it did not, copy the text
            below and email it to {site.contact.email}. Nothing has been submitted to a server.
          </p>
          <p className="mt-4 text-sm text-ink">
            <span className="font-medium">To:</span> {site.contact.email}
          </p>
          <p className="mt-1 text-sm text-ink">
            <span className="font-medium">Subject:</span> {prepared.subject}
          </p>
          <textarea
            className="field mt-4 min-h-48"
            readOnly
            aria-label="Prepared inquiry"
            value={prepared.body}
          />
          <button
            type="button"
            className={`${pathway === 'robes' ? robesAction : primaryAction} mt-4`}
            onClick={copyMessage}
          >
            {copied ? 'Copied' : 'Copy inquiry'}
          </button>
          {copyFailed ? (
            <p className="mt-3 text-sm text-danger">
              Copying was blocked by the browser. Select the message above and copy it manually.
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  hint,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  autoComplete?: string
  hint?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="field"
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
