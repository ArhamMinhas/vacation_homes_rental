export default function PropertyCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/70 shadow-card">
      <div className="aspect-[4/3] animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-4 animate-shimmer rounded-full w-3/4" />
          <div className="h-3 animate-shimmer rounded-full w-1/2" />
        </div>
        <div className="h-px bg-border/60" />
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="h-3 animate-shimmer rounded-full w-12" />
            <div className="h-3 animate-shimmer rounded-full w-12" />
            <div className="h-3 animate-shimmer rounded-full w-8" />
          </div>
          <div className="h-3 animate-shimmer rounded-full w-20" />
        </div>
      </div>
    </div>
  )
}
