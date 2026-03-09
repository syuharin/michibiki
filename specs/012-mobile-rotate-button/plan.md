# Implementation Plan: Mobile Tile Rotation Button

**Branch**: `012-mobile-rotate-button` | **Date**: 2026-03-09 | **Spec**: [specs/012-mobile-rotate-button/spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-mobile-rotate-button/spec.md`

## Summary
Implement a dedicated "Rotate" button for mobile users to prevent accidental tile rotations when tapping tiles in the hand. The button will be fixed in a dedicated "Action Bar" at the bottom right of the screen, appearing only when a tile is selected during the player's turn. Desktop users will retain the existing click-to-rotate behavior.

## Technical Context

**Language/Version**: TypeScript 5.4+ (Next.js 14+)  
**Primary Dependencies**: React 18, Tailwind CSS 4.x, Lucide React, PeerJS, @dnd-kit/core  
**Storage**: Client-side state (GameContext / UIContext)  
**Testing**: Vitest  
**Target Platform**: Web (Responsive: Mobile & Desktop)  
**Project Type**: Web Application  
**Performance Goals**: 60 fps UI, <100ms interaction latency  
**Constraints**: Monotone theme, WCAG AA, P2P (no backend), haptic feedback (navigator.vibrate)  
**Scale/Scope**: 2 players, single-screen game interface  

## Constitution Check

*GATE: Passed Phase 0 research. Re-checked after Phase 1 design.*

- [x] **WCAG AA Compliance**: Button uses high-contrast monotone colors (Black/White) and clear icons.
- [x] **P2P Implementation**: Purely client-side UI logic; rotation state is already part of the game synchronization.
- [x] **Accessibility (Line Styles)**: Follows the project's monotone and clear icon principles.
- [x] **Responsiveness**: Specifically designed to optimize the mobile experience differently from desktop.
- [x] **Vercel Native**: Fully compatible with Next.js App Router and Vercel deployment.
- [x] **Incrementalism**: Implements a specific UX improvement within the existing game loop.

## Project Structure

### Documentation (this feature)

```text
specs/012-mobile-rotate-button/
├── plan.md              # This file
├── research.md          # Research on mobile detection and haptics
├── data-model.md        # UI state additions (selectedTileId)
├── quickstart.md        # Local testing and verification guide
├── contracts/           # N/A (Internal UI change)
└── tasks.md             # To be created by /speckit.tasks
```

### Source Code (repository root)

```text
src/
├── components/
│   └── game/
│       ├── ActionBar.tsx      # New: Contains the mobile Rotate button
│       ├── GameContainer.tsx  # Update: Integrate ActionBar and handle selection logic
│       ├── Hand.tsx           # Update: Add selection logic for mobile
│       └── Tile.tsx           # Update: Add visual 'selected' state
├── context/
│   └── UIContext.tsx          # Update: Add selectedTileId state
├── hooks/
│   └── useMediaQuery.ts       # New: Reliable mobile detection hook
└── types/
    └── game.ts                # (Already exists: defines ROTATE_HAND_TILE)
```

**Structure Decision**: Single project structure within the `src/` directory, following existing component organization.

## Complexity Tracking

*No constitution violations identified.*
