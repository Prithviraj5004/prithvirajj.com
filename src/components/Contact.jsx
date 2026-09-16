import { contact, contactHandles, links } from '../config.js'
import Section from './Section.jsx'

const rows = [
  { key: 'Email', value: contactHandles.email, href: `mailto:${links.email}`, external: false },
  { key: 'GitHub', value: contactHandles.github, href: links.github, external: true },
  { key: 'LinkedIn', value: contactHandles.linkedin, href: links.linkedin, external: true },
  { key: 'Twitter / X', value: contactHandles.twitter, href: links.twitter, external: true },
]

export default function Contact() {
  return (
    <Section id="contact" label="Contact" index="04">
      <h2 className="mb-5 text-[clamp(2rem,5.5vw,3.25rem)] leading-tight tracking-[-0.025em]">
        {contact.heading}
      </h2>
      <p className="max-w-[62ch] text-[1.0625rem] text-muted">{contact.body}</p>

      <ul className="mt-8 max-w-lg list-none p-0">
        {rows.map((row) => (
          <li key={row.key} className="border-t border-line-soft last:border-b last:border-line-soft">
            <a
              href={row.href}
              {...(row.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="group flex items-center justify-between gap-4 px-1 py-3.5 no-underline transition-[padding] duration-300 ease-soft hover:pl-4"
            >
              <span className="min-w-[5.5rem] text-[0.8125rem] text-muted">{row.key}</span>
              <span className="flex-1 break-all font-serif text-[1.0625rem]">{row.value}</span>
              <span
                aria-hidden="true"
                className="opacity-40 transition-all duration-300 ease-soft group-hover:translate-x-1 group-hover:opacity-100"
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
