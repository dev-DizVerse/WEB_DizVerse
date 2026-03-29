// Sync local accounts to online database
import { createClient } from "@supabase/supabase-js";

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export async function POST(request: Request) {
  try {
    const { email, password, accountType } = await request.json();
    
    if (!email || !password || !accountType) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl || '', accountType === 'staff' ? (supabaseServiceKey || '') : (supabaseAnonKey || ''));

    // Server-side cannot access localStorage. Client should send user data in body.
    // For now we mock localUser finding if it was supposed to sync.
    const localUser: any = null; // previously attempted localStorage.getItem

    
    if (localUser && localUser.id) {
      // User exists locally, sync to online
      const { data, error } = await supabase
        .from(accountType === 'staff' ? 'staff_users' : 'users')
        .upsert({
          id: localUser.id,
          email: localUser.email,
          updated_at: new Date().toISOString(),
          last_sync: new Date().toISOString(),
        });

      if (error) {
        console.error("Sync error:", error);
        return Response.json(
          { error: "Sync failed" },
          { status: 500 }
        );
      }

      return Response.json({
        success: true,
        message: `${accountType} account synced to online database`,
        synced: true
      });
    } else {
      return Response.json(
        { error: "No local account found to sync" },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error("Sync API error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
