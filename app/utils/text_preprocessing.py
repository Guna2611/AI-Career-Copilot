import re

_SYMBOL_PATTERN = re.compile(r"[^a-z0-9\s]")
_WHITESPACE_PATTERN = re.compile(r"\s+")


def preprocess_text(text: str) -> str:
    normalized_text = text.lower()
    symbol_cleaned_text = _SYMBOL_PATTERN.sub(" ", normalized_text)
    whitespace_cleaned_text = _WHITESPACE_PATTERN.sub(" ", symbol_cleaned_text)
    return whitespace_cleaned_text.strip()
