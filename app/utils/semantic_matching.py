from sentence_transformers import SentenceTransformer, util

_model: SentenceTransformer | None = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def calculate_semantic_score(resume_text: str, job_description_text: str) -> float:
    if not resume_text.strip() or not job_description_text.strip():
        return 0.0

    model = _get_model()
    embeddings = model.encode(
        [resume_text, job_description_text],
        convert_to_tensor=True,
        normalize_embeddings=True,
    )
    cosine_similarity = float(util.cos_sim(embeddings[0], embeddings[1]).item())
    semantic_score = max(0.0, cosine_similarity) * 100
    return round(semantic_score, 2)
