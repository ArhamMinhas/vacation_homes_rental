import { createClient } from "@/lib/supabase/server"
import type { Profile } from "@/types/auth"

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (data as Profile) ?? null
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile()
  return profile?.role === "admin"
}
