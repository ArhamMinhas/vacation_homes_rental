import { z } from "zod"

export const bookingSchema = z
  .object({
    property_id: z.string().uuid("Invalid property"),
    guest_name: z.string().min(2, "Full name is required"),
    guest_email: z.string().email("Valid email is required"),
    guest_phone: z.string().optional(),
    message: z.string().max(500).optional(),
    check_in: z.string().min(1, "Check-in date is required"),
    check_out: z.string().min(1, "Check-out date is required"),
    guests: z.coerce.number().int().min(1, "At least 1 guest required"),
  })
  .refine((d) => !d.check_in || !d.check_out || d.check_out > d.check_in, {
    message: "Check-out must be after check-in",
    path: ["check_out"],
  })
  .refine((d) => !d.check_in || d.check_in >= new Date().toISOString().split("T")[0], {
    message: "Check-in cannot be in the past",
    path: ["check_in"],
  })

export type BookingInput = z.infer<typeof bookingSchema>
