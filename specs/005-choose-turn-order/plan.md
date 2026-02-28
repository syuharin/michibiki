# Implementation Plan: Choose Turn Order

**Branch**: `005-choose-turn-order` | **Date**: 2026-02-28 | **Spec**: [specs/005-choose-turn-order/spec.md]
**Input**: Feature specification from `/specs/005-choose-turn-order/spec.md`

## Summary

Implement a turn order selection mechanism in the game lobby. The Host must select the turn order (Host First-mover, Guest First-mover, or Random) before starting the game. The selection is synchronized in real-time to the Guest using PeerJS. If Random is chosen, the result is determined at the moment of game start and emphasized to both players.

## Technical Context

**Language/Version**: TypeScript / Next.js 14+ (App Router)
**Primary Dependencies**: React, Tailwind CSS, PeerJS, Lucide React (icons)
**Storage**: Client-side state (GameContext), P2P synchronization via PeerJS
**Testing**: Vitest
**Target Platform**: Web (Vercel-native)
**Project Type**: Web Application (P2P Game)
**Performance Goals**: Synchronization latency < 500ms
**Constraints**: Monotone-based WCAG AA (4.5:1 contrast), Serverless P2P, Color vision accessibility (Line styles/badges)
**Scale/Scope**: 2 players (Host/Guest) per room

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **WCAG AA Compliance**: Design will use monotone colors with verified contrast for turn order badges/buttons.
- [x] **P2P Implementation**: State sync will use existing PeerJS data channels.
- [x] **Accessibility (Line Styles)**: Turn order will be indicated by "先行/後攻" text and distinct badge styles (Solid vs Double borders).
- [x] **Responsiveness**: Selection UI will be responsive for mobile/desktop lobby views.
- [x] **Vercel Native**: Implementation is purely client-side/Next.js.
- [x] **Incrementalism**: Implementation starts with state definition and UI before logic integration.

## Project Structure

### Documentation (this feature)

```text
specs/005-choose-turn-order/
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
│   └── room/[id]/page.tsx  # Lobby UI for turn order selection
├── components/
│   └── game/
│       └── TurnOrderSelector.tsx  # New component for selection
├── context/
│   └── GameContext.tsx     # Update state to include turn order config
├── hooks/
│   └── useGameLogic.ts     # Update game initialization with turn order
└── types/
    └── game.ts             # Update types for TurnOrderConfig
```

**Structure Decision**: Single project structure within the existing Next.js app. Adding a dedicated component for turn order selection and updating the central game state.

## Complexity Tracking

*No violations detected.*
