"use client"

import { useState, useRef } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Loader2, Upload, X, ImagePlus } from "lucide-react"
import {
  propertyFormSchema,
  propertySchema,
  type PropertyFormInput,
} from "@/validations/property.schema"
import { PROPERTY_TYPES, ROUTES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Property } from "@/types/property"

const AMENITIES_LIST = [
  "WiFi",
  "Kitchen",
  "Air Conditioning",
  "Heating",
  "Washer",
  "Dryer",
  "Parking",
  "Pool",
  "Hot Tub",
  "Gym",
  "Pet Friendly",
  "Fireplace",
  "BBQ Grill",
  "Beach Access",
  "Mountain View",
  "TV",
  "Workspace",
  "Balcony",
]

interface PropertyFormProps {
  property?: Property
}

export default function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter()
  const isEdit = !!property
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [serverError, setServerError] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)

  // image_urls managed as local state; synced to RHF only for non-critical fields
  const [imageUrls, setImageUrls] = useState<string[]>(
    property?.images?.length ? property.images : [""]
  )
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    property?.amenities ?? []
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormInput>({
    resolver: zodResolver(propertyFormSchema) as Resolver<PropertyFormInput>,
    defaultValues: isEdit
      ? {
          title: property.title,
          description: property.description,
          property_type: property.property_type,
          location: property.location,
          price_per_night: property.price_per_night,
          cleaning_fee: property.cleaning_fee,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          max_guests: property.max_guests,
          amenities: property.amenities,
          image_urls: property.images,
          is_active: property.is_active,
        }
      : {
          cleaning_fee: 0,
          bedrooms: 1,
          bathrooms: 1,
          max_guests: 1,
          is_active: true,
          amenities: [],
          image_urls: [],
        },
  })

  const addImageUrl = () => setImageUrls((prev) => [...prev, ""])

  const removeImageUrl = (i: number) =>
    setImageUrls((prev) => prev.filter((_, idx) => idx !== i))

  const updateImageUrl = (i: number, val: string) =>
    setImageUrls((prev) => prev.map((u, idx) => (idx === i ? val : u)))

  const toggleAmenity = (a: string) => {
    const updated = selectedAmenities.includes(a)
      ? selectedAmenities.filter((x) => x !== a)
      : [...selectedAmenities, a]
    setSelectedAmenities(updated)
    setValue("amenities", updated)
  }

  const handleFileUpload = async (
    files: FileList | null,
    replaceIdx?: number
  ) => {
    if (!files?.length) return
    const idx = replaceIdx ?? imageUrls.length

    setUploadingIdx(idx)
    setImageError(null)

    try {
      const uploadedUrls: string[] = []
      for (const file of Array.from(files)) {
        const form = new FormData()
        form.append("file", file)
        const res = await fetch("/api/upload", { method: "POST", body: form })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? "Upload failed")
        uploadedUrls.push(json.url as string)
      }

      if (replaceIdx !== undefined) {
        setImageUrls((prev) =>
          prev.map((u, i) => (i === replaceIdx ? uploadedUrls[0] : u))
        )
      } else {
        setImageUrls((prev) => {
          const filtered = prev.filter((u) => u.trim() !== "")
          return [...filtered, ...uploadedUrls]
        })
      }
    } catch (e) {
      setImageError(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setUploadingIdx(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const onSubmit = async (data: PropertyFormInput) => {
    setIsLoading(true)
    setServerError(null)
    setImageError(null)

    const validUrls = imageUrls.filter((u) => u.trim() !== "")
    if (validUrls.length === 0) {
      setImageError("Add at least one image")
      setIsLoading(false)
      return
    }

    // Validate image URLs via the strict schema before sending to API
    const parsed = propertySchema.safeParse({ ...data, image_urls: validUrls })
    if (!parsed.success) {
      const imageIssue = parsed.error.issues.find((i) =>
        i.path[0] === "image_urls"
      )
      if (imageIssue) {
        setImageError(imageIssue.message)
        setIsLoading(false)
        return
      }
    }

    const payload = { ...data, amenities: selectedAmenities, image_urls: validUrls }

    try {
      const url = isEdit ? `/api/properties/${property!.id}` : "/api/properties"
      const method = isEdit ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok) {
        setServerError(
          json.error?.message ?? json.error ?? "Failed to save property"
        )
        return
      }

      router.push(ROUTES.ADMIN_PROPERTIES)
      router.refresh()
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {serverError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
          <p className="text-sm text-destructive font-medium">{serverError}</p>
        </div>
      )}

      {/* ── Basic info ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">
          Basic Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="title">Property title</Label>
            <Input
              id="title"
              placeholder="Luxurious Beachfront Villa"
              {...register("title")}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="property_type">Property type</Label>
            <Select
              defaultValue={property?.property_type}
              onValueChange={(v) => setValue("property_type", v)}
            >
              <SelectTrigger
                className={errors.property_type ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.property_type && (
              <p className="text-xs text-destructive">
                {errors.property_type.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (display name)</Label>
            <Input
              id="location"
              placeholder="Malibu, California"
              {...register("location")}
              className={errors.location ? "border-destructive" : ""}
            />
            {errors.location && (
              <p className="text-xs text-destructive">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe this property…"
              rows={4}
              {...register("description")}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Pricing & capacity ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">
          Pricing &amp; Capacity
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="price_per_night">Price per night ($)</Label>
            <Input
              id="price_per_night"
              type="number"
              min="1"
              step="0.01"
              {...register("price_per_night")}
              className={errors.price_per_night ? "border-destructive" : ""}
            />
            {errors.price_per_night && (
              <p className="text-xs text-destructive">
                {errors.price_per_night.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cleaning_fee">Cleaning fee ($)</Label>
            <Input
              id="cleaning_fee"
              type="number"
              min="0"
              step="0.01"
              {...register("cleaning_fee")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_guests">Max guests</Label>
            <Input
              id="max_guests"
              type="number"
              min="1"
              {...register("max_guests")}
              className={errors.max_guests ? "border-destructive" : ""}
            />
            {errors.max_guests && (
              <p className="text-xs text-destructive">
                {errors.max_guests.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              {...register("bedrooms")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              min="0"
              {...register("bathrooms")}
            />
          </div>
        </div>
      </section>

      {/* ── Images ─────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-foreground">Images</h2>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingIdx !== null}
            >
              {uploadingIdx !== null ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <ImagePlus className="h-4 w-4 mr-1" />
              )}
              Upload files
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addImageUrl}
            >
              <Plus className="h-4 w-4 mr-1" /> Add URL
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          First image is the cover. Upload files (JPG, PNG, WebP) or paste
          direct image URLs.
        </p>

        {imageError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
            <p className="text-xs text-destructive">{imageError}</p>
          </div>
        )}

        {/* Image thumbnails */}
        {imageUrls.some((u) => u.trim() !== "") && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {imageUrls.map((url, i) =>
              url.trim() === "" ? null : (
                <div key={i} className="relative group aspect-video rounded-lg overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Property image ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60'%3E%3Crect fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='%2394a3b8'%3EBad URL%3C/text%3E%3C/svg%3E"
                    }}
                  />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded font-medium">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImageUrl(i)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )
            )}
          </div>
        )}

        {/* URL inputs */}
        <div className="space-y-2">
          {imageUrls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="https://images.unsplash.com/photo-…"
                value={url}
                onChange={(e) => updateImageUrl(i, e.target.value)}
                className="flex-1 font-mono text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.onchange = (ev) => {
                      const files = (ev.target as HTMLInputElement).files
                      handleFileUpload(files, i)
                      fileInputRef.current!.onchange = null
                    }
                    fileInputRef.current.click()
                  }
                }}
                disabled={uploadingIdx === i}
                className="shrink-0"
                title="Upload image for this slot"
              >
                {uploadingIdx === i ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
              {imageUrls.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImageUrl(i)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Amenities ──────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {AMENITIES_LIST.map((amenity) => {
            const selected = selectedAmenities.includes(amenity)
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                  selected
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border text-foreground hover:border-primary/50"
                }`}
              >
                {amenity}
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Active toggle ──────────────────────────────────────────────── */}
      <section className="flex items-center justify-between p-4 rounded-xl border border-border">
        <div>
          <p className="text-sm font-medium text-foreground">Publish listing</p>
          <p className="text-xs text-muted-foreground">
            Visible to guests on the platform
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            defaultChecked={property?.is_active ?? true}
            {...register("is_active")}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
        </label>
      </section>

      {/* ── Actions ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 sm:flex-none sm:min-w-32"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create Property"
          )}
        </Button>
      </div>
    </form>
  )
}
