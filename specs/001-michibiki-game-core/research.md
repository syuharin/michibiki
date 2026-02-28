# Research: Michibiki Core Game Logic

## P2P Synchronization Pattern
- **Decision**: Host-Authoritative State Synchronization.
- **Rationale**: In a turn-based P2P game, having a single source of truth (the "Host" who created the room) simplifies conflict resolution. The Guest sends "intent" messages (e.g., `PLACE_TILE`), and the Host responds with the authoritative `BOARD_STATE_UPDATE`.
- **Alternatives considered**: Deterministic Lockstep (too complex for a simple board game; requires absolute synchronicity of RNG and logic on both sides).

## Drag and Drop Interaction
- **Decision**: @dnd-kit with Pointer Sensors.
- **Rationale**: @dnd-kit is highly accessible and supports both mobile touch and desktop pointer events out of the box. It allows for custom "Drop" logic which is needed for the 6x6 grid.
- **Alternatives considered**: react-beautiful-dnd (no longer actively maintained), native HTML5 Drag and Drop (poor mobile support).

## Pathfinding and Scoring
- **Decision**: BFS (Breadth-First Search) on placement.
- **Rationale**: The 6x6 grid is small enough that BFS will execute almost instantaneously (<1ms). BFS is ideal for finding all connected nodes in an unweighted graph (the pipeline).
- **Complexity**: O(V+E) where V is the number of cells (36) and E is the connections.

## Accessibility (WCAG AA & Color Vision)
- **Decision**: Tailwind CSS `contrast-ratio` checks and SVG Line Patterns.
- **Rationale**: Monotone design can easily fail contrast checks if grays are too close. We will use `slate-900` on `slate-50` or similar for text. For players, we will use SVG patterns (Solid vs. Dash/Double) inside the tile lines.
- **Specific Implementation**: 
  - Host: `stroke-width: 2; stroke: black;`
  - Guest: `stroke-width: 4; stroke: gray; stroke-dasharray: 1 2;` (Visualizing double lines via dash or secondary stroke).

## Vercel-Native P2P
- **Decision**: PeerJS with default signaling server.
- **Rationale**: PeerJS provides a free signaling server for development. For Vercel, everything must be client-side. PeerJS fits this perfectly as it initializes entirely in the browser.
- **Risks**: PeerJS signaling server can occasionally be unstable; we should handle `error` events and allow room ID re-entry.
