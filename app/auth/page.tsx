"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginType, setLoginType] = useState<"staff" | "user" | null>(null);
  const router = useRouter();

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const supabase = createClient();

    try {
      if (loginType === "staff") {


        console.log("Attempting staff login for:", email);
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        console.log("Staff login response:", { data: data?.user?.id, error: signInError });

        if (signInError) throw signInError;

        const role = data.session?.user?.user_metadata?.role;
        const department = data.session?.user?.user_metadata?.department;

        if (role === "admin") {
          localStorage.setItem('currentUser', data.session?.user?.email || '');
          localStorage.setItem('userRole', 'admin');
          window.location.href = "/admin";
        } else if (role === "staff") {
          localStorage.setItem('currentUser', data.session?.user?.email || '');
          localStorage.setItem('userRole', 'staff');
          localStorage.setItem('userDepartment', department || '');
          if (department === "operations") {
            window.location.href = "/dashboard/operations";
          } else {
            window.location.href = "/dashboard/staff";
          }
        } else {
          await supabase.auth.signOut();
          throw new Error("Invalid staff credentials. You do not have staff access.");
        }
      } else {
        // User login/signup
        if (isSignUp) {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                fullName,
                role: "user"
              }
            }
          });

          if (signUpError) throw signUpError;

          setSuccess("Account created successfully! Please login to continue.");
          setIsSignUp(false);
          setPassword("");
          setFullName("");
        } else {
          // User login
          console.log("Attempting user login for:", email);
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          console.log("User login response:", { data: data?.user?.id, error: signInError });

          if (signInError) throw signInError;

          const role = data.session?.user?.user_metadata?.role;

          if (role !== "user" && role !== "admin") {
            // allow admin to login as user too just in case, but mainly check for "user"
            await supabase.auth.signOut();
            throw new Error("Invalid user credentials");
          }

          localStorage.setItem('currentUser', data.session?.user?.email || '');
          localStorage.setItem('userRole', 'user');
          window.location.href = "/dashboard/user";
        }
      }
    } catch (error: any) {
      console.error("Auth error caught:", error);
      setError(error.message || "An error occurred during authentication.");
    } finally {
      console.log("Auth flow finished. Setting loading to false.");
      setLoading(false);
    }
  };

  // Show login type selection if not chosen
  if (!loginType) {
    return (
      <>
        <div className="cursor" id="cursor" ref={cursorRef} />
        <div className="cursor-ring" id="cursorRing" ref={ringRef} />
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0d1117]">
          {/* Large Container Box - FIXED DIMENSIONS */}
          <div className="bg-[#1a2035] border border-[rgba(0,240,255,0.2)] rounded-3xl p-6 shadow-2xl w-[1024px] h-[450px] mx-8 overflow-hidden">
            <div className="flex items-center justify-between gap-6 h-full">
              {/* Left Side - Welcome Text and Icon */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center overflow-hidden">
                <div className="text-center mb-6">
                  <h2 className="text-4xl font-bold text-white inline">Welcome to </h2>
                  <span className="text-4xl font-black text-[#00f0ff] ml-3">DizVerse</span>
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/desk.png"
                    alt="Login Illustration"
                    width={400}
                    height={400}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Right Side - Login Card (UNCHANGED) */}
              <div className="flex-1 max-w-md overflow-hidden">
                <div className="relative">
                  {/* Gradient Border/Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7b2fff] via-[#00f0ff] to-[#00ff88] rounded-2xl opacity-20 blur-sm"></div>

                  {/* Card Content */}
                  <div className="relative bg-[#0d1117] border border-[rgba(0,240,255,0.2)] rounded-2xl p-8 shadow-2xl">
                    <div className="text-center">
                      <h3 className="text-3xl font-light text-white mb-3">Choose Login Type</h3>
                      <p className="text-[#8b949e] text-lg mb-8">
                        Select your account type to continue
                      </p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => setLoginType("staff")}
                        className="w-full py-3 px-6 bg-gradient-to-r from-[#00f0ff] to-[#00d4e0] border border-[#00f0ff] rounded-xl text-[#0d1117] font-semibold hover:from-[#00d4e0] hover:to-[#00f0ff] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                      >
                        <span className="text-xl">👔</span>
                        Staff Login
                      </button>

                      <button
                        onClick={() => setLoginType("user")}
                        className="w-full py-3 px-6 bg-transparent border border-[rgba(0,240,255,0.3)] rounded-xl text-[#00f0ff] font-semibold hover:bg-[rgba(0,240,255,0.1)] transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <span className="text-xl">👤</span>
                        User Login
                      </button>
                    </div>

                    <div className="text-center pt-6">
                      <button
                        onClick={() => router.push("/")}
                        className="text-[#8b949e] hover:text-white text-sm transition-colors"
                      >
                        ← Back to Home
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="cursor" id="cursor" ref={cursorRef} />
      <div className="cursor-ring" id="cursorRing" ref={ringRef} />
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0d1117]">
        {/* Large Container Box - FIXED DIMENSIONS */}
        <div className="bg-[#1a2035] border border-[rgba(0,240,255,0.2)] rounded-3xl p-6 shadow-2xl w-[1024px] h-[450px] mx-8 overflow-hidden">
          <div className="flex items-center justify-between gap-6 h-full">
            {/* Left Side - Welcome Text and Icon */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center overflow-hidden">
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold text-white inline">Welcome to </h2>
                <span className="text-4xl font-black text-[#00f0ff] ml-3">DizVerse</span>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/desk.png"
                  alt="Login Illustration"
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Right Side - Login Card (UNCHANGED) */}
            <div className="flex-1 max-w-md overflow-hidden">
              <div className="relative">
                {/* Gradient Border/Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#7b2fff] via-[#00f0ff] to-[#00ff88] rounded-2xl opacity-20 blur-sm"></div>

                {/* Card Content */}
                <div className="relative bg-[#0d1117] border border-[rgba(0,240,255,0.2)] rounded-2xl p-8 shadow-2xl">
                  <div className="text-center">
                    <h3 className="text-3xl font-light text-white mb-3">
                      {loginType === "staff" ? "Staff Login" : (isSignUp ? "Create Account" : "User Login")}
                    </h3>
                    <p className="text-[#8b949e] text-lg mb-8">
                      {loginType === "staff"
                        ? "Enter your staff credentials"
                        : (isSignUp ? "Join our platform" : "Welcome back to your dashboard")
                      }
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={handleAuth}>
                    <div className="space-y-4">
                      {isSignUp && (
                        <div className="flex items-center gap-3 bg-[rgba(22,27,34,0.5)] border border-[rgba(0,240,255,0.2)] rounded-lg px-4 py-3">
                          <span className="text-xl text-[#00f0ff]">👤</span>
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="flex-1 bg-transparent text-white placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
                            placeholder="Full Name"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-3 bg-[rgba(22,27,34,0.5)] border border-[rgba(0,240,255,0.2)] rounded-lg px-4 py-3">
                        <span className="text-xl text-[#00f0ff]">✉️</span>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 bg-transparent text-white placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
                          placeholder={loginType === "staff" ? "staff@dizverse.online" : "your@email.com"}
                        />
                      </div>

                      <div className="flex items-center gap-3 bg-[rgba(22,27,34,0.5)] border border-[rgba(0,240,255,0.2)] rounded-lg px-4 py-3">
                        <span className="text-xl text-[#00f0ff]">🔒</span>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="flex-1 bg-transparent text-white placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
                          placeholder="••••••••"
                        />
                      </div>

                      {loginType === "user" && !isSignUp && (
                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => setIsSignUp(true)}
                            className="text-[#00f0ff] hover:text-white text-sm transition-colors"
                          >
                            Don't have an account? Sign up
                          </button>
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="bg-[rgba(255,68,102,0.1)] border border-[rgba(255,68,102,0.3)] rounded-lg p-3">
                        <p className="text-[#ff6b6b] text-sm">{error}</p>
                      </div>
                    )}

                    {success && (
                      <div className="bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] rounded-lg p-3">
                        <p className="text-[#00ff88] text-sm">{success}</p>
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-6 bg-gradient-to-r from-[#00f0ff] to-[#00d4e0] border border-[#00f0ff] rounded-xl text-[#0d1117] font-semibold hover:from-[#00d4e0] hover:to-[#00f0ff] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
                      </button>
                    </div>

                    <div className="text-center space-y-2 pt-4">
                      {loginType === "user" && isSignUp && (
                        <button
                          type="button"
                          onClick={() => setIsSignUp(false)}
                          className="text-[#00f0ff] hover:text-white text-sm block transition-colors"
                        >
                          Already have an account? Sign in
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setLoginType(null);
                          setIsSignUp(false);
                        }}
                        className="text-[#8b949e] hover:text-white text-sm block transition-colors"
                      >
                        ← Back to Login Selection
                      </button>

                      <button
                        onClick={() => router.push("/")}
                        className="text-[#8b949e] hover:text-white text-sm block transition-colors"
                      >
                        ← Back to Home
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
