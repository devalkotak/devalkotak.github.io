#!/usr/bin/env python3
"""Inspect generated static content without exposing credentials."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
GENERATED_DIR = ROOT / "content" / "generated"
WRITEUPS_DIR = GENERATED_DIR / "writeups"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--strict",
        action="store_true",
        help="exit with a non-zero status when generated content has errors",
    )
    args = parser.parse_args()

    problems: list[str] = []
    projects = read_json(GENERATED_DIR / "projects.json", problems)
    writeups = read_json(GENERATED_DIR / "writeups.json", problems)
    resources = read_json(GENERATED_DIR / "resources.json", problems)

    print_section(
        "projects",
        projects,
        "projects",
        extra=[
            ("languages", unique_values(projects.get("projects", []), "language")),
            ("topics", unique_list_values(projects.get("projects", []), "topics")),
        ],
        problems=problems,
    )
    print_section(
        "writeups",
        writeups,
        "writeups",
        extra=[
            ("categories", unique_values(writeups.get("writeups", []), "category")),
            ("tags", unique_list_values(writeups.get("writeups", []), "tags")),
            ("detail files", [str(count_writeup_details())]),
        ],
        problems=problems,
    )
    print_section(
        "resources",
        resources,
        "resources",
        extra=[
            ("kinds", unique_values(resources.get("resources", []), "kind")),
            ("categories", unique_values(resources.get("resources", []), "category")),
            ("tags", unique_list_values(resources.get("resources", []), "tags")),
        ],
        problems=problems,
    )

    validate_rows(writeups.get("writeups", []), ["id", "title", "slug", "date"], "writeup", problems)
    validate_rows(resources.get("resources", []), ["id", "title", "description", "kind", "category"], "resource", problems)

    if problems:
        print("\nproblems")
        for problem in problems:
            print(f"- {problem}")

    return 1 if args.strict and problems else 0


def read_json(path: Path, problems: list[str]) -> dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        problems.append(f"missing {path.relative_to(ROOT)}")
    except json.JSONDecodeError as error:
        problems.append(f"invalid json in {path.relative_to(ROOT)}: {error}")
    return {}


def print_section(
    label: str,
    payload: dict[str, Any],
    rows_key: str,
    *,
    extra: list[tuple[str, list[str]]],
    problems: list[str],
) -> None:
    rows = payload.get(rows_key, [])
    if not isinstance(rows, list):
        rows = []
        problems.append(f"{rows_key} payload is not a list")

    print(f"\n{label}")
    print(f"- generated: {payload.get('generatedAt') or 'unknown'}")
    print(f"- count: {len(rows)}")
    if payload.get("error"):
        print(f"- source error: {payload['error']}")
        problems.append(f"{label} source error")
    warnings = payload.get("warnings")
    if isinstance(warnings, list):
        for warning in warnings:
            print(f"- warning: {warning}")

    for name, values in extra:
        print(f"- {name}: {', '.join(values) if values else 'none'}")


def validate_rows(
    rows: Any,
    fields: list[str],
    label: str,
    problems: list[str],
) -> None:
    if not isinstance(rows, list):
        return

    seen: set[str] = set()
    for index, row in enumerate(rows, 1):
        if not isinstance(row, dict):
            problems.append(f"{label} #{index} is not an object")
            continue

        row_id = str(row.get("id") or f"#{index}")
        if row_id in seen:
            problems.append(f"duplicate {label} id: {row_id}")
        seen.add(row_id)

        for field in fields:
            if row.get(field) in (None, ""):
                problems.append(f"{label} {row_id} missing {field}")


def unique_values(rows: Any, key: str) -> list[str]:
    if not isinstance(rows, list):
        return []
    values = {str(row.get(key)) for row in rows if isinstance(row, dict) and row.get(key)}
    return sorted(values, key=str.lower)


def unique_list_values(rows: Any, key: str) -> list[str]:
    if not isinstance(rows, list):
        return []

    values: set[str] = set()
    for row in rows:
        if not isinstance(row, dict):
            continue
        row_values = row.get(key)
        if not isinstance(row_values, list):
            continue
        values.update(str(value) for value in row_values if value)

    return sorted(values, key=str.lower)


def count_writeup_details() -> int:
    if not WRITEUPS_DIR.exists():
        return 0
    return len(list(WRITEUPS_DIR.glob("*.json")))


if __name__ == "__main__":
    sys.exit(main())
