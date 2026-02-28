# Tasks: Compact UI & Right-side Hand Layout

**Input**: Design documents from `specs/003-compact-hand-layout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: No specific automated tests requested. Verification will be performed manually per `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Analyze current `src/components/game/GameContainer.tsx` and `src/components/game/Hand.tsx` for layout injection points
- [x] T002 Review existing Tailwind configuration for orientation support

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Update `src/components/game/Hand.tsx` to accept a `layout` prop (`"bottom" | "right"`)
- [x] T004 [P] Update `src/components/game/GameContainer.tsx` to prepare for conditional rendering based on orientation

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Right-side Hand Layout (Priority: P1) 🎯 MVP

**Goal**: Display hand on the right side in landscape mode with vertical alignment and adaptive overlapping.

**Independent Test**: Open game in landscape window; hand is on the right, top-aligned, and cards overlap as hand grows.

### Implementation for User Story 1

- [x] T005 [P] [US1] Implement vertical, top-aligned, fixed-width, and no-header column styling with overflow-y-auto for Hand.tsx in src/components/game/Hand.tsx
- [x] T006 [US1] Implement adaptive overlapping logic using dynamic margin-top based on hand length in src/components/game/Hand.tsx
- [x] T007 [P] [US1] Implement "Expand Leftwards" hover effect (hover:-translate-x-4) in src/components/game/Hand.tsx
- [x] T008 [US1] Update src/components/game/GameContainer.tsx to position Hand to the right and ensure Board container auto-resizes to fill remaining space

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently in landscape mode.

---

## Phase 4: User Story 2 - Responsive Layout Adaptation (Priority: P1)

**Goal**: Automatically switch hand position based on screen orientation.

**Independent Test**: Resize window from wide to narrow; hand moves from right to bottom smoothly.

### Implementation for User Story 2

- [x] T009 [US2] Implement automatic layout switching logic (using `landscape:` classes) in `src/components/game/GameContainer.tsx` to toggle between bottom and right hand positions
- [x] T010 [US2] Verify and adjust card drawing/playing animations for both layouts in `src/components/game/GameContainer.tsx` and `src/components/game/Tile.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently and switch correctly.

---

## Phase 5: User Story 3 - Compact Board Layout (Priority: P2)

**Goal**: Reduce whitespace and optimize UI elements for a compact feel.

**Independent Test**: UI elements occupy less vertical/horizontal space; board is more efficient.

### Implementation for User Story 3

- [x] T011 [P] [US3] Reduce margins and optimize font sizes in `src/components/game/GameContainer.tsx` turn/score headers
- [x] T012 [P] [US3] Adjust `src/components/game/Board.tsx` grid gap and padding for a more compact appearance

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T013 [P] Verify WCAG AA contrast ratio (4.5:1) for all new UI elements in `src/components/game/GameContainer.tsx`
- [x] T014 [P] Verify player identification via line styles (Solid/Double) for color vision diversity in `src/components/game/Hand.tsx`
- [x] T015 [P] Test responsive behavior across mobile and desktop viewports per `specs/003-compact-hand-layout/quickstart.md`
- [x] T016 Run `specs/003-compact-hand-layout/quickstart.md` final validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 and US2 are P1 and should be prioritized
  - US3 is P2 and can follow
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- T003 and T004 in Foundational phase can run in parallel
- T005 and T007 in US1 can run in parallel
- T011 and T012 in US3 can run in parallel
- Most Polish tasks (T013, T014, T015) can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently in landscape mode

### Incremental Delivery

1. Foundation ready
2. Add US1 → Test independently
3. Add US2 → Test responsive switching
4. Add US3 → Polish for compactness
5. Final verification per Quickstart

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
