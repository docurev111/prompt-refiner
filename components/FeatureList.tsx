import { Feature } from '@/lib/types'

interface FeatureListProps {
  features: Feature[]
}

const PRIORITY_CONFIG = {
  'must-have': {
    label: 'Must-have',
    dotClass: 'bg-emerald-500',
    sectionClass: 'text-emerald-700 dark:text-emerald-400',
  },
  'should-have': {
    label: 'Should-have',
    dotClass: 'bg-amber-400',
    sectionClass: 'text-amber-700 dark:text-amber-400',
  },
  'nice-to-have': {
    label: 'Nice-to-have',
    dotClass: 'bg-zinc-400',
    sectionClass: 'text-zinc-500 dark:text-zinc-400',
  },
} as const

const GROUPS: Feature['priority'][] = ['must-have', 'should-have', 'nice-to-have']

export default function FeatureList({ features }: FeatureListProps) {
  return (
    <div className="flex flex-col gap-5">
      {GROUPS.map((priority) => {
        const group = features.filter((f) => f.priority === priority)
        if (!group.length) return null
        const config = PRIORITY_CONFIG[priority]
        return (
          <div key={priority}>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-2.5 ${config.sectionClass}`}>
              {config.label}
            </p>
            <div className="flex flex-col gap-2">
              {group.map((feature) => (
                <div key={feature.name} className="flex items-start gap-2.5">
                  <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${config.dotClass}`} />
                  <div className="text-sm leading-relaxed">
                    <span className="font-medium">{feature.name}</span>
                    <span className="text-muted-foreground"> — {feature.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
