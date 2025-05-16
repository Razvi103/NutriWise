import re

def strip_json_prefix(text: str) -> str:
    return re.sub(r'^\s*(?:```json\s*|json\s*:?)[\r\n]*', '', text, flags=re.IGNORECASE)


def strip_json_suffix(text: str) -> str:

    last_brace_index = text.rfind('}')
    last_bracket_index = text.rfind(']')
    last_json_end_index = max(last_brace_index, last_bracket_index)

    if last_json_end_index != -1:
        return text[:last_json_end_index + 1]
    else:
        return text