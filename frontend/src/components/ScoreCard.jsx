function getScoreTone(score) {
  if (score >= 80) {
    return {
      badge: "Excellent fit",
      accent: "bg-emerald-100 text-emerald-800 border-emerald-200",
      text: "text-emerald-600",
      track: "bg-slate-100",
      fill: "bg-emerald-500",
      summary: "Strong match for this role",
    };
  }

  if (score >= 60) {
    return {
      badge: "Good potential",
      accent: "bg-amber-100 text-amber-800 border-amber-200",
      text: "text-amber-600",
      track: "bg-slate-100",
      fill: "bg-amber-500",
      summary: "Moderate match with room to improve",
    };
  }

  return {
    badge: "Needs improvement",
    accent: "bg-rose-100 text-rose-800 border-rose-200",
    text: "text-rose-600",
    track: "bg-slate-100",
    fill: "bg-rose-500",
    summary: "Lower alignment with the target role",
  };
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}%</p>
    </div>
  );
}

function ScoreCard({ score, skillScore, semanticScore }) {
  const tone = getScoreTone(score);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tone.accent}`}
          >
            {tone.badge}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">
            Match Score
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {tone.summary}. Use the missing skills and practice questions below
            to improve your chances before applying.
          </p>
        </div>

        <div className="min-w-[240px] rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Overall
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-slate-900">{score}</span>
            <span className="text-lg font-medium text-slate-500">/ 100</span>
          </div>
          <div className={`mt-5 h-3 rounded-full ${tone.track} overflow-hidden`}>
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${tone.fill}`}
              style={{ width: `${Math.max(0, Math.min(score, 100))}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Metric label="Skill Score" value={skillScore} />
        <Metric label="Semantic Score" value={semanticScore} />
      </div>
    </section>
  );
}

export default ScoreCard;
