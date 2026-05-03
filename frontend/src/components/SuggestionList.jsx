import { useState } from "react";

function SourceBadge({ source }) {
  const isAi = source === "gemini";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        isAi
          ? "bg-purple-50 text-purple-700 ring-purple-700/10"
          : "bg-slate-50 text-slate-600 ring-slate-500/10"
      }`}
    >
      {isAi ? "✨ Gemini AI" : "System"}
    </span>
  );
}

function SuggestionList({ suggestions, source }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_COUNT = 5;
  const hasMore = suggestions.length > INITIAL_COUNT;
  const visibleSuggestions = isExpanded ? suggestions : suggestions.slice(0, INITIAL_COUNT);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Improvement Suggestions
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Actionable tips to upgrade your resume.
          </p>
        </div>
        <SourceBadge source={source} />
      </div>

      <div className="space-y-3 flex-grow">
        {visibleSuggestions.map((suggestion, index) => (
          <div
            key={`${index}-${suggestion}`}
            className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-sm font-bold text-indigo-600 shadow-sm">
              {index + 1}
            </div>
            <p className="text-sm leading-relaxed text-slate-700 pt-1">{suggestion}</p>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
          >
            {isExpanded ? "Show Less" : `View More (${suggestions.length - INITIAL_COUNT} more)`}
          </button>
        </div>
      )}
    </section>
  );
}

export default SuggestionList;
