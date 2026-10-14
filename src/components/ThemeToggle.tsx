import { useState } from 'react'

type Theme = 'light' | 'dark'

function readTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => readTheme())
  const next = theme === 'dark' ? 'light' : 'dark'

  function apply(value: Theme) {
    document.documentElement.classList.toggle('dark', value === 'dark')
    localStorage.setItem('theme', value)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', value === 'dark' ? '#08111a' : '#f3f0e8')
    setTheme(value)
  }

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      aria-pressed={theme === 'dark'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-ink"
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
