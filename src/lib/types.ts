export type UserRole = "STUDENT" | "MENTOR" | "ADMIN";

export interface User {
  user_id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at?: string;
}

export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Review {
  review_id: string;
  submission_id: string;
  user_id: string;
  status: SubmissionStatus;
  feedback: string;
  review_date: string;
  created_at: string;
  mentor?: {
    user_id: string;
    name: string;
    email: string;
  };
}

export interface ProjectLink {
  title: string;
  url: string;
}

export interface Submission {
  submission_id: string;
  project_name: string;
  repo_url: string;
  live_link: string;
  additional_links?: ProjectLink[];
  description: string;
  status: SubmissionStatus;
  user_id: string;
  created_at: string;
  updated_at: string;
  user?: {
    user_id: string;
    name: string;
    email: string;
  };
  reviews?: Review[];
}

export interface DashboardStats {
  totalSubmissions: number;
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  totalStudents: number;
  approvalRate: number;
}

export interface MentorUser {
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  reviewCount?: number;
}

export interface AdminStats {
  totalMentors: number;
  totalStudents: number;
  totalAdmins: number;
  totalSubmissions: number;
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  totalReviews: number;
  approvalRate: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  data?: T;
  errorSources?: Array<{ path: string; message: string }>;
}

