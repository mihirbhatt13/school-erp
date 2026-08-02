"use client";

import Link from "next/link";
import Image from "next/image";
import Footer from "@/app/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col relative overflow-hidden">
      {/* Top School Bar */}
      <div className="bg-slate-900 text-slate-100 py-2.5 px-6 text-xs font-medium flex items-center justify-between z-20 shadow-md">
        <div className="flex items-center gap-3">
          <span>EduPulse International Academy • Student Privacy Protection</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-300">
          <a href="tel:+919079781144" className="hover:text-amber-400 transition">📞 +91 90797 81144</a>
          <span>✉️ privacy@edupulse.edu</span>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-200">
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
          <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact Us</Link>
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

      {/* Content Container */}
      <section className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold font-heading text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-xs font-medium">
            Last Updated: January 1, 2026 • EduPulse International Academy
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-6 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-bold font-heading text-slate-900">1. Information We Collect</h2>
            <p>
              EduPulse Academy collects personal information necessary for student enrollment, academic management, and communication. This includes student names, guardian contact details, attendance records, exam results, and fee records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold font-heading text-slate-900">2. How We Use Information</h2>
            <p>
              The information collected is used exclusively for educational and administrative purposes, including:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-xs">
              <li>Managing student admissions, class enrollment, and academic transcripts.</li>
              <li>Recording daily attendance and processing examination scores.</li>
              <li>Sending important notices regarding school schedules, fee deadlines, and emergency announcements.</li>
              <li>Providing secure access to student, teacher, and administrator portals.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold font-heading text-slate-900">3. Data Protection & Security</h2>
            <p>
              We implement industry-standard encryption, role-based access control, and secure database systems to protect student and faculty information from unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold font-heading text-slate-900">4. Disclosure to Third Parties</h2>
            <p>
              EduPulse Academy does not sell, rent, or lease student or parent information to third-party advertisers. Information is shared only with educational authorities or law enforcement when strictly required by law.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold font-heading text-slate-900">5. Contact Information</h2>
            <p>
              For privacy-related inquiries or to request updates to student records, please contact our administrative office at:
            </p>
            <p className="text-xs font-semibold text-slate-900">
              📍 402, Siddhivinayak Apartment, Sahar Road, Andheri East, Mumbai - 400057<br />
              📞 Phone: +91 90797 81144<br />
              ✉️ Email: privacy@edupulse.edu
            </p>
          </section>
        </div>
      </section>

      {/* Shared Enhanced Footer */}
      <Footer />
    </main>
  );
}
