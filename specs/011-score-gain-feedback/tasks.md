# Tasks: Score Gain Feedback

**Input**: Design documents from `/specs/011-score-gain-feedback/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included for core logic verification per quickstart.md guidelines.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Define `ScoreEffectEvent` and `TileCoordinate` types in `src/types/game.ts`
- [x] T002 [P] Add `SCORE_GAIN_EFFECT` to `P2PMessageType` enum in `src/lib/p2p/protocol.ts`
- [x] T002.1 [P] Define `SCORE_EFFECT_DURATION` constant (default: 2000) in `src/lib/constants/game.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update `GameContext.tsx` to include `effects` state (ActiveAnimations) in the `GameState`
- [x] T004 Implement `addScoreEffect` and `removeScoreEffect` actions in `src/context/GameContext.tsx`
- [x] T005 Update P2P message handling in `src/hooks/usePeer.ts` to dispatch `SCORE_GAIN_EFFECT` to the game state

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Immediate Score Visibility (Priority: P1) 🎯 MVP

**Goal**: Display a floating "+N" indicator at the top-right of each scoring tile, where N is the tile's total contribution.

**Independent Test**: Place a scoring tile and verify that "+1" (or "+2" for multiple paths) appears at the top-right of each involved tile and floats upward.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create `FloatingScore.tsx` component with float-up-and-fade animation in `src/components/game/FloatingScore.tsx`
- [x] T007 [US1] Integrate `FloatingScore` into `src/components/game/Board.tsx` to render indicators based on active effects
- [x] T008 [US1] Update move handling logic in `src/hooks/useGameLogic.ts` to calculate per-tile score contribution and trigger/broadcast `SCORE_GAIN_EFFECT`
- [x] T009 [US1] Add logic to `src/lib/game/scoring.ts` to identify all tiles in a connection and their overlap count for multiple paths

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Connection Highlighting (Priority: P2)

**Goal**: Highlight all tiles contributing to a score with a Gold/Yellow glow effect.

**Independent Test**: Place a scoring tile and verify all involved tiles exhibit a soft Gold/Yellow glow simultaneously with the score indicators.

### Implementation for User Story 4

- [x] T010 [P] [US2] Add `.tile-glow` CSS keyframes and class to `src/app/globals.css` using `box-shadow` (Gold: #FFD700)
- [x] T011 [P] [US2] Update `src/components/game/Tile.tsx` to accept an `isHighlighted` prop and apply the `.tile-glow` class
- [x] T012 [US2] Update `src/components/game/Board.tsx` to determine `isHighlighted` status for each tile by checking if its coordinates are in the active `effects` path

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and accessibility validation

### Accessibility and P2P Compliance Check (MANDATORY) ⚠️

- [x] T013 [P] Verify WCAG AA contrast ratio (4.5:1) for `FloatingScore` text (White with Black outline)
- [x] T014 [P] Test responsive behavior of `FloatingScore` on mobile viewports (size and position)
- [x] T015 [P] Verify P2P data synchronization: confirm both players see the same indicators and glows for every scoring move

### Final Verification

- [x] T016 [P] Add unit test for score effect calculation and triggering in `src/tests/game-logic.test.ts`
- [x] T017 Run `npm test` and validate `quickstart.md` steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - defines the types and messages.
- **Foundational (Phase 2)**: Depends on Phase 1 - sets up the state management.
- **User Stories (Phase 3 & 4)**: Both depend on Phase 2 completion.
  - US1 (P1) is the MVP and should be prioritized.
  - US2 (P2) can be implemented in parallel with US1 as they touch different parts of the UI logic.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### Parallel Opportunities

- T001 and T002 can be done together.
- T006 [US1] and T010, T011 [US2] can be developed in parallel as they create separate UI/CSS components.
- All Polish tasks (T013-T016) can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup (Phase 1)
2. Complete Foundational (Phase 2)
3. Complete User Story 1 (Phase 3)
4. **STOP and VALIDATE**: Test that score indicators appear correctly on both peers.

### Incremental Delivery

1. Setup + Foundational → State & Communication ready.
2. Add US1 → Visual score feedback delivered (MVP).
3. Add US2 → Satisfying visual highlights delivered.
4. Polish → Accessibility and robustness verified.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- The floating score indicator uses white text with a black outline to ensure legibility on any tile color.
- Glow effect duration is synchronized with the floating score duration (2 seconds).
