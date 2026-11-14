#!/usr/bin/env python3
"""Add a hash-based Content-Security-Policy to every page in out/.

GitHub Pages cannot send response headers, so the policy goes in a
<meta http-equiv="Content-Security-Policy"> tag instead. Next's static
export inlines small bootstrap scripts (self.__next_f.push(...)) in every
page, so script-src lists the SHA-256 of each inline script on that page
rather than allowing 'unsafe-inline'. Each page gets its own policy.

What a meta CSP cannot do: frame-ancestors, report-uri and sandbox are
ignored outside a real header, so clickjacking protection is not covered
here. /security says so.

Usage: python scripts/add_csp.py [out_dir]   (deploy.py runs it after the build)
"""

from __future__ import annotations

import base64
import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Inline scripts are <script> tags without a src attribute. Their text is not
# entity-decoded, so the bytes between the tags are exactly what the browser
# hashes.
INLINE_SCRIPT = re.compile(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", re.S | re.I)
CHARSET = re.compile(r"<meta charSet=\"utf-8\"\s*/?>", re.I)
EXISTING = re.compile(r"<meta http-equiv=\"Content-Security-Policy\"[^>]*>", re.I)


def policy(html: str) -> str:
    hashes = sorted(
        {
            "'sha256-" + base64.b64encode(hashlib.sha256(body.encode("utf-8")).digest()).decode() + "'"
            for body in INLINE_SCRIPT.findall(html)
            if body.strip()
        }
    )
    # Only the resume page embeds anything (the PDF in an <object>). Chrome
    # renders that PDF in a nested frame, so frame-src has to allow it too.
    embeds = "'self'" if "<object" in html else "'none'"
    directives = [
        "default-src 'self'",
        "script-src 'self' " + " ".join(hashes),
        # React renders style="" attributes for sizing; those need
        # 'unsafe-inline'. Styles cannot run code, scripts stay hash-only.
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        f"object-src {embeds}",
        f"frame-src {embeds}",
        "base-uri 'self'",
        "form-action 'none'",
        "upgrade-insecure-requests",
    ]
    return "; ".join(directives)


def apply(path: Path) -> int:
    html = path.read_text(encoding="utf-8")
    html = EXISTING.sub("", html)
    match = CHARSET.search(html)
    if not match:
        raise SystemExit(f"error: no <meta charSet> in {path}, cannot place the CSP safely")
    content = policy(html).replace('"', "&quot;")
    tag = f'<meta http-equiv="Content-Security-Policy" content="{content}"/>'
    # Right after charset: before every <script>, and charset stays within
    # the first 1024 bytes where browsers look for it.
    html = html[: match.end()] + tag + html[match.end() :]
    path.write_text(html, encoding="utf-8")
    return len(INLINE_SCRIPT.findall(html))


def main() -> int:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "out"
    pages = sorted(out.rglob("*.html"))
    if not pages:
        print(f"error: no HTML files in {out}", file=sys.stderr)
        return 1
    scripts = sum(apply(page) for page in pages)
    print(f"csp: {len(pages)} page(s), {scripts} inline script(s) hashed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
