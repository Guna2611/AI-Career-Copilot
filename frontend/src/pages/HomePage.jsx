import ResumeAnalyzerForm from "../components/ResumeAnalyzerForm";

function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <section className="mb-10 overflow-hidden rounded-[36px] border border-slate-200 bg-white/90 px-6 py-10 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)] backdrop-blur sm:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
              Recruiter-ready demo
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              AI Resume Analyzer
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Turn a plain resume into a polished, recruiter-friendly review.
              Instantly compare your resume against a target job description,
              uncover missing skills, and practice with tailored interview
              questions.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">Smart scoring</p>
                <p className="mt-1 text-sm text-slate-600">
                  Combines skills and semantic relevance.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">Skill gap view</p>
                <p className="mt-1 text-sm text-slate-600">
                  Spot missing capabilities in seconds.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">Practice prep</p>
                <p className="mt-1 text-sm text-slate-600">
                  Get suggestions and interview questions.
                </p>
              </div>
            </div>
          </div>
        </section>
        <ResumeAnalyzerForm />
      </div>
    </main>
  );
}

export default HomePage;
