import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "Invalid email address" },
      { status: 400 },
    );
  }

  if (!supabaseServer) {
    return NextResponse.json(
      { ok: false, error: "Server not configured for Supabase" },
      { status: 500 },
    );
  }

  const { error } = await supabaseServer
    .from("notify_subscribers")
    .insert({ email });

  if (error) {
    console.error("[notify] Supabase insert error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to save email. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

