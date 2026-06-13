import { ArchitectureComponent } from '@/lib/types'

interface ArchitectureListProps {
  items: ArchitectureComponent[]
}

export default function ArchitectureList({ items }: ArchitectureListProps) {
  return (
    <div className="flex flex-col divide-y divide-border">
      {items.map((item, index) => (
        <div key={item.component} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <span className="text-xs font-mono text-muted-foreground/60 mt-0.5 w-5 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">{item.component}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.responsibility}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
