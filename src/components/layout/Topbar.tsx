'use client'

import { User } from '@supabase/supabase-js'
import { Theme, ActiveView } from '@/types'
import { Button } from '@/components/ui/Button'

interface TopbarProps {
  user:        User | null
  theme:       Theme
  onToggleTheme: () => void
  onNavigate:  (view: ActiveView) => void
}

export function Topbar({ user, theme, onToggleTheme, onNavigate }: TopbarProps) {
  const initials = user?.email?.[0].toUpperCase() ?? 'U'
  const username = user?.email?.split('@')[0] ?? ''

  return (
    <header
      className="
        sticky top-0 z-50 h-[60px] px-6
        flex items-center justify-between gap-4
        bg-[var(--bg)] border-b border-[var(--border)]
        backdrop-blur-md transition-[background,border-color] duration-300
      "
    >
      {/* Logo */}
      <button
        onClick={() => onNavigate(user ? 'my-clips' : 'auth')}
        className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-[var(--text)] hover:opacity-80 transition-opacity"
      >
        <img 
          src="/clipstash-logo.svg" 
          alt="Clipstash Logo" 
          className="w-8 h-8 object-contain" 
        />
        Clipstash
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-2.5">
        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="
            w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)]
            flex items-center justify-center text-base text-[var(--text2)]
            hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all
          "
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* User chip or sign-in */}
        {user ? (
          <button
            onClick={() => onNavigate('settings')}
            className="
              flex items-center gap-2 pl-1.5 pr-3 py-1.5
              bg-[var(--surface)] border border-[var(--border)] rounded-full
              text-sm font-semibold text-[var(--text2)]
              hover:border-[var(--accent)] hover:text-[var(--text)] transition-all
            "
          >
            <span className="w-[26px] h-[26px] rounded-full bg-[var(--accent)] flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </span>
            {username}
          </button>
        ) : (
          <Button size="sm" onClick={() => onNavigate('auth')}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  )
}