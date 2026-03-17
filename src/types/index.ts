export interface Clip {
  id: string
  user_id: string | null
  session_code: string | null
  content: string
  label: string | null
  created_at: string
}

export type Theme = 'dark' | 'light'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

export type ActiveView = 'my-clips' | 'guest' | 'auth' | 'settings'
