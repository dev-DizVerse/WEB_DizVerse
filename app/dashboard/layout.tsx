"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const pathname = usePathname();

  // Custom cursor system
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const finePointer =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return;

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;
    };

    const animate = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      raf = window.requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    raf = window.requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const finePointer =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>("a,button,input,select,textarea"),
    );

    const onEnter = () => {
      ring.style.width = "54px";
      ring.style.height = "54px";
    };
    const onLeave = () => {
      ring.style.width = "36px";
      ring.style.height = "36px";
    };

    els.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Check for logged-in user session with cross-device sync
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      let currentUser = session?.user?.email || localStorage.getItem('currentUser');
      let userRole = session?.user?.user_metadata?.role || localStorage.getItem('userRole');
      
      console.log('Session Check - Pathname:', pathname);
      console.log('Session Check - CurrentUser:', currentUser);
      console.log('Session Check - UserRole:', userRole);
      
      // Normalize pathname for comparison
      const normalizedPath = pathname?.replace(/\/$/, '') || '';
      
      // Specific validation for each dashboard type
      if (normalizedPath === '/admin') {
        console.log('Checking admin access...');
        if (!(currentUser === "ra1yan@dizverse.online" && userRole === "admin")) {
          console.log('Admin access denied, redirecting to auth');
          window.location.href = '/auth';
          return;
        }
      } else if (normalizedPath === '/dashboard/staff' || normalizedPath === '/dashboard/operations') {
        console.log('Checking staff access...');
        if (!(currentUser && (userRole === 'staff' || userRole === 'admin'))) {
          console.log('Staff access denied, redirecting to auth');
          window.location.href = '/auth';
          return;
        }
      } else if (normalizedPath === '/dashboard/user') {
        console.log('Checking user access...');
        if (!(currentUser && (userRole === 'user' || userRole === 'admin'))) {
          console.log('User access denied, redirecting to auth');
          window.location.href = '/auth';
          return;
        }
      } else if (!currentUser) {
        // If not logged in and not on a public page, redirect to auth
        window.location.href = '/auth';
        return;
      }
      
      if (currentUser && userRole) {
        setUserEmail(currentUser);
        setUserRole(userRole);
        console.log('Session valid, setting user info');
      }
    };

    checkSession();
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    window.location.href = '/';
  };

  return (
    <>
      <div className="cursor" id="cursor" ref={cursorRef} />
      <div className="cursor-ring" id="cursorRing" ref={ringRef} />
      <div className="min-h-screen bg-[#020408]">
        {/* Dashboard Navigation */}
        <nav className="pt-48">
          <div className="flex items-center justify-between h-12 w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center hover:opacity-80 transition">
                <img 
                  src="/D logo transparent.png" 
                  alt="DizVerse" 
                  className="h-16 w-auto"
                />
              </Link>
              <h1 className="text-white text-lg font-bold">
                {pathname.includes('/staff') ? 'Staff Dashboard' : 
                 pathname.includes('/user') ? 'User Dashboard' : 
                 pathname.includes('/operations') ? 'Operations Dashboard' : 
                 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-x-8">
              {/* Home Link */}
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white text-lg font-medium transition"
              >
                Home
              </Link>
              
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center justify-center w-12 h-12 bg-[#00f0ff] text-[#020408] rounded-full font-semibold hover:bg-[#00d4e0] transition"
                >
                  {userEmail ? userEmail.substring(0, 2).toUpperCase() : 'DV'}
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-[#080f1a] border border-[rgba(0,240,255,0.1)] rounded-lg shadow-lg z-50">
                    {/* User Info */}
                    <div className="p-4 border-b border-[rgba(0,240,255,0.1)]">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-[#00f0ff] text-[#020408] rounded-full font-semibold">
                          {userEmail ? userEmail.substring(0, 2).toUpperCase() : 'DV'}
                      </div>
                      <div>
                        <p className="text-white font-medium">Admin User</p>
                        <p className="text-gray-400 text-sm">{userEmail}</p>
                        <p className="text-[#00f0ff] text-xs">HR Administrator</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        console.log('Navigate to profile');
                      }}
                      className="w-full text-left px-3 py-1.5 text-gray-300 hover:text-white hover:bg-[rgba(0,240,255,0.1)] transition flex items-center space-x-2 text-sm"
                    >
                      <span>👤</span>
                      <span>Profile</span>
                    </button>
                    <button className="w-full text-left px-3 py-1.5 text-gray-300 hover:text-white hover:bg-[rgba(0,240,255,0.1)] transition flex items-center space-x-2 text-sm">
                      <span>⚙️</span>
                      <span>Settings</span>
                    </button>
                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        console.log('Navigate to change password');
                      }}
                      className="w-full text-left px-3 py-1.5 text-gray-300 hover:text-white hover:bg-[rgba(0,240,255,0.1)] transition flex items-center space-x-2 text-sm"
                    >
                      <span>🔒</span>
                      <span>Change Password</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-[rgba(255,68,102,0.1)] transition flex items-center space-x-2 text-sm"
                    >
                      <span>🚪</span>
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content - Direct */}
        <main className="w-full">
          {children}
        </main>
      </div>
    </>
  );
}
