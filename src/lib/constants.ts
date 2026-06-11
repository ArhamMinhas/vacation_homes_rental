// Pulled from env so the name can be changed without touching code
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "StayFinder"
export const APP_DESCRIPTION = "Find and book your perfect vacation home"

export const ROUTES = {
  HOME: "/",
  PROPERTIES: "/properties",
  PROPERTY_DETAIL: (id: string) => `/properties/${id}`,
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  USER_DASHBOARD: "/dashboard",
  USER_BOOKINGS: "/bookings",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PROPERTIES: "/admin/properties",
  ADMIN_PROPERTIES_CREATE: "/admin/properties/create",
  ADMIN_BOOKINGS: "/admin/bookings",
  ADMIN_BLOCKED_DATES: "/admin/blocked-dates",
  ADMIN_USERS: "/admin/users",
} as const

export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
} as const

export const USER_ROLE = {
  ADMIN: "admin",
  USER: "user",
} as const

export const PROPERTY_TYPES = [
  "Villa",
  "Apartment",
  "Cabin",
  "Cottage",
  "Beach House",
  "Mountain House",
  "Condo",
  "Townhouse",
] as const
