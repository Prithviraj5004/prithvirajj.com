/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // All colours come from CSS variables set per theme level in index.css.
        // Note: opacity modifiers (e.g. bg-bg/50) don't work on these.
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        raise: 'var(--raise)',
        ink: 'var(--text)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        'line-soft': 'var(--line-soft)',
        accent: 'var(--accent)',
        'on-accent': 'var(--on-accent)',
      },
      fontFamily: {
        serif: ['Fraunces', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        page: '1060px',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(.2,.7,.2,1)',
      },
    },
  },
  plugins: [],
}
