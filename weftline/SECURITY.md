# Security Policy

## Reporting a vulnerability

If you find a security issue in this repository, for example a validator flaw
that could hide problems, an injection vector in the validation script, or
sensitive information accidentally committed, report it privately rather than
in a public issue:

1. Preferred: open a private security advisory via GitHub's "Report a
   vulnerability" feature on this repository (available to the maintainers
   once the repository is public on GitHub).
2. Alternative: contact the maintainer Zynu via GitHub (@izynu) and mark the
   message as a security report.

Please include: a description of the issue, how to reproduce it, the affected
files or paths, and any suggested mitigation. Do not include secrets or
exploit payloads you are not prepared to share with the maintainers.

## Response process

- The maintainer acknowledges reports as soon as practical.
- Confirmed issues get a fix or mitigation, a CHANGELOG.md entry, and, when
  warranted, a release.
- Reporters are credited in the changelog only if they want to be.

## Scope and honest limitations

This repository contains documentation, a validation script, and CI
configuration. There is no runtime service, server, or user data handling in
this repository, so the attack surface is small. Still in scope:

- scripts/validate_skill.py (path handling, parsing, exit codes).
- .github/workflows/validate.yml (workflow injection, excessive permissions).
- Any place where documentation could instruct agents to run unsafe commands.

Out of scope: the behavior of third-party agent products that consume this
skill, and any claims about their security. Those products' own security
policies apply to them.

## Commit hygiene

The validator includes a basic secret-pattern scan for the repository's own
files, but scanning is not a substitute for care: never commit tokens,
credentials, or personal data. If a secret is ever committed, rotate it
immediately; treating rotation as the fix, not history rewriting, is the
priority.
