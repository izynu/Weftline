---
name: weftline
description: Guides coding agents through research-backed planning, design, implementation, motion, accessibility, and verification of web interfaces. Defines a five-pass workflow (Unpick, Warp, Weave, Finish, Proof) with adaptive depth from one-line fixes to complex systems, a motion technique ladder from CSS to the Web Animations API to animation libraries, hard rules against fabricated metrics, fake social proof, decorative gradients, and purposeless animation, plus a bundled validation script. Use when building or modifying pages, components, landing pages, or UI motion, or whenever the user asks for accessible, responsive, production-quality frontend work.
license: MIT
compatibility: Requires an agent that can read repository files and, optionally, run Python 3 for the bundled validation script. No network access or third-party packages are needed for the core guidance.
metadata:
  author: izynu
  version: "0.1.0"
  spec: "https://agentskills.io"
  maintainer: "Zynu (primary), Shraddha (contributor)"
---

# Weftline

Weftline is a working method for agents that build web interfaces. In a woven
fabric, the warp is the fixed structure and the weft is the thread carried back
and forth through every single pass. This skill is that carried thread: a
repeatable way of working that runs through every stage of interface work, from
the first question about requirements to the final verified result.

## When to activate this skill

Activate Weftline when a task involves creating or changing what users see or
touch in a browser context, including:

- New pages, landing pages, dashboards, or application views.
- Components: forms, navigation, modals, tables, cards, dialogs, and similar.
- Visual design, layout, typography, color, or spacing changes.
- Animations, transitions, scroll behavior, gestures, or microinteractions.
- Accessibility, responsiveness, or frontend performance fixes.
- Reviewing or rejecting proposed interface designs, copy, or marketing claims.

Do not activate it for work that has no user-facing surface, such as pure data
migrations, backend refactors with no UI impact, or infrastructure changes.

## Operating principles

1. **Verify, never assume.** Inspect the actual codebase, the actual rendered
   output, and the actual check results. A claim you have not verified is a
   hypothesis and must be labeled as one.
2. **Adapt depth to risk.** A padding fix and a new application shell deserve
   different amounts of process. Never impose the full workflow on a small fix.
3. **Purpose before decoration.** Every visual choice, every interaction, and
   every animation must serve the user. If you cannot state its purpose, remove
   it or reject it.
4. **Respect the host project.** Preserve established conventions, design
   tokens, and component systems unless you can justify the cost of changing
   them and get agreement.
5. **Honesty is a feature.** Report what is verified, what is untested, and
   what is blocked. Never fabricate metrics, testimonials, compatibility, or
   test results.

## Step 0: Assess the task and choose a depth tier

Before working, classify the task into one of four tiers. The tier decides how
much of the workflow below you perform.

| Tier | Typical tasks | Process |
|---|---|---|
| Patch | Small fixes, copy edits, one-class style tweaks, minor a11y corrections | Focused edit, then targeted checks (Pass 5 only). No plan document. |
| Page | A new page, view, or section within an existing system | Full five passes with a lightweight plan. |
| System | Multi-component work, new feature areas, design-system additions | Full five passes plus component boundaries, state and data flow planning, and a validation strategy. |
| Motion | Animation-heavy work of any size | Full five passes with the motion ladder and performance budget applied (see references/motion-engineering.md). |

When in doubt between two tiers, choose the larger one only if the change is
hard to reverse or touches shared code.

## The five passes

### Pass 1: Unpick (understand)

- Read the request carefully. Identify the user's actual problem, the intended
  audience, and the content the interface must present.
- Inspect the existing code: framework, styling system, component library,
  existing patterns, constraints, and conventions. Match them.
- Note explicit requirements (frameworks, browsers, accessibility standards,
  brand rules) and write down what is ambiguous.
- Output: a short task brief. For Patch tier this can be two or three sentences
  in your working notes.

### Pass 2: Warp (plan the structure)

Before writing interface code, decide:

- Information hierarchy: what must the user see first, second, third?
- Layout and responsive behavior: mobile first, then enhance. Name the
  breakpoints you will use and what changes at each.
- Visual direction: color, typography, spacing scale. Derive these from the
  product and its audience, never from a fixed template.
- Component boundaries, and for System tier: state ownership and data flow.
- Interaction states: default, hover, focus, active, disabled, loading, empty,
  and error for every interactive element you create or modify.
- Motion plan: what moves, why it moves, and the technique for each piece
  (see the motion ladder below).

For Page tier this is a lightweight plan; for System tier it is a design you
can defend. Do not write plan essays nobody asked for.

### Pass 3: Weave (implement)

