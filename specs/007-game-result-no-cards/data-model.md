# Data Model: Display Game Result & Rematch

## Entity Updates

### GameState
Updated state to track end-game status and rematch readiness.

| Field | Type | Description |
|-------|------|-------------|
| `status` | `enum` | Added `"FINISHED"` and `"REMATCH_WAITING"` |
| `rematchReady` | `Record<string, boolean>` | Map of `PeerID -> boolean` indicating if each player clicked "Rematch" |

### GameAction
Updated to handle the new transitions.

| Type | Payload | Description |
|------|---------|-------------|
| `SET_REMATCH_READY` | `{ peerId: string, ready: boolean }` | Marks a player as ready for rematch. |
| `RESET_GAME` | `{ initialDecks, initialHands, startingPlayerId }` | Resets the board for a new match. |

### GameResult (New)
Temporary structure used for the result UI.

| Field | Type | Description |
|-------|------|-------------|
| `winnerId` | `string` | The PeerID of the winning player (or `"DRAW"`) |
| `finalScores` | `Record<string, number>` | Final score of each player. |
| `reason` | `string` | e.g., "Deck & Hand Exhaustion" |

## State Transitions

### Game Over Logic
1. `IN_PROGRESS` -> `FINISHED`
    - Trigger: Both players have empty hands/decks AND no reversal tiles remain on board.
2. `FINISHED` -> `REMATCH_WAITING`
    - Trigger: Local player clicks "Rematch".
3. `REMATCH_WAITING` -> `IN_PROGRESS`
    - Trigger: Both players have `rematchReady: true` (Host dispatches `RESET_GAME`).
4. `FINISHED` -> `WAITING_FOR_GUEST`
    - Trigger: Player clicks "Return to Lobby" (Session closes).
