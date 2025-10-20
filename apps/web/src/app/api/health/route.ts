import { NextResponse } from "next/server";
import { env } from "@shared/env";

export async function GET() {
  // Touch a couple of keys to assert parsing happened
  void env.SUPABASE_URL;
  void env.CLERK_SECRET_KEY;
  return NextResponse.json({ ok: true });
}
