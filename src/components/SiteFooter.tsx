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
            {navigation
              .filter((item) => item.label !== 'Contact')
              .map((item) => (
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
            {robes.navigation
              .filter((item) => item.label !== 'Contact')
              .map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-band-ink hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <p className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-band-muted uppercase">
            <PhoneIcon />
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a className="hover:underline" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2 hover:underline"
                href={`${site.contact.whatsapp}?text=${encodeURIComponent('Hello Robes, I would like to start a conversation.')}`}
                target="_blank"
                rel="noreferrer"
              >
                <PhoneIcon />
                {site.contact.phoneDisplay}
                <span className="text-band-muted">WhatsApp</span>
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

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3.5h3.2l1.2 3.1-1.8 1.1a12.5 12.5 0 0 0 5.7 5.7l1.1-1.8 3.1 1.2V16a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 5 6.7 2 2 0 0 1 7 3.5Z"
      />
    </svg>
  )
}
