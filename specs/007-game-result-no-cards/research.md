# Research: Display Game Result & Rematch

## Decisions

### 1. Game End Condition & Reversal Tiles
- **Decision**: The game will transition to `status: "FINISHED"` (or `OVER`) only when:
    1. Both players have 0 cards in hand.
    2. Both players have 0 cards in their respective decks.
    3. No tiles on the board have an active `turnsLeft` (reversal tile countdown).
- **Rationale**: This ensures all possible scoring changes (including those from tile expiration) have occurred before the final result is calculated.
- **Alternatives considered**: Ending immediately when hands are empty. Rejected because reversal tiles disappearing could change path connectivity and thus "potential" score or board state, although the rulebook says scores are cumulative and irreversible. However, the spec explicitly requests waiting for expiration.

### 2. Host-Authoritative Result
- **Decision**: The Host will be responsible for the final calculation of the winner and broadcasting the `GAME_OVER` (or `SYNC_STATE` with `status: "FINISHED"`) message.
- **Rationale**: Prevents desync where clients might show different winners due to race conditions or minor calculation discrepancies.

### 3. Rematch Handshake
- **Decision**: Introduce a two-step handshake:
    1. Player clicks "Rematch" -> Sends `REMATCH_READY` to Peer.
    2. Local state updates to `status: "REMATCH_WAITING"`.
    3. When both are "Ready", the Host generates a new deck/hand and sends a `REMATCH_START` message (mapping to a `START_GAME` action) to reset the board.
- **Rationale**: Ensures both players are actually ready before the board disappears.

### 4. UI/UX: Result Overlay
- **Decision**: Use a Tailwind-based centered modal with Backdrop blur. 
- **Rationale**: Aligns with monotone aesthetics and provides a clear "Game Over" focus.

## Best Practices
- **Monotone Design**: Use `bg-zinc-900` for dark, `bg-zinc-100` for light, and `border-zinc-500` for neutral elements. Maintain 4.5:1 contrast for all text.
- **P2P Messaging**: Keep message payloads small. Use short type strings (e.g., `GAME_OVER`, `REMATCH_READY`).
- **State Management**: Use `useReducer` and `Context` to keep the source of truth centralized.
