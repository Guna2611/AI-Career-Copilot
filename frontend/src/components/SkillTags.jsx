function Tag({ children, tone = "neutral" }) {
  const toneClasses = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700",
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

function SkillGroup({ title, description, skills, tone, emptyState }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <Tag key={skill} tone={tone}>
              {skill}
            </Tag>
          ))
        ) : (
          <div className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 text-center">
            {emptyState}
          </div>
        )}
      </div>
    </div>
  );
}

function SkillTags({ matchedSkills, missingSkills, score, jdSkillsCount }) {
  let missingEmptyState = "Great! No missing skills detected.";
  
  if (jdSkillsCount === 0) {
    missingEmptyState = "Missing skills could not be extracted clearly from this job description.";
  } else if (missingSkills.length === 0 && score <= 70) {
    missingEmptyState = "No specific missing skills detected, but overall match is low.";
  } else if (missingSkills.length === 0 && score > 70) {
    missingEmptyState = "Great! No missing skills detected.";
  }

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
        emptyState={missingEmptyState}
      />
    </section>
  );
}

export default SkillTags;
