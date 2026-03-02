# Research: Mobile UI and Interaction Fixes

## Decision: Touch Event Handling with @dnd-kit
- **Chosen**: Adjust `activationConstraint` for `TouchSensor`.
- **Rationale**: The current `delay: 250` might be too long or conflict with native scrolling. Lowering the delay and ensuring `touch-action: none` is correctly applied to draggable elements is key.
- **Alternatives**: Switching to another library like `react-beautiful-dnd` (too much overhead) or custom implementation (unnecessary given @dnd-kit's capabilities).

## Decision: Responsive Grid Scaling
- **Chosen**: Use `aspect-ratio` and CSS variables to calculate board size based on the smaller dimension of the viewport.
- **Rationale**: The board currently has a `max-w-[500px]`, which might be too large for small mobile screens (e.g., iPhone SE is 375px wide).
- **Alternatives**: Fixed pixel sizes with media queries (less fluid).

## Decision: Collapsible Player Hand
- **Chosen**: Implementation of an expandable drawer or bottom sheet for the player's hand.
- **Rationale**: To prioritize the board as requested in the specification, the hand should be minimizable to free up vertical space in portrait mode.
- **Alternatives**: Horizontal scrolling hand (still takes up fixed vertical space).

## Decision: Tile Sizing Logic
- **Chosen**: Container-relative sizing (100% width/height of cell).
- **Rationale**: Current `Tile.tsx` uses hardcoded `w-16 h-16`. This must be changed to `w-full h-full` and rely on the grid cell's dimensions.
- **Alternatives**: Scaling with `transform: scale()` (can cause blurring and layout issues).

## Decision: Orientation Handling
- **Chosen**: Lock or strongly encourage Portrait mode via CSS, using `@media (orientation: landscape)` to show a "Please rotate" message or a highly compact layout.
- **Rationale**: The spec explicitly mentions a "portrait-first" approach.
- **Alternatives**: Fully responsive grid that switches from 6x1 to 3x2 (complex for tile placement visualization).
