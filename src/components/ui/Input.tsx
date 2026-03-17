'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?:  string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[10px] font-bold uppercase tracking-widest text-[var(--text2)] font-mono"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-3.5 py-3',
            'text-sm text-[var(--text)] font-display placeholder:text-[var(--text3)]',
            'outline-none transition-all duration-200',
            'focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)]',
            className,
          )}
          {...props}
        />
        {hint && <p className="text-xs text-[var(--text3)]">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
