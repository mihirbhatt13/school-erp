"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Footer from "@/app/components/Footer";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Admissions Inquiry",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const slides = [
    {
      id: 1,
      image: "/images/campus_hero_1.jpg",
      badge: "CAMPUS TOUR",
      title: "Empowering Students for Bright Futures",
      subtitle: "Modern classrooms, dedicated faculty, and world-class athletic facilities for every learner.",
      cta: "Explore Our Campus",
      href: "#about",
    },
    {
      id: 2,
      image: "/images/science_lab_2.jpg",
      badge: "SCIENCE & STEM",
      title: "Interactive Science & Computer Labs",
      subtitle: "Hands-on learning environments designed to inspire scientific curiosity and critical thinking.",
      cta: "View Academics",
      href: "#facilities",
    },
    {
      id: 3,
      image: "/images/school_library_3.jpg",
      badge: "LIBRARY & RESEARCH",
      title: "Comprehensive School Library",
      subtitle: "Thousands of books, digital learning resources, and quiet reading areas for students.",
      cta: "Learn More",
      href: "#about",
    },
    {
      id: 4,
      image: "/images/sports_complex_4.jpg",
      badge: "SPORTS & WELLNESS",
      title: "Sports & Fitness Complex",
      subtitle: "Encouraging physical health, teamwork, and sportsmanship across diverse athletic programs.",
      cta: "Discover Sports",
      href: "#facilities",
    },
  ];

  const facilities = [
    {
      id: 1,
      title: "Science & Physics Lab",
      subtitle: "Modern equipment for experiments",
      image: "/images/science_lab_2.jpg",
      badge: "SCIENCE LAB",
    },
    {
      id: 2,
      title: "Central Library",
      subtitle: "Books, journals & quiet reading space",
      image: "/images/school_library_3.jpg",
      badge: "LIBRARY",
    },
    {
      id: 3,
      title: "Computer & IT Lab",
      subtitle: "High-speed internet & coding stations",
      image: "/images/robotics_lab_3.jpg",
      badge: "IT LAB",
    },
    {
      id: 4,
      title: "Smart Classrooms",
      subtitle: "Interactive digital displays",
      image: "/images/classroom_3d_1.jpg",
      badge: "CLASSROOMS",
    },
    {
      id: 5,
      title: "Sports Arena",
      subtitle: "Indoor courts & outdoor fields",
      image: "/images/sports_complex_4.jpg",
      badge: "SPORTS",
    },
    {
      id: 6,
      title: "School Auditorium",
      subtitle: "Cultural events & school assemblies",
      image: "/images/auditorium_5.jpg",
      badge: "AUDITORIUM",
    },
  ];

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setContactSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col relative overflow-hidden">
      {/* Top School Announcement Bar */}
      <div className="bg-slate-900 text-slate-100 py-2.5 px-4 sm:px-6 text-xs font-medium flex flex-col sm:flex-row items-center justify-between gap-2 z-20 shadow-md">
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden text-center sm:text-left">
          <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-extrabold uppercase tracking-wider text-[10px] whitespace-nowrap">
            ANNOUNCEMENT
          </span>
          <span className="truncate text-slate-200 text-[11px] sm:text-xs">
            📢 Admissions Open for Academic Session 2026-2027 | Annual Day Event on Aug 15th
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-6 text-slate-300">
          <a href="tel:+919079781144" className="hover:text-amber-400 transition">📞 Helpline: +91 90797 81144</a>
          <span>✉️ info@edupulse.edu</span>
          <span className="px-2.5 py-0.5 rounded bg-indigo-800 text-amber-300 font-bold border border-indigo-700">
            Session 2026-2027
          </span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-indigo-600/20 overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo.jpg"
              alt="EduPulse Academy Logo"
              width={56}
              height={56}
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
          <div>
            <span className="text-xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
              EduPulse <span className="text-indigo-600">Academy</span>
            </span>
            <span className="block text-[10px] sm:text-[11px] text-indigo-600 font-bold tracking-widest uppercase">
              Excellence • Wisdom • Integrity
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#hero-slider" className="hover:text-indigo-600 transition-colors">Home</a>
          <a href="#about" className="hover:text-indigo-600 transition-colors">About Us</a>
          <a href="#facilities" className="hover:text-indigo-600 transition-colors">Facilities</a>
          <a href="#portals" className="hover:text-indigo-600 transition-colors">School Portals</a>
          <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact Us</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-700/25 transition-all hover:scale-105"
          >
            School Login 🔑
          </Link>

          {/* Mobile Navigation Toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm"
          >
            {mobileNavOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Down Navigation Menu */}
      {mobileNavOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3 z-30 shadow-lg">
          <a
            href="#hero-slider"
            onClick={() => setMobileNavOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-slate-700 font-bold text-sm hover:bg-indigo-50 hover:text-indigo-700"
          >
            🏫 Home
          </a>
          <a
            href="#about"
            onClick={() => setMobileNavOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-slate-700 font-bold text-sm hover:bg-indigo-50 hover:text-indigo-700"
          >
            📜 About Us
          </a>
          <a
            href="#facilities"
            onClick={() => setMobileNavOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-slate-700 font-bold text-sm hover:bg-indigo-50 hover:text-indigo-700"
          >
            🔬 Facilities
          </a>
          <a
            href="#portals"
            onClick={() => setMobileNavOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-slate-700 font-bold text-sm hover:bg-indigo-50 hover:text-indigo-700"
          >
            💻 School Portals
          </a>
          <a
            href="#contact"
            onClick={() => setMobileNavOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-slate-700 font-bold text-sm hover:bg-indigo-50 hover:text-indigo-700"
          >
            📞 Contact Us
          </a>
        </div>
      )}

      {/* 1. HERO SLIDER */}
      <section id="hero-slider" className="relative w-full h-[450px] sm:h-[500px] lg:h-[600px] overflow-hidden z-10">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover object-center transform scale-105 transition-transform duration-[8000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-24">
              <div className="max-w-2xl text-left space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight drop-shadow-md">
                  {slide.title}
                </h1>

                <p className="text-sm sm:text-lg text-slate-100 font-medium leading-relaxed drop-shadow line-clamp-3 sm:line-clamp-none">
                  {slide.subtitle}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                  <a
                    href={slide.href}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-xl transition-transform hover:scale-105"
                  >
                    {slide.cta} →
                  </a>
                  <a
                    href="#contact"
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold text-xs border border-white/30 transition"
                  >
                    Admissions Desk
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center justify-center text-lg sm:text-xl hover:bg-white/40 transition"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center justify-center text-lg sm:text-xl hover:bg-white/40 transition"
        >
          ❯
        </button>
      </section>

      {/* 2. KEY STATS */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16 w-full mb-12 sm:mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xl text-center space-y-1">
            <span className="text-2xl sm:text-3xl block">🏆</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">25+ Years</h3>
            <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase">Educational Excellence</p>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xl text-center space-y-1">
            <span className="text-2xl sm:text-3xl block">👨‍🎓</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">2,500+</h3>
            <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase">Enrolled Students</p>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xl text-center space-y-1">
            <span className="text-2xl sm:text-3xl block">👨‍🏫</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">150+</h3>
            <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase">Qualified Teachers</p>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xl text-center space-y-1">
            <span className="text-2xl sm:text-3xl block">🏫</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">100%</h3>
            <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase">Pass Result</p>
          </div>
        </div>
      </section>

      {/* 3. ABOUT US SECTION WITH CAMPUS BACKGROUND PHOTOGRAPHY */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-8 sm:p-12 lg:p-16">
          <Image
            src="/images/campus_life_2.jpg"
            alt="Campus Life"
            fill
            className="object-cover object-center brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]" />

          <div className="relative z-10 space-y-8 sm:space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
                About Our School
              </h2>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
                EduPulse Academy is committed to providing quality education, fostering personal growth, and developing responsible citizens in a safe and supportive learning environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold">
                  🎯
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900">Our Mission</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">
                  To inspire learning, foster creativity, and build character through engaging academic and extracurricular activities.
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold">
                  🌟
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900">Our Vision</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">
                  To be a leading educational institution known for academic excellence, innovation, and holistic student development.
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
                  💎
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900">Core Values</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">
                  Respect, integrity, teamwork, continuous growth, and commitment to excellence in all academic pursuits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SCHOOL FACILITIES */}
      <section id="facilities" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-8 sm:space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900">
            School Facilities & Infrastructure
          </h2>
          <p className="text-slate-600 text-sm">
            Providing modern amenities to support effective learning and overall student growth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col"
            >
              <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {facility.title}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium mt-1">
                    {facility.subtitle}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600">View Details</span>
                  <span className="text-indigo-600 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SCHOOL PORTALS SECTION */}
      <section id="portals" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-8 sm:space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900">
            School Portals
          </h2>
          <p className="text-slate-600 text-sm">
            Access secure online portals designed for administrators, teachers, and students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/login" className="group">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/50 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                👨‍💼
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading text-slate-900 group-hover:text-indigo-600">
                  Admin Portal
                </h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  Manage student admissions, faculty records, fee registers, timetables, and school notices.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Admin Login</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          <Link href="/teacher-login" className="group">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-amber-500/50 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                👨‍🏫
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading text-slate-900 group-hover:text-amber-600">
                  Teacher Portal
                </h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  Record daily attendance, upload exam marks, view class schedules, and check announcements.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Teacher Login</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          <Link href="/student-login" className="group">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/50 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                👨‍🎓
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading text-slate-900 group-hover:text-emerald-600">
                  Student Portal
                </h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  Track personal attendance records, view fee receipts, check exam schedules, and update profile info.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Student Login</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. CONTACT US FORM WITH AUDITORIUM BACKGROUND PHOTOGRAPHY */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-6 sm:p-8 lg:p-12">
          <Image
            src="/images/auditorium_5.jpg"
            alt="School Auditorium"
            fill
            className="object-cover object-center brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
                Get in Touch with Our Office
              </h2>
              <p className="text-slate-200 text-sm leading-relaxed font-medium">
                Have questions regarding admissions, fees, or school programs? Fill out the form and our office team will get back to you shortly.
              </p>

              <div className="space-y-4 text-xs font-medium text-slate-100 pt-2">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center text-lg flex-shrink-0">
                    📍
                  </span>
                  <div>
                    <strong className="text-amber-300 block">School Address</strong>
                    402, Siddhivinayak Apartment, near Chamunda Heritage, Sahar Road, Andheri East, Mumbai - 400057
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center text-lg flex-shrink-0">
                    📞
                  </span>
                  <div>
                    <strong className="text-amber-300 block">Phone Helpline</strong>
                    +91 90797 81144
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center text-lg flex-shrink-0">
                    ✉️
                  </span>
                  <div>
                    <strong className="text-amber-300 block">Email Address</strong>
                    info@edupulse.edu
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xl">
              {contactSubmitted ? (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-4 py-8">
                  <span className="text-5xl">✅</span>
                  <h3 className="text-2xl font-bold text-slate-900">Message Sent!</h3>
                  <p className="text-slate-600 text-xs max-w-sm">
                    Thank you for contacting EduPulse Academy. Our team will review your inquiry and respond soon.
                  </p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-md transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">
                    Send Us a Message
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 text-xs focus:border-indigo-600 outline-none transition font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 text-xs focus:border-indigo-600 outline-none transition font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="+91 90797 81144"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 text-xs focus:border-indigo-600 outline-none transition font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Type</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-xs focus:border-indigo-600 outline-none transition font-medium"
                    >
                      <option value="Admissions Inquiry">Admissions Inquiry</option>
                      <option value="General Information">General Information</option>
                      <option value="Student Support">Student Support</option>
                      <option value="Career & Jobs">Career & Jobs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 text-xs focus:border-indigo-600 outline-none transition font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-700/25 transition-all hover:scale-[1.01]"
                  >
                    Send Message →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. ENHANCED SHARED FOOTER COMPONENT */}
      <Footer />
    </main>
  );
}