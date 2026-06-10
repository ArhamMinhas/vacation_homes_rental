import { createAdminClient } from "@/lib/supabase/server"

const BUCKET = "property-images"

/**
 * Uploads a single file to Supabase Storage and returns the public URL.
 * Requires a "property-images" bucket to be created in Supabase Dashboard
 * with public access enabled.
 */
export async function uploadPropertyImage(
  file: File,
  folder = "general"
): Promise<string> {
  const supabase = createAdminClient()
  const ext = file.name.split(".").pop() ?? "jpg"
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const bytes = await file.arrayBuffer()

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType: file.type || "image/jpeg",
      cacheControl: "3600",
      upsert: false,
    })

  if (error) {
    if (error.message?.includes("Bucket not found") || error.message?.includes("bucket")) {
      throw new Error(
        `Storage bucket "${BUCKET}" not found. Create it in Supabase Dashboard → Storage → New bucket, name it "property-images", set it to Public.`
      )
    }
    throw new Error(`Storage upload failed: ${error.message}`)
  }

  return getPublicImageUrl(data.path)
}

export async function uploadMultiplePropertyImages(
  files: File[],
  folder = "general"
): Promise<string[]> {
  return Promise.all(files.map((f) => uploadPropertyImage(f, folder)))
}

export async function deletePropertyImageFromStorage(
  imageUrl: string
): Promise<void> {
  const supabase = createAdminClient()
  try {
    // Extract the storage path from the full public URL
    const marker = `/storage/v1/object/public/${BUCKET}/`
    const idx = imageUrl.indexOf(marker)
    if (idx === -1) return
    const path = imageUrl.slice(idx + marker.length)
    await supabase.storage.from(BUCKET).remove([path])
  } catch {
    // Best-effort — don't fail the whole operation if cleanup fails
  }
}

export function getPublicImageUrl(path: string): string {
  const supabase = createAdminClient()
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path)
  return publicUrl
}
