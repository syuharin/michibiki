# Research: Choose Turn Order

## Decision 1: Game Lifecycle Change
- **Decision**: Update `GameState.status` to include a `LOBBY` state or use `WAITING_FOR_GUEST` as the lobby phase until the Host starts.
- **Rationale**: Currently, `JOIN_ROOM` immediately triggers `START_GAME`. We need a transition phase for the Host to choose the turn order.
- **Implementation**: When a Guest joins, the status should stay `WAITING_FOR_GUEST` (or become `LOBBY`) but `guestPeerId` is now set. The Host's UI will then show the `TurnOrderSelector` and a "Start Game" button.

## Decision 2: State Synchronization during Lobby
- **Decision**: Update `usePeer.ts` to sync the state even when `status === 'WAITING_FOR_GUEST'` if a guest is connected.
- **Rationale**: The Guest needs to see the current turn order selection and the "Host is choosing..." message.
- **Implementation**: The sync effect in `usePeer.ts` will be updated to:
  ```typescript
  useEffect(() => {
    if (isHost && isConnected && (state.status === "IN_PROGRESS" || state.status === "WAITING_FOR_GUEST")) {
      sendMessage({ type: "BOARD_SYNC", state });
    }
  }, [...]);
  ```

## Decision 3: Random Turn Order Resolution
- **Decision**: If "Random" is selected, the `START_GAME` action will be triggered with a randomly chosen `turnOwnerId`.
- **Rationale**: As per the spec clarification, the random drawing happens exactly when the "Start Game" button is clicked.
- **Implementation**:
  ```typescript
  const resolveTurnOrder = (config: TurnOrderOption): string => {
    if (config === 'HOST_FIRST') return state.hostPeerId;
    if (config === 'GUEST_FIRST') return state.guestPeerId!;
    return Math.random() < 0.5 ? state.hostPeerId : state.guestPeerId!;
  };
  ```

## Decision 4: UI/UX (Monotone & Accessibility)
- **Decision**: Use "先行" (First-mover) and "後攻" (Second-mover) labels with distinct monotone badge styles.
- **Rationale**: Adheres to the Michibiki Constitution (Principle I & III).
- **Implementation**:
  - **First-mover (先行)**: Solid black background, white text.
  - **Second-mover (後攻)**: White background, 2px black border (double-line style for accessibility).
  - Both labels will have a minimum contrast ratio of 4.5:1.

## Decision 5: Mandatory Selection
- **Decision**: Disable the "Start Game" button until `turnOrderConfig !== 'UNSELECTED'`.
- **Rationale**: As per FR-005 in the spec.
- **Implementation**: Add `turnOrderConfig` to the `initialState` as `UNSELECTED`.
