"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-slate-300 z-20 overflow-hidden border-t border-slate-800">
      {/* Top Gradient Glow Line */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-amber-400 to-purple-600" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: School Branding & Social Media */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 p-0.5 shadow-xl shadow-indigo-600/30 overflow-hidden flex-shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="EduPulse Academy Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <div>
                <span className="text-2xl font-extrabold font-heading text-white tracking-tight">
                  EduPulse <span className="text-indigo-400">Academy</span>
                </span>
                <span className="block text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                  Excellence • Wisdom • Integrity
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              Empowering students with knowledge, character, and vision. Providing quality education and modern learning infrastructure.
            </p>

            {/* Social Media Links with Custom Tooltips */}
            <div className="pt-2 flex items-center gap-3">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/mihir-bhatt-02543b353"
                target="_blank"
                rel="noreferrer"
                className="group relative w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-blue-600 border border-slate-700/60 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none border border-slate-700">
                  LinkedIn Profile
                </span>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/mihirbhatt13"
                target="_blank"
                rel="noreferrer"
                className="group relative w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 hover:border-slate-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110"
                aria-label="GitHub Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none border border-slate-700">
                  GitHub Profile
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/official_mihir13"
                target="_blank"
                rel="noreferrer"
                className="group relative w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110"
                aria-label="Instagram Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none border border-slate-700">
                  Instagram Profile
                </span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3 bg-amber-400 rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform text-amber-400">›</span> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform text-amber-400">›</span> About School
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform text-amber-400">›</span> Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform text-amber-400">›</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform text-amber-400">›</span> Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3 bg-indigo-500 rounded-full" />
              School Portals
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/login" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform text-indigo-400">›</span> Admin Portal
                </Link>
              </li>
              <li>
                <Link href="/teacher-login" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform text-indigo-400">›</span> Teacher Portal
                </Link>
              </li>
              <li>
                <Link href="/student-login" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform text-indigo-400">›</span> Student & Parent Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3 bg-emerald-400 rounded-full" />
              Contact Information
            </h4>
            <ul className="space-y-3 text-xs text-slate-300 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 flex-shrink-0">📍</span>
                <span>402, Siddhivinayak Apartment, Sahar Road, Andheri East, Mumbai - 400057</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-emerald-400 flex-shrink-0">📞</span>
                <a href="tel:+919079781144" className="hover:text-emerald-400 transition-colors">
                  +91 90797 81144
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-indigo-400 flex-shrink-0">✉️</span>
                <a href="mailto:mihirbhatt529@gmail.com" className="hover:text-indigo-400 transition-colors">
                  mihirbhatt529@gmail.com
                </a>
              </li>
              <li className="pt-1 text-[11px] text-slate-400">
                ⏰ Office Hours: Mon - Sat (8:00 AM - 4:00 PM)
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Copyright & Action Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p className="font-semibold text-slate-300">
            © 2026 <span className="text-white font-bold">Mihir Bhatt</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-200 transition">
              Privacy Policy
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/terms-of-service" className="hover:text-slate-200 transition">
              Terms of Service
            </Link>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="ml-2 w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110"
              title="Scroll to Top"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
