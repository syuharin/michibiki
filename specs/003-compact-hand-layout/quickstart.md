# Quickstart: Compact UI & Right-side Hand Layout

This guide explains how to test the UI layout changes for the Hand component.

## Setup

1. Start the development server: `npm run dev`
2. Open the application in two browser windows to create a match (host and guest).
3. Start the game.

## Testing Layout Switching

1. **Landscape Mode (Right-side Hand)**:
   - Maximize or widen the browser window so its width is greater than its height.
   - Verify the Hand container appears on the **right side** of the board.
   - Verify the hand is a vertical column and cards are top-aligned.
2. **Portrait Mode (Bottom Hand)**:
   - Resize the browser window to be narrow and tall (like a mobile phone).
   - Verify the Hand container moves to the **bottom** of the board.
   - Verify the original horizontal layout of the hand remains functional.

## Testing Interactions

1. **Expand Leftwards**: In landscape mode, hover over a card in the right-side hand. It should slightly translate to the left (`-translate-x-4`).
2. **Adaptive Overlap**: Draw or add multiple cards to your hand (e.g., 6+ cards). In landscape mode, observe that cards start to overlap vertically to fit within the viewport height.
3. **Playability**: Ensure drag-and-drop from both layout positions still functions correctly and places the tile on the board.
