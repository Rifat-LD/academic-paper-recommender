import re
import string

# Simple list of common stop words to avoid external NLTK dependency complexity
STOP_WORDS = {
    "a", "an", "the", "and", "or", "but", "if", "then", "else", "when",
    "at", "by", "for", "with", "about", "against", "between", "into",
    "through", "during", "before", "after", "above", "below", "to", "from",
    "up", "down", "in", "out", "on", "off", "over", "under", "again", "further"
}

def normalize_text(text: str) -> str:
    """
    Phase 3.3: Query preprocessing
    - Lowercase
    - Remove punctuation
    - Remove stop words
    - Normalize whitespace
    """
    if not text:
        return ""

    # 1. Lowercase
    text = text.lower()

    # 2. Remove punctuation
    text = text.translate(str.maketrans("", "", string.punctuation))

    # 3. Tokenize and remove stop words
    tokens = text.split()
    filtered_tokens = [t for t in tokens if t not in STOP_WORDS]

    return " ".join(filtered_tokens)