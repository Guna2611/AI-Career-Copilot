function Tag({ children, tone = "neutral" }) {
  const toneClasses = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100/60",
    danger: "border-rose-200 bg-rose-50 text-rose-700 shadow-rose-100/60",
    neutral: "border-slate-200 bg-slate-50 text-slate-700 shadow-slate-100/60",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium shadow-sm ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

function SkillGroup({ title, description, skills, tone, emptyState }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_-35px_rgba(15,23,42,0.35)]">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <Tag key={skill} tone={tone}>
              {skill}
            </Tag>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {emptyState}
          </div>
        )}
      </div>
    </div>
  );
}

function SkillTags({ matchedSkills, missingSkills }) {
  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <SkillGroup
        title="Matched Skills"
        description="Capabilities already reflected in your resume."
        skills={matchedSkills}
        tone="success"
        emptyState="No matched skills detected yet."
      />
      <SkillGroup
        title="Missing Skills"
        description="Keywords and capabilities to strengthen before applying."
        skills={missingSkills}
        tone="danger"
        emptyState="Great! No missing skills detected."
      />
    </section>
  );
}

export default SkillTags;
