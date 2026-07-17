import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-900 flex flex-col">

      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6 text-white">
        <h1 className="text-3xl font-bold">
          🎓 School ERP
        </h1>

        <nav className="flex gap-6 text-lg">
          <a href="#" className="hover:text-yellow-300 transition">
            Home
          </a>

          <a href="#" className="hover:text-yellow-300 transition">
            About
          </a>

          <a href="#" className="hover:text-yellow-300 transition">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6">

        <div className="text-center max-w-4xl">

          <h2 className="text-6xl font-extrabold text-white leading-tight">
            School ERP
            <br />
            Management System
          </h2>

          <p className="text-blue-100 text-xl mt-6">
            Manage Students, Teachers, Classes, Attendance,
            Fees, Exams and Notices with one smart platform.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-12">

            <Link href="/login">
              <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition shadow-lg">
                👨‍💼 Admin Login
              </button>
            </Link>

            <button
              className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg cursor-not-allowed opacity-70"
              disabled
            >
              👨‍🎓 Student Login
              <br />
              <span className="text-sm">
                Coming Soon
              </span>
            </button>

            <button
              className="bg-yellow-500 text-white px-8 py-4 rounded-xl font-bold text-lg cursor-not-allowed opacity-70"
              disabled
            >
              👨‍🏫 Teacher Login
              <br />
              <span className="text-sm">
                Coming Soon
              </span>
            </button>

          </div>

        </div>

      </section>

      {/* Features */}
      <section className="bg-white py-16">

        <h2 className="text-4xl font-bold text-center text-blue-700 mb-12">
          Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8">

          <div className="shadow-lg rounded-xl p-8 text-center hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-4">
              👨‍🎓 Students
            </h3>

            <p className="text-gray-600">
              Manage student records, admission,
              profiles and reports.
            </p>
          </div>

          <div className="shadow-lg rounded-xl p-8 text-center hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-4">
              👨‍🏫 Teachers
            </h3>

            <p className="text-gray-600">
              Add teachers, subjects,
              salary and attendance.
            </p>
          </div>

          <div className="shadow-lg rounded-xl p-8 text-center hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-4">
              💰 Fees
            </h3>

            <p className="text-gray-600">
              Track fee payments,
              pending fees and receipts.
            </p>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-center text-white py-6">
        © 2026 School ERP Management System | Developed by Mihir Bhatt
      </footer>

    </main>
  );
}