import { createClient, createAdminClient } from "@/lib/supabase/server"
import type { Profile, UserRole } from "@/types/auth"

export async function registerUser(
  email: string,
  password: string,
  fullName: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) throw new Error(error.message)
  return data
}

export async function loginUser(email: string, password: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  return data
}

export async function logoutUser() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ?? null
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()
  return (data as Profile) ?? null
}

export async function getUserRole(): Promise<UserRole | null> {
  const profile = await getCurrentProfile()
  return profile?.role ?? null
}

export async function isAdminUser(): Promise<boolean> {
  const role = await getUserRole()
  return role === "admin"
}

export async function getProfileById(userId: string): Promise<Profile | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()
  return (data as Profile) ?? null
}
