'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { readFromClipboard } from '@/lib/utils'

interface AddClipFormProps {
  onAdd:       (content: string, label?: string) => Promise<void>
  showLabel?:  boolean
  placeholder?: string
}

export function AddClipForm({ onAdd, showLabel = true, placeholder }: AddClipFormProps) {
  const [text,    setText]    = useState('')
  const [label,   setLabel]   = useState('')
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  async function handleAdd() {
    if (!text.trim()) return
    setLoading(true)
    try {
      await onAdd(text.trim(), label.trim() || undefined)
      setText('')
      setLabel('')
      textareaRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  async function handlePaste() {
    const content = await readFromClipboard()
    if (content) setText(prev => prev + content)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleAdd()
  }

  return (
    <Card className="mb-5">
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? 'Paste or type anything — text, links, code, notes…'}
        rows={4}
        className="
          w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-4 py-3
          font-mono text-[13px] leading-relaxed text-[var(--text)]
          placeholder:text-[var(--text3)] resize-y min-h-[110px]
          outline-none transition-all duration-200
          focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)]
          mb-3
        "
      />

      {/* Label row */}
      {showLabel && (
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Label (optional)"
          maxLength={40}
          className="
            w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg px-3 py-2
            font-mono text-xs text-[var(--text)] placeholder:text-[var(--text3)]
            outline-none transition-all duration-200 mb-3
            focus:border-[var(--accent)]
          "
        />
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="font-mono text-[11px] text-[var(--text3)]">
          {text.length} chars
          {text.length > 0 && (
            <span className="ml-2 opacity-60">⌘↵ to add</span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handlePaste}>
            📋 Paste
          </Button>
          <Button
            size="sm"
            loading={loading}
            disabled={!text.trim()}
            onClick={handleAdd}
          >
            ＋ Add Clip
          </Button>
        </div>
      </div>
    </Card>
  )
}
