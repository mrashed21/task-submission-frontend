import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/shared/navbar";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-zinc-100 font-sans antialiased selection:bg-[#1877f2] selection:text-white transition-colors duration-150`}
      >
        <ThemeProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-zinc-200 bg-white py-6 text-center text-xs text-zinc-500 dark:border-zinc-900 dark:bg-black dark:text-zinc-500">
                DevReviewHub &copy; 2026 &bull; Technical Hiring Task &bull; Next.js App Router & Express API
              </footer>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
