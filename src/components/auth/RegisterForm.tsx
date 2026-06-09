"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, CheckCircle2, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { registerSchema, type RegisterInput } from "@/validations/auth.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROUTES } from "@/lib/constants"

export default function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword]   = useState(false)
  const [showConfirm,  setShowConfirm]    = useState(false)
  const [serverError,  setServerError]    = useState<string | null>(null)
  const [needsConfirm, setNeedsConfirm]   = useState(false)
  const [isLoading,    setIsLoading]      = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (formData: RegisterInput) => {
    setIsLoading(true)
    setServerError(null)

    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.fullName },
          // Redirect here after email confirmation
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard`,
        },
      })

      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          setServerError(
            "An account with this email already exists. Please sign in instead."
          )
        } else {
          setServerError(error.message)
        }
        return
      }

      if (data.session) {
        // Email confirmation is disabled — user is logged in immediately
        router.push(ROUTES.USER_DASHBOARD)
        router.refresh()
      } else {
        // Email confirmation is required — show a prompt
        setNeedsConfirm(true)
      }
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Email confirmation waiting screen ───────────────────
  if (needsConfirm) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Check your inbox</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            We sent you a confirmation link. Click it to activate your account and start
            booking your next stay.
          </p>
        </div>
        <div className="bg-muted/50 rounded-xl p-4 text-left space-y-1.5">
          <p className="text-xs font-semibold text-foreground">Didn&apos;t receive it?</p>
          <p className="text-xs text-muted-foreground">
            Check your spam folder. The link expires in 24 hours.
          </p>
        </div>
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
        >
          <CheckCircle2 className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    )
  }

  // ── Registration form ────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
          <p className="text-sm text-destructive font-medium">{serverError}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Jane Smith"
          autoComplete="name"
          disabled={isLoading}
          {...register("fullName")}
          className={errors.fullName ? "border-destructive" : ""}
        />
        {errors.fullName && (
          <p className="text-xs text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
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
            placeholder="At least 8 characters"
            autoComplete="new-password"
            disabled={isLoading}
            {...register("password")}
            className={errors.password ? "border-destructive pr-10" : "pr-10"}
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            disabled={isLoading}
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
