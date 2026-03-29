import { createClient } from "@supabase/supabase-js";

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key'
);

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create user account with role in metadata
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "user",
        full_name: fullName,
        created_by: "admin",
        created_at: new Date().toISOString(),
      },
    });

    if (error) {
      console.error("User creation error:", error);
      return Response.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Also create a profile entry in profiles table
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: data.user?.id,
        email: email,
        full_name: fullName,
        role: "user",
        created_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Don't fail the whole operation if profile creation fails
      // but log it for debugging
    }

    return Response.json({
      success: true,
      message: "User account created successfully",
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
      // Auto-login after successful account creation
      redirectTo: "/dashboard/user"
    });
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
