"use client";

import { useEffect } from "react";

export default function UserDashboard() {
  // Session check - immediate redirect if not user
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    
    if (!(currentUser && userRole === 'user')) {
      window.location.href = '/auth';
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020408]">
      {/* Empty user dashboard - only navigation from layout */}
    </div>
  );
}
