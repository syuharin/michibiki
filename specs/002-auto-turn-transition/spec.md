# Feature Specification: Automatic Turn Transition & Button Removal

**Feature Branch**: `002-auto-turn-transition`  
**Created**: 2026-02-28  
**Status**: Draft  
**Input**: User description: "ターン終了ボタンは不要なので消したいです。 プレイヤーがタイルをおいた瞬間に相手ターンになります。自分に手札がない場合は相手ターンが続きます。"

## Clarifications

### Session 2026-02-28
- Q: 「パス」ボタンの表示タイミング → A: 自分のターン開始時（またはタイル配置後）に、手札の全タイルについて全マスを自動スキャンして判定する
- Q: 「パス」時のペナルティまたは制約 → A: ペナルティなし（単純にターンを終了し、手札を補充して次へ）

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Regular Auto-Turn (Priority: P1)

As a player, I want the game to proceed automatically after I make a move, so I don't have to click an extra button to end my turn.

**Why this priority**: Core feature request. This simplifies the game flow and improves UX by reducing clicks.

**Independent Test**: Can be fully tested by placing a valid tile and verifying that the "Current Turn" indicator changes to the opponent and a new tile is drawn.

**Acceptance Scenarios**:

1. **Given** it is my turn and I have tiles in my hand, **When** I drag and place a valid tile on the board, **Then** the system MUST immediately switch the turn to the opponent.
2. **Given** I have placed a tile, **When** the turn switches, **Then** the system MUST automatically refill my hand from the deck if any tiles are left.

---

### User Story 2 - Empty Hand Formal Skip (Priority: P2)

As a player, if I have no tiles left to play, the turn should formally pass to me but immediately return to the opponent so that the game flow remains consistent while allowing the opponent to finish.

**Why this priority**: Required for game completion when players run out of resources at different times.

**Independent Test**: Can be tested by ensuring that when a player with zero hand and zero deck starts their turn, the system immediately triggers a transition back to the opponent.

**Acceptance Scenarios**:

1. **Given** I have no tiles in my hand and my deck is empty, **When** the opponent finishes their turn, **Then** the turn SHOULD briefly pass to me, and the system MUST immediately transition it back to the opponent.
2. **Given** I place my very last tile (hand and deck both empty), **When** the turn switches to the opponent, **Then** the next time it would be my turn, it MUST immediately skip back to the opponent.

---

### Edge Cases

- **Connectivity Interruptions**: System ensures placement and turn change are atomic or handled by host logic to prevent desync.
- **Multiple Placements**: Only the first valid placement triggers a single turn transition.
- **No Legal Moves**: If a player has tiles but cannot place them anywhere legally, the system MUST display a "Pass" button to allow manual turn transition. The system MUST automatically scan all tiles in hand against all board positions at the start of the turn to detect this state.
- **Pass Penalty**: There is no penalty (score reduction or otherwise) for passing a turn when no legal moves exist. The player simply transitions the turn and attempts to refill their hand for the next turn.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST remove the "End Turn" (ターン終了) button from the standard game interface.
- **FR-002**: System MUST trigger the `CONFIRM_TURN` logic (hand refill, turn switch) automatically upon a successful `PLACE_TILE` event.
- **FR-003**: System MUST decrement reversal tile countdowns for the player whose turn just ended automatically.
- **FR-004**: System MUST check if the player whose turn it just became has any tiles in hand or deck; if not, the system MUST immediately trigger another `CONFIRM_TURN` to return to the active player.
- **FR-005**: System MUST trigger "Game Over" if neither player has tiles in hand and both decks are empty.
- **FR-006**: System MUST detect if any legal moves exist for the current player's hand by scanning all possible placement combinations. If no legal moves exist, the system MUST display a "Pass" button at the start of the turn.
- **FR-007**: System MUST NOT apply any score penalty or other constraints when a player uses the "Pass" button.

### Key Entities

- **Hand**: The current set of tiles available to a player (Max 3).
- **Deck**: Remaining tiles assigned to a player that haven't been drawn yet.
- **TurnOwnerId**: Peer ID of the player currently allowed to make a move.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Turn transition occurs within 200ms of a valid tile placement being processed.
- **SC-002**: "End Turn" button is hidden during normal play.
- **SC-003**: "Pass" button appears within 500ms of the system detecting a "No Legal Moves" state at turn start.
- **SC-004**: A player with zero tiles remaining in both hand and deck is formally skipped automatically.
- **SC-005**: Total clicks required to complete a turn is reduced from 2 to 1 for standard moves.
