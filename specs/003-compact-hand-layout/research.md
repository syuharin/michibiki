# Research: Compact UI & Right-side Hand Layout

## 1. Responsive Layout Strategy for Hand Component

**Decision:** Use Tailwind CSS orientation and aspect-ratio utilities (e.g., `landscape:` or custom `aspect-video`) for triggering the layout shift, falling back to standard breakpoints (`md:` or `lg:`) if aspect-ratio proves too unpredictable for varying device sizes.
**Rationale:** The specification explicitly states the layout should adapt based on screen aspect ratio (landscape vs. portrait). Tailwind supports `@media (orientation: landscape)` via the `landscape:` modifier.
**Alternatives considered:** Using JS `window.innerWidth` / `window.innerHeight` ratio checks, but CSS is more performant and cleaner for layout switching.

## 2. Adaptive Overlapping in Vertical Hand

**Decision:** Use dynamic inline styles for `margin-top` on card elements based on the hand array length, combined with a wrapper that restricts the total height. Alternatively, use a CSS grid with overlapping rows.
**Rationale:** Standard CSS flexbox doesn't natively support "adaptive overlap" (shrinking gap to negative as items increase). Calculating the overlap percentage in React based on `hand.length` and applying it via inline `style={{ marginTop: index > 0 ? `-${overlap}px` : 0 }}` provides the exact control needed to keep the hand within the viewport.
**Alternatives considered:** CSS `gap` with negative values (not supported), or relying solely on a scrollbar (violates the "adaptive overlap" requirement before scrolling).

## 3. Expand Leftwards Hover Behavior

**Decision:** Use Tailwind classes `transition-transform hover:-translate-x-4 hover:z-10` on the vertical hand cards.
**Rationale:** Simple, performant, and leverages the GPU for animation. The `z-10` ensures the hovered card renders above the adjacent cards.
**Alternatives considered:** Framer Motion (adds complexity for a simple hover effect).
