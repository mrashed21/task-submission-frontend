import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/shared/navbar";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DevReviewHub | Project Submission & Evaluation Dashboard",
  description:
    "A full-stack project submission and review platform for students and mentors built with Next.js, Express, and PostgreSQL via Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white`}
      >
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
              DevReviewHub &copy; 2026 &bull; Technical Hiring Task &bull; Next.js App Router & Express API
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
