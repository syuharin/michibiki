# Tasks: Mobile Tile Rotation Button

**Feature**: Mobile Tile Rotation Button
**Branch**: `012-mobile-rotate-button`
**Plan**: [specs/012-mobile-rotate-button/plan.md](./plan.md)

## Implementation Strategy

We follow an incremental delivery approach, prioritizing the core "select and rotate" flow on mobile.

1.  **Foundational**: Add `selectedTileId` to `UIContext` and create a mobile detection hook.
2.  **MVP (US1)**: Implement the dedicated `ActionBar` and update `Hand` to support tile selection instead of rotation on mobile.
3.  **Refinement (US2)**: Ensure the action bar only appears under the correct conditions (player turn + selected tile).
4.  **Polish**: Add haptic feedback and visual "selected" states for tiles.

## Phase 1: Setup & Foundational

Goal: Initialize the necessary state and utilities for mobile-specific logic.

- [X] T001 Add `selectedTileId` and `setSelectedTileId` to `UIContextType` in `src/context/UIContext.tsx`
- [X] T002 Implement `selectedTileId` state and provider logic in `src/context/UIContext.tsx`
- [X] T003 [P] Create `useMediaQuery` hook for mobile detection in `src/hooks/useMediaQuery.ts`

## Phase 2: User Story 1 - Rotate Tile on Mobile (Priority: P1)

Goal: Implement the core rotation button and update interaction logic for mobile devices.
Independent Test: On a mobile viewport, clicking a tile selects it (no rotation), and clicking the rotate button in the action bar rotates the selected tile.

- [X] T004 [P] [US1] Create the ActionBar component (fixed right-side) with a 44x44 rotate button in `src/components/game/ActionBar.tsx`
- [X] T005 [US1] Update `Tile.tsx` to support a visual "selected" state when its ID matches `selectedTileId` in `src/components/game/Tile.tsx`
- [X] T006 [US1] Modify `Hand.tsx` to use `useMediaQuery` and toggle `selectedTileId` instead of calling `onRotate` when on mobile in `src/components/game/Hand.tsx`
- [X] T007 [US1] Integrate `ActionBar` into `GameContainer.tsx` and pass the `rotateTile` function in `src/components/game/GameContainer.tsx`
- [X] T008 [US1] Update `handleDragStart` and `handleDragEnd` in `GameContainer.tsx` to clear or maintain `selectedTileId` appropriately in `src/components/game/GameContainer.tsx`

## Phase 3: User Story 2 - Contextual Visibility (Priority: P2)

Goal: Refine the visibility logic for the rotation button.
Independent Test: Verify the button only appears when it is the player's turn AND a tile is selected.

- [X] T009 [US2] Implement conditional rendering for `ActionBar` based on `isMyTurn` and `selectedTileId !== null` in `src/components/game/GameContainer.tsx`
- [X] T010 [US2] Ensure the "Rotate" button is hidden when no tile is selected or when the turn ends in `src/components/game/ActionBar.tsx`
- [X] T014 [US2] Implement deselection logic (clicking outside or successful placement) to clear `selectedTileId` in `src/components/game/GameContainer.tsx`

## Phase 4: Polish & Cross-cutting

Goal: Add tactile feedback and finalize UI aesthetics.

- [X] T011 [P] Add `navigator.vibrate(50)` haptic feedback to the rotate button click handler in `src/components/game/ActionBar.tsx`
- [X] T012 Add visual feedback (scale/color change) to the rotate button in `src/components/game/ActionBar.tsx` using Tailwind transitions
- [X] T013 Update the status text hint in `GameContainer.tsx` to say "Tap a tile to select" on mobile instead of "Tap to rotate" in `src/components/game/GameContainer.tsx`
- [X] T015 Verify accessibility requirements: 4.5:1 contrast ratio and 44x44 touch target compliance

## Dependencies

1.  **Phase 1** must be completed before **Phase 2**.
2.  **Phase 2 (US1)** is the MVP and should be completed before **Phase 3**.
3.  **Phase 4** can be done incrementally after **Phase 2**.

## Parallel Execution Examples

-   **T003 (Hook)** and **T004 (ActionBar UI)** can be developed in parallel.
-   **T005 (Tile CSS)** and **T011 (Haptics)** can be developed in parallel once their respective components are created.
