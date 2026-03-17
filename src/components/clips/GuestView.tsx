'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useGuestClips } from '@/hooks/useClips'
import { genSessionCode, copyToClipboard } from '@/lib/utils'
import { AddClipForm   } from '@/components/clips/AddClipForm'
import { ClipsList     } from '@/components/clips/ClipsList'
import { Button        } from '@/components/ui/Button'
import { Card          } from '@/components/ui/Card'
import { AboutSection  } from '@/components/layout/AboutSection'
import { QRCodeDisplay } from '@/components/clips/QRCodeDisplay'

// ── Dynamically import QRScanner (uses browser camera API — no SSR) ──
const QRScanner = dynamic(
  () => import('@/components/clips/QRScanner').then(m => m.QRScanner),
  { ssr: false, loading: () => null }
)

interface GuestViewProps {
  initialCode?: string | null
  onCodeChange: (code: string | null) => void
  onToast:      (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

export function GuestView({ initialCode, onCodeChange, onToast }: GuestViewProps) {
  const [sessionCode, setSessionCode] = useState<string | null>(initialCode ?? null)
  const [joinInput,   setJoinInput]   = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [showQR,      setShowQR]      = useState(false)

  const { clips, loading, load, add, remove, clearAll } = useGuestClips(sessionCode)

  useEffect(() => {
    if (sessionCode) load()
  }, [sessionCode, load])

  function activate(code: string) {
    setSessionCode(code)
    onCodeChange(code)
  }

  function handleCreate() { activate(genSessionCode()) }

  function handleJoin() {
    const code = joinInput.trim().toUpperCase()
    if (code.length !== 6) { onToast('Enter a valid 6-character code', 'error'); return }
    activate(code)
  }

  function handleQRScan(code: string) {
    setShowScanner(false)
    activate(code)
    onToast(`Joined session ${code} via QR! 📱`, 'success')
  }

  function handleLeave() {
    setSessionCode(null)
    onCodeChange(null)
    setJoinInput('')
    setShowQR(false)
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
    try { await add(content); onToast('Clip added ✓', 'success') }
    catch (e: any) { onToast(e.message ?? 'Failed to save', 'error') }
  }

  async function handleDelete(id: string) {
    try { await remove(id); onToast('Deleted', 'info') }
    catch { onToast('Delete failed', 'error') }
  }

  async function handleClearAll() {
    if (!confirm('Clear ALL clips in this session?')) return
    try { await clearAll(); onToast('Session cleared', 'info') }
    catch { onToast('Clear failed', 'error') }
  }

  // ── No active session ────────────────────────────────────
  if (!sessionCode) {
    return (
      <div className="animate-fade-in">
        {showScanner && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowScanner(false)}
          />
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">Guest Clipboard</h1>
          <p className="text-sm text-[var(--text2)] mt-1">
            Share a 6-character code to sync clips across devices — no account needed
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Card>
            <p className="font-bold text-base mb-1">🆕 New Session</p>
            <p className="text-sm text-[var(--text2)] mb-4 leading-relaxed">
              Generate a fresh code and start a shared clipboard instantly.
            </p>
            <Button fullWidth onClick={handleCreate}>Generate Code</Button>
          </Card>

          <Card>
            <p className="font-bold text-base mb-1">🔑 Join by Code</p>
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

        <Card>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-bold text-base mb-1">📷 Scan QR Code</p>
              <p className="text-sm text-[var(--text2)]">
                Point your camera at a Clipstash session QR code to join instantly.
              </p>
            </div>
            <Button variant="secondary" onClick={() => setShowScanner(true)}>
              Open Scanner
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // ── Active session ───────────────────────────────────────
  return (
    <div className="animate-fade-in">
      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      <div className="rounded-2xl border border-[rgba(79,142,247,0.2)] p-6 mb-6 bg-gradient-to-br from-[var(--accent-bg)] to-transparent">
        <p className="font-mono text-[11px] text-[var(--text3)] uppercase tracking-[2px] mb-2">
          your session code
        </p>
        <p className="font-mono text-4xl font-bold text-[var(--accent)] tracking-[12px] mb-2">
          {sessionCode}
        </p>
        <p className="text-sm text-[var(--text2)] mb-5">
          Open Clipstash on any device and enter this code — or scan the QR below
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={handleCopyCode}>📋 Copy Code</Button>
          <Button variant="secondary" size="sm" onClick={handleShareLink}>🔗 Share Link</Button>
          <Button variant="secondary" size="sm" onClick={() => setShowQR(v => !v)}>
            {showQR ? '🙈 Hide QR' : '📷 Show QR'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLeave}>✕ Leave</Button>
        </div>

        {showQR && (
          <div className="mt-5 flex justify-center animate-fade-in">
            <QRCodeDisplay
              sessionCode={sessionCode}
              onClose={() => setShowQR(false)}
            />
          </div>
        )}
      </div>

      <AddClipForm onAdd={handleAdd} showLabel={false} />

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
      <AboutSection />
    </div>
  )
}
