import { links, profile } from '../config.js'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons.jsx'

/* Staggered entrance for the hero — the page's single orchestrated moment. */
const step = (i) => ({ animationDelay: `${0.05 + i * 0.09}s` })

export default function Hero() {
  return (
    <section id="top" className="pb-12 pt-14 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-24">
      <div className="wrap">
        <div
          className="seq inline-flex items-center gap-2.5 rounded-full border border-line py-1.5 pl-2 pr-3.5 text-xs text-muted"
          style={step(0)}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
          />
          <span className="rounded-full border border-line-soft bg-surface px-2 font-serif text-[0.8125rem] text-ink">
            {profile.version}
          </span>
          initial portfolio, still being built
        </div>

        <h1
          className="seq mt-6 text-[clamp(2.6rem,9vw,5.25rem)] leading-[1.02] tracking-[-0.03em]"
          style={step(1)}
        >
          {profile.firstName}
          <br />
          {profile.lastName}
        </h1>

        <p className="seq mt-3 text-[clamp(1rem,2.4vw,1.25rem)] text-muted" style={step(2)}>
          {profile.role}
        </p>

        <p
          className="seq mt-7 max-w-[54ch] text-[clamp(1rem,2.1vw,1.1875rem)]"
          style={step(3)}
        >
          {profile.intro}
        </p>

        <div className="seq mt-9 flex flex-wrap gap-3" style={step(4)}>
          <a className="btn btn-solid" href={`mailto:${links.email}`}>
            <MailIcon className="h-4 w-4 shrink-0" />
            Get in touch
          </a>
          <a className="btn btn-ghost" href={links.github} target="_blank" rel="noreferrer">
            <GitHubIcon className="h-4 w-4 shrink-0" />
            GitHub
          </a>
          <a className="btn btn-ghost" href={links.linkedin} target="_blank" rel="noreferrer">
            <LinkedInIcon className="h-4 w-4 shrink-0" />
            LinkedIn
          </a>
        </div>

        <div
          className="seq mt-12 max-w-[56ch] border-l-2 border-accent py-1 pl-5 sm:mt-14"
          style={step(5)}
        >
          <p className="font-serif text-[clamp(1.0625rem,2.4vw,1.3125rem)] leading-snug">
            {profile.notice}
          </p>
          <p className="mt-2 text-[0.8125rem] text-muted">{profile.noticeSub}</p>
        </div>
      </div>
    </section>
  )
}
