# Tasks: Choose Turn Order

**Input**: Design documents from `/specs/005-choose-turn-order/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Add `TurnOrderOption` type and update `GameState` with `turnOrderConfig` and `startingPlayerId` in src/types/game.ts
- [x] T002 [P] Add `SET_TURN_ORDER` and `SET_GUEST_ID` to `GameAction` type in src/types/game.ts
- [x] T003 Update `initialState` with `turnOrderConfig: 'UNSELECTED'` in src/context/GameContext.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Update `gameReducer` in src/context/GameContext.tsx to handle `SET_TURN_ORDER` and `SET_GUEST_ID` actions
- [x] T005 Modify `START_GAME` reducer case in src/context/GameContext.tsx to use provided `turnOwnerId` instead of defaulting to Host
- [x] T006 Update `usePeer.ts` to dispatch `SET_GUEST_ID` when `JOIN_ROOM` is received (instead of immediate `START_GAME`) in src/hooks/usePeer.ts
- [x] T007 [P] Update `usePeer.ts` synchronization effect to broadcast state during `WAITING_FOR_GUEST` status in src/hooks/usePeer.ts
- [x] T008 [P] Add `SET_TURN_ORDER` to allowed `PLAYER_INTENT` actions in src/lib/p2p/protocol.ts to maintain protocol consistency

**Checkpoint**: Foundation ready - lobby phase is now possible without immediate game start.

---

## Phase 3: User Story 1 - Host decides turn order (Priority: P1) 🎯 MVP

**Goal**: Host can select a specific player to go first and start the game manually.

**Independent Test**: Host selects "Guest is First-mover", starts the game, and verifies that the Guest is the first player to move.

### Implementation for User Story 1

- [x] T009 [P] [US1] Create `TurnOrderSelector` component with monotone styling and accessibility badges in src/components/game/TurnOrderSelector.tsx
- [x] T010 [US1] Implement `setTurnOrder` function in src/hooks/useGameLogic.ts to dispatch `SET_TURN_ORDER` (and send intent if Guest)
- [x] T011 [US1] Implement `startGame` function for the Host in src/hooks/usePeer.ts that calculates initial state and dispatches `START_GAME`
- [x] T012 [US1] Integrate `TurnOrderSelector` and "Start Game" button into the lobby view in src/components/game/GameContainer.tsx
- [x] T013 [US1] Add logic to disable "Start Game" button until `turnOrderConfig !== 'UNSELECTED'` in src/components/game/GameContainer.tsx

**Checkpoint**: At this point, User Story 1 is fully functional. Host can manually set turn order and start.

---

## Phase 4: User Story 2 - Random turn order selection (Priority: P2)

**Goal**: Host can select "Random" and the system fairly determines the first player at the moment of start.

**Independent Test**: Select "Random" multiple times and verify that the first player varies and a results message is displayed.

### Implementation for User Story 2

- [x] T014 [US2] Add "Random" option to `TurnOrderSelector` component in src/components/game/TurnOrderSelector.tsx
- [x] T015 [US2] Implement random resolution logic in the `startGame` function in src/hooks/usePeer.ts
- [x] T016 [US2] Implement emphasis message (e.g., "First-mover: [Player Name]") on game start with a 3-second display duration in src/components/game/GameContainer.tsx

**Checkpoint**: User Story 2 is complete. Randomness is now supported with clear UI feedback.

---

## Phase 5: User Story 3 - Guest visibility of turn order (Priority: P3)

**Goal**: Guest can see the current selection status and knows when the Host is still deciding.

**Independent Test**: Connect as a Guest and verify the screen shows "Host is choosing..." until the Host selects an option, then shows the selection.

### Accessibility and P2P Compliance Check (MANDATORY) ⚠️

- [x] T017 [P] Verify WCAG AA contrast ratio (4.5:1) for all new UI elements in TurnOrderSelector
- [x] T018 [P] Verify player identification via "先行/後攻" text and distinct badge styles (Solid/Double) in TurnOrderSelector
- [x] T019 [P] Verify P2P synchronization of `turnOrderConfig` from Host to Guest via PeerJS
- [x] T020 [P] Test responsive behavior of lobby UI across mobile and desktop viewports

### Implementation for User Story 3

- [x] T021 [US3] Implement "Host is choosing..." status message for the Guest in src/components/game/GameContainer.tsx
- [x] T022 [US3] Add read-only display of current `turnOrderConfig` for the Guest in src/components/game/GameContainer.tsx

**Checkpoint**: All user stories are now independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T023 [P] Ensure consistent monotone theme across all lobby components
- [x] T024 Code cleanup and removal of any hardcoded "Host starts" logic
- [x] T025 [P] Performance check: Ensure state synchronization doesn't cause UI lag in the lobby
- [x] T026 Run quickstart.md validation to confirm all scenarios work as expected

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational.
- **User Story 2 & 3 (Phases 4 & 5)**: Depend on User Story 1 (as they build on the lobby UI).
- **Polish (Phase 6)**: Depends on all stories.

### User Story Dependencies

- **US1 (P1)**: Foundation for turn order selection UI and manual start logic.
- **US2 (P2)**: Extends US1 with random logic.
- **US3 (P3)**: Enhances US1/US2 with Guest feedback.

### Parallel Opportunities

- T001, T002 can run in parallel.
- T007, T008 can run in parallel within Phase 2.
- T009 can be started in parallel with T010/T011 (UI vs Logic).
- T017-T020 (Accessibility/Compliance) can run in parallel with implementation.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2.
2. Complete Phase 3 (US1).
3. **VALIDATE**: Host can pick "Host" or "Guest" and start.

### Incremental Delivery

1. Foundation ready.
2. Manual Selection (US1) → MVP.
3. Random Choice (US2) → Fairness.
4. Guest Feedback (US3) → Polish/UX.

---

## Notes

- Total task count: 26
- US1 tasks: 5
- US2 tasks: 3
- US3 tasks: 2
- Each user story is independently testable once US1 provides the UI base.
- All tasks follow the strict format `- [ ] [ID] [P?] [Story] Description`.
