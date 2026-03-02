# Tasks: Accessibility and Score UI Improvement

**Feature**: Accessibility and Score UI Improvement
**Branch**: `010-accessibility-score-ui`
**Date**: 2026-03-01
**Status**: Ready

## Implementation Strategy

We follow an incremental delivery approach, starting with the core accessibility foundation (Tailwind configuration) followed by the high-priority score visibility improvement (US1). Finally, we perform a global audit and fix accessibility issues across all application screens (US2) to ensure full WCAG 2.1 AA compliance.

- **MVP**: Complete US1 (Score Visibility) and the primary contrast adjustment.
- **Incremental Delivery**: US2 (Global Audit) will be implemented as a second stage.

## Phase 1: Setup

- [X] T001 Update `michibiki-gray` color to `#57657A` in `tailwind.config.ts` to ensure 4.5:1 contrast ratio
- [X] T002 Verify color change in `tailwind.config.ts` does not break existing layout or build

## Phase 2: Foundational

- [X] T003 [P] Perform global grep search for `text-michibiki-gray-light` usage on `bg-michibiki-white`
- [X] T004 [P] Perform global grep search for `text-michibiki-gray` usage on `bg-michibiki-white`
- [X] T005 Create a list of components requiring contrast fixes based on search results

## Phase 3: User Story 1 - Clear Score Visibility (Priority: P1)

**Goal**: Increase player score visibility and ensure it is easily readable on all devices.
**Independent Test**: Open game room and verify score is significantly larger (text-lg/text-3xl) and maintains high contrast.

- [X] T006 [US1] Update score font size from `text-sm sm:text-xl` to `text-lg sm:text-3xl` in `src/components/game/GameContainer.tsx`
- [X] T007 [US1] Add `aria-live="polite"` attribute to the score container in `src/components/game/GameContainer.tsx` for screen reader announcements
- [X] T008 [US1] Verify score visibility on mobile layout (320px width) in `src/components/game/GameContainer.tsx`
- [X] T009 [US1] Verify score visibility on desktop layout in `src/components/game/GameContainer.tsx`

## Phase 4: User Story 2 - WCAG AA Compliance (Priority: P2)

**Goal**: Ensure entire application meets WCAG 2.1 AA standards.
**Independent Test**: Run accessibility audit (e.g., Axe or Lighthouse) on landing, matchmaking, and game room pages.

- [X] T010 [P] [US2] Audit and fix contrast issues in `src/app/page.tsx` (Landing page)
- [X] T011 [P] [US2] Audit and fix contrast issues in `src/components/matchmaking/RoomShare.tsx`
- [X] T012 [P] [US2] Audit and fix contrast issues in `src/components/game/ResultModal.tsx`
- [X] T013 [US2] Perform final manual accessibility audit of all application screens using browser developer tools

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T014 Verify responsive behavior of increased font sizes on all screens (320px to 1440px)
- [X] T015 Final validation of all success criteria defined in `spec.md` (including SC-002: screen reader notification within 2 seconds)

## Dependencies

1. **Foundational (Phase 2)** must be completed before **Phase 4 (US2)** implementation.
2. **Setup (Phase 1)** is a prerequisite for all subsequent phases.

## Parallel Execution Examples

- **UI Audits**: T010, T011, and T012 can be executed in parallel as they target different files.
- **Initial Searches**: T003 and T004 can be executed in parallel.
