import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

type ContactPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  service?: string;
  message?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ContactPayload;

  const firstName = body.firstName?.trim();
  const lastName = body.lastName?.trim();
  const email = body.email?.trim();
  const service = body.service?.trim();
  const message = body.message?.trim();

  if (!firstName || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "First name, email, and message are required." },
      { status: 400 },
    );
  }

  if (!supabaseServer) {
    return NextResponse.json(
      { ok: false, error: "Server not configured for Supabase" },
      { status: 500 },
    );
  }

  const { error } = await supabaseServer.from("contact_messages").insert({
    first_name: firstName,
    last_name: lastName,
    email,
    service,
    message,
  });

  if (error) {
    console.error("[contact] Supabase insert error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

