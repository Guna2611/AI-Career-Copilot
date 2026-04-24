function SourceBadge({ source }) {
  const isAi = source === "gemini";
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        isAi
          ? "bg-violet-100 text-violet-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {isAi ? "Gemini" : "Fallback"}
    </span>
  );
}

function SuggestionList({ suggestions, source }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_-35px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Improvement Suggestions
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Focus on these resume upgrades before your next application.
          </p>
        </div>
        <SourceBadge source={source} />
      </div>

      <div className="mt-5 space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={`${index}-${suggestion}`}
            className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition duration-200 hover:border-violet-200 hover:bg-violet-50/40"
          >
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                {index + 1}
              </div>
              <p className="text-sm leading-6 text-slate-700">{suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SuggestionList;
