# Tasks: Display Game Result & Rematch

**Input**: Design documents from `specs/007-game-result-no-cards/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec.md, so focusing on implementation and manual verification as per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Update state and action definitions for the end-game and rematch flow.

- [X] T001 Update `GameState` and `GameAction` types in `src/types/game.ts` to include `FINISHED` and `REMATCH_WAITING` status and `rematchReady` map.
- [X] T002 Update `initialState` in `src/context/GameContext.tsx` to include `rematchReady: {}` and initial `status`.
- [X] T003 [P] Add `GAME_OVER`, `REMATCH_READY`, and `REMATCH_START` message types to `src/lib/p2p/protocol.ts`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core state and message handling across the P2P connection.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 [P] Update `gameReducer` to handle `SET_REMATCH_READY` and `RESET_GAME` actions in `src/context/GameContext.tsx`.
- [X] T005 [P] Update `useGameLogic.ts` to include a `status` guard that prevents all actions (place, rotate, pass) when `status === "FINISHED"`.
- [X] T006 [P] Update `usePeer` to handle incoming `GAME_OVER`, `REMATCH_READY`, and `REMATCH_START` messages in `src/hooks/usePeer.ts`.
- [X] T007 [P] Add a helper function in `src/lib/game/scoring.ts` to determine the winner (Host vs. Guest).

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Automatic Game Over Trigger (Priority: P1) 🎯 MVP

**Goal**: Detect when both players have empty hands/decks and no reversal tiles remain on board.

**Independent Test**: Play a game until hands are empty. Verify `status` transitions to `FINISHED` in local state.

### Implementation for User Story 1

- [X] T008 [US1] Update `finalizeTurn` in `src/context/GameContext.tsx` to check for empty hands/deck AND no reversal tiles on board before transitioning to `FINISHED`.
- [X] T009 [US1] Update `usePeer` or `useGameLogic` to broadcast `GAME_OVER` message when Host detects `FINISHED` status in `src/hooks/usePeer.ts`.
- [X] T010 [US1] Implement Host-authoritative winner calculation before broadcasting the end-game state.

**Checkpoint**: User Story 1 should be fully functional (internal state transitions) and testable independently.

---

## Phase 4: User Story 2 - Clear Result Display (Priority: P1)

**Goal**: Show a clear summary of the game outcome (Win/Loss/Draw) and final scores in a modal.

**Independent Test**: Manually trigger `status: "FINISHED"`; verify the `ResultModal` appears with correct scores and winner labels.

### Implementation for User Story 2

- [X] T011 [P] [US2] Create `ResultModal` component with Win/Loss/Draw status, final scores, and icons in `src/components/game/ResultModal.tsx`.
- [X] T012 [US2] Add monotone styling and Tailwind animations (fade-in/scale) for the modal in `src/components/game/ResultModal.tsx`.
- [X] T013 [US2] Integrate `ResultModal` into the main game room page in `src/app/room/[id]/page.tsx` (conditionally render based on `status === "FINISHED"`).

**Checkpoint**: User Stories 1 AND 2 should now both work together (Game ends -> Modal appears).

---

## Phase 5: User Story 3 - Post-Game Navigation & Rematch (Priority: P2)

**Goal**: Enable "Return to Lobby" (close connection) and "Rematch" (reset board) buttons.

**Independent Test**: Click "Rematch" on both tabs; verify board resets. Click "Return to Lobby"; verify redirection to homepage and connection closure.

### Implementation for User Story 3

- [X] T014 [US3] Add "Rematch" and "Return to Lobby" buttons to the footer of `ResultModal` in `src/components/game/ResultModal.tsx`.
- [X] T015 [US3] Implement `handleRematch` and `handleReturnToLobby` logic in `src/hooks/useGameLogic.ts`.
- [X] T016 [US3] Implement `REMATCH_READY` message exchange logic and local state update in `src/hooks/usePeer.ts`.
- [X] T017 [US3] Implement `RESET_GAME` dispatch logic on Host when both are ready in `src/hooks/usePeer.ts`.
- [X] T018 [US3] Update `gameReducer`'s `RESET_GAME` case to fully clear the board and scores in `src/context/GameContext.tsx`.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, P2P compliance, and validation.

- [X] T019 [P] Verify WCAG AA contrast ratio (4.5:1) for `ResultModal` text and buttons.
- [X] T020 [P] Verify player identification via icons (Trophy for win, Handshake for draw) for color vision diversity in `src/components/game/ResultModal.tsx`.
- [X] T021 [P] Test P2P data synchronization and state consistency across different browser sessions.
- [X] T022 Run `quickstart.md` validation to ensure all user stories are complete.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - US1 and US2 can proceed in parallel once foundational state is ready.
  - US3 integrates with the modal created in US2.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### Parallel Opportunities

- T003 (P2P message types) can be done with T001 (Game types).
- T011 (ResultModal UI) can be done in parallel with T008 (Logic).
- US1 logic and US2 UI components can be developed independently until integration (T013).

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Setup and Foundational work.
2. Implement Game Over trigger (US1).
3. Implement Result Display (US2).
4. **STOP and VALIDATE**: Verify the game ends and shows scores correctly.

### Incremental Delivery

1. Foundation ready.
2. Game Over detection (MVP part 1).
3. Result Modal (MVP part 2).
4. Handshake for Rematch (Post-MVP).
5. Clean-up and Compliance.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Ensure the Host-authoritative rule is followed for `GAME_OVER` and `REMATCH_START` broadcasts.
