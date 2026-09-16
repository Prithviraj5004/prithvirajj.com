import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'ps-theme-level'

/** Reads the level that index.html already applied before paint. */
function initialLevel() {
  const attr = Number(document.documentElement.getAttribute('data-level'))
  return attr >= 1 && attr <= 4 ? attr : 1
}

/**
 * Four theme levels: 1 (lightest) → 4 (darkest).
 * Levels 1–2 are "light", 3–4 are "dark".
 * The choice is stored in localStorage; first visit follows the system preference.
 */
export function useThemeLevel() {
  const [level, setLevel] = useState(initialLevel)

  // Remember the last level used in each mode, so toggling feels predictable.
  const lastLight = useRef(level < 3 ? level : 1)
  const lastDark = useRef(level >= 3 ? level : 4)

  useEffect(() => {
    document.documentElement.setAttribute('data-level', String(level))
    if (level < 3) lastLight.current = level
    else lastDark.current = level
    try {
      localStorage.setItem(STORAGE_KEY, String(level))
    } catch {
      /* storage can be unavailable — the site still works */
    }
  }, [level])

  const isDark = level >= 3

  const toggleMode = useCallback(() => {
    setLevel((current) => (current < 3 ? lastDark.current : lastLight.current))
  }, [])

  return { level, setLevel, isDark, toggleMode }
}
