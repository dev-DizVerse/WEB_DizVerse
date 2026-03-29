"use client";

import { useEffect } from "react";

export default function StaffDashboard() {
  // Session check - immediate redirect if not staff
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    
    if (!(currentUser && userRole === 'staff')) {
      window.location.href = '/auth';
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020408]">
      {/* Empty staff dashboard - only navigation from layout */}
    </div>
  );
}
