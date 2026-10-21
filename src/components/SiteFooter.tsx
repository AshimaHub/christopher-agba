import { Link } from 'react-router-dom'
import { navigation, site, socialLinks } from '../content/site.ts'
import { robes } from '../content/robes.ts'
import { Portrait } from './Portrait.tsx'
import { RobesLogo } from './RobesLogo.tsx'

export function SiteFooter() {
  const profiles = socialLinks()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-band text-band-ink">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <Portrait alt="" className="mb-4 h-16 w-16 rounded-full border border-white/15" />
          <Link to="/about" className="font-serif text-3xl hover:underline">
            {site.name}
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-band-muted">{site.role}</p>
          <ul className="mt-4 space-y-2">
            {navigation.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm text-band-ink hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <RobesLogo surface="dark" className="h-16 w-auto max-w-[5rem] object-contain object-left" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-band-muted">{robes.proposition}</p>
          <ul className="mt-4 space-y-2">
            {robes.navigation.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm text-band-ink hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-band-muted uppercase">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link className="hover:underline" to="/contact">
                Contact Christopher
              </Link>
            </li>
            <li>
              <Link className="hover:underline" to="/robes/contact">
                Contact Robes
              </Link>
            </li>
            <li>
              <a className="hover:underline" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </li>
            <li>
              <a className="hover:underline" href={`tel:${site.contact.phoneTel}`}>
                {site.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="hover:underline" href={site.contact.whatsapp}>
                WhatsApp
              </a>
            </li>
            <li className="text-band-muted">{site.contact.location}</li>
            {profiles.map((profile) => (
              <li key={profile.href}>
                <a className="hover:underline" href={profile.href} target="_blank" rel="noreferrer">
                  {profile.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-6xl px-5 py-5 text-xs leading-relaxed text-band-muted sm:px-8">
          © {year} {site.name}. {robes.name} is an emerging brand on this site. It is not presented
          as a registered company or a large team.
        </p>
      </div>
    </footer>
  )
}
