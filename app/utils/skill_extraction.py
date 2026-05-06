"""
Skill extraction via alias-based normalization.

Goals:
- Normalize inconsistent skill names (ml vs machine learning, ai vs artificial intelligence, etc.)
- Avoid substring mistakes for short abbreviations (ai shouldn't match "paid", sql shouldn't match random words)
- Prefer longest phrase matches first (future-proofing for overlapping aliases)
- Return canonical skill names.

Unit-style examples (run mentally / copy into a REPL):
-------------------------------------------------------
# 1) Case-insensitive + canonicalization
# text = "Built ML pipelines using Python and SQL"
# skills = extract_skills_from_text(text)
# assert "machine learning" in skills
# assert "ml" not in skills
#
# 2) Abbreviation boundary: "ai" should not match "paid"
# text = "paid attention to details"
# skills = extract_skills_from_text(text)
# assert "artificial intelligence" not in skills
#
# 3) Longest phrase ordering (if short alias overlaps):
# skill aliases include "natural language processing" and "language" (if added later)
# text = "NLP and natural language processing techniques..."
# skills = extract_skills_from_text(text)
# assert "natural language processing" in skills
#
# 4) Example mapping:
# text = "Used js/TypeScript with React, and node.js for APIs"
# skills = extract_skills_from_text(text)
# assert "javascript" in skills
# assert "typescript" in skills
# assert "react" in skills
# assert "node.js" in skills
#
# 5) Skill match vs missing match
# resume = "python react"
# jd = "We need machine learning and react"
# _, jd_skills, matched, missing = calculate_skill_match(resume, jd)
# assert "react" in matched
# assert "machine learning" in missing
#
# 6) Abbreviation safety: "ai" should not match "paid"
# text = "paid attention to details; no AI mentioned"
# skills = extract_skills_from_text(text)
# assert "artificial intelligence" not in skills
#
# 7) JS alias boundary: "js" should not match inside "javascript"
# text = "javascript developer"
# skills = extract_skills_from_text(text)
# assert "javascript" in skills
#
# 8) NLP abbreviation: "NLP" should map to "natural language processing"
# text = "We use NLP for text classification"
# skills = extract_skills_from_text(text)
# assert "natural language processing" in skills
#
# 9) Node aliases: nodejs / node.js -> node.js
# text = "Built APIs in nodejs and TypeScript"
# skills = extract_skills_from_text(text)
# assert "node.js" in skills
#
# 10) Score inputs sanity: empty JD skills => match score 0
# assert calculate_match_score([], []) == 0.0
#
# 11) Data Analyst variants -> data analysis
# text = "Seeking a Data Analyst with strong data analytics skills"
# skills = extract_skills_from_text(text)
# assert "data analysis" in skills
#
# 12) AI/ML variants
# text = "AI and ML experience"
# skills = extract_skills_from_text(text)
# assert "artificial intelligence" in skills
# assert "machine learning" in skills
-------------------------------------------------------
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Iterable


# Canonical skill names (these are what we return).
PREDEFINED_SKILLS: list[str] = [
    "python",
    "java",
    "c++",
    "javascript",
    "typescript",
    "react",
    "node.js",
    "sql",
    "mongodb",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "natural language processing",
    "data analysis",
    "aws",
    "docker",
    "kubernetes",
    "fastapi",
]


# Alias -> canonical skill mapping.
# Add new aliases here without changing extraction logic.
ALIAS_TO_CANONICAL: dict[str, str] = {
    # languages / frameworks
    "python": "python",
    "java": "java",
    "c++": "c++",
    "c plus plus": "c++",
    "cplusplus": "c++",

    # web / FE
    "javascript": "javascript",
    "js": "javascript",
    "type script": "typescript",
    "typescript": "typescript",
    "react": "react",

    # backend runtime
    "node.js": "node.js",
    "node js": "node.js",
    "nodejs": "node.js",

    # data / storage
    "sql": "sql",
    "mongodb": "mongodb",
    "database analysis": "data analysis",
    "data analysis": "data analysis",
    "data analyst": "data analysis",
    "data analytics": "data analysis",
    "data analytic": "data analysis",

    # ML / AI
    "machine learning": "machine learning",
    "ml": "machine learning",
    "deep learning": "deep learning",
    "dl": "deep learning",
    "artificial intelligence": "artificial intelligence",
    "ai": "artificial intelligence",
    "natural language processing": "natural language processing",
    "nlp": "natural language processing",

    # cloud / devops
    "aws": "aws",
    "amazon web services": "aws",
    "docker": "docker",
    "kubernetes": "kubernetes",

    # api frameworks
    "fastapi": "fastapi",
}


def normalize_dynamic_skill(skill: str) -> str:
    """
    Lowercase, strip, and map to a predefined canonical if an alias matches.
    """
    skill = skill.lower().strip()
    return ALIAS_TO_CANONICAL.get(skill, skill)


SHORT_ALIAS_LENGTH_MAX = 4


@dataclass(frozen=True)
class _AliasPattern:
    alias: str
    canonical: str
    regex: re.Pattern[str]


def _compile_alias_patterns(
    canonicals_to_check: Iterable[str],
) -> list[_AliasPattern]:
    # Filter aliases by the canonical skills we care about.
    canonicals_set = set(canonicals_to_check)
    relevant_aliases: list[tuple[str, str]] = [
        (alias, canonical)
        for alias, canonical in ALIAS_TO_CANONICAL.items()
        if canonical in canonicals_set
    ]

    # Support dynamic/AI skills that don't exist in ALIAS_TO_CANONICAL
    mapped_canonicals = {canonical for _, canonical in relevant_aliases}
    for canonical in canonicals_set:
        if canonical not in mapped_canonicals:
            relevant_aliases.append((canonical, canonical))

    # Prefer longest phrase matching first.
    # Using length in characters + whitespace count as a cheap proxy.
    relevant_aliases.sort(
        key=lambda pair: (len(pair[0].strip()), pair[0].count(" ")),
        reverse=True,
    )

    patterns: list[_AliasPattern] = []
    for alias, canonical in relevant_aliases:
        escaped = re.escape(alias)

        # Careful regex for short abbreviations (ai/ml/sql/aws, etc).
        # We use word boundaries only at the ends so abbreviations don't match substrings.
        # Example: \bai\b will NOT match "paid" because "ai" isn't bounded by non-word chars.
        alias_stripped = alias.strip()
        if _looks_like_short_word_token(alias_stripped):
            regex_str = rf"\b{escaped}\b"
        else:
            # For phrases and tokens with punctuation (node.js, c++, etc.)
            # boundary at both ends of the whole alias.
            regex_str = rf"(?<!\w){escaped}(?!\w)"

        patterns.append(
            _AliasPattern(
                alias=alias,
                canonical=canonical,
                regex=re.compile(regex_str, flags=re.IGNORECASE),
            )
        )

    return patterns


def _looks_like_short_word_token(alias: str) -> bool:
    # Short = no spaces and <= 4 chars after trimming, and only word chars.
    # This keeps "ai", "ml", "sql", "aws", etc. safe with strict boundaries.
    if " " in alias:
        return False
    if len(alias) > SHORT_ALIAS_LENGTH_MAX:
        return False
    return bool(re.fullmatch(r"[A-Za-z0-9_+\-./]+", alias)) and bool(
        re.fullmatch(r"[A-Za-z0-9_]+", alias)
    )


def extract_skills_from_text(
    text: str,
    skill_list: list[str] | None = None,
) -> list[str]:
    """
    Extract canonical skills from text using alias regex matching.

    If skill_list is provided, it should contain canonical skill names.
    """
    canonicals_to_check = skill_list or PREDEFINED_SKILLS
    patterns = _compile_alias_patterns(canonicals_to_check)

    # Collect alias matches with spans so we can avoid substring mistakes
    # when shorter aliases appear inside longer ones.
    matches: list[tuple[int, int, int, str]] = []
    # tuple = (start, end, alias_length, canonical)
    for pat in patterns:
        for m in pat.regex.finditer(text):
            matches.append(
                (m.start(), m.end(), len(pat.alias), pat.canonical),
            )

    # Prefer longest aliases first, then earlier occurrences.
    matches.sort(key=lambda t: (-t[2], t[0]))

    accepted_spans: list[tuple[int, int]] = []
    accepted_canonicals: set[str] = set()

    def _overlaps(a: tuple[int, int], b: tuple[int, int]) -> bool:
        return not (a[1] <= b[0] or b[1] <= a[0])

    for start, end, _alias_len, canonical in matches:
        span = (start, end)
        if any(_overlaps(span, acc) for acc in accepted_spans):
            continue
        accepted_spans.append(span)
        accepted_canonicals.add(canonical)

    return sorted(accepted_canonicals)


def extract_skill_debug(
    text: str,
    skill_list: list[str] | None = None,
) -> tuple[list[str], list[str]]:
    """
    Debug helper for auditing extraction/normalization.

    Returns:
    - raw_alias_hits: sorted unique aliases found in text (case-preserving from alias map)
    - normalized_canonicals: sorted unique canonical skills derived from those hits
    """
    canonicals_to_check = skill_list or PREDEFINED_SKILLS
    patterns = _compile_alias_patterns(canonicals_to_check)

    raw_alias_hits: set[str] = set()
    normalized: set[str] = set()

    for pat in patterns:
        if pat.regex.search(text):
            raw_alias_hits.add(pat.alias)
            normalized.add(pat.canonical)

    return sorted(raw_alias_hits), sorted(normalized)


def calculate_skill_match(
    resume_text: str,
    job_description_text: str,
    skill_list: list[str] | None = None,
) -> tuple[list[str], list[str], list[str], list[str]]:
    """
    Returns:
    - resume_skills (canonical, sorted)
    - job_description_skills (canonical, sorted)
    - matched_skills = intersection(resume_skills, job_description_skills)
    - missing_skills = difference(job_description_skills - resume_skills)
    """
    canonicals_to_check = skill_list or PREDEFINED_SKILLS
    resume_skills = set(extract_skills_from_text(resume_text, canonicals_to_check))
    job_description_skills = set(
        extract_skills_from_text(job_description_text, canonicals_to_check)
    )

    matched_skills = sorted(resume_skills.intersection(job_description_skills))
    missing_skills = sorted(job_description_skills.difference(resume_skills))

    return (
        sorted(resume_skills),
        sorted(job_description_skills),
        matched_skills,
        missing_skills,
    )


def calculate_hybrid_skill_match(
    resume_text: str,
    job_description_text: str,
    ai_jd_skills: list[str],
) -> tuple[list[str], list[str], list[str], list[str]]:
    """
    Hybrid match combining dictionary extraction and dynamic AI extraction.
    Returns: resume_skills, job_description_skills, matched_skills, missing_skills
    """
    # 1. Predefined dictionary extraction
    predefined_jd_skills = extract_skills_from_text(job_description_text, PREDEFINED_SKILLS)
    predefined_resume_skills = extract_skills_from_text(resume_text, PREDEFINED_SKILLS)

    # 2. Normalize AI skills
    normalized_ai_skills = set(normalize_dynamic_skill(s) for s in ai_jd_skills)

    # 3. Combine JD skills
    job_description_skills = sorted(set(predefined_jd_skills).union(normalized_ai_skills))

    # 4. Search for AI skills in the resume text
    ai_skills_in_resume = extract_skills_from_text(resume_text, list(normalized_ai_skills))

    resume_skills = sorted(set(predefined_resume_skills).union(ai_skills_in_resume))
    matched_skills = sorted(set(resume_skills).intersection(job_description_skills))
    missing_skills = sorted(set(job_description_skills).difference(resume_skills))

    return resume_skills, job_description_skills, matched_skills, missing_skills


def calculate_match_score(matched_skills: list[str], job_skills: list[str]) -> float:
    total_job_skills = len(job_skills)
    if total_job_skills == 0:
        return 0.0

    score = (len(matched_skills) / total_job_skills) * 100
    return round(score, 2)


# Future-ready extension points (not implemented yet):
# ------------------------------------------------------
# 1) Synonym expansion: expand ALIAS_TO_CANONICAL dynamically.
# 2) Fuzzy matching: add optional fuzzy string matching for noisy OCR text.
# 3) Embedding-based skill similarity:
#    - compute embeddings for canonical skill names
#    - map near matches to canonicals
# 4) External skill taxonomy integration:
#    - load taxonomy from a file/service and build ALIAS_TO_CANONICAL at runtime.
