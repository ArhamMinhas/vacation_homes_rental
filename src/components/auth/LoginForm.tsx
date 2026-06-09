"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { loginSchema, type LoginInput } from "@/validations/auth.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROUTES } from "@/lib/constants"

interface LoginFormProps {
  isAdmin?: boolean
}

export default function LoginForm({ isAdmin = false }: LoginFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ??
    (isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD)

  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (formData: LoginInput) => {
    setIsLoading(true)
    setServerError(null)

    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setServerError(
            "Your email is not confirmed yet. Please check your inbox and click the confirmation link."
          )
        } else if (
          error.message.toLowerCase().includes("invalid login") ||
          error.message.toLowerCase().includes("invalid credentials")
        ) {
          setServerError("Invalid email or password. Please try again.")
        } else {
          setServerError(error.message)
        }
        return
      }

      if (!data.user) {
        setServerError("Login failed. Please try again.")
        return
      }

      // Admin portal: verify the user has admin role
      if (isAdmin) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profile?.role !== "admin") {
          await supabase.auth.signOut()
          setServerError("Access denied. This portal is for administrators only.")
          return
        }
      }

      router.push(redirectTo)
      router.refresh()
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const urlError = searchParams.get("error")
  const displayError =
    serverError ??
    (urlError === "unauthorized"
      ? "Access denied. This portal is for administrators only."
      : urlError === "confirmation_failed"
      ? "Email confirmation failed. Please try again or contact support."
      : null)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {displayError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
          <p className="text-sm text-destructive font-medium">{displayError}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          {...register("email")}
          className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
            {...register("password")}
            className={
              errors.password
                ? "border-destructive focus-visible:ring-destructive pr-10"
                : "pr-10"
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      {!isAdmin && (
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.REGISTER} className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      )}
    </form>
  )
}
