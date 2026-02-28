# Feature Specification: Display Game Result (No Cards/Actions Left)

**Feature Branch**: `007-game-result-no-cards`  
**Created**: 2026-02-28  
**Status**: Draft  
**Input**: User description: "お互いの手札がなくなり何もできなくなったタイミングで決着表示を出したいです。" (I want to display the game result when both players have no cards left and can no longer take any actions.)

## Clarifications

### Session 2026-02-28
- Q: What happens to the P2P connection when a player clicks "Return to Lobby"? → A: The connection is closed and the player is returned to the main screen.
- Q: What is the precise trigger for the game end? → A: Both hands empty (and deck empty).
- Q: Who calculates and determines the final game result? → A: The Host calculates and broadcasts the result to the Guest.
- Q: How does a new match start after both agree to a rematch? → A: The game board and scores reset immediately, and the next match begins.
- Q: Who starts the first turn after a rematch? → A: Players select the turn order, same as the initial game setup.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Game Over Trigger (Priority: P1)

As a player, I want the game to automatically recognize when the match is over so that I don't have to manually check if any more moves are possible.

**Why this priority**: Core game loop completion. Without this, the game remains in an "infinite" turn state where nothing can happen.

**Independent Test**: Play a match until both players have 0 cards in hand and the deck is empty. Verify the game transitions to the result screen immediately after the last possible action.

**Acceptance Scenarios**:

1. **Given** both players have 0 cards in hand and the deck is empty, **When** the current player finishes their last possible turn, **Then** the game state transitions to "Game Over".
2. **Given** one player has no cards but the other does, **When** turns continue, **Then** the game does NOT end until both are empty-handed.
3. **Given** a reversal tile is on the board with a countdown > 0, **When** both players have no cards, **Then** the game MUST wait for the reversal tile to expire before declaring the final result.

---

### User Story 2 - Clear Result Display (Priority: P1)

As a player, I want to see a clear summary of the game outcome (Win/Loss/Draw) and final scores so that I can understand the final standing of the match.

**Why this priority**: Essential feedback for the player. Provides closure to the competitive experience.

**Independent Test**: Trigger the game end; verify the displayed scores match the internal game state and the "Winner" is correctly identified based on the higher score.

**Acceptance Scenarios**:

1. **Given** the game has ended and Player 1 has 50 points and Player 2 has 40 points, **When** the result screen appears, **Then** it displays "Victory" for Player 1 and "Defeat" for Player 2.
2. **Given** both players have the same score, **When** the result screen appears, **Then** it displays "Draw".
3. **Given** the result screen is active, **When** I look at the scores, **Then** both the Host and Guest scores are clearly labeled and visible.

---

### User Story 3 - Post-Game Navigation & Rematch (Priority: P2)

As a player, I want to be able to start a new match immediately or return to the main menu after the match ends.

**Why this priority**: Prevents the user from being "stuck" and allows for quick "best-of-X" style play sessions.

**Independent Test**: Click "Rematch" on the result screen; verify that once both players agree, the board resets and the match restarts in the same room.

**Acceptance Scenarios**:

1. **Given** the result screen is visible, **When** I click the "Return to Lobby" button, **Then** I am taken back to the main room setup screen.
2. **Given** the result screen is visible, **When** I click the "Rematch" button, **Then** my opponent sees that I am "Ready for Rematch".
3. **Given** both players have clicked "Rematch", **When** the agreement is synchronized, **Then** the game board and scores are reset immediately, and players are prompted to select the turn order before starting the next match.

### Edge Cases

- **Simultaneous Zero Cards**: Handle cases where both hands/deck empty simultaneously (e.g., at game start or specific rule trigger).
- **Rematch Desync**: If one player clicks "Rematch" and the other clicks "Return to Lobby", the "Ready" state should be cleared/handled correctly.
- **Host Authoritative Result**: Guest clients wait for the Host to broadcast the final score to ensure UI consistency.

### Accessibility and Compliance *(mandatory)*

- **Contrast Compliance**: Result text (Victory/Defeat) must use high contrast (e.g., Black on White or vice versa).
- **Color Vision Diversity**: Use icons (Trophy for win, Handshake for draw) in addition to text.
- **Responsive Layout**: The result modal must be centered and readable on all screen sizes.

### Connectivity and Architecture *(mandatory)*

- **P2P Strategy**: The **Host** client is the authoritative source for result calculation. It broadcasts a `GAME_OVER` message containing final scores and the winner's ID. `REMATCH_READY` and `REMATCH_START` messages are used for the rematch handshake.
- **Serverless Compatibility**: Purely client-side state transitions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST monitor player hand sizes and deck status to detect the end-game condition.
- **FR-002**: System MUST trigger the result screen immediately when both players have 0 cards in hand and the deck is empty.
- **FR-003**: System MUST compare player scores to determine the winner.
- **FR-004**: System MUST display a full-screen overlay or modal with the final game outcome.
- **FR-005**: System MUST provide a "Return to Lobby" button that closes the current PeerJS connection and resets the local game state.
- **FR-006**: Host MUST calculate the final scores/winner and synchronize the `GAME_OVER` state to the Guest via PeerJS to ensure consistency.
- **FR-007**: System MUST prevent any further tile placements or rotations once the game has ended.
- **FR-008**: System MUST support a "Rematch" function where both players must agree before resetting the board and prompting for turn order selection (consistent with initial setup).

### Key Entities

- **GameResult**: Data structure containing the winner's ID, final scores, and match metadata.
- **GameState**: Updated to include a `status: "FINISHED"` or `status: "REMATCH_WAITING"` flag.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The result screen appears within 500ms of the final turn ending.
- **SC-002**: Final scores on the result screen match the in-game score counter with 100% accuracy.
- **SC-003**: "Rematch" successfully resets and restarts the game board in under 2 seconds after both agree.
- **SC-004**: Result screen passes WCAG AA contrast check for all text elements.
