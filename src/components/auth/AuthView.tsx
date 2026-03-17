'use client'

import { useState } from 'react'
import { signIn, signUp, signInWithGoogle } from '@/lib/supabase'
import { Button  } from '@/components/ui/Button'
import { Input   } from '@/components/ui/Input'
import { Card    } from '@/components/ui/Card'
import { Divider } from '@/components/ui/Misc'

interface AuthViewProps {
  onGuestMode: () => void
  onToast:     (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

type Tab = 'login' | 'signup'

export function AuthView({ onGuestMode, onToast }: AuthViewProps) {
  const [tab,           setTab]           = useState<Tab>('login')
  const [loading,       setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Login fields
  const [loginEmail,    setLoginEmail]    = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Signup fields
  const [signupEmail,    setSignupEmail]    = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm,  setSignupConfirm]  = useState('')

  async function handleLogin() {
    if (!loginEmail || !loginPassword) { onToast('Fill in all fields', 'error'); return }
    setLoading(true)
    try {
      await signIn(loginEmail, loginPassword)
      onToast('Welcome back! 👋', 'success')
    } catch (e: any) {
      onToast(e.message ?? 'Sign in failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup() {
    if (!signupEmail || !signupPassword || !signupConfirm) { onToast('Fill in all fields', 'error'); return }
    if (signupPassword !== signupConfirm)                  { onToast('Passwords do not match', 'error'); return }
    if (signupPassword.length < 6)                         { onToast('Password must be at least 6 characters', 'error'); return }
    setLoading(true)
    try {
      await signUp(signupEmail, signupPassword)
      onToast('Account created! Check your email to confirm.', 'success')
    } catch (e: any) {
      onToast(e.message ?? 'Sign up failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      // Supabase redirects the page — no further action needed here
    } catch (e: any) {
      onToast(e.message ?? 'Google sign-in failed', 'error')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img 
            src="/clipstash-logo.png" 
            alt="Clipstash Logo" 
            className="w-16 h-16 object-contain" 
          />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Welcome to Clipstash</h1>
        <p className="text-sm text-[var(--text2)]">
          Sign in to save clips permanently across all your devices
        </p>
      </div>

      {/* Google OAuth button */}
      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        className="
          w-full flex items-center justify-center gap-3
          bg-[var(--surface)] border border-[var(--border)] rounded-xl
          px-4 py-3 mb-4 font-semibold text-sm text-[var(--text)]
          hover:border-[var(--border2)] hover:bg-[var(--surface2)]
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {googleLoading ? (
          <span className="w-4 h-4 border-2 border-[var(--border2)] border-t-[var(--accent)] rounded-full animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
        )}
        {googleLoading ? 'Redirecting…' : 'Continue with Google'}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-[11px] font-mono text-[var(--text3)] uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      {/* Tab switcher */}
      <div className="flex bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-1 mb-4">
        {(['login', 'signup'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`
              flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200
              ${tab === t
                ? 'bg-[var(--accent)] text-white shadow-[0_2px_10px_var(--accent-glow)]'
                : 'text-[var(--text2)] hover:text-[var(--text)]'}
            `}
          >
            {t === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </div>

      {/* Email/password forms */}
      <Card>
        {tab === 'login' ? (
          <div className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <Button fullWidth loading={loading} onClick={handleLogin}>
              Sign In
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={signupEmail}
              onChange={e => setSignupEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={signupPassword}
              onChange={e => setSignupPassword(e.target.value)}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
            />
            <Input
              label="Confirm Password"
              type="password"
              value={signupConfirm}
              onChange={e => setSignupConfirm(e.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
            />
            <Button fullWidth loading={loading} onClick={handleSignup}>
              Create Account
            </Button>
          </div>
        )}
      </Card>

      <Divider />
      <p className="text-center text-xs text-[var(--text3)] font-mono mb-3">
        or continue without an account
      </p>
      <Button variant="secondary" fullWidth onClick={onGuestMode}>
        Use Guest Mode →
      </Button>
    </div>
  )
}