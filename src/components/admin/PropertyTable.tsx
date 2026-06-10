"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Plus, ToggleLeft, ToggleRight, Eye, Loader2 } from "lucide-react"
import type { Property } from "@/types/property"
import { ROUTES } from "@/lib/constants"
import { formatCurrency } from "@/utils/formatCurrency"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

interface PropertyTableProps {
  properties: Property[]
}

export default function PropertyTable({ properties: initial }: PropertyTableProps) {
  const router = useRouter()
  const [properties, setProperties] = useState(initial)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!confirmId) return
    setDeleting(confirmId)
    try {
      await fetch(`/api/properties/${confirmId}`, { method: "DELETE" })
      setProperties((prev) => prev.filter((p) => p.id !== confirmId))
      router.refresh()
    } finally {
      setDeleting(null)
      setConfirmId(null)
    }
  }

  const handleToggleActive = async (property: Property) => {
    setToggling(property.id)
    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !property.is_active }),
      })
      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) => p.id === property.id ? { ...p, is_active: !p.is_active } : p)
        )
      }
    } finally {
      setToggling(null)
    }
  }

  const ActionButtons = ({ property }: { property: Property }) => (
    <div className="flex items-center gap-1">
      <Link href={ROUTES.PROPERTY_DETAIL(property.id)} target="_blank">
        <Button variant="ghost" size="icon" className="h-8 w-8" title="View public page">
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </Link>
      <Link href={`${ROUTES.ADMIN_PROPERTIES}/${property.id}`}>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit property">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={toggling === property.id}
        onClick={() => handleToggleActive(property)}
        title={property.is_active ? "Deactivate" : "Activate"}
      >
        {toggling === property.id ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : property.is_active ? (
          <ToggleRight className="h-3.5 w-3.5 text-primary" />
        ) : (
          <ToggleLeft className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:bg-destructive/10"
        onClick={() => setConfirmId(property.id)}
        title="Delete property"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )

  return (
    <>
      <div className="flex justify-end mb-4">
        <Link href={ROUTES.ADMIN_PROPERTIES_CREATE}>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Property
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-border">
          <div className="text-4xl mb-3">🏡</div>
          <p className="font-medium text-foreground">No properties yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Add your first property to get started.</p>
          <Link href={ROUTES.ADMIN_PROPERTIES_CREATE}>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Property</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* ── Mobile: card list ─────────────────────────────────────────── */}
          <div className="md:hidden space-y-3">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-card border border-border rounded-xl p-4 space-y-3 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {property.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="h-14 w-20 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-20 rounded-lg bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                      🏡
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm text-foreground line-clamp-1">{property.title}</p>
                      <Badge variant={property.is_active ? "default" : "secondary"} className="text-xs flex-shrink-0">
                        {property.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{property.location}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="bg-muted px-2 py-0.5 rounded-full">{property.property_type}</span>
                      <span className="font-semibold text-foreground">{formatCurrency(property.price_per_night)}/night</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end border-t border-border pt-2">
                  <ActionButtons property={property} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop: table ────────────────────────────────────────────── */}
          <div className="hidden md:block rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[45%]">Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {property.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="h-10 w-14 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-14 rounded-lg bg-muted flex items-center justify-center text-lg flex-shrink-0">
                            🏡
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm text-foreground line-clamp-1">{property.title}</p>
                          <p className="text-xs text-muted-foreground">{property.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">{property.property_type}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-foreground">{formatCurrency(property.price_per_night)}</span>
                      <span className="text-xs text-muted-foreground">/night</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={property.is_active ? "default" : "secondary"} className="text-xs">
                        {property.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <ActionButtons property={property} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete property?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This permanently removes the property and all its images. Existing bookings are not affected.
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmId(null)} disabled={!!deleting}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={!!deleting} onClick={handleDelete}>
              {deleting ? <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Deleting…</> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
