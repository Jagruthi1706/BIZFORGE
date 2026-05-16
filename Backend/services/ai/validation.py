"""Heuristic validation for generated logo URLs."""

from __future__ import annotations

import re
from urllib.parse import urlparse

# Hosts that serve random stock photos — not acceptable as logo success.
_PLACEHOLDER_HOSTS = ("picsum.photos", "placehold.co", "placeholder.com", "loremflickr.com")

_SCENERY_HINTS = re.compile(
    r"(landscape|mountain|sunset|scenery|nature|travel|outdoor|bridge|beach|forest)",
    re.IGNORECASE,
)


def is_placeholder_url(url: str) -> bool:
    try:
        host = urlparse(url).netloc.lower()
    except Exception:
        return True
    return any(h in host for h in _PLACEHOLDER_HOSTS)


def validate_logo_url(url: str, *, allow_placeholder: bool = False) -> tuple[bool, str]:
    if not url or not str(url).strip():
        return False, "empty_url"
    url = str(url).strip()
    if not url.startswith(("http://", "https://")):
        return False, "invalid_scheme"
    if _SCENERY_HINTS.search(url):
        return False, "scenery_hint_in_url"
    if is_placeholder_url(url) and not allow_placeholder:
        return False, "placeholder_image"
    return True, "ok"
