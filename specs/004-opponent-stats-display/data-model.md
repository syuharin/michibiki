# Data Model: Opponent Stats and Deck Display

## GameState Entities (Existing)

### `scores` (Record<string, number>)
- **Key**: PeerID (string)
- **Value**: Current score for that player (number)
- **Mapping**: 
  - `state.scores[myPeerId]` → "Your Score" UI
  - `state.scores[opponentPeerId]` → "Opponent Score" UI

### `deck` (Tile[])
- **Value**: Array of Tile objects remaining in the draw pile.
- **Mapping**: 
  - `state.deck.length` → Displayed in the `Deck` component count overlay.

## UI Components (Proposed)

### `Deck.tsx` (New)
- **Props**:
  - `count: number`
- **Behavior**: Renders a card stack icon with a badge showing the count.
- **Style**: 
  - Icon: `Layers` (Lucide React)
  - Badge: Absolute positioned at top-right or center.

### `GameContainer.tsx` (Modified)
- **Logic**:
  - Derive `opponentPeerId` from `isHost` and `GameState`.
  - Pass `state.deck.length` to `Deck` component.
- **Layout**: New horizontal bar to house scores and deck.
