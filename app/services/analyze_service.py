import logging
import tempfile
from pathlib import Path
from typing import Any

from fastapi import HTTPException, UploadFile

from app.services.ai_suggestion_service import (
    generate_improvement_suggestions,
    generate_interview_questions,
)
from app.utils.pdf_extractor import (
    OCREngineNotAvailableError,
    extract_text_with_ocr_fallback,
)
from app.utils.semantic_matching import calculate_semantic_score
from app.utils.skill_extraction import (
    calculate_match_score,
    calculate_skill_match,
    extract_skill_debug,
)
from app.utils.text_preprocessing import preprocess_text

logger = logging.getLogger(__name__)


async def process_resume_submission(
    resume: UploadFile, job_description: str
) -> dict[str, Any]:
    filename = resume.filename or "uploaded_resume.pdf"
    file_extension = Path(filename).suffix.lower()
    content_type = resume.content_type or ""

    if content_type != "application/pdf" and file_extension != ".pdf":
        raise HTTPException(status_code=415, detail="Only PDF files are supported.")

    file_bytes = await resume.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF file is empty.")

    if not file_bytes.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="Invalid PDF file content.")

    file_size = len(file_bytes)
    trimmed_job_description = job_description.strip()
    if not trimmed_job_description:
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(file_bytes)
        temp_file_path = temp_file.name

    try:
        extracted_text, used_ocr = extract_text_with_ocr_fallback(temp_file_path)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except OCREngineNotAvailableError as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "OCR fallback is required for this PDF, but OCR is not configured "
                "on the server."
            ),
        ) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=422, detail="Failed to extract text from PDF."
        ) from exc

    if not extracted_text:
        raise HTTPException(
            status_code=422,
            detail="No extractable text found in PDF, including OCR fallback.",
        )

    processed_resume_text = preprocess_text(extracted_text)
    processed_job_description = preprocess_text(trimmed_job_description)

    # Temporary debug logging to audit normalization consistency end-to-end.
    raw_resume_skills, normalized_resume_skills = extract_skill_debug(
        processed_resume_text
    )
    raw_jd_skills, normalized_jd_skills = extract_skill_debug(processed_job_description)

    _, job_description_skills, matched_skills, missing_skills = calculate_skill_match(
        processed_resume_text, processed_job_description
    )

    logger.info("extracted_raw_resume_skills=%s", raw_resume_skills)
    logger.info("extracted_raw_jd_skills=%s", raw_jd_skills)
    logger.info("normalized_resume_skills=%s", normalized_resume_skills)
    logger.info("normalized_jd_skills=%s", normalized_jd_skills)
    logger.info("matched_normalized_skills=%s", matched_skills)
    logger.info("missing_normalized_skills=%s", missing_skills)
    skill_score = calculate_match_score(matched_skills, job_description_skills)
    semantic_score = calculate_semantic_score(
        processed_resume_text, processed_job_description
    )
    score = round((skill_score * 0.7) + (semantic_score * 0.3), 2)
    improvement_suggestions, suggestion_source = (
        await generate_improvement_suggestions(
            processed_resume_text,
            processed_job_description,
            missing_skills,
        )
    )
    interview_questions, question_source = await generate_interview_questions(
        missing_skills
    )

    logger.info(
        "Received analyze request | filename=%s content_type=%s size_bytes=%s jd_length=%s temp_path=%s extracted_text_length=%s processed_resume_length=%s matched_skills=%s missing_skills=%s skill_score=%s semantic_score=%s final_score=%s suggestion_count=%s question_count=%s suggestion_source=%s question_source=%s used_ocr=%s",
        resume.filename,
        resume.content_type,
        file_size,
        len(trimmed_job_description),
        temp_file_path,
        len(extracted_text),
        len(processed_resume_text),
        len(matched_skills),
        len(missing_skills),
        skill_score,
        semantic_score,
        score,
        len(improvement_suggestions),
        len(interview_questions["questions"]),
        suggestion_source,
        question_source,
        used_ocr,
    )

    return {
        "score": score,
        "skill_score": skill_score,
        "semantic_score": semantic_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "improvement_suggestions": improvement_suggestions,
        "interview_questions": interview_questions,
        "question_source": question_source,
        "suggestion_source": suggestion_source,
    }
