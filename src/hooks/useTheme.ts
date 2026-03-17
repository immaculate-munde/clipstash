'use client'

import { useState, useEffect } from 'react'
import { Theme } from '@/types'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const saved = (localStorage.getItem('cs_theme') as Theme) || 'dark'
    applyTheme(saved)
  }, [])

  function applyTheme(t: Theme) {
    setThemeState(t)
    localStorage.setItem('cs_theme', t)
    if (t === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleTheme() {
    applyTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}
