"use client";

import Link from "next/link";
import Image from "next/image";
import Footer from "@/app/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col relative overflow-hidden">
      {/* Top School Bar */}
      <div className="bg-slate-900 text-slate-100 py-2.5 px-6 text-xs font-medium flex items-center justify-between z-20 shadow-md">
        <div className="flex items-center gap-3">
          <span>EduPulse International Academy • Established 2001</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-300">
          <a href="tel:+919079781144" className="hover:text-amber-400 transition">📞 +91 90797 81144</a>
          <span>✉️ mihirbhatt529@gmail.com</span>
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
          <Link href="/about" className="text-indigo-600 font-bold">About Us</Link>
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

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Pioneering Excellence in School Education
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
          For over 25 years, EduPulse Academy has provided comprehensive education, nurturing young talent and preparing students for higher studies and global careers.
        </p>
      </section>

      {/* Campus Overview Section */}
      <section className="relative z-10 py-16 bg-white border-y border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[380px] sm:h-[440px] rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <Image
              src="/images/campus_hero_1.jpg"
              alt="EduPulse Main Campus"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 text-left shadow-lg">
              <h3 className="text-xl font-bold text-slate-900">Modern School Infrastructure</h3>
            </div>
          </div>

          <div className="space-y-6 text-left">
            <h2 className="text-3xl font-extrabold font-heading text-slate-900">
              Our Core Pillars & Educational Values
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We believe in balanced growth. Our curriculum combines academic rigor with sports, arts, and character building activities.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <span className="text-3xl">🎓</span>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Academic Excellence</h4>
                  <p className="text-slate-500 text-xs mt-1">High board examination results and top university placements.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <span className="text-3xl">🔬</span>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Science & Technology Labs</h4>
                  <p className="text-slate-500 text-xs mt-1">Fully equipped physics, chemistry, biology, and computer labs.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <span className="text-3xl">🏆</span>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Sports & Extracurriculars</h4>
                  <p className="text-slate-500 text-xs mt-1">Football, basketball, athletics, music, and debate clubs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Enhanced Footer */}
      <Footer />
    </main>
  );
}
