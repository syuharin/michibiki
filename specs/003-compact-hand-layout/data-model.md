# Data Model: Compact UI & Right-side Hand Layout

This feature is purely a UI/UX update and does not introduce any new data models or modify existing state structures in `src/types/game.ts`.

## UI State Considerations

- **Layout State**: No explicit React state is needed for the layout; it will rely entirely on CSS Media Queries (`landscape:` / `@media (orientation: landscape)`) and viewport-relative sizing.
- **Overlap Calculation**: The `Hand.tsx` component will derive its overlap factor purely from `myHand.length` to dynamically apply inline styles.
