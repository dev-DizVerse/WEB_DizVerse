import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. API routes depending on Supabase will fail.",
  );
}

export const supabaseServer =
  url && serviceRoleKey
    ? createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    })
    : null;

