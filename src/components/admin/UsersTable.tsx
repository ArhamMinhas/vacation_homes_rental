"use client"

import { useState } from "react"
import { ShieldCheck, User, Loader2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/formatDate"

interface UserRow {
  id:           string
  email:        string
  role:         string
  created_at:   string
  last_sign_in: string | null
}

interface Props {
  users: UserRow[]
}

export default function UsersTable({ users: initial }: Props) {
  const [users, setUsers]       = useState(initial)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError]       = useState<string | null>(null)

  const toggleRole = async (user: UserRow) => {
    const newRole = user.role === "admin" ? "user" : "admin"
    setUpdating(user.id)
    setError(null)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: newRole }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? "Failed to update role"); return }
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      )
    } catch {
      setError("Something went wrong.")
    } finally {
      setUpdating(null)
    }
  }

  const admins = users.filter((u) => u.role === "admin")
  const regular = users.filter((u) => u.role !== "admin")

  const Row = ({ user }: { user: UserRow }) => {
    const isAdmin = user.role === "admin"
    const busy    = updating === user.id

    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors">
        {/* Avatar */}
        <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAdmin ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
        }`}>
          {isAdmin ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isAdmin
                ? "bg-amber-100 text-amber-700"
                : "bg-muted text-muted-foreground"
            }`}>
              {isAdmin ? "Admin" : "User"}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Joined {formatDate(user.created_at)}
            </span>
            {user.last_sign_in && (
              <span className="hidden sm:flex text-xs text-muted-foreground items-center gap-1">
                Last seen {formatDate(user.last_sign_in)}
              </span>
            )}
          </div>
        </div>

        {/* Action */}
        <Button
          size="sm"
          variant={isAdmin ? "outline" : "default"}
          disabled={busy}
          onClick={() => toggleRole(user)}
          className={`shrink-0 gap-1.5 ${isAdmin ? "text-destructive border-destructive/30 hover:bg-destructive/5" : ""}`}
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isAdmin ? (
            <User className="h-3.5 w-3.5" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5" />
          )}
          {busy ? "Saving…" : isAdmin ? "Remove admin" : "Make admin"}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Admins */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-amber-600" />
          Admins
          <span className="text-xs font-normal text-muted-foreground ml-1">({admins.length})</span>
        </h2>
        {admins.length === 0 ? (
          <p className="text-sm text-muted-foreground">No admins found.</p>
        ) : (
          <div className="space-y-2">
            {admins.map((u) => <Row key={u.id} user={u} />)}
          </div>
        )}
      </section>

      {/* Regular users */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          Regular users
          <span className="text-xs font-normal text-muted-foreground ml-1">({regular.length})</span>
        </h2>
        {regular.length === 0 ? (
          <p className="text-sm text-muted-foreground">No regular users yet.</p>
        ) : (
          <div className="space-y-2">
            {regular.map((u) => <Row key={u.id} user={u} />)}
          </div>
        )}
      </section>
    </div>
  )
}
