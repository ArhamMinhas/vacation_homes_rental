import { z } from "zod"
import { PROPERTY_TYPES } from "@/lib/constants"

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000),
  property_type: z.enum([...PROPERTY_TYPES] as [string, ...string[]]),
  location: z.string().min(2, "Location is required"),
  price_per_night: z.coerce.number().min(1, "Price must be at least $1"),
  cleaning_fee: z.coerce.number().min(0, "Cleaning fee cannot be negative").default(0),
  bedrooms: z.coerce.number().int().min(0).default(1),
  bathrooms: z.coerce.number().int().min(0).default(1),
  max_guests: z.coerce.number().int().min(1, "Must allow at least 1 guest").default(1),
  amenities: z.array(z.string()).default([]),
  image_urls: z.array(z.string().url("Must be a valid image URL")).min(1, "Add at least one image URL"),
  is_active: z.boolean().default(true),
})

export type PropertyInput = z.infer<typeof propertySchema>

// Used in the admin form — image_urls validated manually so form validation
// doesn't block submission before images are uploaded.
export const propertyFormSchema = propertySchema.extend({
  image_urls: z.array(z.string()).default([]),
})

export type PropertyFormInput = z.infer<typeof propertyFormSchema>
