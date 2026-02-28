# Quickstart: Board Coordinate Markers

## Implementation Overview

This feature improves the game board's readability by moving coordinate markers from inside the cells to the edges of the board.

### Key Components
- `Board.tsx`: Modified to include a label row and label column.
- `CellComponent`: Simplified by removing internal coordinate text.

## Verification Steps

### 1. Manual Visual Verification
- **Coordinate Values**:
    - Top labels should be: **A B C D E F** (left to right).
    - Left labels should be: **1 2 3 4 5 6** (top to bottom).
- **Cell Removal**:
    - Ensure no numbers (e.g., "0,0") are visible inside the white cell squares.
- **Styling**:
    - Text must be `michibiki-black`.
    - Labels must be perfectly centered above/beside their respective cells.

### 2. Responsiveness Check
- Resize the browser window.
- Verify that the labels scale proportionally with the board and maintain their alignment with the cells.

### 3. Contrast Check
- Use a browser accessibility tool to verify that the black-on-white text maintains a contrast ratio of at least 4.5:1.
