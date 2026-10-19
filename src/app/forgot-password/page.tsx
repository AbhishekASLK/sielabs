"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await res.json();
    setMessage(data.message);
    setIsLoading(false);
    
    if (res.ok) {
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4 relative overflow-hidden">
      {/* Background grid and glowing blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40" 
           style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#9A7B1A]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#9A7B1A]/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Back button */}
      <div className="absolute top-8 left-8 z-10 hidden sm:block">
        <Link href="/login" className="flex items-center gap-2 text-[#1A1A1A]/70 font-semibold hover:text-[#1A1A1A] transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Login
        </Link>
      </div>

      <div className="max-w-[420px] w-full bg-white/70 backdrop-blur-2xl rounded-[24px] shadow-[0_8px_40px_rgba(154,123,26,0.08)] border border-white/50 p-6 sm:p-8 z-10 my-4">
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <img src="/favicon.ico" alt="SieLabs Logo" className="w-12 h-12 object-contain rounded-xl shadow-sm mb-4 transition-transform hover:scale-105" />
          </Link>
          <h2 className="text-[28px] leading-tight font-['DM_Serif_Display'] text-[#1A1A1A] text-center">Reset Password</h2>
          <p className="text-[#1A1A1A]/60 text-[13px] mt-1 font-medium text-center">Enter your email and a new password to reset your account.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-[12px] font-bold text-[#1A1A1A]/80 uppercase tracking-wide mb-1.5">Email or Username</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="off"
                   className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#9A7B1A]/40 focus:border-[#9A7B1A] transition-all placeholder:text-gray-400" 
                   placeholder="Enter your email or username" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#1A1A1A]/80 uppercase tracking-wide mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 pr-11 bg-white border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#9A7B1A]/40 focus:border-[#9A7B1A] transition-all placeholder:text-gray-400" 
                placeholder="Enter your new password"
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
          </div>
          
          <button type="submit" disabled={isLoading} className="w-full bg-[#9A7B1A] text-white py-2.5 rounded-xl text-[14px] font-semibold hover:bg-[#856a16] shadow-[0_4px_14px_rgba(154,123,26,0.3)] hover:shadow-[0_6px_20px_rgba(154,123,26,0.4)] transition-all transform active:scale-[0.98] mt-4 disabled:opacity-70 disabled:active:scale-100">
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        
        {message && <p className={`mt-4 text-center text-[13px] font-medium p-2.5 rounded-lg border ${message.includes('successfully') ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-100'}`}>{message}</p>}
      </div>
    </div>
  );
}
