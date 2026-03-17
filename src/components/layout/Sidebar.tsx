'use client'

import { User } from '@supabase/supabase-js'
import { ActiveView } from '@/types'
import { cn } from '@/lib/utils'

interface NavItemProps {
  icon:      string
  label:     string
  badge?:    string | number
  active:    boolean
  onClick:   () => void
}

function NavItem({ icon, label, badge, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold',
        'border transition-all duration-150 text-left',
        active
          ? 'bg-[var(--accent-bg)] text-[var(--accent)] border-[rgba(79,142,247,0.2)]'
          : 'text-[var(--text2)] border-transparent hover:bg-[var(--surface)] hover:text-[var(--text)]',
      )}
    >
      <span className="text-base w-5 text-center flex-shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge !== '' && (
        <span
          className={cn(
            'text-[10px] font-mono px-1.5 py-0.5 rounded-full',
            active
              ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
              : 'bg-[var(--surface2)] text-[var(--text3)]',
          )}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

interface SectionLabelProps { label: string }
function SectionLabel({ label }: SectionLabelProps) {
  return (
    <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--text3)] font-mono">
      {label}
    </p>
  )
}

interface SidebarProps {
  user:        User | null
  activeView:  ActiveView
  clipCount:   number
  guestCode:   string | null
  onNavigate:  (view: ActiveView) => void
  onCopyCode:  () => void
}

export function Sidebar({ user, activeView, clipCount, guestCode, onNavigate, onCopyCode }: SidebarProps) {
  return (
    <aside
      className="
        border-r border-[var(--border)] px-3 py-5
        flex flex-col gap-1
        sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto
        transition-[border-color] duration-300
        /* Mobile: fixed bottom bar */
        max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0
        max-md:top-auto max-md:h-auto max-md:flex-row
        max-md:border-r-0 max-md:border-t max-md:bg-[var(--bg)]
        max-md:px-3 max-md:py-2 max-md:z-50
        max-md:justify-around
      "
    >
      {user ? (
        <>
          <SectionLabel label="Clipboard" />
          <NavItem
            icon="📋" label="My Clips"
            badge={clipCount || ''}
            active={activeView === 'my-clips'}
            onClick={() => onNavigate('my-clips')}
          />
          <NavItem
            icon="🔑" label="Guest Session"
            active={activeView === 'guest'}
            onClick={() => onNavigate('guest')}
          />

          <div className="h-px bg-[var(--border)] my-2" />

          <SectionLabel label="Account" />
          <NavItem
            icon="⚙️" label="Settings"
            active={activeView === 'settings'}
            onClick={() => onNavigate('settings')}
          />

          {/* Active guest session pill */}
          {guestCode && (
            <>
              <div className="h-px bg-[var(--border)] my-2" />
              <div className="mx-1 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--green)] flex-shrink-0 animate-pulse-dot"
                  style={{ boxShadow: '0 0 6px var(--green)' }} />
                <span className="font-mono text-sm font-semibold text-[var(--accent)] tracking-[3px] flex-1">
                  {guestCode}
                </span>
                <button
                  onClick={onCopyCode}
                  className="text-[var(--text3)] hover:text-[var(--accent)] transition-colors text-sm p-1 rounded"
                  title="Copy code"
                >
                  📋
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <NavItem icon="🔐" label="Sign In"    active={activeView === 'auth'}  onClick={() => onNavigate('auth')} />
          <NavItem icon="🔑" label="Guest Mode" active={activeView === 'guest'} onClick={() => onNavigate('guest')} />
        </>
      )}
    </aside>
  )
}
