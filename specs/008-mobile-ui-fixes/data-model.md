# Data Model: Mobile UI Fixes

This feature focuses on UI/UX changes and does not introduce new data entities. However, it refines how existing entities are presented and interacted with on mobile devices.

## Existing Entities Impacted

### GameState
- **status**: Status remains as `IN_PROGRESS` but the UI must now reflect whether the player's hand is visible or collapsed.
- **UI State (Local Only)**:
  - `isHandExpanded`: A boolean to track whether the player's hand is visible on mobile.
  - `activeId`: Already tracks the tile being dragged.

### Tile
- **Visual Presentation**: Tiles are now scaled relative to their container (board cell or hand slot) rather than having fixed pixel dimensions (`w-16 h-16`).

### Board
- **Responsive Sizing**: The board grid will now use CSS variables (e.g., `--cell-size`) calculated based on the available viewport width to ensure it remains within a single screen.

## Validation Rules
- **No Scroll**: The combined height of Header + Stats Bar + Board + (Collapsed) Hand must not exceed `100vh`.
- **Touch Drag**: Dragging must be triggered with minimal delay and prevent browser scroll events.
- **Tile Alignment**: A tile's visual boundary must precisely align with the grid cell boundary.
