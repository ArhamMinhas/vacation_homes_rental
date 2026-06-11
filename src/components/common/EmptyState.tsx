import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-20 px-6 animate-fade-in",
        className
      )}
    >
      {icon && (
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-2xl bg-primary/8 scale-110 blur-sm" />
          <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/15 flex items-center justify-center text-primary shadow-sm">
            <div className="[&>*]:h-7 [&>*]:w-7">{icon}</div>
          </div>
        </div>
      )}
      <div className="space-y-1.5 mb-5">
        <p className="text-base font-semibold text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
