# Data Model: Choose Turn Order

## GameState Extensions

| Field | Type | Description |
|-------|------|-------------|
| `turnOrderConfig` | `TurnOrderOption` | The chosen configuration for the starting player. |
| `startingPlayerId` | `string \| null` | The ID of the resolved starting player (filled at "Start Game"). |

## Types

### TurnOrderOption
```typescript
type TurnOrderOption = "HOST_FIRST" | "GUEST_FIRST" | "RANDOM" | "UNSELECTED";
```

## Actions Update

### START_GAME (Updated)
- `turnOwnerId`: The ID of the player who starts (after resolving "Random" if applicable).
- `turnOrderConfig`: The configuration that was used to decide.

### SET_TURN_ORDER (New)
```typescript
{ type: "SET_TURN_ORDER"; config: TurnOrderOption }
```

## State Transitions (Lobby)

1. **Initial Room Creation**:
   - `status`: `WAITING_FOR_GUEST`
   - `turnOrderConfig`: `UNSELECTED`
   - `guestPeerId`: `null`

2. **Guest Joins**:
   - `status`: `WAITING_FOR_GUEST`
   - `guestPeerId`: `<guestId>`
   - `turnOrderConfig`: `UNSELECTED`

3. **Host Selects Turn Order**:
   - `turnOrderConfig`: `HOST_FIRST` | `GUEST_FIRST` | `RANDOM`

4. **Host Starts Game**:
   - `status`: `IN_PROGRESS`
   - `turnOwnerId`: `<resolvedId>`
   - `hands`: `<initializedHands>`
   - `decks`: `<initializedDecks>`
