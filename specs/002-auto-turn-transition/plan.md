# Implementation Plan: Automatic Turn Transition & Button Removal

**Branch**: `002-auto-turn-transition` | **Date**: 2026-02-28 | **Spec**: [specs/002-auto-turn-transition/spec.md]
**Input**: Feature specification from `/specs/002-auto-turn-transition/spec.md`

## Summary

This feature eliminates the manual "End Turn" button to create a more fluid game experience. The system will automatically trigger turn transitions (via PASS_TURN logic) and hand refills immediately after a valid tile placement. Key technical challenges include implementing a "No Legal Moves" detection algorithm to conditionally show a "Pass" button and ensuring robust P2P synchronization of automatic state transitions.

## Technical Context

**Language/Version**: TypeScript / Next.js 14+ (App Router)  
**Primary Dependencies**: PeerJS (P2P), @dnd-kit/core (DnD), React (Hooks/Context)  
**Storage**: N/A (Client-side GameContext synced via PeerJS)  
**Testing**: Vitest  
**Target Platform**: Web (Vercel-native)
**Project Type**: Web Application (Interactive Game)  
**Performance Goals**: Turn transition < 200ms, Legal move detection < 500ms  
**Constraints**: Monotone WCAG AA (4.5:1), PeerJS P2P (No backend), Responsive (Mobile/Desktop)  
**Scale/Scope**: 2-player P2P sessions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **WCAG AA Compliance**: Does the design maintain a 4.5:1 contrast ratio and follow monotone aesthetics?
- [x] **P2P Implementation**: Does the solution use PeerJS without a centralized backend?
- [x] **Accessibility (Line Styles)**: Are player identities distinguished by line styles (Solid/Double) in addition to color?
- [x] **Responsiveness**: Is the interface optimized for both mobile and desktop?
- [x] **Vercel Native**: Can the feature run standalone on Vercel?
- [x] **Incrementalism**: Is the implementation following an "Outline-First, Detail-Later" approach?

## Project Structure

### Documentation (this feature)

```text
specs/002-auto-turn-transition/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── app/
│   └── room/[id]/       # Main game room page
├── components/
│   └── game/
│       ├── GameContainer.tsx # UI logic for turn button/indicator
│       └── Board.tsx        # Board rendering
├── context/
│   └── GameContext.tsx      # Core state reducer (PLACE_TILE, PASS_TURN)
├── hooks/
│   ├── useGameLogic.ts      # Action creators and automated triggers
│   └── usePeer.ts           # P2P message handling
├── lib/
│   └── game/
│       └── validation.ts    # [NEW] Legal move detection logic
└── types/
    └── game.ts              # Action and State types
```

**Structure Decision**: Single project (Next.js App Router). We will enhance `GameContext.tsx` and `useGameLogic.ts` to handle the automation, and add a new validation utility in `src/lib/game/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
