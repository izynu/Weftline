# Accessibility and Performance

Depth for Passes 3 to 5 (Weave, Finish, Proof). Load this file when
implementing or reviewing any interface change.

## 1. Accessibility requirements

### Structure and semantics

- Use semantic HTML before ARIA: landmarks (`header`, `nav`, `main`,
  `footer`), real `button` and `a` elements, native form controls with `label`.
- One `h1` per view; heading levels follow document order, never visual size.
- ARIA is a patch for semantics that HTML cannot express, not a styling or
  behavior framework. Adding `role="button"` to a div is almost always wrong
  when a real button exists.
- Images get descriptive `alt` text; decorative images get empty `alt`.
  Icon-only buttons get accessible names.

### Keyboard operability

- Everything operable by pointer must be operable by keyboard. Verify tab
  order follows visual and logical order.
- Visible focus indicators on every focusable element. Never remove focus
  outlines without providing a clearly visible replacement.
- Modals trap focus while open, close on Escape, and return focus to the
  trigger. Custom dropdowns follow combobox or listbox patterns correctly or
  use native `select`.
- No keyboard traps: Shift+Tab must always escape what Tab entered.

### Forms

- Label every input. Placeholder text is not a label.
- Errors are announced: associate messages with inputs via
  `aria-describedby`, and move focus to the first error on submit failure.
- Validate accessibly: explain what went wrong and how to fix it, per field.

### Motion and preference

- Honor `prefers-reduced-motion` everywhere. See
  references/motion-engineering.md for the required handling.
- Nothing flashes more than three times per second.
- Autoplaying moving content must be pausable.

### Color and contrast

- Body text at least 4.5:1 contrast; large text at least 3:1; UI component
  boundaries and meaningful graphics at least 3:1.
- Never encode meaning in color alone.

### Verification honesty

If no accessibility audit tool is available in the environment, perform the
manual checklist above and label the result as a manual review, not an audit.
Do not report WCAG conformance levels without a real audit. Untested claims of
accessibility are treated the same as fabricated metrics.

## 2. Responsive practice

- Test at a minimum: 320 pixels (small phone), one mid size (768), and one
  wide desktop (1440 or more). Record which widths were actually checked.
- Images and media scale within their containers (`max-width: 100%`); never
  cause horizontal page scroll at any width.
- Touch targets at least 44 by 44 pixels; spacing between targets prevents
  accidental activation.
- Navigation collapses gracefully; content reflows without clipping; text
  remains readable without zoom.

## 3. Performance practice

- Ship what the page uses: no framework imports "just in case", no icon
  libraries where two icons would do, no animation library when CSS suffices.
- Prefer compositor-friendly animation properties (`transform`, `opacity`);
  see references/motion-engineering.md.
- Images: correct intrinsic size, modern formats when the project supports
  them, lazy loading below the fold, and explicit dimensions to prevent layout
  shift.
- Scripts: defer what can be deferred; avoid long main-thread tasks during
  interaction.
- Do not report performance improvements without measuring them in the target
  environment and recording the test conditions. Vendor performance claims are
  marketing until verified locally.

## 4. Review checklist (run in Pass 5)

1. Semantic landmarks and heading order verified in the DOM.
2. Keyboard-only walkthrough completed, or labeled unverified.
3. Focus indicators visible on every interactive element.
4. Forms labeled, error states announced.
5. Reduced-motion path present for every animation.
6. Contrast verified with a checker where available, or labeled unverified.
7. Layout checked at narrow, mid, and wide widths.
8. Bundle impact of new dependencies assessed and stated.
