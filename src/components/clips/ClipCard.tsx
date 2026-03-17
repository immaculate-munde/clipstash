'use client'

import { useState } from 'react'
import { Clip } from '@/types'
import { formatClipTime, copyToClipboard } from '@/lib/utils'
import { Badge } from '@/components/ui/Misc'

interface ClipCardProps {
  clip:     Clip
  onDelete: (id: string) => Promise<void>
  onCopied: () => void
  onError:  () => void
}

export function ClipCard({ clip, onDelete, onCopied, onError }: ClipCardProps) {
  const [expanded,  setExpanded]  = useState(false)
  const [deleting,  setDeleting]  = useState(false)
  const [flash,     setFlash]     = useState(false)

  const isLong = clip.content.length > 300 || clip.content.split('\n').length > 5

  async function handleCopy() {
    const ok = await copyToClipboard(clip.content)
    if (ok) {
      setFlash(true)
      setTimeout(() => setFlash(false), 600)
      onCopied()
    } else {
      onError()
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this clip?')) return
    setDeleting(true)
    try {
      await onDelete(clip.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      className={`
        relative overflow-hidden
        flex gap-3 items-start
        border rounded-2xl p-4
        transition-all duration-200
        clip-card-accent
        ${flash
          ? 'bg-[var(--green-bg)] border-[var(--green)]'
          : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border2)] hover:shadow-md'
        }
      `}
      style={{ boxShadow: flash ? '0 0 0 2px var(--green)' : undefined }}
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        <pre
          className={`
            font-mono text-[13px] leading-relaxed text-[var(--text)]
            whitespace-pre-wrap break-words
            ${!expanded ? 'line-clamp-5' : ''}
          `}
        >
          {clip.content}
        </pre>

        {/* Meta row */}
        <div className="flex items-center flex-wrap gap-2 mt-2">
          <span className="font-mono text-[11px] text-[var(--text3)]">
            {formatClipTime(clip.created_at)}
          </span>
          {clip.label && <Badge>{clip.label}</Badge>}
          {isLong && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-[11px] text-[var(--text3)] hover:text-[var(--accent)] transition-colors font-mono"
            >
              {expanded ? 'show less' : 'show more'}
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <button
          onClick={handleCopy}
          className="
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
            bg-[var(--surface2)] border border-[var(--border)] text-[var(--text2)]
            hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)]
            transition-all
          "
        >
          📋 Copy
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
            bg-[var(--surface2)] border border-[var(--border)] text-[var(--text2)]
            hover:border-[var(--red)] hover:text-[var(--red)] hover:bg-[var(--red-bg)]
            transition-all disabled:opacity-40
          "
        >
          {deleting ? '…' : '✕ Del'}
        </button>
      </div>
    </div>
  )
}
