# Tasks: Michibiki Core Game Logic

**Input**: Design documents from `specs/001-michibiki-game-core/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/p2p-messages.json

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable (different files, no dependencies)
- **[Story]**: User story mapping (US1, US2, US3, US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and environment setup

- [x] T001 Initialize Next.js project with App Router in `/`
- [x] T002 [P] Install dependencies: `peerjs`, `@dnd-kit/core`, `@dnd-kit/sortable`, `qrcode.react`, `lucide-react`
- [x] T003 [P] Configure Tailwind CSS with monotone color palette in `tailwind.config.ts`
- [x] T004 [P] Setup Vitest and Playwright for testing in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data structures and state management

**⚠️ CRITICAL**: Must be complete before any user story implementation

- [x] T005 [P] Define core TypeScript interfaces (Tile, Cell, Board, GameState) in `src/types/game.ts`
- [x] T006 [P] Create tile connector definitions and rotation maps in `src/lib/constants/tiles.ts`
- [x] T007 [P] Implement Host-authoritative State Store in src/context/GameContext.tsx, ensuring BOARD_SYNC broadcast on turn completion
- [x] T008 [P] Implement PeerJS message serialization/deserialization logic in src/lib/p2p/protocol.ts


**Checkpoint**: Foundation ready - P2P and Gameplay work can now begin in parallel

---

## Phase 3: User Story 1 - P2P Matchmaking and Room Setup (Priority: P1) 🎯 MVP

**Goal**: Establish a direct P2P connection between two players using a shared URL/QR code.

**Independent Test**: Open two browser windows with the same Room ID; verify Host/Guest roles are assigned and connection state is synchronized.

### Implementation for User Story 1

- [x] T009 [P] [US1] Implement room creation and ID generation in `src/app/page.tsx`
- [x] T010 [P] [US1] Create QR code and URL sharing component in `src/components/matchmaking/RoomShare.tsx`
- [x] T011 [US1] Implement `usePeer` hook for PeerJS lifecycle management in `src/hooks/usePeer.ts`
- [x] T012 [US1] Implement `JOIN_ROOM` and `BOARD_SYNC` message handlers in `src/hooks/usePeer.ts`
- [x] T013 [US1] Build room routing logic to handle `/room/[id]` in `src/app/room/[id]/page.tsx`

**Checkpoint**: MVP Part 1 complete - Players can connect and see a synchronized (empty) state.

---

## Phase 4: User Story 2 - Turn-based Tile Placement (Priority: P1)

**Goal**: Enable players to drag, drop, and rotate tiles on a 6x6 grid.

**Independent Test**: Drag a tile to the board, rotate it 90 degrees, and confirm; verify turn switches to the opponent.

### Implementation for User Story 2

- [x] T014 [P] [US2] Build `Tile` component with Solid/Double line style support in `src/components/game/Tile.tsx`
- [x] T015 [P] [US2] Build 6x6 `Board` grid component in `src/components/game/Board.tsx`
- [x] T016 [P] [US2] Build `Hand` container component in `src/components/game/Hand.tsx`
- [x] T017 [US2] Integrate `@dnd-kit` for dragging tiles from `Hand` to `Board` in `src/components/game/GameContainer.tsx`
- [x] T018 [US2] Implement rotation and confirmation logic in `src/hooks/useGameLogic.ts`
- [x] T019 [US2] Sync `PLAYER_INTENT` actions (Place/Rotate) over PeerJS in `src/hooks/usePeer.ts`

**Checkpoint**: Core loop functional - Players can play a basic game without scoring.

---

## Phase 5: User Story 3 - Cumulative Scoring and Connection Logic (Priority: P1)

**Goal**: Automatically calculate and add connected pipeline size to the cumulative score.

**Independent Test**: Place a tile that connects to a 2-tile pipeline; verify the score increases by 3.

### Implementation for User Story 3

- [x] T020 [P] [US3] Implement BFS algorithm for connected pipeline detection in `src/lib/game/scoring.ts`
- [x] T021 [US3] Implement cumulative scoring logic (Score += GroupSize) in `src/lib/game/scoring.ts`
- [x] T022 [P] [US3] Create `ScoreBoard` UI component in `src/components/game/ScoreBoard.tsx`
- [x] T023 [US3] Integrate scoring calculation into the Host's turn confirmation flow in `src/hooks/useGameLogic.ts`

**Checkpoint**: Scoring active - Players can now compete for the highest score.

---

## Phase 6: User Story 4 - Reversal Tile Mechanics (Priority: P2)

**Goal**: Implement temporary overlay tiles with countdowns and auto-removal.

**Independent Test**: Place a reversal tile; verify it disappears after 5 turns and the player's hand replenishes.

### Implementation for User Story 4

- [x] T024 [P] [US4] Implement layered tile rendering (Host/Guest overlays) in `src/components/game/Cell.tsx`
- [x] T025 [US4] Implement **Host-side** turn-based countdown decrement logic in `src/hooks/useGameLogic.ts`
- [x] T026 [P] [US4] Add CSS pulse animation for tiles with 1 turn remaining in `src/styles/animations.css`
- [x] T027 [US4] Implement **Host-side** auto-removal and hand replenishment logic in `src/hooks/useGameLogic.ts`

**Checkpoint**: All game mechanics complete.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: UX improvements, accessibility, and error handling.

- [x] T028 [P] Apply monotone color theme and verify WCAG AA contrast (4.5:1) in `src/app/globals.css`
- [x] T029 [P] Finalize responsive layout for mobile (Bottom Hand Carousel) in `src/components/game/Hand.tsx`
- [x] T030 [P] Implement connection loss overlay and reconnection logic in `src/components/ui/StatusOverlay.tsx`
- [x] T031 [P] Perform final run of `quickstart.md` validation steps.
- [x] T032 [P] Perform performance profiling for SC-002 (scoring <50ms) and SC-003 (60fps UI) using browser DevTools

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Initial step.
- **Phase 2 (Foundational)**: Blocks all US implementation.
- **Phase 3 (US1)**: Blocks US2-4 (needs P2P context).
- **Phase 4 (US2)**: Core gameplay.
- **Phase 5 (US3)**: Dependent on US2 board state.
- **Phase 6 (US4)**: Dependent on US2 placement logic.

### Parallel Opportunities
- T002-T004 (Setup)
- T005-T008 (Foundational)
- UI components (T014, T015, T016) can be built while P2P (T009-T013) is in progress.
- Scoring logic (T020) can be developed independently of the UI.

---

## Implementation Strategy

### MVP First (US1 + US2 + US3)
1. Complete Setup and Foundation.
2. Implement US1 (P2P Handshake).
3. Implement US2 (Tile Placement).
4. Implement US3 (Scoring).
5. **Result**: A fully playable P2P game with scoring.

### Incremental Delivery
- Add US4 (Reversal Tiles) as a strategic expansion after the core loop is verified.
- Apply Polish (Phase N) as the final hardening step.
