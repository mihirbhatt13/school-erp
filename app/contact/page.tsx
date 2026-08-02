"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Footer from "@/app/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Admissions Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col relative overflow-hidden">
      {/* Top Header */}
      <div className="bg-slate-900 text-slate-100 py-2.5 px-6 text-xs font-medium flex items-center justify-between z-20 shadow-md">
        <div className="flex items-center gap-3">
          <span>EduPulse International Academy • Admissions Open 2026-2027</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-300">
          <a href="tel:+919079781144" className="hover:text-amber-400 transition">📞 +91 90797 81144</a>
          <span>✉️ info@edupulse.edu</span>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-indigo-600/20 overflow-hidden">
            <Image
              src="/images/logo.jpg"
              alt="EduPulse Academy Logo"
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
          <div>
            <span className="text-2xl font-extrabold font-heading text-slate-900 tracking-tight">
              EduPulse <span className="text-indigo-600">Academy</span>
            </span>
            <span className="block text-[10px] text-indigo-600 font-bold tracking-widest uppercase">
              Excellence • Wisdom • Integrity
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link>
          <Link href="/contact" className="text-indigo-600 font-bold">Contact Us</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-700/25 transition-all hover:scale-105"
          >
            School Login 🔑
          </Link>
        </div>
      </header>

      {/* Hero Title */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-slate-900 tracking-tight">
          Contact EduPulse Academy
        </h1>
        <p className="mt-4 text-slate-600 text-sm max-w-2xl mx-auto font-medium">
          Have questions regarding school admissions, fee payments, or campus visits? Send us a message or call our helpline.
        </p>
      </section>

      {/* Contact Split Layout */}
      <section className="relative z-10 py-12 max-w-7xl mx-auto px-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
          {/* Left: Contact Info & Address */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
              <h3 className="text-2xl font-bold font-heading text-slate-900">Contact Information</h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <strong className="text-slate-900 block">School Address</strong>
                    <p className="text-slate-600 text-xs mt-0.5">
                      402, Siddhivinayak Apartment, near Chamunda Heritage,<br />
                      Sahar Road, Andheri East, Mumbai - 400057
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-2xl">📞</span>
                  <div>
                    <strong className="text-slate-900 block">Admissions Helpline</strong>
                    <a href="tel:+919079781144" className="text-indigo-700 font-bold text-xs mt-0.5 block hover:underline">
                      +91 90797 81144
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <strong className="text-slate-900 block">Email Address</strong>
                    <p className="text-indigo-700 font-bold text-xs mt-0.5">info@edupulse.edu</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <strong className="text-slate-900 block">Office Hours</strong>
                    <p className="text-slate-600 text-xs mt-0.5">Monday - Saturday: 8:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md text-center space-y-2">
              <span className="text-3xl block">🗺️</span>
              <h4 className="text-base font-bold text-slate-900">Campus Location Map</h4>
              <p className="text-slate-500 text-xs">402, Siddhivinayak Apartment, Sahar Road, Andheri East, Mumbai - 400057</p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-900">Message Sent!</h3>
                <p className="text-slate-600 text-xs max-w-md mx-auto">
                  Thank you for reaching out to EduPulse Academy. Our office will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-md transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-2xl font-bold font-heading text-slate-900 mb-6">Send Us a Message</h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-indigo-600 rounded-xl px-4 py-3 text-sm placeholder:text-slate-400 outline-none transition font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-indigo-600 rounded-xl px-4 py-3 text-sm placeholder:text-slate-400 outline-none transition font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 90797 81144"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-indigo-600 rounded-xl px-4 py-3 text-sm placeholder:text-slate-400 outline-none transition font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Inquiry Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-sm font-medium outline-none transition"
                  >
                    <option value="Admissions Inquiry">Admissions Inquiry</option>
                    <option value="General Information">General Information</option>
                    <option value="Student Support">Student Support</option>
                    <option value="Careers">Careers & Jobs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your query or message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-indigo-600 rounded-xl px-4 py-3 text-sm placeholder:text-slate-400 outline-none transition font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-700/25 transition"
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Shared Enhanced Footer */}
      <Footer />
    </main>
  );
}
