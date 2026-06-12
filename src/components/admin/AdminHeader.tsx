"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LogOut, ExternalLink, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants"

interface AdminHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  breadcrumb?: string
}

export default function AdminHeader({ title, description, action, breadcrumb }: AdminHeaderProps) {
  const [adminName, setAdminName] = useState<string>("")

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.full_name) setAdminName(user.user_metadata.full_name)
      else if (user?.email) setAdminName(user.email.split("@")[0])
    })
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = ROUTES.ADMIN_LOGIN
  }

  return (
    <div className="mb-6 sm:mb-8">
      {/* Top row: title + actions */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        {/* Title area — pl-14 on mobile to clear the hamburger button */}
        <div className="pl-14 lg:pl-0 min-w-0 flex-1">
          {breadcrumb && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
              <span>{breadcrumb}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">{title}</span>
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>

        {/* Right side: action + admin controls */}
        <div className="flex items-center gap-2 pl-14 lg:pl-0 flex-shrink-0">
          {action}
          <div className="flex items-center gap-1 border-l border-border pl-2 ml-1">
            {adminName && (
              <span className="text-xs text-muted-foreground hidden md:block max-w-[120px] truncate px-1">
                {adminName}
              </span>
            )}
            <Link href={ROUTES.HOME} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="View public site">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
