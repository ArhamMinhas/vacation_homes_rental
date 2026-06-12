import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  /** Return the URL for a given page number (preserve existing search params). */
  buildHref: (page: number) => string
  className?: string
}

/** Produce a compact range like [1, '...', 4, 5, 6, '...', 20] */
function getRange(page: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (page <= 4) return [1, 2, 3, 4, 5, "...", total]
  if (page >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total]
  }
  return [1, "...", page - 1, page, page + 1, "...", total]
}

export default function Pagination({
  page,
  totalPages,
  total,
  buildHref,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const range = getRange(page, totalPages)

  const linkBase =
    "h-9 min-w-[2.25rem] px-2 rounded-xl flex items-center justify-center text-sm font-medium transition-all border"

  return (
    <div className={cn("flex flex-col items-center gap-3 mt-10", className)}>
      <p className="text-xs text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
        {" "}·{" "}
        <span className="font-semibold text-foreground">{total}</span> results
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        {/* Prev */}
        <Link
          href={buildHref(page - 1)}
          aria-disabled={page <= 1}
          aria-label="Previous page"
          className={cn(
            linkBase,
            "border-border",
            page <= 1
              ? "pointer-events-none opacity-35"
              : "hover:bg-primary hover:text-primary-foreground hover:border-primary"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>

        {/* Page numbers */}
        {range.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="h-9 w-9 flex items-center justify-center text-muted-foreground text-sm select-none"
            >
              …
            </span>
          ) : (
            <Link
              key={p}
              href={buildHref(p as number)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                linkBase,
                p === page
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
              )}
            >
              {p}
            </Link>
          )
        )}

        {/* Next */}
        <Link
          href={buildHref(page + 1)}
          aria-disabled={page >= totalPages}
          aria-label="Next page"
          className={cn(
            linkBase,
            "border-border",
            page >= totalPages
              ? "pointer-events-none opacity-35"
              : "hover:bg-primary hover:text-primary-foreground hover:border-primary"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </nav>
    </div>
  )
}
