export type NotificationType = "booking_confirmed" | "payment" | "system"

export interface Notification {
  id: string
  user_id: string
  booking_id: string | null
  type: NotificationType
  title: string
  message: string
  action_url: string | null
  read_at: string | null
  created_at: string
}
