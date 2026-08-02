"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function TeacherLoginPage() {
  const [authMethod, setAuthMethod] = useState<"password" | "phone">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Handle Email & Password Login
  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both Email and Password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/teacher-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginType: "password", email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/teacher-dashboard";
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

  // 2. Handle Phone OTP Login
  async function handlePhoneLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!phone) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (!otpSent) {
      setLoading(true);
      setTimeout(() => {
        setOtpSent(true);
        setLoading(false);
      }, 1000);
      return;
    }

    if (!otp) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/teacher-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginType: "phone", phone, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/teacher-dashboard";
      } else {
        setError(data.message || data.error || "Invalid OTP code.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Error verifying OTP.");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* Background Photography */}
      <Image
        src="/images/classroom_3d_1.jpg"
        alt="Classroom Background"
        fill
        className="object-cover object-center brightness-95 contrast-105"
        priority
      />

      <div className="absolute inset-0 bg-slate-950/35" />

      <div className="w-full max-w-md relative z-10 space-y-4">
        {/* Back Button */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 hover:text-amber-700 border border-slate-200 font-bold text-xs shadow-xl transition flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to Homepage</span>
          </Link>
          <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider drop-shadow-md">
            Faculty Workspace
          </span>
        </div>

        {/* Role Switcher */}
        <div className="flex bg-white/95 p-1.5 rounded-2xl border border-slate-200 shadow-2xl">
          <Link
            href="/login"
            className="flex-1 text-center py-2.5 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-bold text-xs transition"
          >
            👨‍💼 Admin
          </Link>
          <span className="flex-1 text-center py-2.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-md">
            👨‍🏫 Teacher
          </span>
          <Link
            href="/student-login"
            className="flex-1 text-center py-2.5 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-bold text-xs transition"
          >
            👨‍🎓 Student
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-indigo-600 p-0.5 shadow-xl shadow-amber-600/30 mx-auto mb-4 overflow-hidden">
              <Image
                src="/images/logo.jpg"
                alt="EduPulse Academy Logo"
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <h1 className="text-3xl font-extrabold font-heading text-slate-900">
              Teacher Portal
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-medium">
              Access faculty tools, attendance registers, & gradebooks
            </p>
          </div>

          {/* Auth Method Sub-Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("password");
                setError("");
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                authMethod === "password"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              🔑 Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("phone");
                setError("");
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                authMethod === "phone"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              📱 Mobile OTP
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center font-bold">
              ⚠️ {error}
            </div>
          )}

          {/* 1. Password Form */}
          {authMethod === "password" ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Teacher Email
                </label>
                <input
                  type="email"
                  placeholder="teacher@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-amber-600 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-xs font-medium outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-amber-600 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 pr-10 text-xs font-medium outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 text-xs"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all"
              >
                {loading ? "Authenticating..." : "Sign In with Password →"}
              </button>
            </form>
          ) : (
            /* 2. Phone OTP Form */
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={otpSent}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-amber-600 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-xs font-medium outline-none transition disabled:opacity-60"
                />
              </div>

              {otpSent && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Enter OTP Code (Test Code: 123456)
                  </label>
                  <input
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-amber-600 focus:bg-white text-slate-900 text-center tracking-widest text-base font-extrabold rounded-xl px-4 py-2.5 outline-none transition"
                  />
                  <span className="block text-[11px] text-amber-700 font-bold mt-1 text-center">
                    ✅ Verification code sent to {phone}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all"
              >
                {loading
                  ? "Processing..."
                  : otpSent
                  ? "Verify OTP & Sign In →"
                  : "Send Mobile OTP 📲"}
              </button>
            </form>
          )}
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