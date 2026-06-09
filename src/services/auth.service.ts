import { createClient } from "@/lib/supabase/server"
import type { Profile } from "@/types/auth"

export async function signUpUser(input: {
  email: string
  password: string
  fullName: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { full_name: input.fullName },
    },
  })

  if (error) throw error
  return data
}

export async function signInUser(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOutUser() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getProfileById(userId: string): Promise<Profile | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  return (data as Profile) ?? null
}
