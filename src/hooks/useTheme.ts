'use client'

import { useState, useEffect } from 'react'
import { Theme } from '@/types'

export function useTheme() {
  // Default to dark — no localStorage access during SSR
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only runs in the browser
    setMounted(true)
    const saved = (localStorage.getItem('cs_theme') as Theme) || 'dark'
    applyTheme(saved)
  }, [])

  function applyTheme(t: Theme) {
    setThemeState(t)
    if (typeof window === 'undefined') return
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

  return { theme, toggleTheme, mounted }
}