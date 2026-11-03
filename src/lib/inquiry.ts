import { site } from '../content/site.ts'

export type InquiryPayload = {
  name: string
  email: string
  organization: string
  country: string
  service: string
  challenge: string
  budget: string
  timeline: string
  pathway: 'personal' | 'robes'
  subject: string
  body: string
}

/** A Web3Forms access key is a public form identifier, not an account password. Leave it unset to keep mailto. */
export function inquiryConfigured() {
  return Boolean(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim())
}

export async function deliverInquiry(payload: InquiryPayload) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim()
  if (!accessKey) return 'mailto' as const

  // Web3Forms honeypot is an unchecked checkbox named botcheck. Omit it here.
  // Sending botcheck: true would mark a real visitor as a bot. The form's
  // companyWebsite field is the client honeypot and is never posted.
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      subject: payload.subject,
      from_name: payload.name,
      email: payload.email,
      message: payload.body,
      organization: payload.organization,
      country: payload.country,
      service: payload.service,
      budget: payload.budget || 'Not specified',
      timeline: payload.timeline || 'Not specified',
      pathway: payload.pathway,
      replyto: payload.email,
    }),
  })

  const data = (await response.json().catch(() => null)) as {
    success?: boolean
    message?: string
    body?: { message?: string }
  } | null
  if (!response.ok || data?.success !== true) {
    throw new Error(data?.message || data?.body?.message || 'The inquiry was not accepted.')
  }
  return 'delivered' as const
}

export function mailtoHref(subject: string, body: string) {
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
