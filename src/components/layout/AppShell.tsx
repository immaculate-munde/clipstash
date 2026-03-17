'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { ActiveView } from '@/types'
import { useTheme  } from '@/hooks/useTheme'
import { useToast  } from '@/hooks/useToast'

import { Topbar          } from './Topbar'
import { Sidebar         } from './Sidebar'
import { Footer          } from './Footer'
import { ToastContainer  } from '@/components/ui/Toast'
import { AuthView        } from '@/components/auth/AuthView'
import { MyClipsView     } from '@/components/clips/MyClipsView'
import { GuestView       } from '@/components/clips/GuestView'
import { SettingsView    } from '@/components/clips/SettingsView'
import { copyToClipboard } from '@/lib/utils'

export function AppShell() {
  const [user,        setUser]        = useState<User | null>(null)
  const [activeView,  setActiveView]  = useState<ActiveView>('auth')
  const [guestCode,   setGuestCode]   = useState<string | null>(null)
  const [myClipCount, setMyClipCount] = useState(0)
  const [ready,       setReady]       = useState(false)

  const { theme, toggleTheme } = useTheme()
  const { toasts, toast, removeToast } = useToast()

  // ── Auth listener + URL code ─────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlCode = params.get('code')?.toUpperCase() ?? null

    supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        setActiveView('my-clips')
      } else if (urlCode && urlCode.length === 6) {
        setGuestCode(urlCode)
        setActiveView('guest')
      } else {
        setActiveView('auth')
      }
      setReady(true)
    })
  }, [])

  // ── Keyboard shortcut: Cmd/Ctrl+K to focus textarea ──────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.querySelector<HTMLTextAreaElement>('textarea')?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function handleCopyGuestCode() {
    if (!guestCode) return
    const ok = await copyToClipboard(guestCode)
    toast(ok ? 'Code copied!' : `Code: ${guestCode}`, ok ? 'success' : 'info')
  }

  // ── Loading Screen ───────────────────────────────────────
  if (!ready) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--bg)] gap-4">
        <img 
          src="/clipstash-logo.svg" 
          alt="Loading Clipstash" 
          className="w-12 h-12 object-contain animate-pulse" 
        />
        <p className="font-mono text-sm text-[var(--text3)]">loading clipstash…</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">

        {/* Topbar */}
        <Topbar
          user={user}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={setActiveView}
        />

        {/* Body — sidebar + main content */}
        <div className="flex flex-1 max-w-[1200px] w-full mx-auto">

          <Sidebar
            user={user}
            activeView={activeView}
            clipCount={myClipCount}
            guestCode={guestCode}
            onNavigate={setActiveView}
            onCopyCode={handleCopyGuestCode}
          />

          <main className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-60px)] max-md:pb-24 max-md:p-5">

            {activeView === 'auth' && (
              <AuthView
                onGuestMode={() => setActiveView('guest')}
                onToast={toast}
              />
            )}

            {activeView === 'my-clips' && user && (
              <MyClipsView
                user={user}
                onToast={toast}
              />
            )}

            {activeView === 'guest' && (
              <GuestView
                initialCode={guestCode}
                onCodeChange={setGuestCode}
                onToast={toast}
              />
            )}

            {activeView === 'settings' && user && (
              <SettingsView
                user={user}
                theme={theme}
                onToggleTheme={toggleTheme}
                onSignedOut={() => {
                  setUser(null)
                  setActiveView('auth')
                }}
                onToast={toast}
              />
            )}

          </main>
        </div>

        {/* Footer — outside the body row so it sits below everything */}
        <Footer />

      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}