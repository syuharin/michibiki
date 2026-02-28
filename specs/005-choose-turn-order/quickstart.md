# Quickstart: Choose Turn Order

## Implementation Overview

### 1. Update Game Types
- Add `TurnOrderOption` to `src/types/game.ts`.
- Update `GameState` to include `turnOrderConfig`.
- Add `SET_TURN_ORDER` and `SET_GUEST_ID` to `GameAction`.

### 2. Update Game Reducer
- Add `SET_TURN_ORDER` and `SET_GUEST_ID` cases to `gameReducer` in `src/context/GameContext.tsx`.
- Modify `START_GAME` to accept the `turnOwnerId` from the action.

### 3. Update PeerJS Logic
- In `usePeer.ts`, handle `SET_GUEST_ID` when `JOIN_ROOM` is received (instead of auto-starting).
- Update the sync effect to send state during the lobby phase.
- Add a manual `startGame` function for the Host that resolves turn order and dispatches `START_GAME`.

### 4. Create UI Components
- Create `TurnOrderSelector` component.
- Integrate it into `GameContainer.tsx` for the Host when `guestPeerId` is present and `status` is `WAITING_FOR_GUEST`.
- Display "Host is choosing..." for the Guest when `turnOrderConfig === 'UNSELECTED'`.

## Verification Steps

### Unit Testing
- Test `gameReducer` with `SET_TURN_ORDER`.
- Test random turn order resolution logic.

### Integration Testing
- Open two browser tabs (one Host, one Guest).
- Verify Guest joins and Host sees turn order options.
- Verify Guest sees "Host is choosing...".
- Verify selection by Host is reflected on Guest's screen.
- Verify "Start Game" is disabled until selection.
- Verify game starts with correct turn owner.
