import { useEffect, useRef, useState } from "react";
import InterviewQuestions from "./InterviewQuestions";
import ScoreCard from "./ScoreCard";
import SkillTags from "./SkillTags";
import SuggestionList from "./SuggestionList";
import { submitResumeForAnalysis } from "../utils/api";

function LoadingState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900">
            Analyzing your resume...
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Matching skills and generating suggestions...
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm text-2xl">
        📄
      </div>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">
        Analysis dashboard will appear here
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
        Upload a resume and paste the target job description to get a comprehensive breakdown of your fit for the role.
      </p>
    </div>
  );
}

function SummaryStrip({ score, matchedCount, missingCount }) {
  const items = [
    { label: "Match Score", value: `${score}%` },
    { label: "Matched Skills", value: matchedCount },
    { label: "Missing Skills", value: missingCount },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {item.label}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function ResumeAnalyzerForm() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (analysisResult && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [analysisResult]);

  const jdTooShort = jobDescription.trim().length > 0 && jobDescription.trim().length < 10;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!resumeFile) {
      setStatusMessage("Please upload a resume file before submitting.");
      return;
    }

    if (jobDescription.trim().length < 10) {
      setStatusMessage("Please enter a more detailed job description.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Analyzing your resume...");

    try {
      const payload = await submitResumeForAnalysis({
        resumeFile,
        jobDescription,
      });
      setStatusMessage("Resume analyzed successfully.");
      setAnalysisResult({
        score: payload.score,
        skillScore: payload.skill_score ?? 0,
        semanticScore: payload.semantic_score ?? 0,
        matchedSkills: payload.matched_skills ?? [],
        missingSkills: payload.missing_skills ?? [],
        jdSkills: payload.jd_skills ?? [],
        improvementSuggestions: payload.improvement_suggestions ?? [],
        interviewQuestions:
          payload.interview_questions?.questions ?? [],
        suggestionSource: payload.suggestion_source ?? "fallback",
        questionSource: payload.question_source ?? "fallback",
      });
    } catch (error) {
      setStatusMessage(
        `Failed to submit resume for analysis. ${error instanceof Error ? error.message : ""}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-[1fr,1.25fr]">
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors">
              <label
                htmlFor="resumeFile"
                className="block text-sm font-semibold text-slate-900"
              >
                1. Upload Resume
              </label>
              <p className="mt-1 text-sm text-slate-500">
                PDF or Word document format.
              </p>

              <input
                id="resumeFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) =>
                  setResumeFile(event.target.files?.[0] ?? null)
                }
                className="mt-4 block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:cursor-pointer file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="mt-4 rounded-lg bg-white px-4 py-3 shadow-sm border border-slate-200">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Selected file
                </p>
                <p className="mt-1 truncate text-sm font-medium text-slate-700">
                  {resumeFile ? resumeFile.name : "No file selected"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <label
                htmlFor="jobDescription"
                className="block text-sm font-semibold text-slate-900"
              >
                2. Target Job Description
              </label>
              <p className="mt-1 text-sm text-slate-500">
                Paste the requirements and responsibilities.
              </p>
              <textarea
                id="jobDescription"
                rows={8}
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="e.g. We are looking for a Senior Frontend Developer with 5+ years of React experience..."
                className="mt-4 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 resize-none"
                required
              />
              <div className="mt-2 flex items-center justify-between gap-4 text-xs font-medium text-slate-500">
                <span>Tip: include tools and seniority.</span>
                <span className="text-slate-400">{jobDescription.trim().length} chars</span>
              </div>
              {jdTooShort ? (
                <p className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                  Please add more detail to get an accurate score.
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Ready to review?
              </p>
              <p className="text-sm text-slate-500">
                Analysis usually takes about 10-15 seconds.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !resumeFile || jobDescription.trim().length < 10}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Analyzing...
                </>
              ) : (
                "Run Analysis"
              )}
            </button>
          </div>

          {statusMessage && !isSubmitting && statusMessage !== "Resume analyzed successfully." ? (
            <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700 border border-indigo-200">
              {statusMessage}
            </div>
          ) : null}
        </form>
      </section>

      {isSubmitting ? <LoadingState /> : null}

      <div ref={resultsRef} className="space-y-6">
        {analysisResult ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SummaryStrip
              score={analysisResult.score}
              matchedCount={analysisResult.matchedSkills.length}
              missingCount={analysisResult.missingSkills.length}
            />
            <div className="mt-6">
              <ScoreCard
                score={analysisResult.score}
                skillScore={analysisResult.skillScore}
                semanticScore={analysisResult.semanticScore}
              />
            </div>
            <div className="mt-6">
              <SkillTags
                matchedSkills={analysisResult.matchedSkills}
                missingSkills={analysisResult.missingSkills}
                score={analysisResult.score}
                jdSkillsCount={analysisResult.jdSkills?.length || 0}
              />
            </div>
            <div className="mt-6 grid gap-6 xl:grid-cols-2 items-start">
              <SuggestionList
                suggestions={analysisResult.improvementSuggestions}
                source={analysisResult.suggestionSource}
              />
              <InterviewQuestions
                questions={analysisResult.interviewQuestions}
                source={analysisResult.questionSource}
              />
            </div>
          </div>
        ) : (
          !isSubmitting && <EmptyState />
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzerForm;
