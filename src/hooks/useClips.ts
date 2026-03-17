'use client'

import { useState, useCallback } from 'react'
import { Clip } from '@/types'
import {
  fetchMyClips,
  insertMyClip,
  fetchGuestClips,
  insertGuestClip,
  deleteClip,
  clearGuestClips,
} from '@/lib/supabase'

// ── My Clips (authenticated) ─────────────────────────────────

export function useMyClips(userId: string | null) {
  const [clips, setClips]     = useState<Clip[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const data = await fetchMyClips(userId)
      setClips(data ?? [])
    } finally {
      setLoading(false)
    }
  }, [userId])

  const add = useCallback(async (content: string, label?: string) => {
    if (!userId) throw new Error('Not authenticated')
    await insertMyClip(userId, content, label)
    await load()
  }, [userId, load])

  const remove = useCallback(async (id: string) => {
    await deleteClip(id)
    setClips(prev => prev.filter(c => c.id !== id))
  }, [])

  return { clips, loading, load, add, remove }
}

// ── Guest Clips ──────────────────────────────────────────────

export function useGuestClips(sessionCode: string | null) {
  const [clips, setClips]     = useState<Clip[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!sessionCode) return
    setLoading(true)
    try {
      const data = await fetchGuestClips(sessionCode)
      setClips(data ?? [])
    } finally {
      setLoading(false)
    }
  }, [sessionCode])

  const add = useCallback(async (content: string) => {
    if (!sessionCode) throw new Error('No session')
    await insertGuestClip(sessionCode, content)
    await load()
  }, [sessionCode, load])

  const remove = useCallback(async (id: string) => {
    await deleteClip(id)
    setClips(prev => prev.filter(c => c.id !== id))
  }, [])

  const clearAll = useCallback(async () => {
    if (!sessionCode) return
    await clearGuestClips(sessionCode)
    setClips([])
  }, [sessionCode])

  return { clips, loading, load, add, remove, clearAll }
}
