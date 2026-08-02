"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both Email and Password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/admin";
      } else {
        setError(data.message || data.error || "Invalid Email or Password");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* Crystal Clear High-Definition Campus Background (No Blur) */}
      <Image
        src="/images/login_bg.jpg"
        alt="School Academy Campus Background"
        fill
        className="object-cover object-center brightness-95 contrast-105"
        priority
      />

      {/* Subtle Tint Overlay (No Blur) */}
      <div className="absolute inset-0 bg-slate-950/35" />

      <div className="w-full max-w-md relative z-10 space-y-4">
        {/* Back to Homepage Button */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 hover:text-indigo-700 border border-slate-200 font-bold text-xs shadow-xl transition flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to Homepage</span>
          </Link>
          <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider drop-shadow-md">
            EduPulse Academy ERP
          </span>
        </div>

        {/* Role Switcher Tabs (Crisp White Theme) */}
        <div className="flex bg-white/95 p-1.5 rounded-2xl border border-slate-200 shadow-2xl">
          <span className="flex-1 text-center py-2.5 rounded-xl bg-indigo-700 text-white font-extrabold text-xs shadow-md">
            👨‍💼 Admin
          </span>
          <Link
            href="/teacher-login"
            className="flex-1 text-center py-2.5 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-bold text-xs transition"
          >
            👨‍🏫 Teacher
          </Link>
          <Link
            href="/student-login"
            className="flex-1 text-center py-2.5 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-bold text-xs transition"
          >
            👨‍🎓 Student
          </Link>
        </div>

        {/* Crisp White Login Card */}
        <div className="bg-white/95 rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-indigo-600/30 mx-auto mb-4 overflow-hidden">
              <Image
                src="/images/logo.jpg"
                alt="EduPulse Academy Logo"
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <h1 className="text-3xl font-extrabold font-heading text-slate-900">
              Admin Portal
            </h1>
            <p className="text-slate-500 text-xs mt-2 font-medium">
              Enter credentials to access institutional governance
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center font-bold">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-600/10 outline-none transition font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 pr-12 text-sm focus:ring-4 focus:ring-indigo-600/10 outline-none transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 text-sm"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-700/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Admin Portal →"}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-white hover:text-amber-300 font-bold transition drop-shadow-md">
            ← Return to Main School Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}