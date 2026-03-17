'use client'

import { useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { useMyClips } from '@/hooks/useClips'
import { AddClipForm } from '@/components/clips/AddClipForm'
import { ClipsList   } from '@/components/clips/ClipsList'
import { StatsRow    } from '@/components/clips/StatsRow'

interface MyClipsViewProps {
  user:    User
  onToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

export function MyClipsView({ user, onToast }: MyClipsViewProps) {
  const { clips, loading, load, add, remove } = useMyClips(user.id)

  // Load on mount
  useEffect(() => { load() }, [load])

  async function handleAdd(content: string, label?: string) {
    try {
      await add(content, label)
      onToast('Clip saved ✓', 'success')
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

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">My Clipboard</h1>
        <p className="text-sm text-[var(--text2)] mt-1">
          All your saved clips, synced across every device you sign in on
        </p>
      </div>

      {/* Stats */}
      <StatsRow clips={clips} />

      {/* Add clip */}
      <AddClipForm onAdd={handleAdd} showLabel />

      {/* Clips list */}
      <ClipsList
        clips={clips}
        loading={loading}
        onDelete={handleDelete}
        onCopied={() => onToast('Copied!', 'success')}
        onError={() => onToast('Copy failed', 'error')}
        emptyTitle="No clips yet"
        emptySubtitle="Add your first clip above — it'll sync across every device you sign into."
      />
    </div>
  )
}
