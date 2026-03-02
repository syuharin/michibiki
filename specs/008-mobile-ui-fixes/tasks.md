# Tasks: Mobile UI and Interaction Fixes

## Feature Information
- **Feature Name**: Mobile UI and Interaction Fixes
- **Branch**: `008-mobile-ui-fixes`
- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md)

## Implementation Strategy
We follow an incremental delivery approach focusing on the core mobile interaction (dragging) first, then the visual layout scaling, and finally the space-saving collapsible hand UI.

1. **Phase 1 & 2**: Infrastructure and foundational adjustments to sensors and layout containers.
2. **Phase 3**: Core touch interaction (User Story 1 - P1).
3. **Phase 4**: Responsive scaling and layout (User Story 2 & 3 - P2).
4. **Phase 5**: Space optimization (Collapsible Hand).

---

## Phase 1: Setup
- [X] T001 Verify project development environment and mobile emulation tools (Chrome DevTools)

## Phase 2: Foundational
- [X] T002 [P] Update `GameContainer.tsx` to include `max-h-screen` and `overflow-hidden` on the root container
- [X] T003 [P] Configure global CSS for `touch-action: none` on the viewport to prevent unwanted native scrolling during game sessions in `src/app/globals.css`

## Phase 3: User Story 1 - Enable Mobile Touch Dragging (Priority: P1)
**Goal**: Allow players to drag and drop tiles on touch devices without browser interference.
**Independent Test**: Load game on mobile device/emulator, drag a tile, and verify it tracks the finger and drops on release.

- [X] T004 [US1] Adjust `TouchSensor` configuration in `src/components/game/GameContainer.tsx` (reduce delay/tolerance)
- [X] T005 [US1] Ensure `touch-action: none` is applied to all draggable tile elements in `src/components/game/Tile.tsx`
- [X] T006 [US1] Verify that `onDragEnd` triggers immediately upon finger release in `src/components/game/GameContainer.tsx`

## Phase 4: User Story 2 & 3 - Compact Layout & Tile Sizing (Priority: P2)
**Goal**: Ensure the game board and tiles fit perfectly within a single screen across all mobile devices.
**Independent Test**: Check various device resolutions in DevTools; verify no scrollbars appear and tiles align perfectly with grid cells.

- [X] T007 [P] [US2] Implement dynamic board scaling using CSS variables or viewport units in `src/components/game/Board.tsx`
- [X] T008 [P] [US3] Refactor `src/components/game/Tile.tsx` to use `w-full h-full` and relative SVG scaling instead of fixed pixel sizes
- [X] T009 [US2] Update `src/components/game/Board.tsx` coordinate labels (A-F, 1-6) to scale proportionally with the grid size
- [X] T010 [US3] Ensure `Board.tsx` grid cell containers have defined relative dimensions to support `w-full` tiles

## Phase 5: Space Optimization - Collapsible Hand
**Goal**: Maximize board visibility in portrait mode by making the hand minimizable.
**Independent Test**: Click toggle button to collapse hand; verify board remains visible and hand can be re-expanded.

- [X] T011 [US2] Add `isHandExpanded` state to `src/components/game/GameContainer.tsx`
- [X] T012 [P] [US2] Update `src/components/game/Hand.tsx` to accept and reflect the `isExpanded` state
- [X] T013 [US2] Implement the toggle UI (single-tap/click) in `src/components/game/Hand.tsx` or `GameContainer.tsx` to meet SC-004
- [X] T014 [US2] Add transition animations for expanding/collapsing the hand in `src/components/game/Hand.tsx`

## Phase 6: Polish & Cross-Cutting
- [X] T015 Verify WCAG AA contrast ratios are maintained after scaling in `src/components/game/Tile.tsx`
- [X] T016 Perform final responsive test across iPhone SE (gen 1, 320px), iPhone 12 Pro, and Pixel 5 emulators
- [X] T017 [P] Update `specs/008-mobile-ui-fixes/quickstart.md` with any finalized implementation details
- [X] T018 [US1] Implement single-touch enforcement to prevent multi-touch conflicts during drag in `src/components/game/GameContainer.tsx`
- [X] T019 [US2] Explicitly verify layout stability and interaction responsiveness on 320px width viewports (iPhone SE gen 1)

---

## Dependencies
- Foundational (T002-T003) -> User Story 1 (T004-T006)
- User Story 1 (T004-T006) -> User Story 2 & 3 (T007-T014)

## Parallel Execution Examples
- **Setup & Foundational**: T002 and T003 can be worked on simultaneously.
- **US2 & US3 Implementation**: T007 (Board scaling) and T008 (Tile refactoring) are independent and can be parallelized.
- **Polish**: T015 and T017 can be completed in parallel after the main features are implemented.
