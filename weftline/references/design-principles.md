# Design Principles

Depth for Pass 2 (Warp) and Pass 3 (Weave) of the Weftline method. Load this
file when planning or reviewing visual design decisions.

## 1. Information hierarchy

- Decide what the user must see first, second, and third before touching code.
  If nothing needs to come first, the page has no direction; fix that with the
  user, not with bigger text.
- One primary action per view. Secondary actions are visually quieter: outline
  or text styles rather than competing fills.
- Headings follow document order (h1 once, then h2, h3). Never choose heading
  levels for their size; size is styling, level is structure.
- Negative space is a layout tool. Crowding every section signals that
  everything and nothing matters.

## 2. Layout and responsiveness

- Design mobile first, then enhance with `min-width` breakpoints. Name the
  breakpoints and what changes at each; do not add breakpoints speculatively.
- Prefer flow layouts (flex, grid with intrinsic sizing) over fixed pixel
  scaffolds. The page must survive 320 pixel widths and 4K monitors without
  horizontal scroll or crushed text.
- Reading measure: roughly 45 to 75 characters per line for body text.
- Never rely on hover as the only way to reach content or actions. Touch has
  no hover.
- Interactive targets are at least 44 by 44 pixels of touch area, including
  padding.

## 3. Color

- Derive the palette from the product's audience and function, not from a
  template. A billing dashboard and a children's reading app should not share
  a mood.
- Body text contrast: at least 4.5:1 against its background. Large display
  text: at least 3:1. Verify with a contrast check, not by eye.
- Color is never the only carrier of meaning. Pair status colors with icons or
  text.
- Avoid decorative gradients as a substitute for hierarchy. A gradient with a
  stated purpose (depth, state, brand continuity) is a decision; a gradient
  because it looks expensive is not.
- Default to restrained, coherent palettes. When the host project has design
  tokens, use them unchanged unless there is a reasoned, agreed justification.

## 4. Typography

- Establish a scale (for example 12, 14, 16, 20, 24, 32, 48) and stick to it.
  Arbitrary sizes break rhythm.
- Two families maximum. One is usually enough: a well-chosen family with real
  weights beats two that fight.
- Line height: comfortable for body text (1.5 to 1.7), tighter for display.
- Use the system font stack or the project's existing font. Loading custom
  fonts must be justified against their performance and licensing cost.

## 5. Spacing and geometry

- One spacing unit (commonly 4 or 8 pixels) and its multiples. No magic
  numbers.
- Buttons and controls: conventional geometry with modest radii (for example
  4 to 8 pixels). Pill shapes are a deliberate brand choice, not a default.
- Alignment is binary: things align or they do not. Off-by-two-pixel layouts
  read as errors.

## 6. Interaction states

Every interactive element needs, before implementation is called done:

- Default, hover, focus-visible, active, and disabled.
- Loading and empty states for every view that fetches data.
- Error states that say what happened and what to do next.
- Disabled states that explain why they are disabled when the reason is not
  obvious.

Fake progress indicators and simulated functionality are prohibited. If the
system does not know the progress, show an honest indeterminate state.

## 7. Copy

- Hero copy must explain what the product does in one specific sentence. Test:
  could a stranger repeat back what this product is for?
- Ground every claim in real functionality. Delete unsupported superlatives.
- No fabricated testimonials, reviews, client logos, or trust badges. If
  social proof does not exist, say nothing instead of inventing it.
- Write like a knowledgeable colleague: specific verbs, real nouns, no
  decoration. Em dashes are banned in this project's own copy; use commas,
  periods, or parentheses.

## 8. Design decision checklist (run before implementation)

1. Can I state the purpose of every section on this page?
2. Is there exactly one primary action?
3. Does every interactive element have its full state matrix?
4. Does the layout work at 320 pixels and at desktop width?
5. Is all text contrast verified, not eyeballed?
6. Are existing tokens and components reused where they fit?
7. Would every visual choice survive the question "why is this here?"
