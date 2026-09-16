import { footer } from '../config.js'

export default function Footer() {
  return (
    <footer className="border-t border-line-soft py-10">
      <div className="wrap flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 text-[0.8125rem] text-muted">
        <span>{footer.copyright}</span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-[0.45rem] w-[0.45rem] rotate-45 rounded-[1px] bg-accent" />
          {footer.vibe}
        </span>
      </div>
    </footer>
  )
}
