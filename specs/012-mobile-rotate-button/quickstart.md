# Quickstart: Mobile Tile Rotation Button

## 1. Local Testing
To test the mobile-only behavior:
1.  Open your browser's Developer Tools (F12).
2.  Enable "Device Toolbar" (Ctrl+Shift+M) to simulate a mobile screen.
3.  Set the screen width to `< 640px`.
4.  Start a local game session.
5.  Select a tile from your hand.
6.  The "Rotate" button should appear at the bottom right.
7.  Verify that tapping the tile itself does NOT rotate it.
8.  Verify that tapping the "Rotate" button rotates the selected tile.

## 2. Key Components
-   `src/context/UIContext.tsx`: Add `selectedTileId`.
-   `src/components/game/Hand.tsx`: Integrate selection logic.
-   `src/components/game/ActionBar.tsx`: Create new component for the "Rotate" button.
-   `src/components/game/GameContainer.tsx`: Integrate `ActionBar`.

## 3. P2P Verification
Verify that after rotating a tile on mobile and placing it, the final rotation is correctly synchronized with the opponent (rival).
-   PeerJS message `PLACE_TILE` should include the final `rotation` value.
-   The intermediate `ROTATE_HAND_TILE` action is local and does not require P2P synchronization (as it's a private hand state).
