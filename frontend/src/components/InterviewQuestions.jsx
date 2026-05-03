function SourceBadge({ source }) {
  const isAi = source === "gemini";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        isAi
          ? "bg-cyan-50 text-cyan-700 ring-cyan-700/10"
          : "bg-slate-50 text-slate-600 ring-slate-500/10"
      }`}
    >
      {isAi ? "✨ Gemini AI" : "System"}
    </span>
  );
}

function InterviewQuestions({ questions, source }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-full">
      <div className="flex items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Interview Practice
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Rehearse likely questions based on your gaps.
          </p>
        </div>
        <SourceBadge source={source} />
      </div>

      <div className="grid gap-3">
        {questions.map((question, index) => (
          <div
            key={`${index}-${question}`}
            className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-sm font-bold text-indigo-600 shadow-sm">
              {index + 1}
            </div>
            <p className="text-sm leading-relaxed text-slate-700 pt-1">{question}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default InterviewQuestions;
