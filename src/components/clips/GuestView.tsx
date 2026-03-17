'use client'

import { useState, useEffect } from 'react'
import { useGuestClips } from '@/hooks/useClips'
import { genSessionCode, copyToClipboard } from '@/lib/utils'
import { AddClipForm } from '@/components/clips/AddClipForm'
import { ClipsList   } from '@/components/clips/ClipsList'
import { Button      } from '@/components/ui/Button'
import { Card        } from '@/components/ui/Card'

interface GuestViewProps {
  initialCode?: string | null
  onCodeChange: (code: string | null) => void
  onToast:      (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

export function GuestView({ initialCode, onCodeChange, onToast }: GuestViewProps) {
  const [sessionCode, setSessionCode] = useState<string | null>(initialCode ?? null)
  const [joinInput,   setJoinInput]   = useState('')

  const { clips, loading, load, add, remove, clearAll } = useGuestClips(sessionCode)

  // Load clips when session starts
  useEffect(() => {
    if (sessionCode) load()
  }, [sessionCode, load])

  function activate(code: string) {
    setSessionCode(code)
    onCodeChange(code)
  }

  function handleCreate() {
    activate(genSessionCode())
  }

  function handleJoin() {
    const code = joinInput.trim().toUpperCase()
    if (code.length !== 6) { onToast('Enter a valid 6-character code', 'error'); return }
    activate(code)
  }

  function handleLeave() {
    setSessionCode(null)
    onCodeChange(null)
    setJoinInput('')
  }

  async function handleCopyCode() {
    if (!sessionCode) return
    const ok = await copyToClipboard(sessionCode)
    onToast(ok ? 'Code copied!' : `Code: ${sessionCode}`, ok ? 'success' : 'info')
  }

  async function handleShareLink() {
    const url = `${window.location.origin}${window.location.pathname}?code=${sessionCode}`
    if (navigator.share) {
      navigator.share({ title: 'Join my Clipstash session', url })
    } else {
      const ok = await copyToClipboard(url)
      onToast(ok ? 'Link copied!' : url, ok ? 'success' : 'info')
    }
  }

  async function handleAdd(content: string) {
    try {
      await add(content)
      onToast('Clip added ✓', 'success')
    } catch (e: any) {
      onToast(e.message ?? 'Failed to save', 'error')
    }
  }

  async function handleDelete(id: string) {
    try {
      await remove(id)
      onToast('Deleted', 'info')
    } catch {
      onToast('Delete failed', 'error')
    }
  }

  async function handleClearAll() {
    if (!confirm('Clear ALL clips in this session?')) return
    try {
      await clearAll()
      onToast('Session cleared', 'info')
    } catch {
      onToast('Clear failed', 'error')
    }
  }

  // ── No active session ────────────────────────────────────
  if (!sessionCode) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">Guest Clipboard</h1>
          <p className="text-sm text-[var(--text2)] mt-1">
            Share a 6-character code to sync clips across devices — no account needed
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* New session */}
          <Card>
            <p className="font-bold text-base mb-1">🆕 New Session</p>
            <p className="text-sm text-[var(--text2)] mb-4 leading-relaxed">
              Generate a fresh code and start a shared clipboard instantly.
            </p>
            <Button fullWidth onClick={handleCreate}>
              Generate Code
            </Button>
          </Card>

          {/* Join session */}
          <Card>
            <p className="font-bold text-base mb-1">🔑 Join Session</p>
            <p className="text-sm text-[var(--text2)] mb-3 leading-relaxed">
              Enter a code from another device to sync.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinInput}
                onChange={e => setJoinInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
                placeholder="ABC123"
                maxLength={6}
                className="
                  flex-1 bg-[var(--surface2)] border border-[var(--border)] rounded-xl
                  px-3 py-2.5 font-mono text-xl font-bold tracking-[6px] text-center
                  text-[var(--accent)] placeholder:text-[var(--border)]
                  placeholder:text-base placeholder:tracking-[4px]
                  outline-none focus:border-[var(--accent)] transition-colors
                "
              />
              <Button onClick={handleJoin}>Join</Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // ── Active session ───────────────────────────────────────
  return (
    <div className="animate-fade-in">
      {/* Code hero banner */}
      <div
        className="
          rounded-2xl border border-[rgba(79,142,247,0.2)] p-6 text-center mb-6
          bg-gradient-to-br from-[var(--accent-bg)] to-transparent
        "
      >
        <p className="font-mono text-[11px] text-[var(--text3)] uppercase tracking-[2px] mb-2">
          your session code
        </p>
        <p className="font-mono text-4xl font-bold text-[var(--accent)] tracking-[12px] mb-2">
          {sessionCode}
        </p>
        <p className="text-sm text-[var(--text2)] mb-4">
          Open Clipstash on any device and enter this code to sync
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={handleCopyCode}>📋 Copy Code</Button>
          <Button variant="secondary" size="sm" onClick={handleShareLink}>🔗 Share Link</Button>
          <Button variant="ghost"     size="sm" onClick={handleLeave}>✕ Leave</Button>
        </div>
      </div>

      {/* Add clip */}
      <AddClipForm onAdd={handleAdd} showLabel={false} />

      {/* List */}
      <ClipsList
        clips={clips}
        loading={loading}
        onDelete={handleDelete}
        onCopied={() => onToast('Copied!', 'success')}
        onError={() => onToast('Copy failed', 'error')}
        emptyTitle="No clips in this session"
        emptySubtitle="Add something above, then open this code on another device."
        headerActions={
          <div className="flex gap-2">
            <Button variant="ghost"  size="sm" onClick={load}>↻ Refresh</Button>
            <Button variant="danger" size="sm" onClick={handleClearAll}>🗑 Clear All</Button>
          </div>
        }
      />
    </div>
  )
}
