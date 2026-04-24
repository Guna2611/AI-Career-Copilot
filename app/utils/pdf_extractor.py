from pathlib import Path

import fitz


class OCREngineNotAvailableError(RuntimeError):
    """Raised when OCR dependencies are unavailable."""


def extract_text_from_pdf(pdf_path: str) -> str:
    if not Path(pdf_path).exists():
        raise ValueError("PDF file path does not exist.")

    try:
        with fitz.open(pdf_path) as document:
            extracted_chunks = [page.get_text("text") for page in document]
    except Exception as exc:
        raise RuntimeError("Unable to parse PDF file.") from exc

    extracted_text = "\n".join(chunk.strip() for chunk in extracted_chunks if chunk)
    return extracted_text.strip()


def extract_text_with_ocr_fallback(pdf_path: str) -> tuple[str, bool]:
    extracted_text = extract_text_from_pdf(pdf_path)
    if extracted_text:
        return extracted_text, False

    ocr_text = _extract_text_from_pdf_with_ocr(pdf_path)
    return ocr_text, True


def _extract_text_from_pdf_with_ocr(pdf_path: str) -> str:
    try:
        import pytesseract
        from PIL import Image
    except ImportError as exc:
        raise OCREngineNotAvailableError(
            "OCR dependencies are missing. Install pytesseract and Pillow."
        ) from exc

    ocr_chunks: list[str] = []
    try:
        with fitz.open(pdf_path) as document:
            for page in document:
                pixmap = page.get_pixmap(dpi=300, alpha=False)
                image = Image.frombytes(
                    "RGB",
                    [pixmap.width, pixmap.height],
                    pixmap.samples,
                )
                text = pytesseract.image_to_string(image)
                if text:
                    ocr_chunks.append(text.strip())
    except Exception as exc:
        raise RuntimeError("OCR failed while processing PDF pages.") from exc

    return "\n".join(chunk for chunk in ocr_chunks if chunk).strip()
