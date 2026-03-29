// Auto-login handler for dashboard after account creation
export async function POST(request: Request) {
  try {
    const { sessionData } = await request.json();
    
    if (!sessionData) {
      return Response.json(
        { error: "No session data provided" },
        { status: 400 }
      );
    }

    const { access_token, refresh_token, user } = sessionData;
    
    // Store session in localStorage
    localStorage.setItem('currentUser', user.id);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    
    return Response.json({
      success: true,
      message: "Session established successfully"
    });
    
  } catch (error) {
    console.error("Session error:", error);
    return Response.json(
      { error: "Session setup failed" },
      { status: 500 }
    );
  }
}
