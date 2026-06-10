import { createAdminClient } from "@/lib/supabase/server"
import type { BlockedDate } from "@/types/blocked-date"
import type { BlockedDateInput } from "@/validations/blocked-date.schema"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBlockedDate(row: any): BlockedDate {
  return {
    id: row.id,
    property_id: row.property_id,
    start_date: row.start_date,
    end_date: row.end_date,
    reason: row.reason ?? null,
    created_by: row.created_by ?? null,
    created_at: row.created_at,
    property: row.property ?? undefined,
  }
}

const WITH_PROPERTY = `*, property:properties (id, title)` as const

export async function getBlockedDatesByProperty(
  propertyId: string
): Promise<BlockedDate[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("blocked_dates")
    .select(WITH_PROPERTY)
    .eq("property_id", propertyId)
    .order("start_date", { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(toBlockedDate)
}

export async function getAllBlockedDatesForAdmin(): Promise<BlockedDate[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("blocked_dates")
    .select(WITH_PROPERTY)
    .order("start_date", { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(toBlockedDate)
}

// Alias for backwards compat
export const getBlockedDates = getAllBlockedDatesForAdmin

export async function createBlockedDate(
  input: BlockedDateInput,
  adminId: string
): Promise<BlockedDate> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("blocked_dates")
    .insert({
      property_id: input.property_id,
      start_date: input.start_date,
      end_date: input.end_date,
      reason: input.reason ?? null,
      created_by: adminId,
    })
    .select(WITH_PROPERTY)
    .single()
  if (error) throw new Error(error.message)
  return toBlockedDate(data)
}

export async function updateBlockedDate(
  id: string,
  input: Partial<BlockedDateInput>
): Promise<BlockedDate> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("blocked_dates")
    .update(input)
    .eq("id", id)
    .select(WITH_PROPERTY)
    .single()
  if (error) throw new Error(error.message)
  return toBlockedDate(data)
}

export async function deleteBlockedDate(id: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from("blocked_dates").delete().eq("id", id)
  if (error) throw new Error(error.message)
}
