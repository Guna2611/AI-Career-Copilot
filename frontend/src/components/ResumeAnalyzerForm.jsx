import { useEffect, useRef, useState } from "react";
import InterviewQuestions from "./InterviewQuestions";
import ScoreCard from "./ScoreCard";
import SkillTags from "./SkillTags";
import SuggestionList from "./SuggestionList";
import { submitResumeForAnalysis } from "../utils/api";

function LoadingState() {
  return (
    <div className="rounded-3xl border border-indigo-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(79,70,229,0.35)]">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-300 border-t-indigo-600" />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900">
            Analyzing your resume...
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Matching skills and generating suggestions...
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-[0_16px_50px_-35px_rgba(15,23,42,0.35)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl">
        AI
      </div>
      <h3 className="mt-5 text-xl font-semibold text-slate-900">
        Your analysis dashboard will appear here
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
        Upload a resume, paste the target job description, and get a recruiter-
        friendly breakdown with match score, skill gaps, improvement tips, and
        interview practice questions.
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
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.35)]"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {item.label}
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
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
      <section className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-[1fr,1.25fr]">
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-6 transition duration-300 hover:border-indigo-300 hover:bg-indigo-50/40">
              <label
                htmlFor="resumeFile"
                className="block text-sm font-semibold text-slate-900"
              >
                Upload Resume
              </label>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Drop your PDF resume here or browse from your device. Best
                results come from clean, text-based resumes.
              </p>

              <input
                id="resumeFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) =>
                  setResumeFile(event.target.files?.[0] ?? null)
                }
                className="mt-5 block w-full cursor-pointer rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 file:mr-4 file:cursor-pointer file:border-0 file:bg-slate-900 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
              />
              <div className="mt-4 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  Selected file
                </p>
                <p className="mt-2 truncate text-sm font-medium text-slate-800">
                  {resumeFile ? resumeFile.name : "No file selected yet"}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6">
              <label
                htmlFor="jobDescription"
                className="block text-sm font-semibold text-slate-900"
              >
                Target Job Description
              </label>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Paste the job description to compare required skills,
                responsibilities, and role expectations against your resume.
              </p>
              <textarea
                id="jobDescription"
                rows={11}
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste a complete job description here, including responsibilities, required skills, and preferred tools."
                className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm outline-none transition duration-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                required
              />
              <div className="mt-3 flex items-center justify-between gap-4 text-xs text-slate-500">
                <span>Tip: include required tools, skills, and seniority.</span>
                <span>{jobDescription.trim().length} chars</span>
              </div>
              {jdTooShort ? (
                <p className="mt-3 text-sm text-amber-600">
                  Add a little more detail so the analyzer can score the role
                  accurately.
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Ready for a recruiter-style review
              </p>
              <p className="mt-1 text-sm text-slate-600">
                We’ll score role alignment, highlight skill gaps, and generate
                tailored improvement guidance.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Analyzing Resume
                </>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </div>

          {statusMessage ? (
            <p className="text-sm font-medium text-slate-700">{statusMessage}</p>
          ) : null}
        </form>
      </section>

      {isSubmitting ? <LoadingState /> : null}

      <div ref={resultsRef} className="space-y-6">
        {analysisResult ? (
          <>
            <SummaryStrip
              score={analysisResult.score}
              matchedCount={analysisResult.matchedSkills.length}
              missingCount={analysisResult.missingSkills.length}
            />
            <ScoreCard
              score={analysisResult.score}
              skillScore={analysisResult.skillScore}
              semanticScore={analysisResult.semanticScore}
            />
            <SkillTags
              matchedSkills={analysisResult.matchedSkills}
              missingSkills={analysisResult.missingSkills}
            />
            <div className="grid gap-6 xl:grid-cols-2">
              <SuggestionList
                suggestions={analysisResult.improvementSuggestions}
                source={analysisResult.suggestionSource}
              />
              <InterviewQuestions
                questions={analysisResult.interviewQuestions}
                source={analysisResult.questionSource}
              />
            </div>
          </>
        ) : (
          !isSubmitting && <EmptyState />
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzerForm;
