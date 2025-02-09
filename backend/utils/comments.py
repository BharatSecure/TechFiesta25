from better_profanity import profanity
import re

# Load a custom cuss words list (optional)
profanity.load_censor_words()

def contains_cuss_words(text):
    """Check if the comment contains profane words."""
    return profanity.contains_profanity(text)

def is_spam(text):
    """Basic spam detection based on keyword repetition & links."""
    text = text.lower()
    
    # Common spam patterns
    spam_patterns = [
        r"(https?://\S+)",   # URLs
        r"(free money|win cash|click here|giveaway)",  # Scam phrases
        r"(buy now|subscribe|discount)",  # Marketing phrases
    ]
    
    # Check for spam patterns
    for pattern in spam_patterns:
        if re.search(pattern, text):
            return True

    return False
