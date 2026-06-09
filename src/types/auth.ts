export type UserRole = "admin" | "user"

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  profile: Profile | null
}
