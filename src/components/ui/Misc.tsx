import { cn } from '@/lib/utils'

// ── Badge ────────────────────────────────────────────────────
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono',
        'bg-[var(--accent-bg)] text-[var(--accent)]',
        className,
      )}
    >
      {children}
    </span>
  )
}

// ── Divider ──────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px bg-[var(--border)] my-5', className)} />
}

// ── Skeleton ─────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />
}

export function ClipSkeleton() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex gap-3">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-2 w-24 mt-3" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-7 w-16" />
      </div>
    </div>
  )
}

// ── EmptyState ───────────────────────────────────────────────
interface EmptyStateProps {
  icon:     string
  title:    string
  subtitle: string
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 text-[var(--text3)]">
      <div className="text-5xl mb-4 opacity-60">{icon}</div>
      <div className="text-base font-bold text-[var(--text2)] mb-1">{title}</div>
      <div className="text-sm leading-relaxed">{subtitle}</div>
    </div>
  )
}
