#!/usr/bin/env python3
"""validate_skill.py: structural and metadata validation for the Weftline repository.

Checks (mapped to the project's stated validation requirements):
  1. Repository structure: required files exist and are non-empty; no
     unexpected top-level entries.
  2. SKILL.md frontmatter: present, parsable, and compliant with the Agent
     Skills specification rules verified on 2026-10-19 (name: 1-64 chars,
     lowercase a-z 0-9 and hyphens only, no leading/trailing/consecutive
     hyphens, must match the parent directory name; description: 1-1024
     chars; compatibility: max 500 chars if present; metadata: string map).
  3. SKILL.md body length: under 500 lines (specification recommendation).
  4. Internal links in SKILL.md and README.md resolve to real files; SKILL.md
     references stay one level deep as the specification recommends.
  5. Consistency: repository directory name equals the frontmatter name;
     README mentions the project name, both maintainers, and the license.
  6. Compatibility documentation carries explicit verification labels.
  7. Examples use the method's vocabulary (passes and tiers).
  8. CI workflow exists, triggers on push/pull_request, and runs this script.
  9. No committed secrets (pattern scan over text files).
 10. Editorial rules: no em dashes, no emoji, no placeholder text in authored
     markdown.

Limitations (honest, by design): frontmatter is parsed with a minimal YAML
subset parser (scalars and one nested map) because the script must run on the
standard library alone; the script cannot verify external URLs, trademark
databases, or agent-product behavior.

Usage: python3 scripts/validate_skill.py
Exit codes: 0 = all checks passed, 1 = at least one failure.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESEARCH_DATE = "2026-10-19"

REQUIRED_FILES = [
    "SKILL.md",
    "README.md",
    "LICENSE",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "SECURITY.md",
    "CHANGELOG.md",
    "references/design-principles.md",
    "references/motion-engineering.md",
    "references/accessibility-and-performance.md",
    "references/compatibility-and-installation.md",
    "examples/good-workflow.md",
    "examples/anti-patterns.md",
    "scripts/validate_skill.py",
    ".github/PULL_REQUEST_TEMPLATE.md",
    ".github/ISSUE_TEMPLATE/bug_report.md",
    ".github/ISSUE_TEMPLATE/feature_request.md",
    ".github/workflows/validate.yml",
]

EXPECTED_TOP_LEVEL = {
    "SKILL.md", "README.md", "LICENSE", "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md", "SECURITY.md", "CHANGELOG.md",
    "references", "examples", "scripts", ".github",
}

EMOJI_RANGES = [
    (0x1F000, 0x1FAFF), (0x2600, 0x27BF), (0x2B00, 0x2BFF),
    (0x1F1E6, 0x1F1FF), (0xFE0F, 0xFE0F),
]

SECRET_PATTERNS = [
    (r"sk-[A-Za-z0-9]{20,}", "possible API key (sk-...)"),
    (r"ghp_[A-Za-z0-9]{30,}", "possible GitHub token (ghp_...)"),
    (r"github_pat_[A-Za-z0-9_]{20,}", "possible fine-grained GitHub token"),
    (r"AKIA[0-9A-Z]{16}", "possible AWS access key"),
    (r"-----BEGIN [A-Z ]*PRIVATE KEY-----", "private key material"),
    (r"(?i)api[_-]?key\s*[=:]\s*['\"]?[A-Za-z0-9]{16,}", "hardcoded API key"),
    (r"(?i)secret\s*[=:]\s*['\"]?[A-Za-z0-9]{16,}", "hardcoded secret"),
]

results: list[tuple[str, bool, str]] = []


def check(label: str, ok: bool, detail: str = "") -> None:
    results.append((label, ok, detail))


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def parse_frontmatter(text: str) -> tuple[dict[str, object], str]:
    """Minimal frontmatter parser: scalar keys plus one nested map."""
    if not text.startswith("---"):
        return {}, text
    lines = text.splitlines()
    if lines[0].strip() != "---":
        return {}, text
    meta: dict[str, object] = {}
    body_start = 0
    current_key: str | None = None
    for i, line in enumerate(lines[1:], start=1):
        stripped = line.strip()
        if stripped == "---":
            body_start = i + 1
            break
        if not stripped or stripped.startswith("#"):
            continue
        m = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", stripped)
        if not m:
            continue
        key, value = m.group(1), m.group(2).strip()
        indented = line.startswith((" ", "\t"))
        if indented and current_key and isinstance(meta.get(current_key), dict):
            meta[current_key][key] = value.strip("'\"")  # type: ignore[index]
            continue
        if value == "":
            meta[key] = {}
            current_key = key
        else:
            meta[key] = value.strip("'\"")
            current_key = None
    body = "\n".join(lines[body_start:])
    return meta, body


def extract_relative_links(text: str) -> list[str]:
    links = []
    for target in re.findall(r"\]\(([^)]+)\)", text):
        if target.startswith(("http://", "https://", "mailto:", "#")):
            continue
        links.append(target.split("#")[0])
    return links


def contains_emoji(text: str) -> bool:
    return any(lo <= ord(ch) <= hi for ch in text for lo, hi in EMOJI_RANGES)


def main() -> int:
    # 1. Structure
    for rel in REQUIRED_FILES:
        p = ROOT / rel
        if not p.exists():
            check(f"structure: {rel} exists", False, "missing")
        elif p.stat().st_size == 0:
            check(f"structure: {rel} exists", False, "empty file")
        else:
            check(f"structure: {rel} exists", True)

    top = {p.name for p in ROOT.iterdir()}
    extras = top - EXPECTED_TOP_LEVEL
    check("structure: no unexpected top-level entries", not extras,
          f"unexpected: {sorted(extras)}" if extras else "")

    # 2. Frontmatter
    skill_text = read("SKILL.md")
    meta, skill_body = parse_frontmatter(skill_text)
    fm_present = skill_text.startswith("---") and "\n---" in skill_text[3:]
    check("frontmatter: present and delimited", fm_present)

    name = str(meta.get("name", ""))
    name_ok = bool(re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", name)) and 1 <= len(name) <= 64
    check("frontmatter: name charset and length (spec rules)", name_ok, f"name={name!r}")
    check("frontmatter: name has no consecutive hyphens", "--" not in name)
    check("frontmatter: name matches parent directory name",
          name == ROOT.name, f"dir={ROOT.name!r} name={name!r}")

    description = str(meta.get("description", ""))
    check("frontmatter: description length 1-1024",
          1 <= len(description) <= 1024, f"len={len(description)}")
    desc_quality = ("when" in description.lower()
                    and any(k in description.lower() for k in
                            ("interface", "ui", "frontend", "web")))
    check("frontmatter: description states what and when", desc_quality)

    compatibility = str(meta.get("compatibility", ""))
    if compatibility:
        check("frontmatter: compatibility max 500 chars", len(compatibility) <= 500,
              f"len={len(compatibility)}")

    md = meta.get("metadata")
    check("frontmatter: metadata is a string map",
          isinstance(md, dict) and all(isinstance(k, str) and isinstance(v, str)
                                       for k, v in md.items()) if isinstance(md, dict) else False)
    license_field = str(meta.get("license", ""))
    check("frontmatter: license field present", license_field == "MIT")

    # 3. Body length
    body_lines = skill_body.count("\n") + 1
    check("SKILL.md body under 500 lines", body_lines < 500, f"lines={body_lines}")

    # 4. Links
    for doc in ("SKILL.md", "README.md"):
        bad = []
        for target in extract_relative_links(read(doc)):
            if not (ROOT / target).exists():
                bad.append(target)
        check(f"links: {doc} relative links resolve", not bad,
              f"broken: {bad}" if bad else "")
    deep = [t for t in extract_relative_links(skill_text)
            if t.startswith("..") or t.count("/") > 1]
    check("links: SKILL.md references stay one level deep", not deep,
          f"too deep: {deep}" if deep else "")

    # 5. Consistency
    readme = read("README.md")
    check("consistency: README names the project", "weftline" in readme.lower())
    check("consistency: README credits Zynu", "Zynu" in readme)
    check("consistency: README credits Shraddha", "Shraddha" in readme)
    check("consistency: README states the license", "MIT" in readme)
    changelog = read("CHANGELOG.md")
    version = str(md.get("version", "")) if isinstance(md, dict) else ""
    check("consistency: metadata version matches CHANGELOG",
          bool(version) and f"[{version}]" in changelog, f"version={version!r}")

    # 6. Compatibility claims carry verification labels
    compat_doc = read("references/compatibility-and-installation.md")
    check("compatibility doc: dated", RESEARCH_DATE in compat_doc)
    check("compatibility doc: labels unverified claims", "unverified" in compat_doc.lower())
    overpromise = ["tested and confirmed", "works in every",
                   "compatible with all agents", "fully verified",
                   "guaranteed to work"]
    hits = [p for p in overpromise if p in compat_doc.lower()]
    check("compatibility doc: makes no universal-compatibility claims",
          not hits, f"found phrases: {hits}" if hits else "")

    # 7. Examples vocabulary
    for rel in ("examples/good-workflow.md", "examples/anti-patterns.md"):
        text = read(rel).lower()
        check(f"examples: {rel} uses pass and tier vocabulary",
              "pass" in text and "tier" in text)

    # 8. CI workflow
    wf = read(".github/workflows/validate.yml")
    check("ci: workflow triggers on push and pull_request",
          "push" in wf and "pull_request" in wf)
    check("ci: workflow runs the validation script", "validate_skill.py" in wf)
    check("ci: workflow restricts permissions", "contents: read" in wf)

    # 9. Secrets scan
    findings = []
    for rel in REQUIRED_FILES:
        if not (ROOT / rel).exists():
            continue
        text = read(rel)
        for pattern, label in SECRET_PATTERNS:
            if re.search(pattern, text):
                findings.append(f"{rel}: {label}")
    check("secrets: no secret patterns found", not findings,
          "; ".join(findings) if findings else "")

    # 10. Editorial rules
    em_dash_files = [rel for rel in REQUIRED_FILES if rel.endswith(".md")
                     and (ROOT / rel).exists() and "\u2014" in read(rel)]
    check("editorial: no em dashes in authored markdown", not em_dash_files,
          f"found in: {em_dash_files}" if em_dash_files else "")
    emoji_files = [rel for rel in REQUIRED_FILES if rel.endswith(".md")
                   and (ROOT / rel).exists() and contains_emoji(read(rel))]
    check("editorial: no emoji in authored markdown", not emoji_files,
          f"found in: {emoji_files}" if emoji_files else "")
    lorem = [rel for rel in REQUIRED_FILES if rel.endswith(".md")
             and (ROOT / rel).exists() and "lorem ipsum" in read(rel).lower()]
    check("editorial: no placeholder text", not lorem,
          f"found in: {lorem}" if lorem else "")

    # Report
    passed = sum(1 for _, ok, _ in results if ok)
    failed = len(results) - passed
    width = max(len(label) for label, _, _ in results)
    print("Weftline repository validation")
    print(f"Root: {ROOT}")
    print("-" * (width + 8))
    for label, ok, detail in results:
        mark = "PASS" if ok else "FAIL"
        line = f"[{mark}] {label.ljust(width)}"
        if detail:
            line += f"  ({detail})"
        print(line)
    print("-" * (width + 8))
    print(f"Total: {len(results)}  Passed: {passed}  Failed: {failed}")
    if failed:
        print("Result: FAIL")
        return 1
    print("Result: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
