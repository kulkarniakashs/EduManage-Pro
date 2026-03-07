# EduManage Pro

> **A role-based Learning Management System (LMS)** for managing academic structures, course content, and student learning progress within an educational institution.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Architecture](#architecture)
6. [Database Schema](#database-schema)
7. [API Reference](#api-reference)
8. [Frontend Routes](#frontend-routes)
9. [Getting Started](#getting-started)
10. [Environment Variables](#environment-variables)
11. [Key Design Decisions](#key-design-decisions)

---

## Overview

EduManage Pro is a full-stack LMS with **three distinct user roles** — Admin, Teacher, and Student — each with a dedicated dashboard, scoped API endpoints, and a tailored user interface. The platform supports end-to-end academic workflows from creating an academic year all the way through to students consuming course content and paying fees.

---

## Features

### 👑 Admin
| Capability | Details |
|---|---|
| Academic Year Management | Create and manage academic years |
| Classroom Management | Create classrooms linked to academic years |
| Subject Management | Create and assign subjects to classrooms |
| Teacher Assignment | Assign teachers to specific subjects |
| Student Enrollment | Enroll students into classrooms |
| Fee Structure Configuration | Set up fee structures per classroom |
| Announcements | Broadcast announcements to classrooms |
| User Management | Create new user accounts (students/teachers) |

### 👩‍🏫 Teacher
| Capability | Details |
|---|---|
| My Subjects | View all assigned subjects |
| Module Management | Create and delete modules within a subject |
| Content Upload | Upload Videos, PDFs, and external links (via pre-signed URLs) |
| Content Deletion | Delete individual content items and modules |
| Subject Thumbnails | Upload and manage subject cover images |
| Attendance | Take attendance per subject session |

### 🎓 Student
| Capability | Details |
|---|---|
| Class Overview | View enrolled classroom and its subjects |
| Content Browsing | Browse modules and published content |
| Video Streaming | Stream videos with progress tracking |
| Content Access | Open PDFs and external links |
| Announcements | View classroom announcements |
| Attendance | View personal attendance records |
| Fee Payment | Pay fees via Razorpay or simulate a payment |

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Spring Boot** | 4.0.2 | Core framework |
| **Spring Security** | bundled | Authentication & authorization |
| **Spring Data JPA / Hibernate** | bundled | ORM and data access |
| **PostgreSQL** | 16 | Primary relational database |
| **JJWT** | 0.11.5 | JWT token generation & validation |
| **AWS SDK for Java (S3)** | 2.25.0 | Object storage (Cloudflare R2 / S3 compatible) |
| **Razorpay Java SDK** | 1.4.8 | Payment processing |
| **Spring Mail** | bundled | Email notifications |
| **Lombok** | latest | Boilerplate reduction |
| **Java** | 17 | Language version |
| **Maven** | bundled | Build tool |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI framework |
| **TypeScript** | 5.9.x | Type-safe JavaScript |
| **Vite** | 7.x | Build tool & dev server |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **React Router DOM** | 7.x | Client-side routing |
| **Axios** | 1.x | HTTP client |
| **react-jwt** | 2.x | JWT decoding on client |
| **date-fns** | 4.x | Date utility library |
| **react-calendar** | 6.x | Calendar component |

---

## Project Structure

```
EduManage-Pro/
├── docker-compose.yml                # PostgreSQL local development setup
├── backend/                          # Spring Boot application
│   ├── pom.xml                       # Maven dependencies & build config
│   └── src/
│       └── main/
│           ├── java/com/edumanagepro/
│           │   ├── EduManageProApplication.java   # Main entry point
│           │   ├── config/
│           │   │   ├── CorsConfig.java            # CORS configuration
│           │   │   ├── DataSeeder.java            # Database seeder
│           │   │   └── R2Config.java              # Cloudflare R2 / S3 client config
│           │   ├── controller/
│           │   │   ├── AuthController.java
│           │   │   ├── AdminController.java
│           │   │   ├── AdminQueryController.java
│           │   │   ├── MeController.java
│           │   │   ├── ProfileController.java
│           │   │   ├── TeacherContentController.java
│           │   │   ├── TeacherContentQueryController.java
│           │   │   ├── TeacherSubjectController.java
│           │   │   ├── TeacherAttendanceController.java
│           │   │   ├── StudentContentQueryController.java
│           │   │   ├── StudentContentAccessController.java
│           │   │   ├── StudentContentConsumptionController.java
│           │   │   ├── StudentFeeController.java
│           │   │   ├── StudentAttendanceController.java
│           │   │   └── StudentAnnouncementController.java
│           │   ├── service/                       # Business logic
│           │   ├── repository/                    # Spring Data JPA repositories
│           │   ├── entity/
│           │   │   ├── AcademicYear.java
│           │   │   ├── Announcement.java
│           │   │   ├── AttendanceRecord.java
│           │   │   ├── AttendanceSession.java
│           │   │   ├── BaseEntity.java
│           │   │   ├── ClassRoom.java
│           │   │   ├── ContentConsumption.java
│           │   │   ├── ContentItem.java
│           │   │   ├── Enrollment.java
│           │   │   ├── FeePayment.java
│           │   │   ├── FeeStructure.java
│           │   │   ├── Institute.java
│           │   │   ├── Module.java
│           │   │   ├── Subject.java
│           │   │   ├── User.java
│           │   │   └── enums/
│           │   │       ├── AttendanceStatus.java
│           │   │       ├── ConsumptionStatus.java
│           │   │       ├── ContentType.java
│           │   │       ├── EnrollmentStatus.java
│           │   │       ├── PaymentStatus.java
│           │   │       └── UserRole.java
│           │   ├── dto/
│           │   │   ├── request/                   # Incoming request DTOs
│           │   │   └── response/                  # Outgoing response DTOs
│           │   ├── events/                        # Application events (enrollment, teacher assignment)
│           │   ├── exceptions/                    # Custom exception classes
│           │   └── security/
│           │       ├── JwtService.java
│           │       └── UserPrincipal.java
│           └── resources/
│               ├── application.properties         # Local config (git-ignored)
│               ├── application.properties.example # Config template (committed)
│               └── static/
│                   └── logo.png                   # Logo embedded in emails
│
└── frontend/                         # React + Vite application
    ├── .env                          # Local env vars (git-ignored)
    ├── .env.example                  # Env template (committed)
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── App.tsx                   # Root router definition
        ├── main.tsx                  # React entry point
        ├── index.css
        ├── api/
        │   ├── adminApi.ts
        │   ├── adminUserApi.ts
        │   ├── teacherApi.ts
        │   ├── teacherAttendanceApi.ts
        │   ├── studentApi.ts
        │   ├── studentAttendanceApi.ts
        │   └── profileApi.ts
        ├── components/
        │   ├── Accordion.tsx
        │   ├── Avatar.tsx
        │   ├── Badge.tsx
        │   ├── EmptyState.tsx
        │   ├── SidebarMeCard.tsx
        │   ├── Skeleton.tsx
        │   ├── admin/
        │   │   ├── AdminLayout.tsx
        │   │   ├── AdminSidebar.tsx
        │   │   ├── CreateAcademicYearModal.tsx
        │   │   ├── CreateClassModal.tsx
        │   │   ├── CreateSubjectModal.tsx
        │   │   ├── EnrollmentStudentModal.tsx
        │   │   └── ModalShell.tsx
        │   ├── teacher/
        │   │   ├── ConfrimModal.tsx
        │   │   ├── TeacherLayout.tsx
        │   │   └── TeacherSidebar.tsx
        │   └── student/
        │       ├── AttendanceHeatmap.tsx
        │       ├── Card.tsx
        │       ├── ProgressBar.tsx
        │       ├── StudentLayout.tsx
        │       └── StudentSidebar.tsx
        ├── pages/
        │   ├── Login.tsx
        │   ├── ProfilePage.tsx
        │   ├── VideoPlayer.tsx
        │   ├── admin/
        │   │   ├── AdminHome.tsx
        │   │   ├── AdminClassDetails.tsx
        │   │   ├── AdminCreateUserPage.tsx
        │   │   └── AdminAnnouncement.tsx
        │   ├── teacher/
        │   │   ├── TeacherHome.tsx
        │   │   ├── TeacherSubject.tsx
        │   │   ├── TeacherAttendanceHome.tsx
        │   │   ├── TeacherAttendanceSubject.tsx
        │   │   └── UploadContentModal.tsx
        │   └── student/
        │       ├── StudentHome.tsx
        │       ├── StudentSubject.tsx
        │       ├── StudentPlayer.tsx
        │       ├── StudentFees.tsx
        │       ├── StudentAnnouncements.tsx
        │       └── StudentAttendancePage.tsx
        ├── lib/
        │   ├── http.ts               # Axios instance with auth interceptor
        │   └── getVideoDuration.ts   # Video duration utility
        └── types/                    # TypeScript type definitions
            ├── admin.ts
            ├── teacher.ts
            ├── student.ts
            ├── attendance.ts
            ├── fees.ts
            └── announcements.ts
```

---

## Architecture

### Backend – Layered Architecture

```
HTTP Request
     │
     ▼
┌─────────────────────┐
│   Controller Layer  │  ← Validates request, extracts auth principal
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│    Service Layer    │  ← Business logic, access control checks
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Repository Layer   │  ← Spring Data JPA interfaces
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│     PostgreSQL      │
└─────────────────────┘
```

### Security Flow

```
Client
  │  POST /auth/login  { email, password }
  │─────────────────────────────────────────▶ AuthController
  │                                              │
  │                                         JwtService.generateToken()
  │                                              │
  │◀──────────────────── { token, userInfo } ───┘
  │
  │  GET /teacher/me/subjects
  │  Authorization: Bearer <token>
  │─────────────────────────────────────────▶ JwtAuthFilter
  │                                              │
  │                                         JwtService.validateToken()
  │                                              │
  │                                         SecurityContextHolder.setAuth()
  │                                              │
  │                                         TeacherContentQueryController
```

### Content Upload Flow (Teacher)

```
1. Teacher requests pre-signed URL   POST /teacher/modules/{moduleId}/content-items/init-upload
2. Backend generates presigned S3 PUT URL  →  returns { uploadUrl, contentItemId }
3. Teacher uploads file directly to R2/S3 storage using the presigned URL
4. Teacher confirms upload            PUT /teacher/content-items/{contentItemId}/confirm-upload
5. Backend marks ContentItem as READY
```

### Event-Driven Email Notifications

```
Service Layer
     │  publishes ApplicationEvent
     ▼
NotificationListener
     │  listens for StudentEnrolledEvent / TeacherAssignedEvent
     ▼
EmailService
     │  uses EmailTemplates + Spring Mail
     ▼
SMTP (Gmail)  →  sends welcome / assignment email to user
```

### Academic Hierarchy

```
AcademicYear
    └── ClassRoom(s)
            └── Subject(s)
                    └── Module(s)
                            └── ContentItem(s)
                                    └── ContentConsumption (per Student)
```

---

## Database Schema

| Entity | Key Fields | Relationships |
|---|---|---|
| `User` | id, name, email, password, role | has many Enrollments, Subjects (teacher), Announcements |
| `AcademicYear` | id, name, startDate, endDate | has many ClassRooms |
| `ClassRoom` | id, name, academicYear | has many Subjects, Enrollments, FeeStructures |
| `Subject` | id, name, classRoom, teacher | has many Modules |
| `Module` | id, title, subject, order | has many ContentItems |
| `ContentItem` | id, title, type (VIDEO/PDF/LINK), objectKey, published | belongs to Module |
| `ContentConsumption` | id, student, contentItem, status, watchedSeconds | tracks student progress |
| `Enrollment` | id, student, classRoom, status | links student to classroom |
| `FeeStructure` | id, classRoom, amount, academicYear | configures fees |
| `FeePayment` | id, student, amount, status (PAID/PENDING) | tracks payments |
| `AttendanceSession` | id, subject, date, teacher | groups attendance records |
| `AttendanceRecord` | id, session, student, status (PRESENT/ABSENT) | individual attendance |
| `Announcement` | id, title, message, classRoom, academicYear | classroom broadcasts |
| `Institute` | id, name | top-level tenant (future multi-tenancy) |

### Enums

| Enum | Values |
|---|---|
| `UserRole` | `ADMIN`, `TEACHER`, `STUDENT` |
| `ContentType` | `VIDEO`, `PDF`, `LINK` |
| `ConsumptionStatus` | `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED` |
| `EnrollmentStatus` | `ACTIVE`, `INACTIVE`, ... |
| `PaymentStatus` | `PENDING`, `PAID`, ... |
| `AttendanceStatus` | `PRESENT`, `ABSENT` |

---

## API Reference

> All protected endpoints require `Authorization: Bearer <JWT_TOKEN>` header.

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/login` | Login and receive JWT token | ❌ Public |

### User Profile (`/me`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/me` | Get current logged-in user info |
| `POST` | `/me/profile-photo/presign` | Get pre-signed URL to upload profile photo |

### Admin Endpoints (`/admin/*`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/admin/academic-years` | Create a new academic year |
| `GET` | `/admin/academic-years` | List all academic years |
| `GET` | `/admin/academic-years/latest` | Get the latest academic year |
| `POST` | `/admin/classrooms` | Create a new classroom |
| `GET` | `/admin/academic-years/{yearId}/classrooms` | List classrooms for a year |
| `POST` | `/admin/subjects` | Create a new subject |
| `GET` | `/admin/academic-years/{yearId}/classrooms/{classId}/subjects` | List subjects in a classroom |
| `PUT` | `/admin/subjects/{subjectId}/assign-teacher` | Assign a teacher to a subject |
| `POST` | `/admin/enrollments` | Enroll a student into a classroom |
| `GET` | `/admin/students/available` | List students available for enrollment |
| `GET` | `/admin/teachers` | List all teachers |
| `POST` | `/admin/fee-structures` | Create a fee structure |
| `GET` | `/admin/fee-structures` | Get fee structure for a classroom |
| `POST` | `/admin/announcements` | Create an announcement |
| `GET` | `/admin/announcements` | List announcements for a classroom |
| `POST` | `/admin/users` | Create a new user account |

### Teacher Endpoints (`/teacher/*`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/teacher/me/subjects` | Get subjects assigned to me |
| `GET` | `/teacher/subjects/{subjectId}/modules` | List modules for a subject |
| `POST` | `/teacher/subjects/{subjectId}/modules` | Create a module |
| `DELETE` | `/teacher/modules/{moduleId}` | Delete a module |
| `GET` | `/teacher/modules/{moduleId}/content-items` | List content in a module |
| `POST` | `/teacher/modules/{moduleId}/content-items/init-upload` | Initialize content upload (get presigned URL) |
| `PUT` | `/teacher/content-items/{id}/confirm-upload` | Confirm content upload complete |
| `DELETE` | `/teacher/content-items/{id}` | Delete a content item |
| `POST` | `/teacher/subjects/{subjectId}/thumbnail/presign` | Get presigned URL for subject thumbnail |
| `PUT` | `/teacher/subjects/{subjectId}/thumbnail` | Confirm subject thumbnail upload |
| `GET` | `/teacher/content-item/{contentId}` | Get content access URL |
| `GET` | `/teacher/attendance/subjects` | List subjects for attendance |
| `GET` | `/teacher/attendance/subjects/{subjectId}/sessions` | List sessions for a subject |
| `GET` | `/teacher/attendance/subjects/{subjectId}/students` | List enrolled students |
| `POST` | `/teacher/attendance/subjects/{subjectId}/sessions` | Take attendance |

### Student Endpoints (`/student/*`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/student/me/class` | Get enrolled class with subjects |
| `GET` | `/student/subjects/{subjectId}` | Get subject details with modules |
| `GET` | `/student/subjects/{subjectId}/modules/{moduleId}/content-list` | List content items with consumption status |
| `GET` | `/student/content-items/{id}/access-url` | Get secure (signed) URL to access content |
| `POST` | `/student/content/{contentId}/visited` | Mark a content item as visited |
| `POST` | `/student/content/{contentId}/video-progress` | Update video watch progress |
| `GET` | `/student/announcements` | Get classroom announcements |
| `GET` | `/student/fees/summary` | Get fee summary |
| `POST` | `/student/fees/simulate-pay` | Simulate a fee payment |
| `POST` | `/student/fees/razorpay/order` | Create a Razorpay payment order |
| `POST` | `/student/fees/razorpay/verify` | Verify Razorpay payment signature |
| `GET` | `/student/attendance/subjects` | Get attendance summary per subject |

---

## Frontend Routes

```
/                                     → Login page

/admin                                → Admin dashboard (academic year overview)
/admin/class/:academicYearId/:classId → Class detail (subjects, enrollment, fees)
/admin/users                          → Create new users
/admin/announcements                  → Manage announcements
/admin/profile                        → Admin profile

/teacher                              → Teacher dashboard (my subjects)
/teacher/subject/:subjectId           → Subject detail (modules, content upload & delete)
/teacher/player/:kind/:contentId      → Content preview player
/teacher/attendance                   → Attendance home (pick a subject)
/teacher/attendance/:subjectId        → Take/view attendance for a subject
/teacher/profile                      → Teacher profile

/student                              → Student dashboard (my class & subjects)
/student/subject/:subjectId           → Subject content (modules, content list)
/student/player/:kind/:contentId      → Video/content player with progress tracking
/student/fees                         → Fee summary & payment
/student/announcements                → View announcements
/student/attendance                   → View attendance records
/student/profile                      → Student profile
```

---

## Getting Started

### Prerequisites

- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+** and **npm**
- **Docker & Docker Compose** (for the local PostgreSQL database)
- An **S3-compatible object storage** bucket (Cloudflare R2 or AWS S3)
- *(Optional)* Razorpay account for live payments

---

### Database Setup (Docker)

```bash
# From the project root — starts PostgreSQL 16 on port 5432
docker compose up -d
```

This spins up a **PostgreSQL 16** container named `edumanage-postgres` with the credentials defined in `docker-compose.yml`.

Data is persisted in a named Docker volume (`postgres_data`) so it survives container restarts.

To stop the database:
```bash
docker compose down
```

---

### Backend Setup

```bash
cd backend

# Copy the example config and fill in your values
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Run the Spring Boot application
./mvnw spring-boot:run
```

The server starts on `http://localhost:8080` by default.

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy the example env file and fill in your values
cp .env.example .env

# Start development server
npm run dev
```

The app starts on `http://localhost:5173` by default.

---

## Environment Variables

> Copy the example files and fill in your own values before running either service.

### Backend — `src/main/resources/application.properties`

Template: [`application.properties.example`](backend/src/main/resources/application.properties.example)

| Property | Description |
|---|---|
| `spring.datasource.url` | PostgreSQL JDBC URL |
| `spring.datasource.username` | DB username |
| `spring.datasource.password` | DB password |
| `app.jwt.secret` | Secret key used to sign JWTs (min 32 chars) |
| `app.jwt.expiration-minutes` | JWT lifetime in minutes (default `1440` = 24 h) |
| `app.seed.enabled` | Seed an institute + admin on first boot (`true`/`false`) |
| `app.seed.admin.email` | Seeded admin email |
| `app.seed.admin.password` | Seeded admin password |
| `app.r2.endpoint` | Cloudflare R2 / S3 endpoint URL |
| `app.r2.access-key` | R2 access key ID |
| `app.r2.secret-key` | R2 secret access key |
| `app.r2.public.bucket` | Public R2 bucket name (profile photos, thumbnails) |
| `app.r2.public.base-url` | Public CDN base URL for the public bucket |
| `app.r2.bucket` | Private R2 bucket name (course content) |
| `razorpay.keyId` | Razorpay key ID |
| `razorpay.keySecret` | Razorpay key secret |
| `spring.mail.username` | Gmail / SMTP sender address |
| `spring.mail.password` | Gmail app password |

### Frontend — `.env`

Template: [`.env.example`](frontend/.env.example)

| Variable | Description |
|---|---|
| `VITE_APP_BACKEND_URL` | Spring Boot API base URL (default `http://localhost:8080`) |
| `VITE_APP_BUCKET` | Cloudflare R2 public CDN base URL for images/thumbnails |

---

## Key Design Decisions

### 1. Role-Based API Prefixes
Every API route is prefixed by role (`/admin/*`, `/teacher/*`, `/student/*`), making it trivial to apply Spring Security rules per route prefix and keeping each role's surface area clearly separated.

### 2. Pre-signed URL Content Delivery
Content files (videos, PDFs) are **never served through the backend**. Instead, the backend generates short-lived pre-signed S3/R2 URLs for both upload (teacher) and download (student), keeping the backend stateless and offloading bandwidth to object storage.

### 3. Content Consumption Tracking
Each time a student accesses content, a `ContentConsumption` record is created or updated. For videos, progress is tracked in seconds via `/student/content/{id}/video-progress`, enabling resume functionality and completion detection.

### 4. Attendance System
Attendance is session-based. Teachers create an `AttendanceSession` for a date, then record `AttendanceRecord` entries (PRESENT/ABSENT) for each enrolled student in that session.

### 5. Event-Driven Email Notifications
When a student is enrolled or a teacher is assigned to a subject, the service publishes a Spring `ApplicationEvent`. A `NotificationListener` handles these events asynchronously and sends personalised emails via `EmailService` and `EmailTemplates`, keeping business logic decoupled from notification logic.

### 6. DataSeeder
A `DataSeeder` configuration bean seeds initial data on application startup, making it easy to bootstrap a demo environment with default admin/teacher/student accounts.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---
