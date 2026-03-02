# Implementation Plan: Mobile UI and Interaction Fixes

**Feature Branch**: `008-mobile-ui-fixes`  
**Created**: 2026-02-28  
**Status**: Draft  
**Related Spec**: [spec.md](./spec.md)

## Technical Context

- **Language/Framework**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Interaction Library**: @dnd-kit/core
- **Environment Constraints**: Vercel-native, mobile-first responsive design
- **State Management**: React Context (`GameContext.tsx`)
- **Key Files**: `GameContainer.tsx`, `Board.tsx`, `Hand.tsx`, `Tile.tsx`

## Constitution Check

| Principle | Impact | Status |
| :--- | :--- | :--- |
| Monotone & WCAG AA | Ensure scaling doesn't affect color contrast or readability. | ✅ |
| PeerJS P2P | No direct impact, as UI changes won't affect the data protocol. | ✅ |
| Color Vision | Symbols remain clear when scaled. Use line styles to differentiate players. | ✅ |
| Responsive UX | The core of this feature. Ensure one-screen fit without scrolling. | ✅ |
| Vercel Native | Fully compatible as it's a client-side UI fix. | ✅ |
| Incremental Implementation | Phase 1 focuses on core UI scaling and interaction fixes. | ✅ |

## Implementation Roadmap

### Phase 0: Research & Discovery
- **Goal**: Resolve unknowns regarding @dnd-kit touch behavior and CSS grid scaling.
- **Output**: [research.md](./research.md)
- **Status**: Completed

### Phase 1: Core UI & Data Design
- **Goal**: Define the visual model for scaling and collapsible hand.
- **Output**: [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)
- **Status**: Completed

### Phase 2: Component Refactoring
- **Goal**: Implement the responsive layout and interaction improvements.
- **Status**: Planned

#### Task 2.1: GameContainer Layout Adjustments
- Update `GameContainer.tsx` to use a `max-h-screen` container and `overflow-hidden`.
- Implement a state variable `isHandExpanded` to toggle the player's hand.
- Adjust `TouchSensor` configuration for better responsiveness.

#### Task 2.2: Responsive Board Scaling
- Update `Board.tsx` to calculate its dimensions relative to the available viewport space.
- Remove hardcoded `max-w-[500px]` and use fluid sizing.
- Ensure the coordinate markers (A-F, 1-6) scale with the board.

#### Task 2.3: Relative Tile Sizing
- Refactor `Tile.tsx` to remove fixed `w-16 h-16` classes.
- Use `w-full h-full` and rely on parent container sizing.
- Ensure the SVG content scales correctly within the relative box.

#### Task 2.4: Collapsible Hand UI
- Update `Hand.tsx` to support an "expanded" and "collapsed" state.
- Add a toggle button or handle to allow the player to open/close their hand.
- In collapsed mode, show only a small preview or indicator to maximize board space.

### Phase 3: Validation & Polishing
- **Goal**: Verify fixes on simulated and real mobile devices.
- **Status**: Planned
