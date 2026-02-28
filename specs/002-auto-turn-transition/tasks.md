# Tasks: Automatic Turn Transition & Button Removal

**Input**: Design documents from `/specs/002-auto-turn-transition/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Vitest is used for testing. Test tasks are included to verify logic and UI changes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Verify `002-auto-turn-transition` branch environment
- [x] T002 [P] Confirm Vitest configuration in `vitest.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic and utilities required for both user stories

- [x] T003 [P] Create legal move detection utility `hasLegalMove` in `src/lib/game/validation.ts`
- [x] T004 [P] Create unit tests for `hasLegalMove` in `src/tests/validation.test.ts`
- [x] T005 [P] Update `GameAction` type to include `PASS_TURN` and deprecate `CONFIRM_TURN` notes in `src/types/game.ts`
- [x] T006 Update `gameReducer` in `src/context/GameContext.tsx` to handle `PASS_TURN` (identical to old `CONFIRM_TURN` logic initially)

**Checkpoint**: Foundation ready - move detection and basic action types are available.

---

## Phase 3: User Story 1 - Regular Auto-Turn (Priority: P1) 🎯 MVP

**Goal**: Automatically transition turn and refill hand after a tile is placed.

**Independent Test**: Place a tile as Host/Guest and verify the turn indicator changes and hand refills without clicking "End Turn".

### Tests for User Story 1

- [x] T007 [P] [US1] Create integration test for auto-turn transition in `src/tests/auto-turn.test.ts`

### Implementation for User Story 1

- [x] T008 [US1] Modify `PLACE_TILE` logic in `gameReducer` (`src/context/GameContext.tsx`) to trigger turn transition logic, including reversal tile countdown decrement (FR-003).
- [x] T009 [US1] Update `useGameLogic` hook in `src/hooks/useGameLogic.ts` to remove `confirmTurn` export and ensure `placeTile` handles sequential local dispatch if needed.
- [x] T010 [US1] Update Host intent handling in `src/app/room/[id]/page.tsx` (or relevant P2P coordinator) to automatically dispatch `PASS_TURN` logic after `PLACE_TILE`.
- [x] T011 [US1] Remove "ターン終了" button from `src/components/game/GameContainer.tsx`.
- [x] T012 [US1] Verify hand refill logic works atomically with the automatic turn switch.

**Checkpoint**: User Story 1 is functional. Turns transition automatically upon placement.

---

## Phase 4: User Story 2 - Empty Hand & Pass Logic (Priority: P2)

**Goal**: Handle "No Legal Moves" with a Pass button and automatically skip players with empty hands.

**Independent Test**: Verify "Pass" button appears when no moves are possible, and verify immediate skip for empty-handed players.

### Accessibility and P2P Compliance Check (MANDATORY) ⚠️

- [x] T013 [P] [US2] Verify "Pass" button meets 4.5:1 contrast ratio in monotone theme
- [x] T014 [P] [US2] Verify P2P synchronization of the automatic skip state transition
- [x] T015 [P] [US2] Test "Pass" button visibility on mobile viewports in `src/components/game/GameContainer.tsx`

### Tests for User Story 2

- [x] T016 [P] [US2] Add test case for `hasLegalMove` with empty hand/deck in `src/tests/validation.test.ts`
- [x] T017 [P] [US2] Add integration test for automatic skipping in `src/tests/skip-logic.test.ts`

### Implementation for User Story 2

- [x] T018 [US2] Implement `isPassAvailable` derived state logic in `src/components/game/GameContainer.tsx` using `hasLegalMove`.
- [x] T019 [US2] Add "Pass" (パス) button to `src/components/game/GameContainer.tsx` conditioned on `isPassAvailable`.
- [x] T020 [US2] Implement automatic skip logic in `gameReducer` (`src/context/GameContext.tsx`) ensuring reversal tile decrement is applied during each skipped turn (FR-003).
- [x] T021 [US2] Update `status` to `FINISHED` in `gameReducer` (`src/context/GameContext.tsx`) when both players are skipped and have no tiles.

**Checkpoint**: All user stories functional. "Pass" button and empty-hand skipping are working.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation

- [x] T022 [P] Remove any dead code related to manual `CONFIRM_TURN` button in `src/components/game/GameContainer.tsx`
- [x] T023 [P] Update `src/lib/p2p/protocol.ts` documentation to reflect `PASS_TURN` usage
- [x] T024 Run `quickstart.md` validation scenarios and verify SC-005 (total clicks to complete a turn reduced from 2 to 1 for standard moves).
- [x] T025 [P] Final CSS polish for "Pass" button to match monotone aesthetic

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately.
- **Foundational (Phase 2)**: Depends on T001, T002. Blocks T007-T021.
- **User Story 1 (Phase 3)**: Depends on Phase 2.
- **User Story 2 (Phase 4)**: Depends on Phase 2. Can run in parallel with US1 if UI conflicts are managed.
- **Polish (Phase 5)**: Depends on Phase 3 and Phase 4.

### User Story Dependencies

- **US1 (Auto-Turn)**: High priority. Core mechanic change.
- **US2 (Pass/Skip)**: Depends on Foundational logic (T003) but is functionally distinct from US1.

### Parallel Opportunities

- T003, T004, T005 can run in parallel.
- Accessibility checks (T013, T014, T015) can run in parallel with implementation.
- Integration tests (T007, T017) can be prepared in parallel with implementation.

---

## Parallel Example: User Story 2

```bash
# Prepare logic and tests simultaneously
Task T016: "Add test case for hasLegalMove in src/tests/validation.test.ts"
Task T013: "Verify Pass button contrast ratio"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational (T001-T006).
2. Implement US1 (T007-T012).
3. **VALIDATE**: Ensure basic game loop works without the "End Turn" button.

### Incremental Delivery

1. Foundation -> `hasLegalMove` utility and updated Reducer types.
2. MVP -> Automatic turn transition after placement.
3. Feature Complete -> "Pass" button for deadlocks and automatic skipping for empty hands.

---

## Notes

- `CONFIRM_TURN` logic in the reducer is reused for `PASS_TURN`.
- The "Pass" button is a safety net for "No Legal Moves" and should be styled consistently with the "MICHIBIKI" monotone aesthetic.
- P2P sync is critical: only the Host should calculate the "Next Turn Owner" to avoid desync.
