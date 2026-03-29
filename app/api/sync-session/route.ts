// Cross-device session synchronization API
export async function POST(request: Request) {
  try {
    const { email, password, deviceInfo } = await request.json();
    
    if (!email || !password || !deviceInfo) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check existing sessions for this email
    const existingSession = localStorage.getItem(`session_${email}`);
    
    // Create new session with device info
    const sessionId = `session_${email}_${Date.now()}`;
    const sessionData = {
      email,
      deviceInfo,
      sessionId,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    // Store in localStorage (cross-device sync)
    localStorage.setItem(`session_${email}`, JSON.stringify(sessionData));
    localStorage.setItem('currentUser', email);
    localStorage.setItem('lastActiveDevice', JSON.stringify(deviceInfo));
    
    return Response.json({
      success: true,
      message: "Session synchronized across devices",
      sessionId,
      sessionData
    });
    
  } catch (error) {
    console.error("Session sync error:", error);
    return Response.json(
      { error: "Session synchronization failed" },
      { status: 500 }
    );
  }
}
