import { TechStackItem } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

const LAYER_COLORS: Record<string, string> = {
  Frontend: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
  Backend: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300',
  Database: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
  Auth: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300',
  Hosting: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300',
  'AI/LLM': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300',
}

interface TechStackListProps {
  items: TechStackItem[]
}

export default function TechStackList({ items }: TechStackListProps) {
  return (
    <div className="flex flex-col divide-y divide-border">
      {items.map((item) => (
        <div key={item.layer} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <Badge
            variant="outline"
            className={`mt-0.5 shrink-0 text-xs font-medium ${LAYER_COLORS[item.layer] ?? LAYER_COLORS['Hosting']}`}
          >
            {item.layer}
          </Badge>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium leading-snug">{item.tech}</span>
            <span className="text-xs text-muted-foreground leading-snug">{item.reason}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
