# 💻 DevReviewHub — Frontend Application

A modern, high-performance web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** design patterns. It serves as an intuitive portal for students to submit projects and track evaluations, and an efficient review dashboard for mentors to assess submissions in real time.

---

## 📋 Table of Contents
- [Key Features](#-key-features)
- [User Roles & Workflows](#-user-roles--workflows)
  - [Student Workflow](#1-student-workflow)
  - [Mentor / Admin Workflow](#2-mentor--admin-workflow)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [Design System & Components](#-design-system--components)
- [API Integration & State Management](#-api-integration--state-management)
- [Demo Credentials](#-demo-credentials)
- [Available Scripts](#-available-scripts)

---

## ✨ Key Features

- **⚡ Next.js 15+ App Router**: Leverages React Server Components, fast client-side navigation, and modular route grouping.
- **🎨 Modern Dark Aesthetic**: Engineered with deep slate/indigo gradients, subtle glow backdrops, glassmorphism card surfaces, and accessible typography.
- **🛡️ Multi-Role Authentication**: Complete JWT-based auth flow (`STUDENT`, `MENTOR`, `ADMIN`) with local storage token persistence, automatic session restore, and route guards.
- **📝 Smart Submission Engine**:
  - Live client-side URL schema validation (validating GitHub repositories and live demo links).
  - Anti-duplicate submission guard to prevent submitting identical repos.
  - Rate-limit awareness and detailed feedback messages on submission attempts.
- **📊 Real-Time Mentor Review Dashboard**:
  - **KPI Metrics Cards**: Total Submissions, Pending Reviews, Approved, Rejected, and Approval Rate percentage.
  - **Server-Side Filters**: Instant filtering by status (`ALL`, `PENDING`, `APPROVED`, `REJECTED`).
  - **Search & Pagination**: Search submissions by project name, student name, or repo URL with paginated navigation.
  - **Interactive Evaluation Modal**: Dialog allowing mentors to submit decisions (`APPROVED` / `REJECTED`) alongside structured mentor feedback.
- **📜 Student History & Feedback Tracker**:
  - Full history of submitted projects.
  - Live status badges (`PENDING`, `APPROVED`, `REJECTED`).
  - Collapsible/modal view of mentor evaluations and constructive feedback.
- **🚀 1-Click Demo Presets**: Quick-fill login buttons for Student and Mentor roles for instant testing and demonstration.

---

## 👥 User Roles & Workflows

### 1. Student Workflow
1. **Sign Up / Log In**: Register a new student account at `/signup` or log in with demo credentials.
2. **Submit Project (`/student/submit`)**:
   - Provide Project Title, GitHub Repository URL, Live Demo Link, and Project Description.
   - Immediate validation prevents empty fields and invalid URLs.
3. **Track Submissions (`/student/my-submissions`)**:
   - View status updates in real time.
   - Inspect mentor feedback directly inside the project card.

### 2. Mentor / Admin Workflow
1. **Access Dashboard (`/mentor/dashboard`)**:
   - Review top-level metrics across all student submissions.
   - Filter submissions by `PENDING` to see projects waiting for evaluation.
2. **Evaluate Project**:
   - Click "Evaluate" on any submission to inspect code repository and live deployment links.
   - Choose **Approve** or **Reject**.
   - Provide structured, constructive feedback and submit.
   - The dashboard updates immediately and reflects the new status.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v15+ / App Router)
- **Library**: [React](https://react.dev/) (v19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **UI Components**: shadcn/ui modular architecture
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utility Libraries**: `clsx`, `tailwind-merge`, `class-variance-authority`
- **Linting & Code Quality**: ESLint

---

## 📂 Project Directory Structure

```text
frontend/
├── public/                     # Static assets and icons
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/
│   │   │   └── page.tsx        # Login page with demo presets
│   │   ├── mentor/
│   │   │   └── dashboard/
│   │   │       └── page.tsx    # Mentor review dashboard
│   │   ├── signup/
│   │   │   └── page.tsx        # Student signup registration
│   │   ├── student/
│   │   │   ├── my-submissions/
│   │   │   │   └── page.tsx    # Student submission tracker & feedback
│   │   │   └── submit/
│   │   │       └── page.tsx    # Project submission form
│   │   ├── globals.css         # Global styles & Tailwind utilities
│   │   ├── layout.tsx          # Root layout with AuthProvider & Navbar
│   │   └── page.tsx            # Landing page with hero & quick switcher
│   ├── components/             # Reusable UI component library
│   │   ├── review/
│   │   │   └── review-dialog.tsx  # Modal dialog for submitting evaluations
│   │   ├── shared/
│   │   │   ├── empty-state.tsx    # Empty data state placeholder
│   │   │   ├── navbar.tsx         # Responsive top navigation & role switcher
│   │   │   ├── stat-card.tsx      # Dashboard KPI metric counter cards
│   │   │   └── status-badge.tsx   # Color-coded PENDING/APPROVED/REJECTED badges
│   │   ├── submission/
│   │   │   └── submission-table.tsx # Paginated data table for submissions
│   │   └── ui/                    # Base primitives (Button, Card, Input, Dialog, etc.)
│   └── lib/                    # Core utilities and state
│       ├── api-client.ts       # Centralized Fetch wrapper with auth header injection
│       ├── auth-context.tsx    # Global React Context for user state & JWT tokens
│       ├── types.ts            # Shared TypeScript interface definitions
│       └── utils.ts            # ClassName merging helpers (cn)
├── .env.example                # Example environment variables
├── .env.local                  # Local environment file
├── next.config.ts              # Next.js build configuration
├── package.json
└── tsconfig.json
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# URL of the Backend REST API
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- Backend API running on `http://localhost:5000` (see `backend/README.md`)

### Installation
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build
```bash
# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 🎨 Design System & Components

The interface follows a cohesive, design system:
- **Glassmorphism**: Translucent cards (`bg-slate-900/60 backdrop-blur-md`) with subtle border highlights (`border-slate-800`).
- **Status Badges**:
  - `PENDING`: Amber/Yellow palette with clock icon.
  - `APPROVED`: Emerald/Green palette with checkmark icon.
  - `REJECTED`: Rose/Red palette with alert icon.
- **Responsive Layout**: Fluid grids and collapsible mobile navigation adapted for desktop, tablet, and mobile displays.

---

## 🔗 API Integration & State Management

- **Centralized API Client (`src/lib/api-client.ts`)**:
  - Auto-attaches `Authorization: Bearer <token>` when available.
  - Automatically handles response errors and parses backend `ApiResponse<T>` payload envelopes.
- **Auth Context (`src/lib/auth-context.tsx`)**:
  - Stores JWT and user profile in React State + `localStorage`.
  - Supports role simulation with pre-configured demo presets.

---

## 👥 Demo Credentials

Test accounts can be filled with a single click on the `/login` page:

| Role | Email | Password | Access Routes |
| :--- | :--- | :--- | :--- |
| **Student** | `student@example.com` | `student1234` | `/student/submit`, `/student/my-submissions` |
| **Mentor** | `mentor@example.com` | `mentor1234` | `/mentor/dashboard` |
| **Admin** | `admin@example.com` | `admin1234` | `/mentor/dashboard`, All routes |

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Start Next.js development server with hot-reloading |
| `npm run build` | `next build` | Compile and bundle production application |
| `npm run start` | `next start` | Launch Next.js production server |
| `npm run lint` | `eslint` | Run ESLint static code analysis |
