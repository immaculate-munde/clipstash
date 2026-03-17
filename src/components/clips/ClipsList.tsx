'use client'

import { useState, useMemo } from 'react'
import { Clip } from '@/types'
import { ClipCard } from './ClipCard'
import { ClipSkeleton, EmptyState } from '@/components/ui/Misc'

interface ClipsListProps {
  clips:     Clip[]
  loading:   boolean
  onDelete:  (id: string) => Promise<void>
  onCopied:  () => void
  onError:   () => void
  emptyIcon?:     string
  emptyTitle?:    string
  emptySubtitle?: string
  headerActions?: React.ReactNode
}

export function ClipsList({
  clips,
  loading,
  onDelete,
  onCopied,
  onError,
  emptyIcon     = '📭',
  emptyTitle    = 'No clips yet',
  emptySubtitle = 'Add your first clip above!',
  headerActions,
}: ClipsListProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return clips
    const q = query.toLowerCase()
    return clips.filter(c =>
      c.content.toLowerCase().includes(q) ||
      (c.label ?? '').toLowerCase().includes(q)
    )
  }, [clips, query])

  return (
    <div>
      {/* Search + header actions */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Search bar */}
        <div className="
          flex items-center gap-2 flex-1 min-w-[160px]
          bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-3
          focus-within:border-[var(--accent)] transition-colors
        ">
          <span className="text-[var(--text3)] text-sm">🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search clips…"
            className="
              flex-1 bg-transparent py-2.5 text-sm text-[var(--text)]
              placeholder:text-[var(--text3)] outline-none font-display
            "
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[var(--text3)] hover:text-[var(--text)] text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Injected actions (e.g. refresh, clear all) */}
        {headerActions}
      </div>

      {/* Count */}
      {!loading && clips.length > 0 && (
        <p className="font-mono text-[11px] text-[var(--text3)] mb-3">
          {filtered.length === clips.length
            ? `${clips.length} clip${clips.length !== 1 ? 's' : ''}`
            : `${filtered.length} of ${clips.length} clips`}
        </p>
      )}

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-2.5">
          {[1, 2, 3].map(i => <ClipSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={emptyIcon}
          title={query ? 'No results' : emptyTitle}
          subtitle={query ? `No clips match "${query}"` : emptySubtitle}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map(clip => (
            <div key={clip.id} className="animate-fade-in">
              <ClipCard
                clip={clip}
                onDelete={onDelete}
                onCopied={onCopied}
                onError={onError}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
