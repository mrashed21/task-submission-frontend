# DevReviewHub - Frontend Application

A responsive, state-of-the-art Project Submission & Review Dashboard built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** reusable components.

## Features

### 1. Student Submission Portal (`/student/submit`)
- Form to submit project details (Project name, Repo URL, Live Link, Description).
- Robust client-side & server-side validation.
- Duplicate submission protection (prevents submitting identical repository links).
- Anti-spam submission rate limiting.
- Submission history & feedback tracker (`/student/my-submissions`).

### 2. Mentor Review Dashboard (`/mentor/dashboard`)
- **Paginated Data Table**: Paginated view of submissions with project links, metadata, and status.
- **Server-Side Filters**: Instant filtering by `ALL`, `PENDING`, `APPROVED`, `REJECTED`.
- **Approval & Rejection Actions**: Interactive modal allowing mentors to approve or reject submissions with structured feedback.
- **Aggregated Statistics**: KPI cards showing Total Submissions, Pending Reviews, Approved, Rejected, and Approval Rate percentage.

### 3. Authentication & Role-Based Access Control (`/login`, `/signup`)
- Student signup page.
- Login page with 1-click test fill buttons for Student and Mentor roles.
- Responsive top navbar with role switcher and demo toggles.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS with custom glassmorphism and dark mode
- **UI Architecture**: shadcn/ui inspired modular components (`button`, `input`, `textarea`, `card`, `dialog`, `badge`, `table`, `alert`)
- **Icons**: Lucide React
- **Typography**: Inter (Google Fonts)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
