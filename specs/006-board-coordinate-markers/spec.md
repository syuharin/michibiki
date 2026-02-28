# Feature Specification: Board Coordinate Markers

**Feature Branch**: `006-board-coordinate-markers`  
**Created**: 2026-02-28  
**Status**: Draft  
**Input**: User description: "現在盤面の中に0,0といった数字をつけていますが、盤面の外にA,B,C 1,2,3といった目印をつけてほしいです。"

## Clarifications

### Session 2026-02-28
- Q: 座標の起点はどこにすべきか？ → A: A (左上をA1とする)
- Q: 目印の配置間隔はどうすべきか？ → A: A (盤面の各セルと同じ幅/高さを持たせる)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - External Coordinate Labels (Priority: P1)

As a player, I want to see coordinate markers (A-F for columns and 1-6 for rows) outside the game board so that I can easily identify and communicate specific cell positions without visual clutter inside the cells.

**Why this priority**: This is the core request. It improves board readability and aligns with standard board game conventions.

**Independent Test**: Can be fully tested by opening the game room and verifying that labels 'A' through 'F' are visible above the board and '1' through '6' are visible to the left of the board.

**Acceptance Scenarios**:

1. **Given** a game board is displayed, **When** viewing the top edge, **Then** column labels A, B, C, D, E, F are visible and aligned with their respective columns.
2. **Given** a game board is displayed, **When** viewing the left edge, **Then** row labels 1, 2, 3, 4, 5, 6 are visible and aligned with their respective rows.

---

### User Story 2 - Clean Cell UI (Priority: P2)

As a player, I want the internal coordinate numbers (e.g., "0,0") removed from the board cells so that the board looks cleaner and focuses on the game tiles.

**Why this priority**: Removing the old system is necessary to complete the visual transition and fulfill the user's intent of moving markers "outside".

**Independent Test**: Can be tested by verifying that no numeric text (like "0,0") is rendered inside any of the 36 board cells.

**Acceptance Scenarios**:

1. **Given** a board cell is empty or has tiles, **When** the board is rendered, **Then** no coordinate numbers are visible inside the cell boundaries.

---

### User Story 3 - Responsive Marker Alignment (Priority: P3)

As a player on a mobile device, I want the coordinate markers to remain correctly aligned with the board even when the screen size changes or the layout shifts.

**Why this priority**: Ensures the feature remains functional across different devices, which is critical for a web-based P2P game.

**Independent Test**: Can be tested by resizing the browser window or rotating a mobile device and verifying that markers stay centered relative to their columns/rows.

**Acceptance Scenarios**:

1. **Given** a game room, **When** the screen width is reduced to mobile size, **Then** the board and its external markers scale together and maintain alignment.

---

### Edge Cases

- **What happens when the board is zoomed?**: The markers should scale proportionally with the board cells to maintain alignment.
- **How does system handle layout shifts (e.g., opening a side panel)?**: The board container should include the markers to ensure they move as a single unit.

### Accessibility and Compliance *(mandatory)*

- **Contrast Compliance**: Markers will use the standard `michibiki-black` (#0F172A) text on `michibiki-white` (#F8FAFC) background to exceed WCAG AA (4.5:1) contrast requirements.
- **Color Vision Diversity**: Information is conveyed through alphanumeric characters (A-F, 1-6) rather than color, ensuring full accessibility for color-blind users.
- **Responsive Layout**: Labels will use flexible units (e.g., percentages or `fr`) to match the board's CSS Grid/Flexbox layout.

### Connectivity and Architecture *(mandatory)*

- **P2P Strategy**: Coordinate markers are pure UI components and do not require data synchronization via PeerJS.
- **Serverless Compatibility**: This is a pure client-side UI change, fully compatible with Vercel-native deployment.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render column labels (A, B, C, D, E, F) outside the top edge of the board, with 'A' corresponding to the leftmost column.
- **FR-002**: System MUST render row labels (1, 2, 3, 4, 5, 6) outside the left edge of the board, with '1' corresponding to the top row.
- **FR-003**: System MUST remove the current internal coordinate text (e.g., "0,0") from all board cells.
- **FR-004**: Markers MUST be rendered using the project's monotone theme font and colors.
- **FR-005**: Markers MUST be placed strictly on the Top edge (columns) and Left edge (rows) of the board container.
- **FR-006**: Each marker MUST have the same width (for columns) or height (for rows) as a single board cell to ensure centered alignment.

### Key Entities *(include if feature involves data)*

- **BoardCoordinate**: Visual representation of a cell's position (Column: A-F, Row: 1-6).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of board cells are correctly labeled with external markers.
- **SC-002**: Zero internal coordinate strings (e.g., "x,y") are visible on the board.
- **SC-003**: Markers maintain perfect alignment (within 1px of cell center) across all supported responsive breakpoints.
- **SC-004**: 100% of users can identify a cell (e.g., "B3") using only external markers in under 2 seconds.
