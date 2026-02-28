# Research: Opponent Stats and Deck Display

## Decision: Opponent ID Identification
- **Choice**: Use the inverse of `myPeerId` based on `isHost` status.
- **Rationale**: In a 1v1 scenario, the opponent is always the other defined PeerID in the `GameState`.
- **Logic**:
  ```tsx
  const myPeerId = isHost ? state.hostPeerId : state.guestPeerId;
  const opponentPeerId = isHost ? state.guestPeerId : state.hostPeerId;
  const opponentScore = opponentPeerId ? (state.scores[opponentPeerId] || 0) : 0;
  ```

## Decision: UI Layout for Stats
- **Choice**: Horizontal "Status Bar" above the Board.
- **Rationale**: Keeps all critical game metrics in a single glance-able area without cluttering the play space.
- **Layout**:
  - [Turn Indicator] (Left)
  - [Deck Stack with Count] (Center)
  - [My Score] (Right)
  - [Opponent Score] (Right-most or next to My Score)

## Decision: Deck Component Design
- **Choice**: A custom `Deck` component using Tailwind `relative` positioning for the overlay.
- **Rationale**: Provides a clear visual representation of a "pile" of cards.
- **Icon**: `Library` or `Layers` from `lucide-react`.
- **Styling**: `michibiki-black` background with `michibiki-white` text for the count badge.

## Decision: Accessibility Enhancements
- **Choice**: Use `Trophy` icon for scores and `Layers` icon for deck count.
- **Rationale**: Complies with Constitution Principle III (Don't rely solely on color).
- **Tooling**: `lucide-react`.
