import { useEffect } from 'react'
import { site } from '../content/site.ts'

type SeoProps = {
  title: string
  description: string
  path: string
  jsonLd?: object
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`
  const existing = document.head.querySelector(selector)
  if (!content) {
    existing?.remove()
    return
  }
  const element = existing ?? document.createElement('meta')
  element.setAttribute(attribute, key)
  element.setAttribute('content', content)
  if (!existing) document.head.appendChild(element)
}

function upsertLink(rel: string, href: string) {
  const existing = document.head.querySelector(`link[rel="${rel}"]`)
  if (!href) {
    existing?.remove()
    return
  }
  const element = existing ?? document.createElement('link')
  element.setAttribute('rel', rel)
  element.setAttribute('href', href)
  if (!existing) document.head.appendChild(element)
}

export function Seo({ title, description, path, jsonLd }: SeoProps) {
  useEffect(() => {
    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:locale', 'en_NG')
    upsertMeta('name', 'twitter:card', 'summary')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)

    const url = site.siteUrl ? new URL(path, site.siteUrl).toString() : ''
    upsertMeta('property', 'og:url', url)
    upsertLink('canonical', url)

    const image = site.siteUrl ? new URL(site.portrait, site.siteUrl).toString() : ''
    upsertMeta('property', 'og:image', image)
  }, [title, description, path])

  if (!jsonLd) return null

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  )
}
