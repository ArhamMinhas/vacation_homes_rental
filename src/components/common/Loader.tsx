import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function Loader({ className, size = "md" }: LoaderProps) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" }
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
    </div>
  )
}
