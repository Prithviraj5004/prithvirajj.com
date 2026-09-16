import { useState } from 'react'
import { navItems, profile } from '../config.js'
import ThemeControl from './ThemeControl.jsx'
import { MenuIcon } from './Icons.jsx'

export default function Navbar({ theme }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 nav-blur border-b border-line-soft transition-colors duration-500 ease-soft">
      <div className="wrap">
        <div className="flex h-[4.25rem] items-center justify-between gap-4">
          <a
            href="#top"
            className="whitespace-nowrap font-serif text-[1.0625rem] tracking-[0.01em] no-underline"
          >
            {profile.firstName}
            <span className="hidden sm:inline"> {profile.lastName}</span>
            <span className="hidden text-muted sm:inline"> — {profile.version}</span>
          </a>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group relative py-1 text-sm text-muted no-underline transition-colors duration-200 ease-soft hover:text-ink"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-ink transition-all duration-300 ease-soft group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeControl {...theme} />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-[2.1rem] w-[2.1rem] place-items-center rounded-full border border-line text-ink lg:hidden"
            >
              <MenuIcon open={open} className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden transition-[max-height] duration-500 ease-soft lg:hidden ${
          open ? 'max-h-80 border-t border-line-soft' : 'max-h-0'
        }`}
      >
        <div className="wrap">
          <nav className="flex flex-col pb-5 pt-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="border-b border-line-soft py-3 text-base text-muted no-underline last:border-b-0"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
