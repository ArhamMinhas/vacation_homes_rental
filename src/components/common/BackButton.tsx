"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  label?: string
  className?: string
}

export default function BackButton({ label = "Back", className }: BackButtonProps) {
  const router = useRouter()
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className={`gap-1.5 -ml-1 text-muted-foreground hover:text-foreground w-fit ${className ?? ""}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  )
}
