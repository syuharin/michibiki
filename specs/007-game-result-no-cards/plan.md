# Implementation Plan: Display Game Result & Rematch

**Branch**: `007-game-result-no-cards` | **Date**: 2026-02-28 | **Spec**: [specs/007-game-result-no-cards/spec.md](spec.md)
**Input**: Feature specification from `/specs/007-game-result-no-cards/spec.md`

## Summary
Implement an automatic "Game Over" trigger that activates when both players have empty hands/decks and all reversal tiles have expired. The feature includes a host-authoritative result calculation, a P2P-synchronized result modal with Win/Loss/Draw status, and a "Rematch" handshake to reset the game board for a new match within the same session.

## Technical Context

**Language/Version**: TypeScript 5.0+, Next.js 14/15 (App Router)
**Primary Dependencies**: PeerJS, Tailwind CSS, lucide-react, @dnd-kit
**Storage**: Ephemeral (Client-side memory)
**Testing**: Vitest
**Target Platform**: Web (Vercel)
**Project Type**: Web Application
**Performance Goals**: <100ms for result synchronization, 60fps animations
**Constraints**: WCAG AA (4.5:1 contrast), Monotone aesthetic, P2P (No server)
**Scale/Scope**: 2 concurrent players per room, 6x6 grid

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **WCAG AA Compliance**: Result modal uses high-contrast text and icons.
- [x] **P2P Implementation**: Synchronization via PeerJS `GAME_OVER` and `REMATCH_READY` messages.
- [x] **Accessibility (Line Styles)**: Player result differentiation includes icons and clear text.
- [x] **Responsiveness**: Modal scales for mobile and desktop viewports.
- [x] **Vercel Native**: Fully client-side logic compatible with Vercel.
- [x] **Incrementalism**: Core logic implemented first, then UI, then handshake.

## Project Structure

### Documentation (this feature)

```text
specs/007-game-result-no-cards/
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
│   └── room/
│       └── [id]/        # Game room page
├── components/
│   └── game/
│       └── ResultModal.tsx # New component
├── context/
│   └── GameContext.tsx  # State logic updates
├── hooks/
│   ├── useGameLogic.ts  # Logic hooks updates
│   └── usePeer.ts       # PeerJS messaging updates
├── lib/
│   └── game/
│       └── scoring.ts   # Scoring utilities
└── types/
    └── game.ts          # Type definitions updates
```

**Structure Decision**: Standard Next.js structure with Hooks and Context pattern.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
