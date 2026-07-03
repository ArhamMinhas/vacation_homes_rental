"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Plus, ToggleLeft, ToggleRight, Eye, Loader2, Check, X } from "lucide-react"
import type { Property } from "@/types/property"
import { ROUTES, PROPERTY_TYPES } from "@/lib/constants"
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

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editLocation, setEditLocation] = useState("")
  const [editType, setEditType] = useState("")
  const [editPrice, setEditPrice] = useState(0)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const startInlineEdit = (property: Property) => {
    setEditingId(property.id)
    setEditTitle(property.title)
    setEditLocation(property.location)
    setEditType(property.property_type)
    setEditPrice(property.price_per_night)
    setSaveError(null)
  }

  const cancelInlineEdit = () => {
    setEditingId(null)
    setSaveError(null)
  }

  const handleSave = async (id: string) => {
    if (editTitle.trim().length < 5) {
      setSaveError("Title must be at least 5 characters.")
      return
    }
    if (editLocation.trim().length < 2) {
      setSaveError("Location is required (at least 2 chars).")
      return
    }
    if (Number(editPrice) < 1) {
      setSaveError("Price must be at least $1.")
      return
    }

    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          location: editLocation.trim(),
          property_type: editType,
          price_per_night: Number(editPrice),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setSaveError(data.error?.message || "Failed to update property details.")
        return
      }

      setProperties((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                title: editTitle.trim(),
                location: editLocation.trim(),
                property_type: editType,
                price_per_night: Number(editPrice),
              }
            : p
        )
      )
      setEditingId(null)
      router.refresh()
    } catch {
      setSaveError("Failed to save changes. Network error.")
    } finally {
      setSaving(false)
    }
  }

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
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary transition-colors" title="View public page">
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </Link>
      <Link href={`${ROUTES.ADMIN_PROPERTIES}/${property.id}`}>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary transition-colors" title="Edit full details">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-500 hover:text-primary transition-colors"
        onClick={() => startInlineEdit(property)}
        title="Edit Inline"
      >
        <span className="text-[10px] font-bold">IN</span>
      </Button>
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
        className="h-8 w-8 text-destructive hover:bg-destructive/10 transition-colors"
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
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md shadow-primary/20">
            <Plus className="h-4 w-4 mr-1" /> Add Property
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-white shadow-sm">
          <div className="text-4xl mb-3">🏡</div>
          <p className="font-semibold text-foreground">No properties yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Add your first property to get started.</p>
          <Link href={ROUTES.ADMIN_PROPERTIES_CREATE}>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Property</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* ── Mobile: card list ─────────────────────────────────────────── */}
          <div className="md:hidden space-y-4">
            {properties.map((property) => {
              const isEditing = editingId === property.id
              return (
                <div
                  key={property.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full text-sm h-10 rounded-xl border border-gray-200 px-3 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Location</label>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="w-full text-sm h-10 rounded-xl border border-gray-200 px-3 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Type</label>
                          <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value)}
                            className="w-full text-sm h-10 rounded-xl border border-gray-200 px-3 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          >
                            {PROPERTY_TYPES.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Price/Night</label>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-full text-sm h-10 rounded-xl border border-gray-200 px-3 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          />
                        </div>
                      </div>

                      {saveError && (
                        <p className="text-xs font-semibold text-destructive">{saveError}</p>
                      )}

                      <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                        <Button variant="outline" size="sm" onClick={cancelInlineEdit} disabled={saving} className="rounded-xl">
                          <X className="h-3.5 w-3.5 mr-1" /> Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleSave(property.id)} disabled={saving} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
                          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Check className="h-3.5 w-3.5 mr-1" />} Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        {property.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="h-16 w-20 object-cover rounded-xl flex-shrink-0 shadow-sm"
                          />
                        ) : (
                          <div className="h-16 w-20 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                            🏡
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm text-gray-900 line-clamp-1">{property.title}</p>
                            <Badge variant={property.is_active ? "default" : "secondary"} className="text-[10px] font-bold rounded-full">
                              {property.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{property.location}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">{property.property_type}</span>
                            <span className="font-bold text-primary">{formatCurrency(property.price_per_night)}/night</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end border-t border-gray-100 pt-2">
                        <ActionButtons property={property} />
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* ── Desktop: table ────────────────────────────────────────────── */}
          <div className="hidden md:block rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
                  <TableHead className="w-[45%] text-gray-500 font-bold uppercase text-[10px] tracking-widest">Property</TableHead>
                  <TableHead className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Type</TableHead>
                  <TableHead className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Price</TableHead>
                  <TableHead className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="text-right text-gray-500 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => {
                  const isEditing = editingId === property.id
                  return (
                    <TableRow key={property.id} className="hover:bg-gray-50/30 transition-colors border-b border-gray-100">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {property.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="h-10 w-14 object-cover rounded-lg flex-shrink-0 shadow-sm border border-gray-100"
                            />
                          ) : (
                            <div className="h-10 w-14 rounded-lg bg-gray-50 flex items-center justify-center text-lg flex-shrink-0 border border-gray-100">
                              🏡
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <div className="space-y-1.5 py-1">
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="w-full text-sm h-8 rounded-lg border border-gray-200 px-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                  placeholder="Property Title"
                                />
                                <input
                                  type="text"
                                  value={editLocation}
                                  onChange={(e) => setEditLocation(e.target.value)}
                                  className="w-full text-xs h-7 rounded-lg border border-gray-200 px-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                  placeholder="Location"
                                />
                                {saveError && (
                                  <p className="text-[10px] font-semibold text-destructive mt-0.5">{saveError}</p>
                                )}
                              </div>
                            ) : (
                              <>
                                <p className="font-semibold text-sm text-gray-900 line-clamp-1">{property.title}</p>
                                <p className="text-xs text-gray-500">{property.location}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg h-8 px-2 bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                          >
                            {PROPERTY_TYPES.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase">{property.property_type}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400">$</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-20 text-sm h-8 rounded-lg border border-gray-200 px-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                            />
                          </div>
                        ) : (
                          <div>
                            <span className="text-sm font-bold text-gray-900">{formatCurrency(property.price_per_night)}</span>
                            <span className="text-xs text-gray-500">/night</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={property.is_active ? "default" : "secondary"} className="text-[10px] font-bold rounded-full">
                          {property.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={cancelInlineEdit}
                                disabled={saving}
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-500 hover:bg-emerald-50 transition-colors"
                                onClick={() => handleSave(property.id)}
                                disabled={saving}
                                title="Save"
                              >
                                {saving ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ) : (
                            <ActionButtons property={property} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete property?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            This permanently removes the property and all its images. Existing bookings are not affected.
            This action cannot be undone.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmId(null)} disabled={!!deleting} className="rounded-xl">
              Cancel
            </Button>
            <Button variant="destructive" disabled={!!deleting} onClick={handleDelete} className="rounded-xl">
              {deleting ? <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Deleting…</> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
