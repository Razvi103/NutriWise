import re

def strip_json_prefix(text: str) -> str:
    return re.sub(r'^\s*(?:```json\s*|json\s*:?)[\r\n]*', '', text, flags=re.IGNORECASE)