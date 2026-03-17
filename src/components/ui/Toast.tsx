'use client'

import { Toast } from '@/types'

const icons: Record<string, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

const styles: Record<string, string> = {
  success: 'bg-[var(--green-bg)]  text-[var(--green)]  border-[rgba(79,207,142,0.25)]',
  error:   'bg-[var(--red-bg)]    text-[var(--red)]    border-[rgba(247,110,110,0.25)]',
  info:    'bg-[var(--accent-bg)] text-[var(--accent)] border-[rgba(79,142,247,0.25)]',
  warning: 'bg-[var(--amber-bg)]  text-[var(--amber)]  border-[rgba(247,184,79,0.25)]',
}

interface ToastItemProps {
  toast:    Toast
  onRemove: (id: string) => void
}

export function ToastItem({ toast, onRemove }: ToastItemProps) {
  return (
    <div
      className={`
        flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-mono font-medium
        shadow-lg max-w-xs cursor-pointer animate-slide-in
        ${styles[toast.type]}
      `}
      onClick={() => onRemove(toast.id)}
    >
      <span>{icons[toast.type]}</span>
      <span>{toast.message}</span>
    </div>
  )
}

interface ToastContainerProps {
  toasts:   Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  )
}
