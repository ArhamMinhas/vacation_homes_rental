export interface Property {
  id: string
  title: string
  description: string
  property_type: string
  location: string
  city: string
  country: string
  address: string | null
  price_per_night: number
  cleaning_fee: number
  bedrooms: number
  bathrooms: number
  max_guests: number
  amenities: string[]
  images: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}
