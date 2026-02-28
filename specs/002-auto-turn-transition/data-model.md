# Data Model: Automatic Turn Transition

## Refined State Definitions

### GameState
- **status**: Added `FINISHED` transition condition.
    - Trigger: When `hands[hostPeerId].length === 0` AND `hands[guestPeerId].length === 0` AND `deck.length === 0`.
- **turnOwnerId**: Logic change.
    - Automatic Switch: After `PLACE_TILE` action, `turnOwnerId` must immediately switch to the other player unless they are out of tiles.

### Derived State (Logic Layer)
- **isPassAvailable**: Boolean
    - Logic: `true` if `turnOwnerId === currentPeerId` AND `hasLegalMove(board, hand) === false`.
    - Purpose: Controls the visibility of the "Pass" button.

## Refined Transitions

### Action: PLACE_TILE
1. Update `board` with new tile.
2. Update `scores` based on connection scoring.
3. Remove tile from `hands[currentPlayerId]`.
4. **[NEW]** Chain `CONFIRM_TURN` logic immediately (Atomic transition).

### Action: CONFIRM_TURN (Manual Pass or Auto Skip)
1. Decrement `turnsLeft` for reversal tiles in current player's hand.
2. Refill current player's hand from `deck`.
3. Switch `turnOwnerId` to the next player.
4. **[NEW] Check next player status**:
    - If next player has tiles (hand or deck) -> Proceed.
    - If next player is empty -> Repeat `CONFIRM_TURN` for that player (Skip).
    - If ALL players are empty -> Set `status = "FINISHED"`.
