import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6',
        'transition-[border-color] duration-200 hover:border-[var(--border2)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
