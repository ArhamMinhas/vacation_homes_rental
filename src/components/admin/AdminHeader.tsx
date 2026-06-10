"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LogOut, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants"

interface AdminHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export default function AdminHeader({ title, description, action }: AdminHeaderProps) {
  const [adminName, setAdminName] = useState<string>("Admin")

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.full_name) setAdminName(user.user_metadata.full_name)
      else if (user?.email) setAdminName(user.email.split("@")[0])
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = ROUTES.ADMIN_LOGIN
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 pl-12 lg:pl-0">
        {action}
        <div className="flex items-center gap-2 border-l border-border pl-3 ml-1">
          <span className="text-sm text-muted-foreground hidden sm:block">{adminName}</span>
          <Link href={ROUTES.HOME} target="_blank">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
