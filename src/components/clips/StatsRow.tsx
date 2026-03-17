import { Clip } from '@/types'

interface StatsRowProps {
  clips: Clip[]
}

export function StatsRow({ clips }: StatsRowProps) {
  if (!clips.length) return null

  const today    = new Date().toDateString()
  const todayCount  = clips.filter(c => new Date(c.created_at).toDateString() === today).length
  const totalChars  = clips.reduce((s, c) => s + c.content.length, 0)
  const charsLabel  = totalChars > 999 ? `${Math.round(totalChars / 1000)}k` : String(totalChars)

  const stats = [
    { value: clips.length, label: 'total clips' },
    { value: todayCount,   label: 'added today' },
    { value: charsLabel,   label: 'chars stored' },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map(s => (
        <div
          key={s.label}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 text-center"
        >
          <div className="text-2xl font-extrabold text-[var(--accent)] tracking-tight leading-none mb-1">
            {s.value}
          </div>
          <div className="font-mono text-[11px] text-[var(--text3)]">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
