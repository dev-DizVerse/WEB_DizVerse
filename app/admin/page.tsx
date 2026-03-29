"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Session check - immediate redirect if not admin
  useEffect(() => {
    const checkAdminSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      const currentUser = session?.user?.email || localStorage.getItem('currentUser');
      const userRole = session?.user?.user_metadata?.role || localStorage.getItem('userRole');
      
      console.log('Admin Page - Session Check:', { currentUser, userRole });
      
      if (!(currentUser === "ra1yan@dizverse.online" && userRole === "admin") && userRole !== "admin") {
        console.log('Admin access denied - redirecting');
        window.location.href = '/auth';
      }
    };
    checkAdminSession();
  }, []);

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

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/create-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, staffName, staffRole, department })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create staff account");
      }

      setSuccess(`Staff account created successfully for ${email}`);
      
      // Reset form
      setEmail("");
      setPassword("");
      setStaffName("");
      setStaffRole("");
      setDepartment("");

    } catch (error: any) {
      setError(error.message || "Failed to create staff account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="cursor" id="cursor" ref={cursorRef} />
      <div className="cursor-ring" id="cursorRing" ref={ringRef} />
      <div className="min-h-screen bg-[#020408] flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header with Logout */}
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h2 className="text-3xl font-bold text-white">Create Staff Account</h2>
              <p className="mt-2 text-gray-400">
                Add a new staff member to the team
              </p>
            </div>
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userRole');
                window.location.href = '/';
              }}
              className="bg-[#ff4466] text-white px-4 py-2 rounded font-semibold hover:bg-[#ff5577] transition text-sm"
            >
              Logout
            </button>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleCreateStaff}>
            <div className="space-y-4">
              <div>
                <label htmlFor="staffName" className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  id="staffName"
                  name="staffName"
                  type="text"
                  required
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-[#080f1a] border border-[rgba(0,240,255,0.1)] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-[#080f1a] border border-[rgba(0,240,255,0.1)] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] focus:border-transparent"
                  placeholder="staff@dizverse.online"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Temporary Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-[#080f1a] border border-[rgba(0,240,255,0.1)] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] focus:border-transparent"
                  placeholder="•••••••"
                />
                <p className="mt-1 text-xs text-gray-500">Staff member can change this later</p>
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-300">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setStaffRole(""); // Reset role when department changes
                  }}
                  className="mt-1 block w-full px-3 py-2 bg-[#080f1a] border border-[rgba(0,240,255,0.1)] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00f0ff] focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  <option value="operations">Operations</option>
                  <option value="sales">Sales</option>
                  <option value="creative">Creative</option>
                  <option value="development">Development</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>

              <div>
                <label htmlFor="staffRole" className="block text-sm font-medium text-gray-300">
                  Role Type
                </label>
                <select
                  id="staffRole"
                  name="staffRole"
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  disabled={!department}
                  className="mt-1 block w-full px-3 py-2 bg-[#080f1a] border border-[rgba(0,240,255,0.1)] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00f0ff] focus:border-transparent disabled:opacity-50"
                >
                  <option value="">Select Role</option>
                  {department === "operations" && (
                    <>
                      <option value="chief-operating-officer">Chief Operating Officer</option>
                      <option value="head-of-operations">Head of Operations</option>
                      <option value="deputy-head-of-operations">Deputy Head of Operations</option>
                      <option value="senior-project-manager">Senior Project Manager</option>
                      <option value="project-coordinator">Project Coordinator</option>
                      <option value="hr-manager">HR Manager</option>
                      <option value="hr-executive">HR Executive</option>
                      <option value="finance-manager">Finance Manager</option>
                      <option value="accountant">Accountant</option>
                      <option value="billing-executive">Billing Executive</option>
                      <option value="client-success-executive">Client Success Executive</option>
                    </>
                  )}
                  {department === "sales" && (
                    <>
                      <option value="chief-sales-officer">Chief Sales Officer</option>
                      <option value="head-of-sales">Head of Sales</option>
                      <option value="deputy-head-of-sales">Deputy Head of Sales</option>
                      <option value="senior-lead-generation-executive">Senior Lead Generation Executive</option>
                      <option value="lead-generation-executive">Lead Generation Executive</option>
                      <option value="senior-sales-executive">Senior Sales Executive</option>
                      <option value="sales-executive">Sales Executive</option>
                      <option value="proposal-executive">Proposal Executive</option>
                      <option value="senior-onboarding-executive">Senior Onboarding Executive</option>
                      <option value="onboarding-executive">Onboarding Executive</option>
                    </>
                  )}
                  {department === "creative" && (
                    <>
                      <option value="chief-creative-officer">Chief Creative Officer</option>
                      <option value="head-of-creative">Head of Creative</option>
                      <option value="deputy-head-of-creative">Deputy Head of Creative</option>
                      <option value="senior-graphic-designer">Senior Graphic Designer</option>
                      <option value="graphic-designer">Graphic Designer</option>
                      <option value="senior-video-editor">Senior Video Editor</option>
                      <option value="motion-graphics-designer">Motion Graphics Designer</option>
                      <option value="junior-editor">Junior Editor</option>
                      <option value="2d-3d-animator">2D/3D Animator</option>
                      <option value="3d-modeler">3D Modeler</option>
                      <option value="senior-ui-ux-designer">Senior UI/UX Designer</option>
                      <option value="ui-designer">UI Designer</option>
                      <option value="ux-researcher">UX Researcher</option>
                    </>
                  )}
                  {department === "marketing" && (
                    <>
                      <option value="chief-marketing-officer">Chief Marketing Officer</option>
                      <option value="head-of-marketing">Head of Marketing</option>
                      <option value="deputy-head-of-marketing">Deputy Head of Marketing</option>
                      <option value="social-media-manager">Social Media Manager</option>
                      <option value="social-media-executive">Social Media Executive</option>
                      <option value="community-manager">Community Manager</option>
                      <option value="reels-shorts-planner">Reels/shorts content planner</option>
                      <option value="paid-ads-manager">Paid Ads Manager</option>
                      <option value="meta-ads-specialist">Meta Ads Specialist</option>
                      <option value="google-ads-specialist">Google Ads Specialist</option>
                      <option value="linkedin-ads-specialist">LinkedIn Ads Specialist</option>
                      <option value="campaign-executive">Campaign Executive</option>
                      <option value="tracking-analytics-executive">Tracking & Analytics Executive</option>
                      <option value="seo-manager">SEO Manager</option>
                      <option value="seo-executive-onpage">SEO Executive (On-page)</option>
                      <option value="seo-executive-offpage">SEO Executive (Off-page)</option>
                      <option value="technical-seo-specialist">Technical SEO Specialist</option>
                      <option value="keyword-search-analysist">Keyword Search Analysist</option>
                      <option value="content-strategist">Content Strategist</option>
                      <option value="seo-content-specialist">SEO Content Specialist</option>
                      <option value="conversion-copywriter">Conversion Copywriter</option>
                      <option value="social-media-content-writer">Social Media Content Writer / Scriptwriter</option>
                      <option value="managing-editor">Managing Editor</option>
                      <option value="email-marketing-specialist">Email Marketing Specialist</option>
                      <option value="crm-automation-executive">CRM/Automation Executive</option>
                      <option value="social-media-account-manager">Social Media Account Manager</option>
                      <option value="social-media-account-executive">Social Media Account Executive</option>
                      <option value="community-support-executive">Community/Support Executive</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-[#ff4466]/10 border border-[#ff4466]/20 rounded-md p-3">
                <p className="text-[#ff6677] text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-md p-3">
                <p className="text-[#00ff88] text-sm">{success}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#020408] bg-[#00f0ff] hover:bg-[#00d4e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00f0ff] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Creating Account..." : "Create Staff Account"}
              </button>
            </div>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => router.push("/auth")}
                className="text-gray-400 hover:text-white text-sm block"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
