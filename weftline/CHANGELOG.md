# Changelog

All notable changes to this project are documented here. The format follows
Keep a Changelog conventions and the project uses semantic versioning.

## [0.1.0] - 2026-10-19

Initial release.

### Added

- SKILL.md: the Weftline working method for agents building web interfaces,
  with five passes (Unpick, Warp, Weave, Finish, Proof), four depth tiers
  (Patch, Page, System, Motion), a motion ladder (CSS, Web Animations API,
  purpose-chosen libraries), hard rules, and an honest verification protocol.
- references/: design-principles.md, motion-engineering.md,
  accessibility-and-performance.md, compatibility-and-installation.md.
- examples/: good-workflow.md and anti-patterns.md.
- scripts/validate_skill.py: structural and metadata validation using the
  Python standard library only.
- .github/: issue templates, pull request template, and validate.yml CI
  workflow running the bundled validator.
- Community and project files: README.md, LICENSE (MIT), CONTRIBUTING.md,
  CODE_OF_CONDUCT.md, SECURITY.md, CHANGELOG.md.

### Known limitations at release

- End-to-end installation in specific agent products is documented but
  untested; see references/compatibility-and-installation.md.
- The CI workflow has not run on GitHub runners (no remote repository yet).
- The name Weftline was checked against public registries at release time;
  no name check is a guarantee of uniqueness or trademark clearance in
  every jurisdiction.
