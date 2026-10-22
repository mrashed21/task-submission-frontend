import { SubmissionForm } from "@/components/submission/submission-form";

export const metadata = {
  title: "Submit Project | DevReviewHub",
  description: "Submit your web development project for mentor review and evaluation.",
};

export default function StudentSubmitPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Project Submission Portal
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Ensure your repository is accessible and provides clear documentation. Our mentors review submissions continuously.
        </p>
      </div>

      <SubmissionForm />
    </div>
  );
}
