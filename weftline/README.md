# Weftline

A cross-agent skill for building thoughtful, accessible, responsive, and
production-quality web interfaces. Weftline gives compatible coding agents a
research-backed working method: how to understand an interface task, plan it at
the right depth, implement it cleanly, add purposeful motion, and prove the
result instead of claiming it.

- Maintainer: Zynu (@izynu), primary maintainer and main developer.
- Contributor: Shraddha (@xhraddha), contribution, research, implementation,
  documentation, testing, and review as agreed by the maintainers.
- Format: [Agent Skills](https://agentskills.io) open standard (SKILL.md).
- License: MIT. See [LICENSE](LICENSE).
- Version: 0.1.0 (initial release).

## Why Weftline exists

AI coding agents can already generate interfaces. What they often lack is a
disciplined way to decide what deserves to exist. Weftline contributes an
independent methodology, developed from a study of existing tools and agent
products:

- **Five passes.** Unpick, Warp, Weave, Finish, Proof. A fixed sequence that
  scales from a one-line fix to a multi-component system.
- **Depth tiers.** Patch, Page, System, Motion. Small fixes stay small; complex
  work gets architecture. The workflow adapts to the task, never the reverse.
- **Motion ladder.** CSS transitions, then the Web Animations API, then a
  purpose-chosen library such as Anime.js or Motion, only when its capabilities
  justify the dependency. Every animation must pass a purpose test and respect
  reduced-motion preferences.
- **Hard rules.** No fake testimonials, no invented metrics, no decorative
  gradients or purposeless animation, no vague hero copy. These rules are
  enforceable and stated in the skill text.
- **Honest verification.** Results are reported as verified, unverified, or
  blocked. Nothing is claimed as done because it compiled.

## What is inside

```text
weftline/
├── SKILL.md                     # The skill: metadata + working method
├── references/
│   ├── design-principles.md     # Hierarchy, layout, color, type, spacing
│   ├── motion-engineering.md    # Motion ladder, purpose test, performance
│   ├── accessibility-and-performance.md
│   └── compatibility-and-installation.md
├── examples/
│   ├── good-workflow.md
│   └── anti-patterns.md
├── scripts/
│   └── validate_skill.py        # Structural and metadata validation
└── .github/
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/validate.yml   # CI runs the validation script
```

## Requirements

Any agent that supports the Agent Skills format and can read files in its
workspace can use the core guidance. The optional validation script needs
Python 3.7 or newer. Nothing else is required: no network access, no packages.

## Installation

Weftline is a directory containing `SKILL.md`. Install it by copying that
directory into a location your agent scans. The Agent Skills specification
documents these conventions (verified against agentskills.io on 2026-10-19):

| Scope | Cross-client location | Notes |
|---|---|---|
| Project | `<project>/.agents/skills/weftline/` | Widely adopted interop convention |
| User | `~/.agents/skills/weftline/` | Available to all projects |
| Claude Code | `<project>/.claude/skills/weftline/` or `~/.claude/skills/weftline/` | Common native location |
| Project override | Project-level skills override user-level skills | Spec-documented rule |

Manual steps:

1. Clone or download this repository.
2. Copy the `weftline/` directory (the folder that contains `SKILL.md`) into
   one of the locations above, keeping the folder name `weftline`. The
   specification requires the `name` field to match the parent directory name.
3. Restart or reload your agent's skill list if it caches skills at startup.
4. Confirm the skill appears, then try a prompt such as "build a landing page
   for a small pottery studio" and check the agent announces the Weftline
   workflow.

Compatibility status, per environment, as of 2026-10-19: the skill format and
metadata rules follow the current published specification. End-to-end
installation inside specific commercial agents (VS Code with GitHub Copilot,
Codex, Claude-based tools, Manus) has not been tested by the maintainers and is
therefore documented as unverified in
[references/compatibility-and-installation.md](references/compatibility-and-installation.md).
Nothing here claims that cloning a repository automatically installs anything.

## Usage

Activate it by asking for interface work in plain language. Examples of tasks
likely to trigger the skill:

- "Create a landing page for our backup tool. No purple gradients, no fake
  logos."
- "Add a save action to this settings form with proper loading and error
  states."
- "This page is animation-heavy and janky on cheap laptops. Fix it without
  making it boring."
- "Review this hero section: does the copy explain what the product does?"

The skill responds according to depth tier: a Patch gets a focused edit and
targeted checks; a Page gets the full five passes; System work adds component
boundaries and state planning; Motion work applies the motion ladder and a
performance budget.

## Validation

Run the bundled validator from the repository root:

```bash
python3 scripts/validate_skill.py
```

It checks directory structure, YAML frontmatter and naming rules from the
specification, internal link resolution, README consistency, the CI
workflow, and absence of common secret patterns. The
Agent Skills project also publishes a reference validator (`skills-ref
validate`); both are listed here so maintainers can cross-check. CI runs the
bundled script on every push and pull request via
[.github/workflows/validate.yml](.github/workflows/validate.yml).

## Limitations

- The skill guides work; it does not execute it. It cannot make an agent run
  tests it has no ability to run.
- Installation procedures in individual agent products are documented but
  untested end to end. See the compatibility reference for the exact status of
  each environment.
- The name Weftline was checked against public registries at release time;
  no name check is a guarantee of uniqueness or trademark clearance in every
  jurisdiction.

## Contributing

Contributions from Zynu and Shraddha, and from any contributor who follows
[CONTRIBUTING.md](CONTRIBUTING.md), are welcome. Read the
[Code of Conduct](CODE_OF_CONDUCT.md) first. Report security issues per
[SECURITY.md](SECURITY.md). Changes are versioned in
[CHANGELOG.md](CHANGELOG.md).

## License

MIT. Copyright (c) 2026 Zynu and contributors. Each contributor retains
copyright to their contributions. The skill's guidance text is original work;
external sources are cited for research provenance and were not copied.
