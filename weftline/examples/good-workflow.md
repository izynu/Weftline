# Good Workflow Examples

Worked examples of the Weftline method across the depth tiers. Each shows the
task, the tier choice, the passes performed, key decisions, and the
verification criteria that define done. The rendering results in these
examples describe what an agent should verify, not fabricated measurements.

## Example 1: Landing page for a small pottery studio (Page tier)

Task: "Create a landing page for our pottery studio. We sell classes and
handmade tableware. Nothing flashy."

Tier: Page (new surface, single page, existing static site).

Pass 1, Unpick: inspected the existing site: plain HTML with a shared
stylesheet, no framework, system font stack. Audience: local students and
buyers. Content needed: what the studio offers, class schedule entry point,
shop entry point, location, contact. Ambiguity found: no photography was
provided.

Pass 2, Warp (the decisions that matter):

- Hierarchy: one sentence explaining the studio, then two equal entry paths
  (classes, shop), then location and hours. One primary action: view the
  class schedule.
- Responsive plan: single column under 640 pixels, two-column entry paths
  above that, tested at 320, 768, and 1440.
- Visual direction: warm neutral palette sampled from finished ceramics,
  generous spacing, system serif for display. No gradients; the subject
  matter carries the visual weight.
- States: schedule link loads the schedule page; shop link scrolls to shop
  section; contact form gets loading, success, and error states.
- Motion plan: none needed beyond a 150 millisecond CSS transition on link
  hover for affordance. Stated purpose: cursor feedback. That is the whole
  plan.

Pass 3, Weave: semantic HTML (header, nav, main, footer, h1 then h2
sections), real buttons and links, labels on form fields, `alt` text
placeholders marked for the studio's real photography with a comment refusing
to ship AI-slop stock images in their place.

Pass 4, Finish: copy written to answer "what does this studio do" in one
sentence; no invented testimonials and no fabricated student counts, with a
note to the user suggesting they add real quotes if they have them.

Pass 5, Proof: HTML validated, page rendered in a browser preview at three
widths, keyboard tab order checked, contrast of the warm gray text on cream
background verified at 4.6:1 with a contrast checker. Reported: verified
(rendering, tab order, contrast); unverified (form delivery, which needs the
site's mail handler); blocked (real photography, waiting on the studio).

## Example 2: Adding a save action to a settings form (Patch tier)

Task: "Users complain the settings form loses input. Add a save button that
shows what happened."

Tier: Patch (single component change, no layout work). Passes 1 to 4 collapse
into focused work; Pass 5 is not skipped.

Decisions: real `button type="submit"`, disabled state while submitting with
an honest indeterminate spinner, success text "Settings saved", error text
with the server's reason and a retry hint, focus moved to the status message
via `aria-live="polite"` so screen readers announce it.

Verification: submitted with valid data (verified success path), submitted
with the network tab throttled offline (verified error path and retry),
keyboard-only submit (verified focus behavior). Reported accordingly.

## Example 3: Rescuing an animation-heavy marketing page (Motion tier)

Task: "This page feels expensive but is janky on cheap laptops, and a user
complained about nausea from the parallax."

Tier: Motion.

Pass 1: audited the animation inventory first. Found: scroll-hijacked
sections, five simultaneous scroll listeners animating `top` and `left`, a
3D card tilt library (18 kilobytes gzipped) doing one job, and no
reduced-motion handling anywhere.

Pass 2 decisions, applying the purpose test to each animation:

- Hero reveal: kept, moved to CSS `opacity` and `transform` transition.
  Purpose: orientation. Reduced motion: instant show.
- Scroll-hijack sections: removed entirely. Hijacking interferes with reading
  and cannot pass the purpose test.
- Parallax layers: removed. Same reason; the nausea complaint is the user
  need winning.
- Card tilt library: removed; replaced with a 2 KB CSS hover lift using
  `transform`. Purpose: affordance.
- Stat counters counting up on scroll: removed as decorative; the numbers
  were also unverifiable marketing claims, reported to the owner separately.

Pass 3 to 4: listeners removed, compositor-only properties left, cleanup
confirmed for the two remaining JS-driven animations (both now WAAPI with
cancel on unmount).

Pass 5: rendered at desktop and mobile widths, tab order intact, reduced
motion emulated (both surviving animations degrade to instant states), and
frame timing spot-checked in the browser profiler before and after with the
numbers recorded in the report rather than summarized as "much faster".
Reported the scroll removal honestly: the original requester wanted the
effect, and the response explains why it was cut and what replaced it.

## Example 4: Accessibility and responsive defects found in review

Task: "Review our checkout page before launch."

Tier: Page, review-only variant.

Findings reported with severity: error messages not associated with inputs
(fix: `aria-describedby`); focus lost after the coupon dialog closes (fix:
return focus to trigger); 28-pixel touch targets on quantity steppers (fix:
padding to 44 pixels); discount field placeholder used as its only label
(fix: real label); price text 3.1:1 contrast on the promotional background
(fix: darken token); horizontal scroll at 360 pixels from a fixed-width
promo banner (fix: reflow). Every finding listed the verification step that
surfaced it. Reported: verified findings; unverified: screen reader pass
(no reader available in that environment, labeled as such).
