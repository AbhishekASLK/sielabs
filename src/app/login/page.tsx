"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userName, setUserName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setUserName(data.name || "");
        localStorage.setItem("user", data.name);
        if (data.email) localStorage.setItem("user_email", data.email);
        localStorage.setItem("user_role", data.role || "student");
        const mobileVal = data.mobile || data.phone || "";
        if (mobileVal) {
          localStorage.setItem("user_mobile", mobileVal);
        } else {
          localStorage.removeItem("user_mobile");
        }
        localStorage.removeItem("user_phone");
        setTimeout(() => {
          if (data.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/profile");
          }
        }, 1400);
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch {
      setMessage("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4 relative overflow-hidden">
      {/* ── KEYFRAME ANIMATIONS ── */}
      <style>{`
        @keyframes loginSuccessPop {
          0% {
            opacity: 0;
            transform: translateY(-12px) scale(0.96);
          }
          60% {
            transform: translateY(2px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes loginCheckBounce {
          0% {
            transform: scale(0.3) rotate(-15deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.25) rotate(5deg);
          }
          75% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1) rotate(0);
            opacity: 1;
          }
        }
        @keyframes loginPulseGlow {
          0% {
            box-shadow: 0 8px 40px rgba(154, 123, 26, 0.08);
            border-color: rgba(255, 255, 255, 0.5);
          }
          30% {
            box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.25), 0 16px 50px rgba(16, 185, 129, 0.2);
            border-color: rgba(16, 185, 129, 0.5);
          }
          100% {
            box-shadow: 0 8px 40px rgba(16, 185, 129, 0.12);
            border-color: rgba(16, 185, 129, 0.35);
          }
        }
        @keyframes loginProgressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes loginConfetti {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(0.2);
          }
        }
      `}</style>

      {/* Background grid and glowing blobs */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#9A7B1A]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#9A7B1A]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-8 left-8 z-10 hidden sm:block">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#1A1A1A]/70 font-semibold hover:text-[#1A1A1A] transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div
        className="max-w-[420px] w-full bg-white/80 backdrop-blur-2xl rounded-[24px] border p-6 sm:p-8 z-10 my-4 transition-all duration-300"
        style={{
          boxShadow: isSuccess
            ? "0 0 0 4px rgba(16, 185, 129, 0.2), 0 16px 50px rgba(16, 185, 129, 0.15)"
            : "0 8px 40px rgba(154, 123, 26, 0.08)",
          borderColor: isSuccess ? "rgba(16, 185, 129, 0.35)" : "rgba(255, 255, 255, 0.5)",
          animation: isSuccess ? "loginPulseGlow 1.2s ease-out" : "none",
        }}
      >
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <img
              src="/favicon.ico"
              alt="SieLabs Logo"
              className="w-12 h-12 object-contain rounded-xl shadow-sm mb-4 transition-transform hover:scale-105"
            />
          </Link>
          <h2 className="text-[28px] leading-tight font-['DM_Serif_Display'] text-[#1A1A1A] text-center">
            Welcome Back
          </h2>
          <p className="text-[#1A1A1A]/60 text-[13px] mt-1 font-medium">
            Log in to your SieLabs account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-[12px] font-bold text-[#1A1A1A]/80 uppercase tracking-wide mb-1.5">
              Email or Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || isSuccess}
              autoComplete="off"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#9A7B1A]/40 focus:border-[#9A7B1A] transition-all placeholder:text-gray-400 disabled:opacity-60"
              placeholder="Enter your email or username"
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#1A1A1A]/80 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isSuccess}
                autoComplete="current-password"
                className="w-full px-4 py-2.5 pr-11 bg-white border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#9A7B1A]/40 focus:border-[#9A7B1A] transition-all placeholder:text-gray-400 disabled:opacity-60"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A1A1A] transition-colors p-1"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <Link
                href="/forgot-password"
                className="text-[12px] font-bold text-[#9A7B1A] hover:text-[#7A6015] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            {/* Confetti celebration burst */}
            {isSuccess && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  pointerEvents: "none",
                  zIndex: 20,
                }}
              >
                {[
                  { x: -50, y: -45, color: "#10B981", size: 7, delay: "0ms" },
                  { x: 45, y: -50, color: "#9A7B1A", size: 6, delay: "40ms" },
                  { x: -65, y: -15, color: "#F59E0B", size: 8, delay: "20ms" },
                  { x: 60, y: -20, color: "#10B981", size: 7, delay: "60ms" },
                  { x: -40, y: 35, color: "#6366F1", size: 6, delay: "30ms" },
                  { x: 45, y: 30, color: "#10B981", size: 8, delay: "50ms" },
                  { x: 0, y: -60, color: "#9A7B1A", size: 7, delay: "10ms" },
                  { x: -25, y: -50, color: "#10B981", size: 5, delay: "70ms" },
                  { x: 25, y: -55, color: "#EC4899", size: 6, delay: "50ms" },
                  { x: -70, y: 5, color: "#F59E0B", size: 6, delay: "80ms" },
                  { x: 70, y: 5, color: "#10B981", size: 7, delay: "40ms" },
                  { x: 0, y: 45, color: "#9A7B1A", size: 6, delay: "90ms" },
                ].map((p, i) => (
                  <span
                    key={i}
                    style={
                      {
                        position: "absolute",
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        borderRadius: i % 2 === 0 ? "50%" : "2px",
                        backgroundColor: p.color,
                        animation: `loginConfetti 0.85s cubic-bezier(0.25, 1, 0.5, 1) ${p.delay} forwards`,
                        ["--dx" as string]: `${p.x}px`,
                        ["--dy" as string]: `${p.y}px`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full text-white py-2.5 rounded-xl text-[14px] font-semibold transition-all transform active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
              style={{
                backgroundColor: isSuccess ? "#10B981" : "#9A7B1A",
                boxShadow: isSuccess
                  ? "0 4px 18px rgba(16, 185, 129, 0.4)"
                  : "0 4px 14px rgba(154, 123, 26, 0.3)",
                cursor: isLoading || isSuccess ? "default" : "pointer",
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : isSuccess ? (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ animation: "loginCheckBounce 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Welcome, {userName || "Student"}!</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* ── ANIMATED SUCCESS BANNER ── */}
        {isSuccess && (
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "14px 16px",
              borderRadius: "14px",
              marginTop: "18px",
              backgroundColor: "#ECFDF5",
              border: "1.5px solid #A7F3D0",
              boxShadow: "0 4px 18px rgba(16, 185, 129, 0.15)",
              animation: "loginSuccessPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                backgroundColor: "#10B981",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.35)",
                animation: "loginCheckBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#065F46" }}>
                Login Successful!
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#047857", fontWeight: 500 }}>
                Welcome back{userName ? `, ${userName}` : ""}! Redirecting you now...
              </p>
            </div>

            {/* Redirect loading timer bar */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "3px",
                backgroundColor: "#10B981",
                opacity: 0.65,
                animation: "loginProgressFill 1.4s ease-in forwards",
              }}
            />
          </div>
        )}

        {/* ── ERROR MESSAGE ── */}
        {!isSuccess && message && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              marginTop: "16px",
              fontSize: "13px",
              fontWeight: 500,
              backgroundColor: "#FEF2F2",
              color: "#991B1B",
              border: "1px solid #FECACA",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#DC2626"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{message}</span>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-center text-[13px] text-[#1A1A1A]/60 font-medium">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[#9A7B1A] font-bold hover:text-[#7A6015] transition-colors ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
