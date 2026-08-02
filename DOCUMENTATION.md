# 📘 EduPulse Academy - Technical Documentation & System Architecture

This document provides technical architecture details, API route specifications, database schema models, authentication flows, and frontend design rules for the **EduPulse Academy School ERP** system.

---

## 📐 Architecture Overview

```
[ Client Browser ] 
       │
       ▼ (HTTP / REST API Requests)
[ Next.js 16 App Router Server ]
       │
       ├── Middleware & JWT Cookie Verification (`teacher_token`, `student_token`, `admin_token`)
       ├── API Routes (`/app/api/...`)
       │     ├── Image Upload Handler (`/api/upload` -> `/public/uploads`)
       │     └── ORM Queries (`Prisma Client`)
       │
       ▼ (PostgreSQL Connection String)
[ PostgreSQL Database ]
```

---

## 🔐 Authentication & Session Security

- **JSON Web Tokens (JWT)**: Used to sign and encode session payloads.
- **Cookies**: Token cookies (`admin_token`, `teacher_token`, `student_token`) are set with `HttpOnly`, `SameSite=lax`, and `Path=/`.
- **Multi-Option Auth**:
  - **Email & Password**: Supports hashed passwords (`bcryptjs`).
  - **Mobile OTP**: OTP verification for phone-based logins.
- **Session Fallbacks**: API routes include fallback authentication for seamless development and testing.

---

## 🌐 API Route Reference

### 1. Faculty / Teacher Profile APIs (`/api/teacher-profile`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/teacher-profile` | Fetches active teacher profile data (Name, Subject, Class, Phone, Address, Profile Photo). |
| `PUT` | `/api/teacher-profile` | Updates teacher details and profile photo URL. |

### 2. Student Profile APIs (`/api/student-profile`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/student-profile` | Fetches student profile data (Name, Roll No, Class, Email, Phone, Address, Profile Photo). |
| `PUT` | `/api/student-profile` | Updates student details and profile photo URL. |

### 3. Attendance APIs (`/api/attendance`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/attendance` | Returns daily attendance logs for all classes/students. |
| `POST` | `/api/attendance` | Creates a new attendance entry (`studentId`, `student`, `className`, `date`, `status`). |

### 4. File & Avatar Upload Service (`/api/upload`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/upload` | Receives multipart form data file (`image/*`), saves file to `/public/uploads/avatar_[timestamp]_[filename]`, and returns static image URL `/uploads/[filename]`. |

### 5. Contact Inquiries API (`/api/contact`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/contact` | Retrieves all contact inquiry messages for the admin desk. |
| `POST` | `/api/contact` | Stores parent/visitor inquiry (`name`, `email`, `phone`, `category`, `message`). |

---

## 🗃️ Database Schema Specifications

### `Student` Table
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
```

### `Teacher` Table
```prisma
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
```

### `Attendance` Table
```prisma
model Attendance {
  id        Int    @id @default(autoincrement())
  studentId Int
  student   String
  className String
  date      String
  status    String // "Present" | "Absent" | "Late"
}
```

---

## 🎨 UI & Design Rules

1. **Light Theme Default**: White & slate color system (`#ffffff`, `#f8fafc`, `#0f172a`).
2. **Text Contrast Standard**: All input fields use `text-slate-900` on white/slate-50 backgrounds for 100% visible text while writing.
3. **Responsive Cards**: Rounded corners (`rounded-3xl`), glassmorphism borders (`border-slate-200`), and soft drop shadows (`shadow-xl`).
4. **Photography Assets**: Campus hero slider, science labs, libraries, auditorium, and sports complexes.

---

## 📜 Copyright Notice

© 2026 **Mihir Bhatt**. All rights reserved.
