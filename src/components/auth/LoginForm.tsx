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
import { cn } from "@/lib/utils"

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
        <div className="rounded-xl bg-destructive/8 border border-destructive/20 px-4 py-3 flex items-start gap-2.5">
          <span className="text-destructive mt-px flex-shrink-0">⚠</span>
          <p className="text-sm text-destructive font-medium leading-relaxed">{displayError}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          {...register("email")}
          className={cn(
            "h-11 rounded-xl border-border/70 bg-muted/30 focus-visible:bg-background transition-colors",
            errors.email ? "border-destructive focus-visible:ring-destructive" : "focus-visible:border-primary/60"
          )}
        />
        {errors.email && (
          <p className="text-xs text-destructive flex items-center gap-1"><span>⚠</span>{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
            {...register("password")}
            className={cn(
              "h-11 rounded-xl pr-10 border-border/70 bg-muted/30 focus-visible:bg-background transition-colors",
              errors.password
                ? "border-destructive focus-visible:ring-destructive"
                : "focus-visible:border-primary/60"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive flex items-center gap-1"><span>⚠</span>{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 rounded-xl font-semibold text-base shadow-md hover:shadow-lg hover:-translate-y-px transition-all duration-200"
        disabled={isLoading}
      >
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
          <Link href={ROUTES.REGISTER} className="font-semibold text-primary hover:text-primary/80 transition-colors">
            Create one →
          </Link>
        </p>
      )}
    </form>
  )
}
