import { createClient, createAdminClient } from "@/lib/supabase/server"
import type { Property } from "@/types/property"
import type { PropertyInput } from "@/validations/property.schema"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PropertyFilters {
  location?: string
  property_type?: string
  min_price?: number
  max_price?: number
  bedrooms?: number
  max_guests?: number
}

export interface PropertyImage {
  id: string
  property_id: string
  image_url: string
  is_primary: boolean
  created_at: string
}

// ─── Mapper ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toProperty(row: any): Property {
  const imgs: { image_url: string; is_primary: boolean }[] =
    row.property_images ?? []
  const images = imgs
    .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
    .map((i) => i.image_url)

  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    property_type: row.property_type,
    location: row.location,
    price_per_night: Number(row.price_per_night),
    cleaning_fee: Number(row.cleaning_fee ?? 0),
    bedrooms: row.bedrooms ?? 0,
    bathrooms: row.bathrooms ?? 0,
    max_guests: row.max_guests ?? 1,
    amenities: row.amenities ?? [],
    images,
    is_active: row.is_active ?? true,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by ?? null,
  }
}

const WITH_IMAGES = `*, property_images (id, image_url, is_primary, created_at)` as const

// ─── Public queries ───────────────────────────────────────────────────────────

/** All active properties — used on public listing page. */
export async function getActiveProperties(): Promise<Property[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("properties")
    .select(WITH_IMAGES)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(toProperty)
}

/** Active properties with optional filters — used on listing page with search. */
export async function getFilteredProperties(
  filters?: PropertyFilters
): Promise<Property[]> {
  const supabase = await createClient()
  let query = supabase
    .from("properties")
    .select(WITH_IMAGES)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (filters?.location) query = query.ilike("location", `%${filters.location}%`)
  if (filters?.property_type) query = query.eq("property_type", filters.property_type)
  if (filters?.min_price) query = query.gte("price_per_night", filters.min_price)
  if (filters?.max_price) query = query.lte("price_per_night", filters.max_price)
  if (filters?.bedrooms) query = query.gte("bedrooms", filters.bedrooms)
  if (filters?.max_guests) query = query.gte("max_guests", filters.max_guests)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []).map(toProperty)
}

/** Single property — public users see only active ones. */
export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("properties")
    .select(WITH_IMAGES)
    .eq("id", id)
    .single()
  if (error) return null
  return toProperty(data)
}

// ─── Admin queries ────────────────────────────────────────────────────────────

/** All properties including inactive — admin only. */
export async function getAllProperties(): Promise<Property[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("properties")
    .select(WITH_IMAGES)
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(toProperty)
}

// Alias kept for backwards compatibility with admin pages
export const getAllPropertiesAdmin = getAllProperties

export async function createProperty(
  input: PropertyInput,
  adminId: string
): Promise<Property> {
  const supabase = createAdminClient()
  const { image_urls, amenities, ...rest } = input

  const { data: property, error } = await supabase
    .from("properties")
    .insert({ ...rest, amenities: amenities ?? [], created_by: adminId })
    .select("id")
    .single()
  if (error) throw new Error(error.message)

  if (image_urls.length > 0) {
    await createPropertyImages(property.id, image_urls)
  }

  // Use admin client for the final fetch to avoid RLS on the freshly inserted row
  const { data: final, error: fetchErr } = await supabase
    .from("properties")
    .select(WITH_IMAGES)
    .eq("id", property.id)
    .single()
  if (fetchErr || !final) throw new Error(fetchErr?.message ?? "Created property not found")
  return toProperty(final)
}

export async function updateProperty(
  id: string,
  input: Partial<PropertyInput>
): Promise<Property> {
  const supabase = createAdminClient()
  const { image_urls, ...rest } = input

  if (Object.keys(rest).length > 0) {
    const { error } = await supabase.from("properties").update(rest).eq("id", id)
    if (error) throw new Error(error.message)
  }

  if (image_urls !== undefined) {
    await supabase.from("property_images").delete().eq("property_id", id)
    if (image_urls.length > 0) {
      await createPropertyImages(id, image_urls)
    }
  }

  // Use admin client for the final fetch to avoid RLS issues
  const { data: final, error: fetchErr } = await supabase
    .from("properties")
    .select(WITH_IMAGES)
    .eq("id", id)
    .single()
  if (fetchErr || !final) throw new Error(fetchErr?.message ?? "Property not found after update")
  return toProperty(final)
}

/** Soft-delete: sets is_active = false, property stays in DB. */
export async function deactivateProperty(id: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from("properties")
    .update({ is_active: false })
    .eq("id", id)
  if (error) throw new Error(error.message)
}

/** Hard-delete: removes property and its images (cascade). */
export async function deleteProperty(id: string): Promise<void> {
  const supabase = createAdminClient()
  // Delete images first (foreign key)
  await supabase.from("property_images").delete().eq("property_id", id)
  const { error } = await supabase.from("properties").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

// ─── Images ───────────────────────────────────────────────────────────────────

export async function getPropertyImages(
  propertyId: string
): Promise<PropertyImage[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("property_images")
    .select("*")
    .eq("property_id", propertyId)
    .order("is_primary", { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createPropertyImages(
  propertyId: string,
  imageUrls: string[]
): Promise<void> {
  const supabase = createAdminClient()
  const rows = imageUrls.map((url, i) => ({
    property_id: propertyId,
    image_url: url,
    is_primary: i === 0,
  }))
  const { error } = await supabase.from("property_images").insert(rows)
  if (error) throw new Error(error.message)
}

export async function deletePropertyImage(imageId: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from("property_images")
    .delete()
    .eq("id", imageId)
  if (error) throw new Error(error.message)
}
