# Feature Specification: Fix Mobile UI and Interactions

**Feature Branch**: `008-mobile-ui-fixes`  
**Created**: 2026-02-28  
**Status**: Draft  
**Input**: User description: "スマホ版の動き、デザインを修正したいです。 まず、スマホ版でドラッグができません。また、画面の内容が１画面に収まらないため、コンパクトにしたいです。 盤面に置いたタイルがマスをはみ出します。"

## Clarifications

### Session 2026-02-28
- Q: UIを1画面に収める際、盤面と手札のどちらを優先すべきか？ → A: 盤面表示を優先し、手札は縮小または折り畳み（開閉）式にする。
- Q: モバイルでのタイル配置確定のトリガーはどうすべきか？ → A: 指を離した瞬間に、そのマスに即時配置（ドロップ）する。
- Q: 画面の向き（オリエンテーション）のサポート範囲は？ → A: 縦向き（Portrait）を基本とし、横向きでもスクロールなしで収まるよう可変にする。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enable Mobile Touch Dragging (Priority: P1)

As a mobile user, I want to be able to drag and drop tiles using touch gestures so that I can play the game on my smartphone.

**Why this priority**: Dragging is the core mechanic of the game; without it, the game is unplayable on mobile devices.

**Independent Test**: Can be fully tested by loading the game on a mobile device and successfully dragging a tile from the hand to the board.

**Acceptance Scenarios**:

1. **Given** a mobile device, **When** the user touches and drags a tile, **Then** the tile moves tracking their finger.
2. **Given** a tile is being dragged, **When** the user releases their finger over a valid board square, **Then** the tile is immediately placed on that square.

---

### User Story 2 - Compact Single-Screen Layout (Priority: P2)

As a mobile user, I want the entire game UI to fit within a single screen without scrolling so that I can see the board, my hand, and game information at a glance.

**Why this priority**: Scrolling breaks immersion and makes drag-and-drop mechanics unreliable on touch devices.

**Independent Test**: Can be fully tested by opening the game on various mobile screen sizes and ensuring no vertical or horizontal scrollbars appear.

**Acceptance Scenarios**:

1. **Given** a standard smartphone screen size in portrait mode, **When** the game loads, **Then** the board is prioritized and visible without scrolling.
2. **Given** the player needs to see their tiles, **When** they interact with the hand area, **Then** the hand expands or becomes visible to allow tile selection.
3. **Given** a change in device orientation, **When** the layout updates, **Then** the content scales to remain within the viewport limits without introducing scrollbars.

---

### User Story 3 - Correct Tile Sizing on Board (Priority: P2)

As a player, I want tiles placed on the board to exactly fit their designated squares without overflowing, so that the board remains visually consistent with 0px overflow and zero visual overlap between adjacent tiles.

**Why this priority**: Visual clarity is essential for a grid-based game. Overflowing tiles cause confusion and visual clutter.

**Independent Test**: Can be fully tested by placing multiple tiles adjacent to each other on the board and verifying no visual overlap occurs.

**Acceptance Scenarios**:

1. **Given** an empty square on the board, **When** a tile is placed, **Then** the tile's visual boundary is constrained to 100% of the grid cell's width and height with no clipping.
2. **Given** adjacent placed tiles, **When** viewed on any screen size, **Then** there is no overlapping or visual clipping between them.

---

### Edge Cases

- What happens when a user attempts to drag a tile while the browser tries to trigger a "pull-to-refresh" or swipe gesture?
- How does the system handle rapid repeated touch events (e.g., multi-touch)?
- What happens if the screen size is extremely small (e.g., older smartphones with very limited viewport height)?

### Accessibility and Compliance *(mandatory)*

- **Contrast Compliance**: Ensure scaling down UI elements doesn't compromise visual contrast ratios in a monotone theme.
- **Color Vision Diversity**: Ensure tile symbols remain recognizable even when scaled down to fit smaller mobile screens.
- **Responsive Layout**: The UI will prioritize a portrait-first layout for mobile devices, with dynamic scaling to ensure zero-scroll visibility in both portrait and landscape orientations.

### Connectivity and Architecture *(mandatory)*

- **P2P Strategy**: This feature primarily affects local UI rendering and interaction logic. No direct impact on PeerJS data synchronization, as dragging will map to standard placement events.
- **Serverless Compatibility**: Completely client-side UI and interaction fixes. Fully compatible with serverless architecture.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support touch events for drag-and-drop interactions on mobile devices, ensuring immediate placement upon finger release (release-to-drop).
- **FR-002**: System MUST prevent default browser touch actions (like scrolling or pull-to-refresh) during a tile drag operation.
- **FR-003**: System MUST constrain the overall game container to 100% of the viewport height to prevent scrolling, prioritizing a portrait-first orientation.
- **FR-004**: System MUST implement a collapsible or minimizable player hand UI to maximize board visibility on small screens.
- **FR-005**: System MUST dynamically calculate tile sizes in the hand and on the board based on the available container dimensions.
- **FR-006**: System MUST ensure the visual bounding box of a placed tile exactly matches the bounding box of the target grid cell.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of drag operations on iOS and Android devices successfully move the tile without triggering browser scrolling.
- **SC-002**: The game UI loads and fits entirely on a single screen without scrollbars on devices down to 320px width and 600px height (portrait mode).
- **SC-003**: Zero visual overlap (0px) between adjacent tiles placed on the board across all supported screen sizes.
- **SC-004**: Users can toggle or access the player hand in 1 interaction without losing sight of the active game board state.
- **SC-005**: Task completion rate for "placing a tile on the board" on mobile improves to match the desktop completion rate.