- Build with maintainable code: clear names, small components, no dead code.
- Use the project's existing UI primitives and design tokens first. Build
  custom pieces only when nothing suitable exists.
- Semantic HTML first: landmarks, headings in order, real buttons and links,
  labels tied to inputs. ARIA only where semantics fall short.
- Responsive by construction: test the layout at narrow widths while building,
  not after.
- Implement all interaction states from Pass 2, including focus visibility.

### Pass 4: Finish (motion and polish)

- Apply the motion plan. Every animation must pass the purpose test in
  references/motion-engineering.md: it serves usability, it has a reduced-motion
  path, it is cleaned up on unmount, and it never hijacks scrolling or blocks
  reading.
- Complete the state matrix: loading, empty, error, and success states for
  every flow that needs them. No fake progress indicators, ever.
- Copy pass: specific, grounded text that explains what the product actually
  does. No unsupported claims, no fabricated social proof, no invented
  metrics.

### Pass 5: Proof (validate and report)

- Run the checks the environment offers: linters, type checks, the project's
  test suite, and `scripts/validate_skill.py` when working on this skill
  itself.
- When a browser or preview tool is available, look at the rendered result at
  desktop and mobile widths, with keyboard navigation, and with reduced motion
  emulation if available. Confirm the work is genuinely rendered and
  interactive, not merely compiled.
- Report results in three categories: verified (you saw it work), unverified
  (implemented but not tested here), and blocked (could not be done, with the
  reason). This is the definition of done for Weftline work.

## Hard rules

Never do any of the following when generating or changing interfaces, public
pages, or product copy:

- Fake testimonials, reviews, customer stories, client logos, or trust badges.
- Invented metrics, usage counters, or performance claims you did not measure.
- Vague hero text that fails to explain what the product does.
- Emoji used as interface icons.
- Purple gradients or generic gradient-heavy styling used as a substitute for
  a design decision.
- Pill-shaped buttons as a default geometry.
- Decorative animation, scroll hijacking, custom cursors, or motion that
  interferes with reading or navigation.
- Fake progress indicators or simulated functionality.
- Glassmorphism, blobs, or neon accents without a stated purpose.
- AI-slop stock imagery in place of real screenshots, diagrams, or licensed
  assets.

Always do all of the following:

- Deliberate typography, a coherent spacing system, and clear hierarchy.
- Visible focus indicators and keyboard operability for every interactive
  element.
- Responsive layouts verified at at least one narrow and one wide width.
- Honest reporting of verification status.

## Motion ladder

Choose the simplest technique that meets the verified need, in this order:

1. **CSS transition or animation** for simple state changes (hover, focus,
   show/hide) where no sequencing or physics is needed.
2. **Web Animations API** when you need programmatic control, interruption,
   or composition without adding a dependency.
3. **A purpose-chosen library** (for example Anime.js or Motion) only when its
   capabilities justify the dependency: complex timelines, spring physics,
   layout transitions, or framework-integrated gesture and scroll systems.

Before adding any animation, state the user need it serves and why a simpler
option is insufficient. Respect `prefers-reduced-motion`. Evaluate lifecycle
cleanup, interrupted transitions, repeated interactions, keyboard and touch
behavior, and the effect on bundle size. Full guidance:
references/motion-engineering.md.

## When tools are unavailable

- No browser or preview tool: rely on code review, static checks, and the
  project's tests, then label rendering verification as unverified.
- No test runner: perform a manual checklist review (semantic structure, focus
  order, state matrix, responsive classes) and say it was manual.
- No ability to run anything: deliver the change with a numbered list of the
  checks a human should run, in order.
- Never claim a check passed that you did not run.

## Communicating uncertainty

Use plain categories in your final report: verified, unverified, blocked. For
each unverified or blocked item, state what would resolve it. If a requirement
cannot be established (for example, an undefined design direction), record it
as a question for the maintainer instead of inventing an answer. This skill
applies the same standard to itself.

## File map

- references/design-principles.md: visual hierarchy, layout, color, typography,
  spacing, and the design decision checklist.
- references/motion-engineering.md: the motion ladder in depth, the purpose
  test, technique comparison, performance and lifecycle rules.
- references/accessibility-and-performance.md: accessibility requirements,
  responsive rules, and performance practices.
- references/compatibility-and-installation.md: how to install this skill in
  agent environments and what has and has not been verified.
- scripts/validate_skill.py: structural and metadata validation for this
  repository.
- examples/good-workflow.md: worked examples across the depth tiers.
- examples/anti-patterns.md: requests that must be refused or corrected, and
  how to respond instead.

Keep references one level deep from this file, as recommended by the Agent
Skills specification.
