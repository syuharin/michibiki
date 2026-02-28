# Tasks: Display Opponent Score and Deck Count

**Input**: Design documents from `/specs/004-opponent-stats-display/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Exact file paths are included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and component scaffolding

- [x] T001 Create `src/components/game/Deck.tsx` with basic props (`count: number`) and monotone styling base

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic for identifying players and scores in the synchronized state

**⚠️ CRITICAL**: Must be complete before UI integration

- [x] T002 Update `src/components/game/GameContainer.tsx` to derive `opponentPeerId` and `opponentScore` from `GameState` and `isHost` status

---

## Phase 3: User Story 1 - Track Opponent Progress (Priority: P1) 🎯 MVP

**Goal**: Display opponent's score next to their avatar/name for strategic awareness

**Independent Test**: Verify opponent score updates in UI when state changes in a 1v1 match

### Implementation for User Story 1

- [x] T003 [US1] Update `src/components/game/GameContainer.tsx` to include a dedicated score section for the opponent adjacent to their avatar/name info area
- [x] T004 [US1] Add `Trophy` icon from `lucide-react` next to the opponent's score in `src/components/game/GameContainer.tsx`
- [x] T005 [US1] Implement conditional rendering in `src/components/game/GameContainer.tsx` to show opponent stats only when a guest is connected

**Checkpoint**: Opponent score is now visible and synchronizes correctly in 1v1 play

---

## Phase 4: User Story 2 - Monitor Deck Size (Priority: P2)

**Goal**: Provide a clear visual indicator of remaining cards in the deck

**Independent Test**: Verify deck count overlay decreases on the deck icon when a tile is drawn

### Implementation for User Story 2

- [x] T006 [P] [US2] Implement `Layers` icon and absolute-positioned count overlay badge in `src/components/game/Deck.tsx`
- [x] T007 [US2] Integrate `Deck.tsx` into the horizontal status bar in `src/components/game/GameContainer.tsx`
- [x] T008 [US2] Pass `state.deck.length` from `GameContainer.tsx` to the `Deck` component as a prop

**Checkpoint**: Deck count is now visible as an overlay on the deck icon and updates in real-time

---

## Phase 5: Polish & Compliance

**Purpose**: Accessibility verification and responsive refinement

- [x] T009 [P] Verify WCAG AA contrast ratio (4.5:1) for score and deck count text in `src/components/game/GameContainer.tsx` and `src/components/game/Deck.tsx`
- [x] T010 [P] Test responsive behavior of the new stats bar in `src/components/game/GameContainer.tsx` across mobile and desktop viewports
- [x] T011 [P] Run quickstart.md validation, including visual checks for 3-digit numbers and negative scores (layout integrity)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phase 3-4)**: Depend on Foundational phase completion (T002)
- **Polish (Phase 5)**: Depends on all implementation tasks (T003-T008)

### Parallel Opportunities

- T001 (Setup) and T002 (Foundational logic) can be worked on in parallel
- Once T002 is complete, US1 (T003-T005) and US2 (T006-T008) can proceed in parallel
- T009 and T010 (Polish) can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2 (Setup and Opponent logic)
2. Complete Phase 3 (User Story 1 - Score display)
3. **STOP and VALIDATE**: Verify 1v1 score tracking works correctly

### Incremental Delivery

1. Add User Story 2 (Deck count) after US1 is stable
2. Finalize with Phase 5 (Polish/Accessibility)
