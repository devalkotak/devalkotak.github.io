#!/usr/bin/env python3
"""Sync content, build the static site, and publish it without GitHub Actions.

Runs the same three steps the old Actions workflow did, but on this machine:

  1. scripts/build_content.py pulls projects from GitHub and writeups,
     resources and the Optiverse page from Notion into content/generated.
  2. `next build` exports the site to out/.
  3. out/ is pushed as a single commit to the gh-pages branch, which GitHub
     Pages serves when its source is set to "Deploy from a branch".

Usage:
  python scripts/deploy.py                  sync, build, publish
  python scripts/deploy.py --dry-run        sync and build only, publish nothing
  python scripts/deploy.py --skip-content   rebuild from the committed content
  python scripts/deploy.py --commit-content also commit and push the refreshed
                                            content/generated to main
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "out"
PAGES_BRANCH = "gh-pages"


def main() -> int:
    args = parse_args()

    if not (ROOT / "node_modules").exists():
        step("installing dependencies (first run)")
        run([tool("npm"), "ci", "--no-audit", "--no-fund"])

    if args.skip_content:
        step("skipping content sync, using committed content")
    else:
        step("syncing content from GitHub and Notion")
        content_cmd = [sys.executable, str(ROOT / "scripts" / "build_content.py")]
        if args.commit_content:
            content_cmd += ["--push", "--message", "content: refresh from github/notion"]
        # build_content.py refuses to continue on a failed Notion query, so a
        # broken connection stops here instead of publishing stale writeups.
        run(content_cmd)

    step("building the static site")
    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    # next.config.mjs only switches to static export when NODE_ENV is production.
    run([tool("npx"), "next", "build"], env={**os.environ, "NODE_ENV": "production"})

    if not (OUT_DIR / "index.html").exists():
        print("error: build finished but out/index.html is missing", file=sys.stderr)
        return 1

    if args.dry_run:
        step(f"dry run: built site is in {OUT_DIR}, nothing published")
        return 0

    publish(args.remote)
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dry-run", action="store_true", help="sync and build, but do not publish")
    parser.add_argument("--skip-content", action="store_true", help="do not call GitHub or Notion")
    parser.add_argument(
        "--commit-content",
        action="store_true",
        help="commit and push refreshed content/generated to the current branch",
    )
    parser.add_argument("--remote", default="origin", help="git remote to publish to (default: origin)")
    return parser.parse_args()


def publish(remote: str) -> None:
    """Push out/ to gh-pages as one fresh commit.

    The branch only ever holds the latest build, so each deploy replaces it
    with a force push instead of growing a history of generated files.
    """
    remote_url = run(["git", "-C", str(ROOT), "remote", "get-url", remote], capture=True).strip()
    source = run(["git", "-C", str(ROOT), "rev-parse", "--short", "HEAD"], capture=True).strip()
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    step(f"publishing out/ to {remote}/{PAGES_BRANCH}")
    with tempfile.TemporaryDirectory(prefix="pages-") as tmp:
        site = Path(tmp) / "site"
        shutil.copytree(OUT_DIR, site)
        # Without this, Pages runs Jekyll and drops the _next/ folder, which
        # holds every script and stylesheet.
        (site / ".nojekyll").touch()

        git = ["git", "-C", str(site)]
        run([*git, "init", "-q", "-b", PAGES_BRANCH])
        run([*git, "add", "-A"])
        run([
            *git,
            "-c", "user.name=" + git_config("user.name"),
            "-c", "user.email=" + git_config("user.email"),
            "commit", "-q", "-m", f"Deploy {source} ({stamp})",
        ])
        run([*git, "push", "--force", "-q", remote_url, f"HEAD:{PAGES_BRANCH}"])

    step(f"published build of {source}. Pages picks it up within a minute or two.")


def git_config(key: str) -> str:
    return run(["git", "-C", str(ROOT), "config", key], capture=True).strip()


def tool(name: str) -> str:
    # On Windows npm and npx are .cmd shims that subprocess cannot find by bare name.
    found = shutil.which(name)
    if not found:
        sys.exit(f"error: {name} not found on PATH. Install Node.js 20 first.")
    return found


def run(cmd: list[str], *, capture: bool = False, env: dict[str, str] | None = None) -> str:
    result = subprocess.run(cmd, cwd=ROOT, capture_output=capture, text=True, env=env)
    if result.returncode != 0:
        if capture and result.stderr:
            print(result.stderr, file=sys.stderr)
        sys.exit(f"error: command failed ({result.returncode}): {' '.join(cmd[:3])} ...")
    return result.stdout if capture else ""


def step(message: str) -> None:
    print(f"\n==> {message}", flush=True)


if __name__ == "__main__":
    sys.exit(main())
