# Motion Engineering

Depth for the motion parts of Pass 2 (Warp) and Pass 4 (Finish), and for all
Motion-tier tasks. Load this file when planning, implementing, or reviewing
animation.

## 1. The purpose test

Before adding any animation, answer all five questions in one sentence each:

1. **Need:** what user need does this serve (orientation, feedback, causal
   connection, continuity)?
2. **Sufficiency:** why is a simpler solution (an instant change, a CSS
   transition) insufficient?
3. **Preference:** what happens when `prefers-reduced-motion: reduce` is set?
4. **Lifecycle:** is the animation cleaned up on unmount, and what happens if
   it is interrupted mid-flight?
5. **Cost:** what does it add to bundle size and main-thread work?

If any answer is missing, the animation is not ready to build. If the need
cannot be stated, the animation is decoration; cut it.

## 2. The motion ladder

Choose the simplest rung that meets the verified need. Climb only when the
current rung genuinely cannot do the job.

### Rung 1: CSS transitions and animations

Best for state changes: hover, focus, show and hide, enabled and disabled,
simple reveals.

- Animate only `transform` and `opacity` where possible; they run on the
  compositor. Animating `width`, `height`, `top`, or `left` forces layout on
  every frame.
- Use `transition` for state-to-state changes, `@keyframes` for multi-step
  loops.
- Reduced motion: wrap in a `@media (prefers-reduced-motion: no-preference)`
  query or shorten durations to near zero under `reduce`.
- Costs nothing in bundle size. This is the default rung.

### Rung 2: Web Animations API (WAAPI)

Best when JavaScript control is required without a dependency: programmatic
start and stop, interruption handling, composition, animation of non-CSS
values, playback-rate control, or synchronizing with application state.

- `element.animate()` returns an `Animation` object with `cancel()`,
  `pause()`, `finished`, and `onfinish`. Keep the handle so you can clean up.
- Handles interruption explicitly: the developer decides what interrupting a
  running transition means (commit, reverse, or cancel).
- Reduced motion: check `matchMedia('(prefers-reduced-motion: reduce)')` and
  skip or shorten the animation.

### Rung 3: A purpose-chosen library (for example Anime.js or Motion)

Justified only when its capabilities are the requirement, for example:

- Complex timelines with overlapping, sequenced choreography.
- Spring physics or interruptible gesture-driven animation.
- Layout transitions (measured position changes between states).
- Framework-integrated scroll-linked animation, drag, or enter and exit
  orchestration across a component tree.

Known trade-offs observed in the 2026-10-19 reference analysis of
primary sources:

- **Anime.js** (v4.x, MIT): framework-agnostic, modular ESM imports so you pay
  only for the modules you use; strong timeline, stagger, scroll observer, and
  drag APIs; you handle reduced-motion yourself (media queries or its Scope
  API).
- **Motion** (MIT core): first-class React and Vue packages; hybrid engine
  using native browser APIs with JS fallback; built-in
  `useReducedMotion` / `reducedMotion` support; premium features exist behind
  the paid Motion+ tier, so check that the parts you use are in the free core.
- Both are actively maintained per the October 2026 check, but verify the
  current state before adding a dependency; maintenance status is a
  point-in-time observation, not a guarantee.

Choosing between them: pick by programming model, not by feature list.
Declarative state-driven UI motion in React or Vue fits Motion's model;
imperative choreography in vanilla JS, canvas-adjacent work, or SVG text and
shape effects fit Anime.js. When the task fits CSS or WAAPI, choose no library
at all.

## 3. Hard requirements (all rungs)

- **Reduced motion is mandatory.** Provide a meaningful alternative: shortened
  durations, opacity-only fades, or instant state changes. The content and
  function must be identical.
- **No scroll hijacking.** Never intercept or rewrite scroll behavior, trap
  scrolling, or make motion interfere with reading or navigation. Scroll-linked
  effects must remain passive and escapable.
- **Keyboard and touch parity.** Every animated interaction must work from the
  keyboard and from touch. Do not put behavior behind hover alone.
- **Cleanup.** Cancel or complete animations on unmount. Long-running loops
  must stop when offscreen or hidden (`document.visibilitychange`).
- **Interruption.** Decide and implement what happens when a user interacts
  mid-animation: the interface must never be left in a half-state.
- **Performance honesty.** Do not report performance improvements without
  measuring them in the target environment and recording the conditions.
  Prefer compositor-friendly properties; budget long tasks; test on a mid-tier
  device profile when possible.

## 4. Review checklist (Motion tier)

1. Does every animation pass the five-question purpose test?
2. Is reduced motion handled for every animated path?
3. Are all animations cleaned up on unmount and on tab hide?
4. Are interrupted transitions handled?
5. Are animated properties compositor-friendly (transform, opacity)?
6. Is there any scroll hijacking or reading interference? Remove it.
7. Is the dependency justified by capabilities CSS and WAAPI lack?
8. Were performance effects measured, or explicitly left unverified?
