'use client'

import { User } from '@supabase/supabase-js'
import { Theme } from '@/types'
import { signOut } from '@/lib/supabase'
import { Button  } from '@/components/ui/Button'
import { Card    } from '@/components/ui/Card'
import { Divider } from '@/components/ui/Misc'

interface SettingsViewProps {
  user:          User
  theme:         Theme
  onToggleTheme: () => void
  onSignedOut:   () => void
  onToast:       (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

export function SettingsView({ user, theme, onToggleTheme, onSignedOut, onToast }: SettingsViewProps) {
  async function handleSignOut() {
    try {
      await signOut()
      onToast('Signed out', 'info')
      onSignedOut()
    } catch {
      onToast('Sign out failed', 'error')
    }
  }

  return (
    <div className="max-w-md animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--text2)] mt-1">Manage your account and preferences</p>
      </div>

      {/* Account */}
      <Card className="mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text3)] font-mono mb-3">
          Account
        </p>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-lg">
            {user.email?.[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-sm">{user.email}</p>
            <p className="text-xs text-[var(--text3)] font-mono">Signed in</p>
          </div>
        </div>
        <Divider className="my-3" />
        <Button variant="danger" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Card>

      {/* Appearance */}
      <Card>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text3)] font-mono mb-3">
          Appearance
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Theme</p>
            <p className="text-xs text-[var(--text3)]">
              Currently {theme === 'dark' ? 'dark' : 'light'} mode
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={onToggleTheme}>
            {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
          </Button>
        </div>
      </Card>

      {/* SQL setup reminder */}
      <div className="mt-6 p-4 bg-[var(--amber-bg)] border border-[var(--amber)] border-opacity-30 rounded-xl">
        <p className="text-xs font-bold text-[var(--amber)] font-mono uppercase tracking-wider mb-1">
          ⚠ Supabase Setup
        </p>
        <p className="text-xs text-[var(--text2)] leading-relaxed">
          Make sure you've run the SQL migration in your Supabase dashboard to create the <code className="font-mono bg-[var(--surface2)] px-1 rounded">clips</code> table and RLS policies.
        </p>
      </div>
    </div>
  )
}
