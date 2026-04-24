function getScoreTone(score) {
  if (score >= 80) {
    return {
      badge: "Excellent fit",
      accent: "from-emerald-500 to-teal-500",
      text: "text-emerald-600",
      track: "bg-emerald-100",
      fill: "bg-emerald-500",
      summary: "Strong match for this role",
    };
  }

  if (score >= 60) {
    return {
      badge: "Good potential",
      accent: "from-amber-500 to-orange-500",
      text: "text-amber-600",
      track: "bg-amber-100",
      fill: "bg-amber-500",
      summary: "Moderate match with room to improve",
    };
  }

  return {
    badge: "Needs improvement",
    accent: "from-rose-500 to-pink-500",
    text: "text-rose-600",
    track: "bg-rose-100",
    fill: "bg-rose-500",
    summary: "Lower alignment with the target role",
  };
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}%</p>
    </div>
  );
}

function ScoreCard({ score, skillScore, semanticScore }) {
  const tone = getScoreTone(score);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-0.5">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div
            className={`inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white shadow-sm ${tone.accent}`}
          >
            {tone.badge}
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">
            Match Score
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {tone.summary}. Use the missing skills and practice questions below
            to improve your chances before applying.
          </p>
        </div>

        <div className="min-w-[220px] rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Overall
          </p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-bold">{score}</span>
            <span className="pb-1 text-lg text-slate-400">/ 100</span>
          </div>
          <div className={`mt-5 h-3 rounded-full ${tone.track}`}>
            <div
              className={`h-3 rounded-full transition-all duration-700 ${tone.fill}`}
              style={{ width: `${Math.max(0, Math.min(score, 100))}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Metric label="Skill Score" value={skillScore} />
        <Metric label="Semantic Score" value={semanticScore} />
      </div>
    </section>
  );
}

export default ScoreCard;
