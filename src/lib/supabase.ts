import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnon)

// ── Clips helpers ────────────────────────────────────────────

export async function fetchMyClips(userId: string) {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function insertMyClip(userId: string, content: string, label?: string) {
  const { error } = await supabase.from('clips').insert({
    user_id: userId,
    content,
    label: label || null,
  })
  if (error) throw error
}

export async function fetchGuestClips(sessionCode: string) {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('session_code', sessionCode)
    .is('user_id', null)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function insertGuestClip(sessionCode: string, content: string) {
  const { error } = await supabase.from('clips').insert({
    session_code: sessionCode,
    user_id: null,
    content,
  })
  if (error) throw error
}

export async function deleteClip(id: string) {
  const { error } = await supabase.from('clips').delete().eq('id', id)
  if (error) throw error
}

export async function clearGuestClips(sessionCode: string) {
  const { error } = await supabase
    .from('clips')
    .delete()
    .eq('session_code', sessionCode)
    .is('user_id', null)
  if (error) throw error
}

// ── Auth helpers ─────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signUp(email: string, password: string) {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}`,
    },
  })
  if (error) throw error
}