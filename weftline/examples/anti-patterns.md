# Anti-Patterns

Requests and habits that Weftline refuses, corrects, or escalates, with the
expected response pattern for each. Refusal is part of the method, not a
failure state: the goal is to redirect toward work that survives contact with
real users. These scenarios apply at every depth tier; the refusal itself does
not shrink when the tier is Patch, only the surrounding process does.

## 1. Fake social proof

Request: "Add some testimonials and a few company logos so the landing page
looks established. Make up realistic names."

Why it is refused: fabricated testimonials, reviews, client logos, and trust
badges are prohibited. They misrepresent the product to real users and may
constitute legal exposure for the owner.

Response pattern: refuse the fabrication, then offer honest alternatives:
request real quotes from actual customers, ship the page without social
proof, or surface verifiable facts (how long the product has existed, real
changelog, real team page). If the user insists, state the refusal and the
reason once, clearly, and proceed with everything else in the task.

## 2. Invented metrics and counters

Request: "Show 10,000+ happy users and 99.9% uptime on the homepage."

Why it is refused: invented metrics are prohibited, and Pass 5 forbids
claiming anything that was not measured.

Response pattern: ask the owner for the real numbers and a source. If real
numbers exist, implement them with the source date in a comment. If they do
not, replace the counter with something true (feature list, changelog
highlight, real screenshot).

## 3. Vague hero copy

Request: "The headline should just say: Unleash the Future of Possibility."

Why it is corrected: hero copy must explain what the product does in one
specific sentence. A stranger should be able to repeat back what the product
is for.

Response pattern: draft three specific alternatives grounded in actual
functionality ("Encrypted backups for small teams. Set a schedule, forget it
exists."), ship the best one, and leave the others as comments. Explain the
one-sentence test.

## 4. Decoration posing as design

Request: "Add a purple gradient hero, glassmorphism cards, a custom cursor
that sparkles, and some floating blobs. Everyone does it."

Why it is corrected: decorative gradients without purpose, gratuitous
glassmorphism, and cursor-following effects are prohibited; each must state
its purpose or be cut. A custom cursor also breaks user expectations and
pointer accessibility.

Response pattern: explain the purpose test, then propose where a restrained
visual decision would earn attention instead (typography scale, one accent
color, real product imagery, spacing).

## 5. Motion that damages usability

Request: "Make the whole page animate in on scroll, and stop users from
skipping the intro animation."

Why it is refused: scroll hijacking and motion that interferes with reading
or navigation are prohibited. Forcing users to watch is the definition of
interference.

Response pattern: keep any animation that passes the purpose test, shorten
it, gate it behind `prefers-reduced-motion`, and never block scrolling.
references/motion-engineering.md contains the exact rules to cite.

## 6. Fake progress and simulated function

Request: "Just show a progress bar for three seconds when they click import;
it feels faster even though the import is instant."

Why it is refused: fake progress indicators and misleading loading states are
prohibited. Lying about system state erodes trust and hides real errors.

Response pattern: implement an honest state: instant import shows instant
success; slow import shows a real determinate bar if progress is knowable, or
an honest indeterminate indicator labeled with what is happening.

## 7. Emoji as interface icons

Request: "Use emoji for the nav icons, it's friendly."

Why it is corrected: emoji in interfaces are prohibited in this method. They
render inconsistently across platforms, conflict with iconography, and
complicate assistive technology announcement.

Response pattern: use the project's icon system (or two inline SVG icons if
none exists), which keeps announcements and alignment consistent.

## 8. Skipping verification

Habit: "The build passed, so the page is done."

Why it is corrected: a passing build proves compilation, not behavior. Pass 5
requires rendering, interaction, and honest categories.

Response pattern: open the preview, exercise the main flow, check a narrow
and a wide viewport, then report verified, unverified, and blocked items
separately. If no browser tool exists, say so and list the checks for a
human to run, in order.
