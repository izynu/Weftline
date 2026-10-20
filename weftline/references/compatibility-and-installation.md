# Compatibility and Installation

Facts about installing Weftline in agent environments, with the verification
status of every claim. Research date for all statements below: 2026-10-19.
If you are reading this file after that date, re-verify against current
official documentation before trusting installation paths.

## 1. What the format is

Weftline follows the Agent Skills open standard (agentskills.io). A skill is a
directory containing a `SKILL.md` file with YAML frontmatter and Markdown
instructions. Optional subdirectories include `scripts/`, `references/`, and
`assets/`. Weftline uses `scripts/` and `references/`.

Verified frontmatter rules (from agentskills.io/specification, fetched
2026-10-19):

- `name`: 1 to 64 characters, lowercase letters, numbers, and hyphens only,
  must not start or end with a hyphen, must not contain consecutive hyphens,
  and must match the parent directory name. Weftline's folder is `weftline`
  and its name field is `weftline`.
- `description`: 1 to 1024 characters, describing what the skill does and when
  to use it.
- Optional: `license`, `compatibility` (max 500 characters), `metadata`
  (string-to-string map), `allowed-tools` (experimental).
- The spec recommends keeping the main SKILL.md under 500 lines and loading
  deeper detail from reference files on demand, which Weftline does.

## 2. Where skills are scanned

Verified conventions (agentskills.io client-implementation documentation,
fetched 2026-10-19):

| Scope | Path | Status |
|---|---|---|
| Project, cross-client | `<project>/.agents/skills/` | Documented as widely adopted |
| User, cross-client | `~/.agents/skills/` | Documented as widely adopted |
| Project, client native | `<project>/.<client>/skills/` | Client-specific |
| User, client native | `~/.<client>/skills/` | Client-specific |
| Claude compat | `.claude/skills/` (project and user) | Documented as a pragmatic convention many implementations also scan |
| Override rule | Project-level overrides user-level | Documented |

The specification states it defines what goes inside skill directories, not
where clients must place them; the table above reflects documented client
conventions, not a guarantee about any specific product's current behavior.

## 3. Environment-specific guidance (verification status: unverified)

The following describes manual installation for commonly used environments.
The maintainers have not run end-to-end installation tests inside these
products; treat each as a procedure to verify locally, not a tested claim.
Consult each product's current official skill documentation before installing.

- **Claude Code:** copy the `weftline/` folder into `~/.claude/skills/` or the
  project's `.claude/skills/`. The `.claude/skills/` convention is documented
  by the Agent Skills project (see above).
- **Any spec-compliant client:** copy into `.agents/skills/weftline/` at
  project or user scope.
- **VS Code with GitHub Copilot, Codex, and other tools:** these products
  evolve their skill and instruction support independently. Determine the
  current supported location from their official documentation, then copy the
  folder there. If the product supports the Agent Skills format, the same
  folder works unchanged; if it only supports instruction files, Weftline's
  content can be referenced but the activation model may differ.
- **Manus:** the Manus feature list (manus.im/features, fetched 2026-10-19)
  documents Agent Skills support ("Automate your expertise" and a community
  skill directory). The exact installation path for a third-party skill folder
  was not verifiable from the fetched pages and remains unverified.

Important: cloning this repository does not install the skill anywhere by
itself. Someone or some tool must copy the `weftline/` directory into a
location the agent scans, and then reload its skill list.

## 4. Validation tooling

- Bundled: `python3 scripts/validate_skill.py` checks structure, frontmatter
  rules, links, and consistency. Needs only Python 3.7+.
- Reference validator published by the Agent Skills project: `skills-ref
  validate ./weftline` (documented on agentskills.io/specification,
  fetched 2026-10-19). Not bundled here because it is distributed separately;
  maintainers can install it and cross-check.
- CI: `.github/workflows/validate.yml` runs the bundled script on push and
  pull requests. The workflow is structural and simple; it has not been
  executed on GitHub's runners (no remote repository exists yet) and is
  therefore labeled untested in that specific environment.

## 5. Known limitations

- The skill guides agent behavior through instructions; it cannot force an
  agent lacking file or shell access to run the validation script.
- `allowed-tools` is marked experimental in the specification; Weftline does
  not rely on it.
- Per-product activation quality (whether the agent correctly notices the
  skill for a given prompt) depends on the agent's own retrieval and cannot be
  guaranteed by the format. Test activation with realistic prompts after
  installing.
