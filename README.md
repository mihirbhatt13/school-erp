# 🏫 EduPulse Academy - School ERP & Learning Management System

> **EduPulse Academy** is a modern, full-stack School Enterprise Resource Planning (ERP) platform built with **Next.js 16 (App Router & Turbopack)**, **TypeScript**, **TailwindCSS**, **Prisma ORM**, and **PostgreSQL**.

---

## 🌟 Key Features

### 🏢 Public Institutional Portal
- **Interactive Hero Slider**: Dynamic banner showcasing campus life, science labs, libraries, and athletic facilities.
- **About School & Mission**: Detailed institutional background, core values, and infrastructure highlights.
- **Admissions Inquiry Form**: Direct communication form for parents and prospective students with backend inquiry storage.
- **Enhanced Footer**: 5-column responsive footer with quick navigation links, contact details, official social profiles (LinkedIn, GitHub, Instagram), and back-to-top smooth scrolling.
- **Legal Compliance Pages**: Full [Privacy Policy](app/privacy-policy/page.tsx) and [Terms of Service](app/terms-of-service/page.tsx) pages.

### 👨‍💼 Administrator Workspace (`/admin`)
- **Student Roster Management**: Create, edit, search, and delete student accounts with roll numbers, classes, and credentials.
- **Faculty Directory**: Add, update, and manage teacher profiles, subject specializations, and assigned classes.
- **Class & Timetable Control**: Class creation and section management.
- **Fee Register & Ledger**: Track total fees, paid amounts, pending balances, and fee status per student.
- **Exam Management**: Schedule exams, update passing criteria, and enter student marks.
- **Notice Board Broadcasts**: Post official announcements for students, parents, and faculty.
- **Inquiries Desk**: Inspect parent and visitor inquiries submitted from the contact form.

### 👨‍🏫 Faculty Workspace (`/teacher-dashboard`)
- **Daily Attendance Register**: Interactive attendance entry system (**Present**, **Absent**, **Late**) for assigned classes with date picker.
- **Student Roster**: View student details (Avatar Photo, Roll No, Class, Email, Phone, Address).
- **Profile & Photo Management**: Edit teacher details (**Name**, **Phone**, **Subject**, **Class**, **Address**) and upload custom profile photos with instant live preview.
- **Exam Schedule & Notices**: Access upcoming test dates and school broadcasts.

### 👨‍🎓 Student & Parent Workspace (`/student-dashboard`)
- **Personal Profile Management**: Update personal contact information, address, and upload avatar photo.
- **Attendance History**: Track daily attendance percentage and presence log.
- **Fee Ledger**: View fee payments, receipts, and outstanding dues.
- **Exam Timetable & Results**: Access exam dates and subject marks.
- **School Notices**: View school announcements.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [TailwindCSS v4](https://tailwindcss.com/) & Vanilla CSS |
| **Database ORM** | [Prisma ORM](https://www.prisma.io/) |
| **Database Engine** | [PostgreSQL](https://www.postgresql.org/) |
| **Authentication** | JWT (JSON Web Tokens) & HTTP-Only Secure Cookies |
| **Password Hashing** | Bcryptjs |

---

## 📁 Project Directory Structure

```
school-erp/
├── app/                        # Next.js App Router Routes & Pages
│   ├── about/                  # About School Page
│   ├── admin/                  # Admin Dashboard & Inquiry Management
│   ├── api/                    # RESTful Backend API Endpoints
│   │   ├── attendance/         # Attendance CRUD Endpoints
│   │   ├── contact/            # Inquiry Form Endpoints
│   │   ├── exams/              # Exam Timetable Endpoints
│   │   ├── fees/               # Fee Ledger Endpoints
│   │   ├── student-profile/    # Student Profile & Photo Endpoints
│   │   ├── teacher-profile/    # Teacher Profile & Photo Endpoints
│   │   └── upload/             # Local File Upload Service (/public/uploads)
│   ├── components/             # Reusable Components (Admin Layout, Enhanced Footer)
│   ├── contact/                # Contact Us Page
│   ├── login/                  # Admin Login Page
│   ├── privacy-policy/         # Legal Privacy Policy Page
│   ├── student/                # Admin Student Management Page
│   ├── student-dashboard/      # Student Workspace & Profile Editor
│   ├── student-login/          # Student Login Page (Password & OTP)
│   ├── teacher/                # Admin Teacher Management Page
│   ├── teacher-attendance/     # Teacher Daily Attendance Register
│   ├── teacher-dashboard/      # Faculty Workspace Dashboard
│   ├── teacher-login/          # Teacher Login Page (Password & OTP)
│   ├── teacher-profile/        # Teacher Profile Editor & Photo Upload
│   ├── teacher-students/       # Assigned Student Roster
│   └── terms-of-service/       # Legal Terms of Service Page
├── lib/                        # Global Libraries (Prisma Singleton)
├── prisma/                     # Database Schema & Migrations
│   └── schema.prisma           # Prisma PostgreSQL Models
├── public/                     # Static Assets & Uploaded Profile Photos
│   ├── images/                 # Campus Photography & Logo
│   └── uploads/                # Dynamic Profile Avatars
├── .env.example                # Example Environment Variables Template
├── DOCUMENTATION.md            # Detailed Architecture & API Reference
├── next.config.ts              # Next.js Image & App Configuration
├── package.json                # Dependencies & NPM Scripts
└── README.md                   # Complete Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher
- **PostgreSQL**: Running locally or via a cloud instance (Supabase, Railway, Neon)

---

### 2. Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mihirbhatt13/school-erp.git
   cd school-erp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your PostgreSQL database credentials:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/school_erp"
   JWT_SECRET="edupulse_school_erp_super_secret_jwt_key_2026"
   ```

4. **Initialize PostgreSQL Database**:
   Push the Prisma schema to your PostgreSQL database:
   ```bash
   npx prisma db push
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🗄️ Database Schema Overview

```prisma
model Student {
  id           Int     @id @default(autoincrement())
  rollNo       String? @unique
  name         String
  email        String  @unique
  class        String
  password     String?
  phone        String?
  address      String?
  profileImage String?
}

model Teacher {
  id            Int      @id @default(autoincrement())
  teacherId     String   @unique
  name          String
  email         String   @unique
  phone         String?
  subject       String
  assignedClass String
  password      String?
  address       String?
  profileImage  String?
}

model Attendance {
  id        Int    @id @default(autoincrement())
  studentId Int
  student   String
  className String
  date      String
  status    String
}
```

---

## 👤 Developer & Contact Information

- **Owner / Lead Developer**: Mihir Bhatt
- **Helpline Phone**: [+91 90797 81144](tel:+919079781144)
- **Address**: 402, Siddhivinayak Apartment, near Chamunda Heritage, Sahar Road, Andheri East, Mumbai - 400057
- **LinkedIn**: [Mihir Bhatt Profile](https://www.linkedin.com/in/mihir-bhatt-02543b353)
- **GitHub**: [@mihirbhatt13](https://github.com/mihirbhatt13)
- **Instagram**: [@official_mihir13](https://www.instagram.com/official_mihir13)

---

## 📄 License & Copyright

© 2026 **Mihir Bhatt**. All rights reserved.
