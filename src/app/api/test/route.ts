import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } =
    await supabaseAdmin
      .from("properties")
      .select("*");

  return NextResponse.json({
    data,
    error
  });
}