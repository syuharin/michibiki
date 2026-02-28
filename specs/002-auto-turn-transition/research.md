# Research: Automatic Turn Transition

## Decision: Legal Move Detection Algorithm
**Decision**: Create a utility `src/lib/game/validation.ts` with `hasLegalMove(board: Board, hand: Tile[]): boolean`.
**Rationale**: 
- A 6x6 board with 3 tiles in hand and 4 rotations results in a maximum of 432 checks per turn start.
- This is computationally negligible for modern browsers and ensures zero-latency feedback for the "Pass" button.
- Logic must account for:
    - Layer limits (max 2 tiles per cell).
    - Reversal tile rules (can stack on any single tile, but only up to 2 layers).
    - Standard tile rules (can only be placed on empty cells or under specific conditions defined in game core).

## Decision: Automated Trigger Location
**Decision**: Handle automatic turn confirmation in `src/context/GameContext.tsx` reducer as an extended behavior of `PLACE_TILE`, or as a separate chained action in `useGameLogic`.
**Correction**: Reducers should be pure. `PLACE_TILE` will update board/score/hand. The *logic* to then trigger `CONFIRM_TURN` will be handled:
1. **In Host**: When processing `PLACE_TILE` intent, the host will dispatch `PLACE_TILE` then `CONFIRM_TURN` sequentially before syncing state.
2. **In Guest**: The guest sends `PLACE_TILE` intent. The host receives, processes both, and sends back the synced state with the next turn owner already set.
**Rationale**: Centralizing the "Auto-Transition" in the Host's intent handler ensures both players see the same state transition atomically.

## Decision: Empty Hand Skip Logic
**Decision**: Modify the `CONFIRM_TURN` case in `gameReducer`.
**Logic**: 
```typescript
let nextTurnOwner = getNextPlayer(state.turnOwnerId);
const isNextEmpty = isPlayerEmpty(state, nextTurnOwner);

if (isNextEmpty) {
  const isAllEmpty = isPlayerEmpty(state, state.turnOwnerId);
  if (isAllEmpty) {
    return { ...state, status: "FINISHED" };
  }
  // Skip and stay with current (or return to other)
  nextTurnOwner = state.turnOwnerId; 
}
```
**Rationale**: Simple check during turn switch prevents the "Current Turn" indicator from getting stuck on a player who cannot act.

## Alternatives Considered
- **Client-side only auto-skip**: Rejected because it leads to desync between Host and Guest views of who is "active".
- **Infinite check in reducer**: Rejected. We must have a termination condition (Game Over) when neither player can move.
