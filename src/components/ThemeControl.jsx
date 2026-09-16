import { MoonIcon, SunIcon } from './Icons.jsx'

/* The swatch colour of each level, so the control previews what it does. */
const SWATCHES = {
  1: { bg: '#FFFBF4', fg: '#565449', name: 'lightest' },
  2: { bg: '#D8CFBC', fg: '#565449', name: 'light' },
  3: { bg: '#565449', fg: '#FFFBF4', name: 'dark' },
  4: { bg: '#11120D', fg: '#D8CFBC', name: 'darkest' },
}

function LevelButton({ value, active, onSelect }) {
  const { bg, fg, name } = SWATCHES[value]
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={active}
      aria-label={`Theme level ${value}, ${name}`}
      style={{
        background: bg,
        color: fg,
        boxShadow: active ? '0 0 0 2px var(--bg), 0 0 0 3.5px var(--text)' : 'none',
      }}
      className="grid h-[1.7rem] w-[1.7rem] place-items-center rounded-full border border-[rgba(86,84,73,0.3)] text-[0.6875rem] font-medium leading-none transition-all duration-300 ease-soft hover:-translate-y-0.5"
    >
      {value}
    </button>
  )
}

export default function ThemeControl({ level, setLevel, isDark, toggleMode }) {
  return (
    <div className="flex items-center gap-2">
      <div
        role="group"
        aria-label="Theme level, 1 is lightest and 4 is darkest"
        className="flex items-center gap-[0.3rem] rounded-full border border-line p-[0.28rem]"
      >
        <LevelButton value={1} active={level === 1} onSelect={setLevel} />
        <LevelButton value={2} active={level === 2} onSelect={setLevel} />
        <span aria-hidden="true" className="mx-[0.1rem] h-[1.15rem] w-px bg-line" />
        <LevelButton value={3} active={level === 3} onSelect={setLevel} />
        <LevelButton value={4} active={level === 4} onSelect={setLevel} />
      </div>

      <button
        type="button"
        onClick={toggleMode}
        title={isDark ? 'Switch to light levels' : 'Switch to dark levels'}
        aria-label={isDark ? 'Switch to light levels' : 'Switch to dark levels'}
        className="grid h-[2.1rem] w-[2.1rem] place-items-center rounded-full border border-line text-ink transition-colors duration-300 ease-soft hover:border-accent hover:bg-accent hover:text-on-accent"
      >
        {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
      </button>
    </div>
  )
}
