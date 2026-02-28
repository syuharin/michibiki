# Feature Specification: Michibiki Core Game Logic

**Feature Branch**: `001-michibiki-game-core`  
**Created**: 2026-02-28  
**Status**: Draft  
**Input**: User description: "添付の「パイプライン_ルールブック.md」に基づき、詳細な仕様書を作成してください。追加仕様：得点計算(累積加算)、逆転用タイル(5ターン期限、カウントダウン、パルス強調、消滅、補充)、マッチング(PeerID含むURL/QRコード、同URL使用、複数ルーム)"

## Clarifications

### Session 2026-02-28
- Q: How should conflicts be resolved during P2P turn synchronization? → A: Option A: Host-authoritative (Host resolves all conflicts).
- Q: Should tiles be rotatable during the drag-and-drop process? → A: Option B: Rotate only before or after dragging (no rotation during movement).
- Q: How should scoring be handled when a reversal tile expires? → A: Option A: Irreversible (Added points stay even if tile disappears).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - P2P Matchmaking and Room Setup (Priority: P1)

As a player, I want to easily connect with an opponent using a single URL or QR code so that we can start a game without a complex lobby system.

**Why this priority**: Essential for the "Serverless P2P Combat" principle. Without connection, the core game loop cannot be initiated.

**Independent Test**: Can be tested by opening two browser windows with the same Room ID URL; PeerJS connection should establish, and both should transition to the game board.

**Acceptance Scenarios**:

1. **Given** no active game, **When** I visit the root URL, **Then** I see an option to create a room with a unique PeerID-based URL.
2. **Given** a room URL with a Room ID, **When** I share it with an opponent, **Then** they see the same room and can join as a "Guest".
3. **Given** a Room ID, **When** I view the "Share" screen, **Then** a QR code is displayed that points to the room URL.

---

### User Story 2 - Turn-based Tile Placement (Priority: P1)

As a player, I want to place and rotate tiles on a 6x6 grid to build my pipeline and gain points.

**Why this priority**: Core game mechanic. Covers the basic gameplay loop.

**Independent Test**: Place a tile, rotate it before confirming, and verify the tile is correctly registered in the board state on both clients.

**Acceptance Scenarios**:

1. **Given** it is my turn, **When** I select a tile from my hand, **Then** I can rotate it by clicking/tapping before starting to drag.
2. **Given** a tile is being dragged, **When** it moves across the grid, **Then** it cannot be rotated until it is dropped.
3. **Given** a tile is dropped on the grid (before confirmation), **When** I click/tap it, **Then** it rotates by 90 degrees.
4. **Given** a tile is placed, **When** I confirm the placement, **Then** my turn ends and the opponent's turn begins.

---

### User Story 3 - Cumulative Scoring and Connection Logic (Priority: P1)

As a player, I want my score to increase every time I place a tile based on the size of the connected pipeline, so that I can track my progress toward victory.

**Why this priority**: Primary feedback loop for the player. Defines the goal of the game.

**Independent Test**: Connect three tiles in a row; verify the score adds "1" for the first, "2" for the second, and "3" for the third (cumulative logic).

**Acceptance Scenarios**:

1. **Given** a tile is placed, **When** it connects to an existing pipeline, **Then** the system calculates the total number of tiles in that connected group.
2. **Given** a connected group size of N, **When** the turn ends, **Then** the player's current score is increased by N.
3. **Given** a tile is placed standalone, **When** the turn ends, **Then** the player's current score is increased by 1.
4. **Given** a reversal tile expires and is removed, **When** the board state changes, **Then** the existing cumulative score is NOT reduced.

---

### User Story 4 - Reversal Tile Mechanics (Priority: P2)

As a player, I want to use special reversal tiles to overwrite existing tiles, knowing they will disappear after 5 turns, to strategically disrupt my opponent's pipeline.

**Why this priority**: Adds strategic depth and fulfills the "Reversal Tile" requirement.

**Independent Test**: Place a reversal tile; verify the countdown starts at 5 and decreases each time the *placing* player completes a turn. Verify it disappears and a new tile is drawn when it hits 0.

**Acceptance Scenarios**:

