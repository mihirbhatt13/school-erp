import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import ToastContainer from "./components/Toast";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "EduPulse ERP - Smart School Management System",
  description:
    "Empowering education with modern, intelligent management of Students, Teachers, Attendance, Fees, Exams, and Notices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${outfit.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
