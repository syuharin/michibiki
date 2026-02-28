# Quickstart: Automatic Turn Transition

## Testing Scenario: Automatic Turn Transition
1. Start two game sessions (Host & Guest).
2. Connect them via Room ID.
3. As the Host, drag a tile from the Hand to a valid board cell.
4. **Observe**: The "Current Turn" indicator should immediately switch to "OPPONENT" without clicking any button.
5. **Observe**: A new tile should be drawn from the deck to refill the hand.

## Testing Scenario: "Pass" Button Detection
1. Manipulate the board state (manually or via debug tools if available) such that no cells are available for your current hand tiles.
2. **Observe**: A "Pass" button (パス) should appear in the UI.
3. **Action**: Click "Pass".
4. **Observe**: Turn transitions correctly to the opponent.

## Testing Scenario: Empty Hand Skip
1. Empty one player's hand and deck.
2. The other player places a tile.
3. **Observe**: The turn briefly transitions to the empty-handed player and immediately skips back to the active player.
4. **Observe**: If both are empty, the game transitions to "FINISHED" state.
