function SourceBadge({ source }) {
  const isAi = source === "gemini";
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        isAi
          ? "bg-cyan-100 text-cyan-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {isAi ? "Gemini" : "Fallback"}
    </span>
  );
}

function InterviewQuestions({ questions, source }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_-35px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Interview Practice
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Use these questions to rehearse the most likely gaps recruiters may
            probe.
          </p>
        </div>
        <SourceBadge source={source} />
      </div>

      <div className="mt-5 grid gap-3">
        {questions.map((question, index) => (
          <div
            key={`${index}-${question}`}
            className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition duration-200 hover:border-cyan-200 hover:bg-cyan-50/40"
          >
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {index + 1}
              </div>
              <p className="text-sm leading-6 text-slate-700">{question}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default InterviewQuestions;
