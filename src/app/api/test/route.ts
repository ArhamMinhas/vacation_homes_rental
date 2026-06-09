import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("properties").select("*");
  return NextResponse.json({ data, error });
}