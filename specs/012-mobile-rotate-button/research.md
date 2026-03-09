# Research: Mobile Tile Rotation Button

## 1. Mobile Detection Strategy

### Decision
Use a combination of CSS Media Queries for layout and a custom React hook `useMediaQuery` or checking `window.matchMedia` for functional logic in components.

### Rationale
Tailwind's `sm:` classes (640px) are already used for layout. For logic that depends on "isMobile", we need a reliable way to detect the screen width or touch capability. Since the requirement is specifically "Mobile only", checking `(max-width: 640px)` aligns with existing UI breakpoints.

### Alternatives Considered
-   **User-Agent string**: Too complex and unreliable.
-   **Touch capability detection (`ontouchstart` in window)**: Some desktops have touchscreens, which might trigger the button unnecessarily if we only check touch.

## 2. Haptic Feedback (Vibration)

### Decision
Use `navigator.vibrate(50)` for a short, light feedback.

### Rationale
`navigator.vibrate` is standard for simple haptics in browsers. A 50ms pulse provides a subtle "click" feel.

### Alternatives Considered
-   **Audio feedback**: Might be intrusive if the user has sound off.
-   **Visual-only feedback**: Requirement explicitly asked for haptic feedback.

## 3. Tile Selection & Rotation Logic

### Decision
1.  Add `selectedTileId` to `UIContext`.
2.  In `Hand.tsx`, if mobile:
    -   `onClick` sets `selectedTileId`.
    -   `onRotate` is NOT called by `onClick`.
3.  Create `ActionBar.tsx` fixed at the bottom right.
4.  `ActionBar` appears when `selectedTileId` is set and `isMyTurn`.
5.  `ActionBar` contains the "Rotate" button, which calls `rotateTile(selectedTileId)`.
6.  `selectedTileId` is cleared when a tile is placed, or when clicking outside.

### Rationale
This separates "selection" from "rotation" on mobile, preventing accidental turns.

## 4. Visual Feedback

### Decision
Use Tailwind's `active:scale-95` and `transition-transform` for the button.
For the tile, add a "selected" highlight (e.g., a thicker border or a subtle glow) when `selectedTileId === tile.id`.

### Rationale
Clear visual indication is crucial for "What am I rotating?".
