import { z } from "zod"

export const blockedDateSchema = z
  .object({
    property_id: z.string().uuid("Property is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    reason: z.string().max(200).optional(),
  })
  .refine((d) => d.end_date > d.start_date, {
    message: "End date must be after start date",
    path: ["end_date"],
  })

export type BlockedDateInput = z.infer<typeof blockedDateSchema>
