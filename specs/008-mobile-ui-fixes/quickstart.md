# Quickstart: Mobile UI Fixes

This guide provides instructions on how to verify the mobile-specific UI fixes for the Michibiki game.

## Local Development & Testing

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```

2. **Accessing the Mobile View**:
   - Open your browser's Developer Tools (F12).
   - Toggle the device toolbar (Ctrl+Shift+M).
   - Select a mobile device profile (e.g., iPhone SE or Pixel 5).

3. **Verifying UI Fixes**:

### Touch-Drag (Story 1)
- **Action**: Click and hold a tile in your hand for a brief moment, then drag it to the board.
- **Expected**: The tile should track your movement immediately without the browser attempting to scroll the page.
- **Verification**: Drop the tile on a valid square. It should snap into place.

### Compact Layout (Story 2)
- **Action**: Load the game on a mobile device profile (e.g., iPhone SE gen 1, 320px width).
- **Expected**: All game elements (Header, Board, Hand) should be visible on the screen. There should be no vertical or horizontal scrollbars.
- **Verification**: The hand should be collapsed by default on very small screens or accessible via a toggle. Click the chevron icon to expand/collapse the hand. Verify the board remains visible and centered.

### Tile Sizing (Story 3)
- **Action**: Place multiple tiles on the board.
- **Expected**: Each tile should fit perfectly within its grid cell with 0px overflow.
- **Verification**: On a 320px screen, the tiles will scale down automatically. Verify they remain recognizable and properly aligned with the coordinate labels.

## Orientation Test
- **Action**: Rotate the device between Portrait and Landscape modes.
- **Expected**: The layout should adjust to remain within a single screen. In Portrait mode, the Board should be prioritized, and the Hand should be collapsible.
