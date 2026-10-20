# Contributing to Weftline

Thank you for contributing. This document describes how work happens in this
repository. It applies to the maintainers and to outside contributors alike.

## Project roles

- Zynu (@izynu) is the primary maintainer: project ownership, technical
  direction, architecture, and release decisions.
- Shraddha (@xhraddha) contributes research, implementation, documentation,
  testing, and review as agreed by the maintainers.

## Ways to contribute

- Bug reports and behavioral gaps in the skill's guidance (open an issue).
- Documentation improvements, including clearer wording in the references.
- New examples that demonstrate the method honestly.
- Validator improvements that catch real defects.

## Workflow

1. **Open or claim an issue first** for anything beyond typo fixes, so
   decisions happen before code.
2. **Branch from `main`** with a descriptive name, for example
   `fix/motion-ladder-reduced-motion` or `docs/validator-usage`.
3. **Make focused changes.** One logical change per pull request. Do not
   reformat files you are not otherwise touching.
4. **Run the validator locally** before pushing:
   `python3 scripts/validate_skill.py`. CI runs the same script; a failing
   CI run is a review blocker.
5. **Update documentation together with behavior.** If you change a rule in
   SKILL.md, check whether references/, examples/, and README.md describe it
   too. Consistency failures found by the validator or review must be fixed
   in the same pull request.
6. **Open a pull request** using the provided template. Describe what changed
   and why, and list what you verified (ran the validator, re-read affected
   files) and what you did not.

## Review and acceptance

- Zynu reviews and merges. Review focuses on correctness of the guidance,
  consistency across files, honesty of any claimed verification, and absence
  of unrelated changes.
- Substantive changes to SKILL.md or to the hard rules require a note in
  CHANGELOG.md describing what changed and why.

## Releases and versioning

- Versions follow semantic versioning, tracked in CHANGELOG.md and in the
  SKILL.md metadata version field.
- A release means: validator passes on a clean checkout, CHANGELOG.md has an
  entry, and the SKILL.md metadata version matches the release version.
- Only Zynu performs releases.

## What not to commit

- Secrets, tokens, or personal data of any kind.
- Vendored third-party documentation or code (cite and link instead).
- Generated archives or build output.
- Claims about untested compatibility (label them unverified instead; see
  references/compatibility-and-installation.md).

## Issue reporting quality

For guidance bugs, include: the prompt or task that triggered the behavior,
what the skill's text is currently interpreted to require, what the better
behavior would be, and which file and section you believe needs changing.
For validator bugs, include the exact command, output, and expected result.
