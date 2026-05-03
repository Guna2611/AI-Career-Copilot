import json
import logging
from typing import Any

import google.generativeai as genai

from app.utils.config import settings

logger = logging.getLogger(__name__)


def _build_fallback_suggestions(missing_skills: list[str]) -> list[str]:
    if not missing_skills:
        return [
            "Your resume already aligns with the listed job skills. Add measurable project impact and quantified outcomes to strengthen your profile further."
        ]

    top_missing_skills = missing_skills[:5]
    suggestions: list[str] = [
        f"Add project bullets that demonstrate practical use of {skill}."
        for skill in top_missing_skills
    ]
    suggestions.append(
        "Tailor your summary section to reflect the role's priorities and include relevant tools in recent experience."
    )
    return suggestions


def _parse_suggestions(raw_content: str) -> list[str]:
    cleaned = raw_content.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    try:
        parsed: Any = json.loads(cleaned)
        if isinstance(parsed, list):
            return [str(item).strip() for item in parsed if str(item).strip()]
    except json.JSONDecodeError as exc:
        logger.debug("JSON decode error: %s", exc)

    lines = []
    for line in cleaned.splitlines():
        line = line.strip("-* \t\",[]{}")
        if line and len(line) > 3:
            lines.append(line)
            
    return lines[:6]


def _build_fallback_questions(missing_skills: list[str]) -> list[str]:
    base_questions = [
        "How do you approach understanding requirements before implementing a new feature?",
        "Describe a challenging project and how you measured its impact.",
        "How do you ensure your code is maintainable and testable?",
        "What is your strategy for debugging production issues?",
        "How do you prioritize tasks when multiple deadlines overlap?",
    ]
    skill_questions = [
        f"What is your practical experience with {skill}, and can you share a project example?"
        for skill in missing_skills[:5]
    ]
    return (skill_questions + base_questions)[:10]


def _parse_questions(raw_content: str) -> list[str]:
    parsed = _parse_suggestions(raw_content)
    if not parsed:
        return []
    return parsed[:10]


def _get_gemini_model() -> genai.GenerativeModel | None:
    if not settings.GEMINI_API_KEY:
        return None
    genai.configure(api_key=settings.GEMINI_API_KEY)
    logger.info("Configuring Gemini model: %s", settings.GEMINI_MODEL)
    return genai.GenerativeModel(settings.GEMINI_MODEL)


async def generate_improvement_suggestions(
    resume_text: str,
    job_description: str,
    missing_skills: list[str],
) -> tuple[list[str], str]:
    model = _get_gemini_model()
    if model is None:
        logger.info("Using fallback suggestions")
        return _build_fallback_suggestions(missing_skills), "fallback"

    prompt = (
        "You are a resume coach. Analyze the resume, the job description, and the missing skills. "
        "Return only a valid JSON array of 4-8 concise, practical resume improvement suggestions.\n\n"
        f"Missing skills: {', '.join(missing_skills) if missing_skills else 'None'}\n\n"
        f"Job description:\n{job_description[:3000]}\n\n"
        f"Resume text:\n{resume_text[:3000]}"
    )

    try:
        logger.info("Using Gemini suggestions with model: %s", settings.GEMINI_MODEL)
        response = model.generate_content(
            [
                "Return only a valid JSON array of suggestion strings.",
                prompt,
            ]
        )
        raw_content = response.text or "[]"
        suggestions = _parse_suggestions(raw_content)
        if suggestions:
            return suggestions, "gemini"
    except Exception as exc:
        logger.warning(
            "Gemini suggestion generation failed for model %s: %s",
            settings.GEMINI_MODEL,
            exc,
        )

    logger.info("Using fallback suggestions")
    return _build_fallback_suggestions(missing_skills), "fallback"


async def generate_interview_questions(
    missing_skills: list[str],
) -> tuple[dict[str, list[str]], str]:
    model = _get_gemini_model()
    if model is None:
        logger.info("Using fallback interview questions")
        return {"questions": _build_fallback_questions(missing_skills)}, "fallback"

    prompt = (
        "Generate 5 to 8 practical, role-relevant technical interview questions "
        "based on these missing skills. Return only a valid JSON array.\n\n"
        f"Missing skills: {', '.join(missing_skills) if missing_skills else 'None'}"
    )

    try:
        logger.info(
            "Using Gemini interview questions with model: %s",
            settings.GEMINI_MODEL,
        )
        response = model.generate_content(
            [
                "Return only a valid JSON array of interview question strings.",
                prompt,
            ]
        )
        raw_content = response.text or "[]"
        questions = _parse_questions(raw_content)
        if 5 <= len(questions) <= 8:
            return {"questions": questions}, "gemini"
        if questions:
            padded = questions + _build_fallback_questions(missing_skills)
            unique_questions = list(dict.fromkeys(padded))
            return {"questions": unique_questions[:8]}, "gemini"
    except Exception as exc:
        logger.warning(
            "Gemini interview question generation failed for model %s: %s",
            settings.GEMINI_MODEL,
            exc,
        )

    logger.info("Using fallback interview questions")
    return {"questions": _build_fallback_questions(missing_skills)}, "fallback"
