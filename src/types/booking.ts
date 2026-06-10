export type BookingStatus = "pending" | "confirmed" | "cancelled" | "rejected"

export interface Booking {
  id: string
  property_id: string
  user_id: string | null
  guest_name: string
  guest_email: string
  guest_phone: string | null
  message: string | null
  check_in: string
  check_out: string
  guests: number
  nights: number
  total_price: number
  status: BookingStatus
  created_at: string
  updated_at: string
  property?: {
    id: string
    title: string
    location: string
    property_type: string
    images: string[]
  }
}

export interface CreateBookingInput {
  property_id: string
  guest_name: string
  guest_email: string
  guest_phone?: string
  message?: string
  check_in: string
  check_out: string
  guests: number
}
