from typing import Annotated
from typing import Any

from fastapi import APIRouter, File, Form, UploadFile

from app.services.analyze_service import process_resume_submission

router = APIRouter(tags=["Analyze"])


@router.post("/analyze")
async def analyze_resume(
    resume: Annotated[UploadFile, File(...)],
    job_description: Annotated[str, Form(..., min_length=10)],
) -> dict[str, Any]:
    return await process_resume_submission(resume, job_description)
