# Research: Accessibility and Score UI Improvement

## Decisions

### Decision 1: Score Font Size Increase
- **Choice**: Increase score font size from `text-sm sm:text-xl` to `text-lg sm:text-3xl`.
- **Rationale**: Meets the requirement of being at least 1.5x larger than default body text and improves visibility on mobile devices (320px+).
- **Alternatives considered**: 
    - `text-2xl sm:text-4xl`: Rejected as it might cause layout overlaps on very small screens.
    - `text-xl`: Rejected as it doesn't provide enough contrast with other UI elements.

### Decision 2: Contrast Adjustments (WCAG AA)
- **Choice**: Update `michibiki-gray` from `#64748B` to `#57657A` (slate-600) to ensure a more comfortable contrast margin against `#F8FAFC`.
- **Rationale**: Current contrast of `#64748B` on `#F8FAFC` is 4.54:1, which is the absolute minimum for WCAG AA. Increasing it slightly ensures compliance across different displays and prevents "barely passing" scenarios.
- **Alternatives considered**: 
    - Keep current: Rejected due to risk of failing AA on some panels.
    - Change to `michibiki-gray-dark`: Rejected as it reduces visual hierarchy.

### Decision 3: Audit Scope
- **Choice**: Perform a global CSS search for all uses of `text-michibiki-gray-light` and `text-michibiki-gray` on white backgrounds.
- **Rationale**: Entire application must be compliant as per user choice.
- **Alternatives considered**: Game room only (Rejected by user).

## Unknowns Resolved

| Unknown | Finding |
|---------|---------|
| Current Score Implementation | Handled in `GameContainer.tsx` using `text-sm sm:text-xl`. |
| Monotone Palette Contrast | `michibiki-gray` (#64748B) on white (#F8FAFC) is 4.54:1 (Barely AA). `michibiki-gray-light` on white fails. |
| Score Label Visibility | Labels like "You" and "Opponent" use `text-michibiki-gray`, which may be too faint for some users. |

## Accessibility Audit Checklist
- [ ] Audit `src/app/page.tsx` (Landing page)
- [ ] Audit `src/components/matchmaking/RoomShare.tsx`
- [ ] Audit `src/components/game/ResultModal.tsx`
- [ ] Verify `aria-live="polite"` on score updates in `GameContainer.tsx`.