1. **Given** I have a reversal tile, **When** I place it on an occupied cell, **Then** it covers the existing tile and becomes the active tile for pathfinding.
2. **Given** a reversal tile on the board, **When** I finish my turn, **Then** its countdown decreases by 1.
3. **Given** a reversal tile has 1 turn left, **When** it is visible on the board, **Then** it displays a pulse animation.
4. **Given** a reversal tile countdown reaches 0, **When** the turn ends, **Then** it is removed from the board, the player's cumulative score remains unchanged, and the player draws from the deck until their hand has 3 tiles.

## Edge Cases

- **Connection Loss**: If a PeerJS connection drops mid-game, how should the UI inform players and can they reconnect to the same room?
- **Deck Depletion**: What happens if the deck is empty but a player needs to draw after a reversal tile disappears? (Rulebook says hand/deck can be empty).
- **Overlapping Timers**: If two reversal tiles are placed at different times, do their timers correctly decrement independently based on the owner's turn?
- **P2P State Conflict**: In case of network latency, the **Host** acts as the authoritative source of truth for the final game board state and turn resolution.

## Accessibility and Compliance *(mandatory)*

- **Contrast Compliance**: Using a monotone palette (Black/White/Grays), all functional text and tile borders MUST maintain a 4.5:1 ratio. Interactive states (hover/focus) will use distinct gray shades.
- **Color Vision Diversity**: 
    - **Player 1 (Host)**: High-contrast Dark Gray/Black with **Solid Lines**.
    - **Player 2 (Guest)**: Medium Gray with **Double Lines** (Parallel lines).
    - This allows identification even in complete grayscale.
- **Responsive Layout**: The 6x6 grid will scale based on viewport width. On mobile, the "Hand" will be a bottom-docked carousel, while on desktop it will be a side panel.

## Connectivity and Architecture *(mandatory)*

- **P2P Strategy**: PeerJS will be used. The **Host** acts as the authoritative source of truth for all turn transitions and state resolutions to prevent P2P desync. Room IDs will be UUID-based or short-coded (e.g., /room/ABC) to allow multiple simultaneous matches.
- **Serverless Compatibility**: No database or API required. Game state is ephemeral and lives in client memory. qrcode.react handles QR generation client-side.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow P2P connection via PeerJS using a shared URL.
- **FR-002**: System MUST generate a QR code for the current room URL.
- **FR-003**: System MUST manage a 6x6 grid where tiles can be placed and rotated.
- **FR-004**: System MUST calculate connected pipeline groups using BFS/DFS.
- **FR-005**: System MUST apply cumulative scoring: `Score = Score + ConnectedGroupSize`.
- **FR-006**: System MUST track individual countdowns (5 turns) for reversal tiles.
- **FR-007**: System MUST provide visual feedback (pulse) for reversal tiles with 1 turn remaining.
- **FR-008**: System MUST automatically remove reversal tiles and replenish the player's hand after expiration.
- **FR-009**: System MUST distinguish players using both color and line style (Solid vs. Double).
- **FR-010**: System MUST restrict tile rotation to "in hand" or "placed but unconfirmed" states (no rotation during drag).
- **FR-011**: System MUST resolve P2P conflicts using the Host's state as the primary source of truth.
- **FR-012**: System MUST NOT deduct points when a reversal tile expires; scores are strictly cumulative.

### Key Entities

- **GameSession**: Manages the PeerJS connection, turn state, and Room ID.
- **GameBoard**: A 6x6 array representing the grid state (including layered tiles).
- **Tile**: Data structure containing connection points (U, D, L, R), owner ID, line style, and optional timer.
- **Player**: Data structure for score, hand, and player type (Host/Guest).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- SC-001: 100% of P2P connections are established within 5 seconds (assuming RTT < 500ms between peers).
- **SC-002**: Pathfinding and scoring calculations complete in under 50ms per move.
- **SC-003**: UI remains interactive and responsive (60fps) during drag-and-drop operations.
- **SC-004**: All text and game elements pass automated WCAG AA contrast checks.
- **SC-005**: Players can successfully distinguish between Host and Guest tiles using line styles in a grayscale test.
