const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'sielabs-next');

const files = {
  'src/app/login/page.tsx': `"use client";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-[0_4px_24px_rgba(154,123,26,0.06)] border-2 border-[rgba(160,120,20,0.3)] p-8">
        <h2 className="text-3xl font-['DM_Serif_Display'] text-[#1A1A1A] mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#9A7B1A]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#9A7B1A]" />
          </div>
          <button type="submit" className="w-full bg-[#9A7B1A] text-white py-2 rounded-[8px] font-semibold hover:bg-[#7A6015] transition-colors mt-4">Login</button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
        <p className="mt-6 text-center text-sm text-[#1A1A1A]/60">
          Don't have an account? <Link href="/signup" className="text-[#9A7B1A] font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
`,

  'src/app/signup/page.tsx': `"use client";
import { useState } from "react";
import Link from "next/link";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-[0_4px_24px_rgba(154,123,26,0.06)] border-2 border-[rgba(160,120,20,0.3)] p-8">
        <h2 className="text-3xl font-['DM_Serif_Display'] text-[#1A1A1A] mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#9A7B1A]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#9A7B1A]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#9A7B1A]" />
          </div>
          <button type="submit" className="w-full bg-[#9A7B1A] text-white py-2 rounded-[8px] font-semibold hover:bg-[#7A6015] transition-colors mt-4">Sign Up</button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
        <p className="mt-6 text-center text-sm text-[#1A1A1A]/60">
          Already have an account? <Link href="/login" className="text-[#9A7B1A] font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(targetDir, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

console.log('Frontend pages created successfully!');
