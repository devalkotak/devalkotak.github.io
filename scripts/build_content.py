#!/usr/bin/env python3
"""Generate static portfolio content from GitHub and Notion.

The Next.js app reads only the JSON files produced here. Network calls and API
shape handling stay in Python so the frontend remains a static renderer.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import re
import subprocess
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
GENERATED_DIR = ROOT / "content" / "generated"
WRITEUPS_DIR = GENERATED_DIR / "writeups"
MEDIA_DIR = ROOT / "public" / "notion-media"
MEDIA_ROUTE = "/notion-media"
GITHUB_REPOS_URL = "https://api.github.com/users/devalkotak/repos?per_page=100"

# Notion serves uploaded files from S3 behind a signature that expires in an
# hour. Baking those URLs into a static export means every image 404s shortly
# after the build, so anything on these hosts gets mirrored into public/ and
# served from this domain instead.
NOTION_FILE_HOSTS = (
    "prod-files-secure.s3.us-west-2.amazonaws.com",
    "s3.us-west-2.amazonaws.com",
    "secure.notion-static.com",
    "file.notion.so",
)
MEDIA_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif"}
MEDIA_MAX_BYTES = 20 * 1024 * 1024

# This site's own source and the profile README repo. Both are public and real,
# neither belongs in a list of projects.
HIDDEN_REPOS = {"devalkotak.github.io", "devalkotak"}
NOTION_PLACEHOLDER_SLUG = "notion-not-configured"
REQUEST_ATTEMPTS = 2
REQUEST_TIMEOUT_SECONDS = 30
ROLE_ALIASES = {
    "title": ["title", "name", "post", "article", "writeup"],
    # No "url" here. A lab's URL property points at the external lab, not at a
    # desired path, so treating it as a slug source turns every PortSwigger
    # writeup into /blog/https-portswigger-net-web-security-... Fall back to the
    # title instead, and use an explicit Slug property to override.
    "slug": ["slug", "urlslug", "path", "permalink"],
    "date": ["date", "published", "publisheddate", "posted", "created"],
    "category": ["category", "type", "topic", "area", "section"],
    "tags": ["tags", "tag", "topics", "labels", "keywords", "skills"],
    "published": ["published", "publish", "public", "live", "status", "state"],
    "description": ["description", "summary", "excerpt", "notes", "details"],
    "href": ["href", "url", "link", "website", "resource", "source"],
    "kind": ["kind", "type", "format", "resource", "category"],
}
PUBLISHED_VALUES = {
    "published",
    "publish",
    "public",
    "live",
    "done",
    "complete",
    "completed",
    "posted",
    "released",
    "ready",
}
UNPUBLISHED_VALUES = {
    "draft",
    "private",
    "idea",
    "ideas",
    "backlog",
    "todo",
    "notstarted",
    "notready",
    "wip",
}


def main() -> int:
    args = parse_args()

    protected_env = set(os.environ)
    loaded_env: set[str] = set()
    load_local_env(ROOT / ".env", protected_env, loaded_env)
    load_local_env(ROOT / ".env.local", protected_env, loaded_env, override_loaded=True)
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)

    generated_at = utc_now()
    projects_payload = build_projects_payload(generated_at)
    writeups_payload, details, replace_writeup_details = build_writeups_payload(generated_at)
    resources_payload = build_resources_payload(generated_at)
    optiverse_payload = build_optiverse_payload(generated_at)

    # Deploying committed content after a failed Notion query silently undoes
    # edits made since that snapshot: unchecking Status or deleting a page is
    # reverted, and the writeup goes back up. Pages keeps the last successful
    # deployment, so failing here leaves the site in its correct state instead
    # of overwriting it with resurrected content. Nothing is written either, so
    # a failed run cannot clobber the good snapshot on disk.
    if writeups_payload.get("error") and not env_bool("ALLOW_STALE_CONTENT", False):
        print(
            "error: refusing to build with stale writeups (see the warning above).\n"
            "  The last successful deploy stays live. Fix the Notion connection and\n"
            "  rebuild, or set ALLOW_STALE_CONTENT=true to deploy the committed\n"
            "  snapshot anyway, which can republish anything unpublished since then.",
            file=sys.stderr,
        )
        return 1

    write_json(GENERATED_DIR / "projects.json", projects_payload)
    write_json(GENERATED_DIR / "writeups.json", writeups_payload)
    write_json(GENERATED_DIR / "resources.json", resources_payload)
    write_json(GENERATED_DIR / "optiverse.json", optiverse_payload)

    if replace_writeup_details:
        reset_writeups_dir()
        for detail in details:
            write_json(WRITEUPS_DIR / f"{detail['slug']}.json", detail)

        if not any(detail["slug"] == NOTION_PLACEHOLDER_SLUG for detail in details):
            write_json(WRITEUPS_DIR / f"{NOTION_PLACEHOLDER_SLUG}.json", placeholder_writeup())

    pruned = prune_media()
    mirrored = sum(1 for path in MEDIA_DIR.glob("*") if path.is_file()) if MEDIA_DIR.exists() else 0

    print(
        "generated content: "
        f"{len(projects_payload['projects'])} project(s), "
        f"{len(writeups_payload['writeups'])} writeup(s), "
        f"{len(resources_payload['resources'])} resource(s), "
        f"{mirrored} image(s)"
    )

    if pruned:
        print(f"pruned {pruned} unreferenced image(s)")

    for failure in MEDIA_FAILURES:
        print(f"warning: image not mirrored, keeping expiring URL: {failure}", file=sys.stderr)

    if args.push:
        return push_content(args)
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--push",
        action="store_true",
        help="commit and push content/generated after building, if it changed",
    )
    parser.add_argument(
        "--remote",
        default="origin",
        help="git remote to push to (default: origin)",
    )
    parser.add_argument(
        "--branch",
        default=None,
        help="git branch to push (default: current branch)",
    )
    parser.add_argument(
        "--message",
        default="content: refresh from github/notion",
        help="commit message to use when pushing",
    )
    return parser.parse_args()


def push_content(args: argparse.Namespace) -> int:
    # Mirrored images ship with the JSON that references them. Splitting the two
    # would leave the cached-content fallback pointing at files that were never
    # committed.
    tracked = ["content/generated", "public/notion-media"]
    run_git(["add", "--", *tracked])

    diff = subprocess.run(
        ["git", "-C", str(ROOT), "diff", "--cached", "--quiet", "--", *tracked],
    )
    if diff.returncode == 0:
        print("no content changes, nothing to push")
        return 0

    run_git(["commit", "-m", args.message, "--", *tracked])

    branch = args.branch or run_git(
        ["rev-parse", "--abbrev-ref", "HEAD"], capture=True
    ).strip()
    run_git(["push", args.remote, branch])
    print(f"pushed content update to {args.remote}/{branch}")
    return 0


def run_git(git_args: list[str], *, capture: bool = False) -> str:
    result = subprocess.run(
        ["git", "-C", str(ROOT), *git_args],
        capture_output=capture,
        text=True,
        check=True,
    )
    return result.stdout if capture else ""


def load_local_env(
    path: Path,
    protected_env: set[str],
    loaded_env: set[str],
    *,
    override_loaded: bool = False,
) -> None:
    if not path.exists():
        return

    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue

        key, value = stripped.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if not key or key in protected_env:
            continue

        if key not in os.environ or (override_loaded and key in loaded_env):
            os.environ[key] = value
            loaded_env.add(key)


def reset_writeups_dir() -> None:
    if WRITEUPS_DIR.exists():
        shutil.rmtree(WRITEUPS_DIR)
    WRITEUPS_DIR.mkdir(parents=True, exist_ok=True)


def build_projects_payload(generated_at: str) -> dict[str, Any]:
    try:
        repos = request_json(
            GITHUB_REPOS_URL,
            headers=github_headers(),
        )
        projects = [
            normalize_repo(repo)
            for repo in repos
            if not repo.get("fork")
            and not repo.get("archived")
            and repo.get("name") not in HIDDEN_REPOS
        ]
        projects.sort(key=lambda item: item["pushedAt"], reverse=True)

        return {
            "generatedAt": generated_at,
            "error": None,
            "projects": projects,
        }
    except ContentFetchError as error:
        return {
            "generatedAt": generated_at,
            "error": str(error),
            "projects": [],
        }


def github_headers() -> dict[str, str]:
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "devalkotak-github-io-content-builder",
    }
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def normalize_repo(repo: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(repo.get("id", "")),
        "name": repo.get("name") or "untitled",
        "description": repo.get("description") or "No description provided.",
        "url": repo.get("html_url") or "https://github.com/devalkotak",
        "language": repo.get("language"),
        "stars": repo.get("stargazers_count") or 0,
        "pushedAt": repo.get("pushed_at") or "",
        "topics": repo.get("topics") or [],
    }


def build_writeups_payload(
    generated_at: str,
) -> tuple[dict[str, Any], list[dict[str, Any]], bool]:
    token = os.environ.get("NOTION_API_KEY")
    source_id = os.environ.get("NOTION_DATA_SOURCE_ID") or os.environ.get(
        "NOTION_DATABASE_ID"
    )

    if not token or not source_id:
        return {
            "generatedAt": generated_at,
            "error": None,
            "writeups": [],
        }, [placeholder_writeup()], True

    try:
        pages, notion_version = query_notion_pages(token, source_id)
        require_published = env_bool("NOTION_REQUIRE_PUBLISHED", False)
        # Defaults on: the cache is a failure fallback, not a normal-path
        # shortcut. Reusing it by default meant edits in Notion never reached
        # the site and mirrored images were never refreshed. A Notion error
        # still falls back to the cached blocks per page, below.
        refresh_writeup_details = env_bool("NOTION_REFRESH_WRITEUP_DETAILS", True)
        summaries: list[dict[str, Any]] = []
        details: list[dict[str, Any]] = []
        cached_detail_slugs: list[str] = []
        used_slugs: set[str] = set()

        for page in pages:
            summary = normalize_notion_page(page, used_slugs, require_published)
            if not summary:
                continue

            cached_detail = read_existing_writeup_detail(summary["slug"])
            if cached_detail and not refresh_writeup_details:
                summaries.append(summary)
                details.append({
                    **summary,
                    "blocks": cached_detail.get("blocks") or [],
                })
                cached_detail_slugs.append(summary["slug"])
                continue

            try:
                blocks = fetch_notion_blocks(token, notion_version, summary["id"])
                detail = {**summary, "blocks": blocks}
            except ContentFetchError:
                if not cached_detail:
                    raise
                detail = {
                    **summary,
                    "blocks": cached_detail.get("blocks") or [],
                }
                cached_detail_slugs.append(summary["slug"])

            summaries.append(summary)
            details.append(detail)

        summaries.sort(key=lambda item: item["date"], reverse=True)
        details.sort(key=lambda item: item["date"], reverse=True)

        payload = {
            "generatedAt": generated_at,
            "error": None,
            "writeups": summaries,
        }
        if cached_detail_slugs:
            payload["warnings"] = [
                "used cached detail blocks for: " + ", ".join(cached_detail_slugs)
            ]
            print(
                "warning: Notion blocks unavailable, served from cache for: "
                + ", ".join(cached_detail_slugs),
                file=sys.stderr,
            )

        return payload, details or [placeholder_writeup()], True
    except ContentFetchError as error:
        # Falling back to committed content keeps a deploy from going blank, but
        # it also means the site silently serves whatever it shipped last. Say so
        # loudly: a quiet fallback here is indistinguishable from a healthy build.
        print(f"warning: Notion writeup query failed: {error}", file=sys.stderr)

        previous_writeups = read_existing_rows(
            GENERATED_DIR / "writeups.json",
            "writeups",
        )
        if previous_writeups and writeup_details_exist(previous_writeups):
            print(
                f"warning: serving {len(previous_writeups)} writeup(s) from committed "
                "content; edits in Notion and image mirroring are both skipped",
                file=sys.stderr,
            )
            return {
                "generatedAt": generated_at,
                "error": str(error),
                "writeups": previous_writeups,
            }, [], False

        return {
            "generatedAt": generated_at,
            "error": str(error),
            "writeups": [],
        }, [placeholder_writeup()], True


def build_resources_payload(generated_at: str) -> dict[str, Any]:
    token = os.environ.get("NOTION_API_KEY")
    source_id = (
        os.environ.get("NOTION_RESOURCES_DATA_SOURCE_ID")
        or os.environ.get("NOTION_RESOURCES_DATABASE_ID")
        or os.environ.get("NOTION_TOOLS_DATA_SOURCE_ID")
        or os.environ.get("NOTION_TOOLS_DATABASE_ID")
    )

    if not token or not source_id:
        return {
            "generatedAt": generated_at,
            "error": None,
            "resources": [],
        }

    try:
        pages, _ = query_notion_pages(token, source_id)
        require_published = env_bool(
            "NOTION_RESOURCES_REQUIRE_PUBLISHED",
            env_bool("NOTION_TOOLS_REQUIRE_PUBLISHED", False),
        )
        resources: list[dict[str, Any]] = []
        used_ids: set[str] = set()

        for page in pages:
            resource = normalize_resource_page(page, used_ids, require_published)
            if resource:
                resources.append(resource)

        resources.sort(key=resource_sort_key)

        return {
            "generatedAt": generated_at,
            "error": None,
            "resources": resources,
        }
    except ContentFetchError as error:
        previous_resources = read_existing_rows(
            GENERATED_DIR / "resources.json",
            "resources",
        )
        return {
            "generatedAt": generated_at,
            "error": str(error),
            "resources": previous_resources,
        }


def build_optiverse_payload(generated_at: str) -> dict[str, Any]:
    token = os.environ.get("NOTION_API_KEY")
    page_id = os.environ.get("NOTION_OPTIVERSE_PAGE_ID")

    if not token or not page_id:
        return {
            "generatedAt": generated_at,
            "error": None,
            "title": None,
            "blocks": [],
        }

    try:
        page = None
        notion_version = "2022-06-28"
        for version in ("2022-06-28", "2025-09-03"):
            try:
                page = request_json(
                    f"https://api.notion.com/v1/pages/{page_id}",
                    headers=notion_headers(token, version),
                )
                notion_version = version
                break
            except ContentFetchError as error:
                last_error = error
        if page is None:
            raise last_error or ContentFetchError("Notion page fetch failed")

        title_property = next(
            (
                value
                for value in (page.get("properties") or {}).values()
                if isinstance(value, dict) and value.get("type") == "title"
            ),
            None,
        )
        title = property_text(title_property) or None
        blocks = fetch_notion_blocks(token, notion_version, page_id)

        return {
            "generatedAt": generated_at,
            "error": None,
            "title": title,
            "blocks": blocks,
        }
    except ContentFetchError as error:
        previous = read_existing_optiverse()
        if previous:
            return {
                "generatedAt": generated_at,
                "error": str(error),
                "title": previous.get("title"),
                "blocks": previous.get("blocks") or [],
            }
        return {
            "generatedAt": generated_at,
            "error": str(error),
            "title": None,
            "blocks": [],
        }


def read_existing_optiverse() -> dict[str, Any] | None:
    try:
        payload = json.loads((GENERATED_DIR / "optiverse.json").read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return None
    if not isinstance(payload, dict) or not isinstance(payload.get("blocks"), list):
        return None
    return payload


def query_notion_pages(
    token: str,
    source_id: str,
) -> tuple[list[dict[str, Any]], str]:
    body = {"page_size": 100}

    attempts = [
        (
            f"https://api.notion.com/v1/data_sources/{source_id}/query",
            "2025-09-03",
        ),
        (
            f"https://api.notion.com/v1/databases/{source_id}/query",
            "2022-06-28",
        ),
    ]

    # Report every attempt. Surfacing only the last one hides the modern
    # data_sources error behind a legacy databases 404, which is misleading
    # when the id is a data source id and the legacy endpoint could never
    # have matched it.
    failures: list[str] = []
    for url, version in attempts:
        try:
            return paginate_notion_query(token, version, url, body), version
        except ContentFetchError as error:
            failures.append(f"[{version}] {error}")

    raise ContentFetchError(
        "Notion query failed; tried " + " | ".join(failures)
        if failures
        else "Notion query failed"
    )


def paginate_notion_query(
    token: str,
    notion_version: str,
    url: str,
    body: dict[str, Any],
) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    cursor: str | None = None

    while True:
        request_body = dict(body)
        if cursor:
            request_body["start_cursor"] = cursor

        payload = request_json(
            url,
            method="POST",
            headers=notion_headers(token, notion_version),
            body=request_body,
        )
        results.extend(payload.get("results", []))

        if not payload.get("has_more"):
            return results

        cursor = payload.get("next_cursor")
        if not cursor:
            return results


def fetch_notion_blocks(
    token: str,
    notion_version: str,
    block_id: str,
) -> list[dict[str, Any]]:
    blocks: list[dict[str, Any]] = []
    cursor: str | None = None

    while True:
        query = {"page_size": "100"}
        if cursor:
            query["start_cursor"] = cursor

        url = (
            f"https://api.notion.com/v1/blocks/{block_id}/children?"
            f"{urllib.parse.urlencode(query)}"
        )
        payload = request_json(
            url,
            headers=notion_headers(token, notion_version),
        )

        for block in payload.get("results", []):
            normalized = normalize_notion_block(block)
            if not normalized:
                continue
            if block.get("has_children"):
                normalized["children"] = fetch_notion_blocks(
                    token,
                    notion_version,
                    block.get("id", ""),
                )
            blocks.append(normalized)

        if not payload.get("has_more"):
            return blocks

        cursor = payload.get("next_cursor")
        if not cursor:
            return blocks


def notion_headers(token: str, notion_version: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Notion-Version": notion_version,
        "User-Agent": "devalkotak-github-io-content-builder",
    }


def normalize_notion_page(
    page: dict[str, Any],
    used_slugs: set[str],
    require_published: bool,
) -> dict[str, Any] | None:
    properties = page.get("properties") or {}

    publish_property = choose_property(
        properties,
        "published",
        preferred_types={"checkbox", "select", "status", "rich_text"},
        fallback_to_type=False,
    )
    if publish_property:
        _, property_value = publish_property
        if not property_is_published(property_value):
            return None
    elif require_published:
        return None

    title = property_text(
        property_from_choice(
            choose_property(
                properties,
                "title",
                preferred_types={"title"},
                fallback_to_type=True,
            )
        )
    )

    if not title:
        return None

    slug = property_text(
        property_from_choice(
            choose_property(
                properties,
                "slug",
                preferred_types={"rich_text", "url", "title"},
                fallback_to_type=False,
            )
        )
    )
    slug = unique_slug(slugify(slug or title), used_slugs)
    date = page_date(page, properties)
    category = property_text(
        property_from_choice(
            choose_property(
                properties,
                "category",
                preferred_types={"select", "status", "rich_text"},
                fallback_to_type=True,
            )
        )
    )
    tags = property_tags(
        property_from_choice(
            choose_property(
                properties,
                "tags",
                preferred_types={"multi_select", "select", "rich_text"},
                fallback_to_type=False,
            )
        )
    )

    return {
        "id": page.get("id") or slug,
        "title": title,
        "slug": slug,
        "date": date,
        "category": category or "Writing",
        "tags": tags,
        "properties": normalize_extra_properties(properties),
    }


def normalize_resource_page(
    page: dict[str, Any],
    used_ids: set[str],
    require_published: bool,
) -> dict[str, Any] | None:
    properties = page.get("properties") or {}

    publish_property = choose_property(
        properties,
        "published",
        preferred_types={"checkbox", "select", "status", "rich_text"},
        fallback_to_type=False,
        env_prefix=("NOTION_RESOURCES", "NOTION_TOOLS"),
    )
    if publish_property:
        _, property_value = publish_property
        if not property_is_published(property_value):
            return None
    elif require_published:
        return None

    title = property_text(
        property_from_choice(
            choose_property(
                properties,
                "title",
                preferred_types={"title"},
                fallback_to_type=True,
                env_prefix=("NOTION_RESOURCES", "NOTION_TOOLS"),
            )
        )
    )
    if not title:
        return None

    slug = property_text(
        property_from_choice(
            choose_property(
                properties,
                "slug",
                preferred_types={"rich_text", "url", "title"},
                fallback_to_type=False,
                env_prefix=("NOTION_RESOURCES", "NOTION_TOOLS"),
            )
        )
    )
    resource_id = unique_slug(slugify(slug or title), used_ids)
    description = property_text(
        property_from_choice(
            choose_property(
                properties,
                "description",
                preferred_types={"rich_text", "title"},
                fallback_to_type=False,
                env_prefix=("NOTION_RESOURCES", "NOTION_TOOLS"),
            )
        )
    )
    href = property_text(
        property_from_choice(
            choose_property(
                properties,
                "href",
                preferred_types={"url", "rich_text", "title"},
                fallback_to_type=False,
                env_prefix=("NOTION_RESOURCES", "NOTION_TOOLS"),
            )
        )
    )
    kind = property_text(
        property_from_choice(
            choose_property(
                properties,
                "kind",
                preferred_types={"select", "status", "rich_text"},
                fallback_to_type=True,
                env_prefix=("NOTION_RESOURCES", "NOTION_TOOLS"),
            )
        )
    )
    category = property_text(
        property_from_choice(
            choose_property(
                properties,
                "category",
                preferred_types={"select", "status", "rich_text"},
                fallback_to_type=False,
                env_prefix=("NOTION_RESOURCES", "NOTION_TOOLS"),
            )
        )
    )
    tags = property_tags(
        property_from_choice(
            choose_property(
                properties,
                "tags",
                preferred_types={"multi_select", "select", "rich_text"},
                fallback_to_type=False,
                env_prefix=("NOTION_RESOURCES", "NOTION_TOOLS"),
            )
        )
    )

    return {
        "id": resource_id,
        "title": title,
        "description": description or "No description provided.",
        "href": href or None,
        "kind": kind or "resource",
        "category": category or kind or "Resource",
        "tags": tags,
        "date": page_date(
            page,
            properties,
            env_prefix=("NOTION_RESOURCES", "NOTION_TOOLS"),
        ),
        "source": "notion",
        "properties": normalize_extra_properties(properties),
    }


def normalize_notion_block(block: dict[str, Any]) -> dict[str, Any] | None:
    block_type = block.get("type")
    typed = block.get(block_type) if block_type else None

    if not block.get("id") or not isinstance(typed, dict):
        return None

    normalized: dict[str, Any] = {
        "id": block["id"],
        "type": block_type,
    }

    if "rich_text" in typed:
        normalized["richText"] = rich_text_array(typed.get("rich_text"))

    if "language" in typed:
        normalized["language"] = typed.get("language")

    if "is_toggleable" in typed:
        normalized["isToggleable"] = typed.get("is_toggleable") is True

    if block_type == "image":
        url = image_url(typed)
        if url:
            normalized["url"] = mirror_media(url)

    if block_type == "table":
        normalized["hasColumnHeader"] = typed.get("has_column_header") is True

    if block_type == "table_row":
        cells = typed.get("cells") or []
        if isinstance(cells, list):
            normalized["cells"] = [rich_text_array(cell) for cell in cells]

    return normalized


def page_date(
    page: dict[str, Any],
    properties: dict[str, Any],
    *,
    env_prefix: str | tuple[str, ...] = "NOTION",
) -> str:
    choice = choose_property(
        properties,
        "date",
        preferred_types={"date", "created_time", "last_edited_time"},
        fallback_to_type=True,
        env_prefix=env_prefix,
    )
    date = property_date(property_from_choice(choice))
    if date:
        return date

    created = page.get("created_time")
    if isinstance(created, str):
        return created[:10]

    return utc_now()[:10]


def choose_property(
    properties: dict[str, Any],
    role: str,
    *,
    preferred_types: set[str],
    fallback_to_type: bool,
    env_prefix: str | tuple[str, ...] = "NOTION",
) -> tuple[str, dict[str, Any]] | None:
    env_prefixes = (env_prefix,) if isinstance(env_prefix, str) else env_prefix
    for prefix in env_prefixes:
        override = os.environ.get(f"{prefix}_{role.upper()}_PROPERTY")
        if override and override in properties:
            property_value = properties[override]
            if isinstance(property_value, dict):
                return override, property_value

    aliases = {normalize_key(alias) for alias in ROLE_ALIASES[role]}
    matches: list[tuple[int, str, dict[str, Any]]] = []
    type_matches: list[tuple[str, dict[str, Any]]] = []

    for name, property_value in properties.items():
        if not isinstance(property_value, dict):
            continue

        property_type = property_value.get("type")
        if property_type in preferred_types:
            type_matches.append((name, property_value))

        normalized = normalize_key(name)
        if property_type not in preferred_types:
            continue

        score = 0
        if normalized in aliases:
            score += 100
        elif any(alias in normalized for alias in aliases):
            score += 50

        if score:
            matches.append((score, name, property_value))

    if matches:
        matches.sort(key=lambda item: item[0], reverse=True)
        return matches[0][1], matches[0][2]

    if fallback_to_type and type_matches:
        return type_matches[0]

    return None


def property_from_choice(choice: tuple[str, dict[str, Any]] | None) -> dict[str, Any] | None:
    return choice[1] if choice else None


def property_text(property_value: dict[str, Any] | None) -> str:
    if not property_value:
        return ""

    property_type = property_value.get("type")
    if property_type == "title":
        return rich_text_plain(property_value.get("title"))
    if property_type == "rich_text":
        return rich_text_plain(property_value.get("rich_text"))
    if property_type == "select":
        return ((property_value.get("select") or {}).get("name") or "").strip()
    if property_type == "status":
        return ((property_value.get("status") or {}).get("name") or "").strip()
    if property_type == "url":
        return (property_value.get("url") or "").strip()
    if property_type in {"email", "phone_number"}:
        return (property_value.get(property_type) or "").strip()
    if property_type == "number":
        number = property_value.get("number")
        return "" if number is None else str(number)
    if property_type in {"created_time", "last_edited_time"}:
        return (property_value.get(property_type) or "")[:10]
    if property_type == "date":
        return property_date(property_value)

    return ""


def property_date(property_value: dict[str, Any] | None) -> str:
    if not property_value:
        return ""

    property_type = property_value.get("type")
    if property_type == "date":
        date = property_value.get("date") or {}
        start = date.get("start") or ""
        return start[:10]
    if property_type in {"created_time", "last_edited_time"}:
        return (property_value.get(property_type) or "")[:10]

    return ""


def property_tags(property_value: dict[str, Any] | None) -> list[str]:
    if not property_value:
        return []

    property_type = property_value.get("type")
    if property_type == "multi_select":
        values = property_value.get("multi_select") or []
        return [item.get("name") for item in values if item.get("name")]
    if property_type in {"select", "status", "rich_text"}:
        text = property_text(property_value)
        if not text:
            return []
        return [part.strip() for part in re.split(r"[,#]", text) if part.strip()]

    return []


def property_is_published(property_value: dict[str, Any]) -> bool:
    property_type = property_value.get("type")
    if property_type == "checkbox":
        return property_value.get("checkbox") is True

    value = normalize_key(property_text(property_value))
    if not value:
        return False
    if value in UNPUBLISHED_VALUES:
        return False
    return value in PUBLISHED_VALUES


def normalize_extra_properties(
    properties: dict[str, Any],
) -> dict[str, str | list[str] | int | float | bool | None]:
    normalized: dict[str, str | list[str] | int | float | bool | None] = {}
    for name, property_value in properties.items():
        if not isinstance(property_value, dict):
            continue

        property_type = property_value.get("type")
        if property_type == "checkbox":
            normalized[name] = property_value.get("checkbox") is True
        elif property_type == "multi_select":
            normalized[name] = property_tags(property_value)
        elif property_type == "number":
            normalized[name] = property_value.get("number")
        else:
            text = property_text(property_value)
            normalized[name] = text or None
    return normalized


def slugify(value: str) -> str:
    ascii_value = (
        unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    )
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_value).strip("-").lower()
    return slug or "writeup"


def unique_slug(slug: str, used_slugs: set[str]) -> str:
    candidate = slug
    counter = 2
    while candidate in used_slugs:
        candidate = f"{slug}-{counter}"
        counter += 1
    used_slugs.add(candidate)
    return candidate


def normalize_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def env_bool(name: str, default: bool) -> bool:
    value = os.environ.get(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def rich_text_plain(value: Any) -> str:
    return "".join(part["plainText"] for part in rich_text_array(value)).strip()


def rich_text_array(value: Any) -> list[dict[str, Any]]:
    if not isinstance(value, list):
        return []

    parts: list[dict[str, Any]] = []
    for item in value:
        annotations = item.get("annotations") or {}
        parts.append(
            {
                "plainText": item.get("plain_text") or "",
                "href": item.get("href"),
                "bold": annotations.get("bold") is True,
                "italic": annotations.get("italic") is True,
                "code": annotations.get("code") is True,
            }
        )
    return parts


def image_url(value: dict[str, Any]) -> str | None:
    external = value.get("external") or {}
    file_value = value.get("file") or {}
    return external.get("url") or file_value.get("url")


# Hosts that refused to serve. A failed download leaves the signed URL in place
# rather than breaking the page outright.
MEDIA_FAILURES: list[str] = []
MEDIA_REFERENCE_PATTERN = re.compile(rf"{MEDIA_ROUTE}/([A-Za-z0-9]+\.[A-Za-z0-9]+)")


def mirror_media(url: str) -> str:
    """Copy a Notion-hosted file into public/ and return its local route.

    URLs that are not Notion-signed are returned untouched, so images embedded
    by external URL keep pointing wherever they already point.
    """
    parsed = urllib.parse.urlparse(url)
    if parsed.hostname not in NOTION_FILE_HOSTS:
        return url

    # The signature lives in the query string and changes every fetch. Keying
    # on the path alone keeps the local filename stable across builds.
    stable_key = f"{parsed.hostname}{parsed.path}"
    digest = hashlib.sha256(stable_key.encode("utf-8")).hexdigest()[:16]

    suffix = Path(urllib.parse.unquote(parsed.path)).suffix.lower()
    if suffix not in MEDIA_EXTENSIONS:
        suffix = ".png"

    filename = f"{digest}{suffix}"
    destination = MEDIA_DIR / filename
    route = f"{MEDIA_ROUTE}/{filename}"

    if destination.exists():
        return route

    try:
        payload = request_bytes(url)
    except ContentFetchError as error:
        MEDIA_FAILURES.append(str(error))
        return url

    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix(destination.suffix + ".part")
    temporary.write_bytes(payload)
    temporary.replace(destination)

    return route


def prune_media() -> int:
    """Delete mirrored files that no generated JSON points at.

    References are read back off disk rather than collected during download, so
    images carried over from cached content still count as live. Skipped
    entirely when a download failed, since a partial run cannot tell an orphan
    from a file it simply did not reach.
    """
    if MEDIA_FAILURES or not MEDIA_DIR.exists():
        return 0

    referenced: set[str] = set()
    for path in GENERATED_DIR.rglob("*.json"):
        referenced.update(
            MEDIA_REFERENCE_PATTERN.findall(path.read_text(encoding="utf-8"))
        )

    removed = 0
    for path in MEDIA_DIR.iterdir():
        if path.is_file() and path.name not in referenced:
            path.unlink()
            removed += 1

    return removed


def request_bytes(url: str) -> bytes:
    last_error: urllib.error.URLError | TimeoutError | None = None

    for attempt in range(REQUEST_ATTEMPTS):
        request = urllib.request.Request(url, method="GET")

        try:
            with urllib.request.urlopen(
                request,
                timeout=REQUEST_TIMEOUT_SECONDS,
            ) as response:
                payload = response.read(MEDIA_MAX_BYTES + 1)
                if len(payload) > MEDIA_MAX_BYTES:
                    raise ContentFetchError(
                        f"{url} is larger than {MEDIA_MAX_BYTES} bytes"
                    )
                return payload
        except urllib.error.HTTPError as error:
            raise ContentFetchError(f"{url} returned {error.code}") from error
        except (urllib.error.URLError, TimeoutError) as error:
            last_error = error
            if attempt < REQUEST_ATTEMPTS - 1:
                continue

    raise ContentFetchError(f"{url} failed: {last_error}")


def resource_sort_key(resource: dict[str, Any]) -> tuple[str, str]:
    return (resource.get("kind") or "", resource.get("title") or "")


def placeholder_writeup() -> dict[str, Any]:
    return {
        "id": "notion-placeholder",
        "title": "Notion writeups are not configured",
        "slug": NOTION_PLACEHOLDER_SLUG,
        "date": "2026-06-30",
        "category": "System",
        "tags": ["notion", "static-export"],
        "blocks": [
            {
                "id": "notion-placeholder-body",
                "type": "paragraph",
                "richText": [
                    {
                        "plainText": (
                            "This unlinked page exists so Next.js static export can "
                            "build the dynamic writeup route before Notion credentials "
                            "are configured."
                        ),
                        "href": None,
                        "bold": False,
                        "italic": False,
                        "code": False,
                    }
                ],
            }
        ],
    }


def request_json(
    url: str,
    *,
    method: str = "GET",
    headers: dict[str, str] | None = None,
    body: dict[str, Any] | None = None,
) -> Any:
    encoded_body = None
    if body is not None:
        encoded_body = json.dumps(body).encode("utf-8")

    last_error: urllib.error.URLError | TimeoutError | None = None

    for attempt in range(REQUEST_ATTEMPTS):
        request = urllib.request.Request(
            url,
            data=encoded_body,
            method=method,
            headers=headers or {},
        )

        try:
            with urllib.request.urlopen(
                request,
                timeout=REQUEST_TIMEOUT_SECONDS,
            ) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as error:
            message = error.read().decode("utf-8", errors="replace")
            raise ContentFetchError(f"{url} returned {error.code}: {message}") from error
        except json.JSONDecodeError as error:
            raise ContentFetchError(f"{url} failed: {error}") from error
        except (urllib.error.URLError, TimeoutError) as error:
            last_error = error
            if attempt < REQUEST_ATTEMPTS - 1:
                continue

    raise ContentFetchError(f"{url} failed: {last_error}")


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def read_existing_rows(path: Path, rows_key: str) -> list[dict[str, Any]]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return []

    rows = payload.get(rows_key)
    if not isinstance(rows, list):
        return []

    return [row for row in rows if isinstance(row, dict)]


def read_existing_writeup_detail(slug: str) -> dict[str, Any] | None:
    try:
        payload = json.loads((WRITEUPS_DIR / f"{slug}.json").read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return None

    if not isinstance(payload, dict) or not isinstance(payload.get("blocks"), list):
        return None
    return payload


def writeup_details_exist(writeups: list[dict[str, Any]]) -> bool:
    for writeup in writeups:
        slug = writeup.get("slug")
        if not isinstance(slug, str) or not slug:
            return False
        if not (WRITEUPS_DIR / f"{slug}.json").exists():
            return False
    return True


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


class ContentFetchError(RuntimeError):
    pass


if __name__ == "__main__":
    sys.exit(main())
