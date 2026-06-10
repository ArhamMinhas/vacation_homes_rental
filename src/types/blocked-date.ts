export interface BlockedDate {
  id: string
  property_id: string
  start_date: string
  end_date: string
  reason: string | null
  created_by: string | null
  created_at: string
  property?: {
    id: string
    title: string
  }
}

export interface CreateBlockedDateInput {
  property_id: string
  start_date: string
  end_date: string
  reason?: string
}
