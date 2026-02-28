# Tasks: Board Coordinate Markers

**Input**: Design documents from `/specs/006-board-coordinate-markers/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and code awareness

- [x] T001 Read and analyze the current implementation of `src/components/game/Board.tsx` to identify grid structure dependencies

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared logic for coordinate mapping

- [x] T002 [P] Create coordinate mapping constants (A-F, 1-6) in `src/lib/constants/coordinates.ts`

---

## Phase 3: User Story 1 - External Coordinate Labels (Priority: P1) 🎯 MVP

**Goal**: Display A-F and 1-6 markers outside the board area

**Independent Test**: Labels 'A'-'F' are visible above the board and '1'-'6' are visible to the left, correctly aligned with the cells.

### Implementation for User Story 1

- [x] T003 [US1] Update `src/components/game/Board.tsx` to use a 7x7 grid layout (expanding from 6x6), handling the top-left intersection as an empty spacer cell
- [x] T004 [US1] Implement rendering logic for the top label row (A-F) in `src/components/game/Board.tsx` using the mapping from T002
- [x] T005 [US1] Implement rendering logic for the left label column (1-6) in `src/components/game/Board.tsx` using the mapping from T002
- [x] T006 [US1] Adjust grid styles in `src/components/game/Board.tsx` to ensure labels are centered and have high visibility

**Checkpoint**: User Story 1 complete - coordinate markers are visible and aligned outside the board.

---

## Phase 4: User Story 2 - Clean Cell UI (Priority: P2)

**Goal**: Remove internal cell coordinates to reduce visual clutter

**Independent Test**: No numeric coordinates (e.g., "0,0") are visible inside any of the board cells.

### Implementation for User Story 2

- [x] T007 [US2] Remove the coordinate `<span>` element from `CellComponent` in `src/components/game/Board.tsx`

**Checkpoint**: User Story 2 complete - board cells are clean and focus only on tiles.

---

## Phase 5: User Story 3 - Responsive Marker Alignment (Priority: P3)

**Goal**: Ensure labels remain perfectly aligned across all screen sizes

**Independent Test**: Labels stay centered relative to their columns/rows when the browser window is resized.

### Accessibility and P2P Compliance Check (MANDATORY) ⚠️

- [x] T008 [P] Verify WCAG AA contrast ratio (4.5:1) for the new alphanumeric labels in `src/components/game/Board.tsx`
- [x] T009 [P] Test responsive behavior across mobile and desktop viewports to ensure labels stay centered with cells

### Implementation for User Story 3

- [x] T010 [US3] Refine CSS Grid/Tailwind unit choices in `src/components/game/Board.tsx` to guarantee fractional alignment during scaling

**Checkpoint**: All user stories complete - labels are responsive and accessible.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and styling consistency

- [x] T011 [P] Ensure all marker text uses `michibiki-black` and `font-black` for consistent monotone branding
- [x] T012 Run `npm run build` to ensure no UI regressions or build errors
- [x] T013 Run quickstart.md validation to confirm all scenarios work as expected

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 & 2**: Can start immediately.
- **Phase 3 (US1)**: Depends on T002.
- **Phase 4 (US2)**: Can be done in parallel with US1, but ideally after grid expansion.
- **Phase 5 (US3)**: Depends on US1 completion.
- **Phase 6 (Polish)**: Depends on all US phases.

### User Story Dependencies

- **US1 (P1)**: The core feature.
- **US2 (P2)**: Clean-up task.
- **US3 (P3)**: Optimization for responsiveness.

### Parallel Opportunities

- T002 can be done in parallel with T001.
- T008 and T009 can run in parallel with T010.
- T011 can be done in parallel with other polish tasks.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001 and T002.
2. Implement 7x7 grid and labels (T003-T006).
3. **VALIDATE**: Visual check of A-F and 1-6 markers.

### Incremental Delivery

1. Add External Markers (US1) → MVP functionality.
2. Clean Internal Markers (US2) → Enhanced aesthetics.
3. Optimize Responsiveness (US3) → Final quality polish.

---

## Notes

- All tasks follow the strict format `- [ ] [ID] [P?] [Story] Description`.
- Total task count: 13
- Estimated time: 2-3 hours
- Each user story is independently testable via visual verification.
