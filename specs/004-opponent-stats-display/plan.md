# Implementation Plan: Display Opponent Score and Deck Count

**Branch**: `004-opponent-stats-display` | **Date**: 2026-02-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-opponent-stats-display/spec.md`

## Summary

Implement UI displays for the opponent's score and the remaining deck count.
- Opponent's score will be displayed adjacent to their status/turn indicator.
- Deck count will be shown as an overlay on a new `Deck` component representing the draw pile.
- State synchronization is already handled by `GameState.scores` and `GameState.deck`.

## Technical Context

**Language/Version**: TypeScript 5.4+ (Next.js 14+)
**Primary Dependencies**: React 18, Tailwind CSS 4.x, Lucide React, PeerJS
**Storage**: N/A (Client-side game state)
**Testing**: Vitest 1.5+
**Target Platform**: Web (Vercel)
**Project Type**: Web Application
**Performance Goals**: UI updates within 250ms of state synchronization.
**Constraints**: Monotone-first, WCAG AA contrast (4.5:1), fully responsive.
**Scale/Scope**: 1v1 multiplayer display.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **WCAG AA Compliance**: High-contrast monotone theme (Michibiki theme).
- [x] **P2P Implementation**: PeerJS-based synchronization.
- [x] **Accessibility (Line Styles)**: Using icons (Trophy, Layers) in addition to text.
- [x] **Responsiveness**: Responsive layout logic (bottom/right) handled in `GameContainer`.
- [x] **Vercel Native**: Standalone web app on Vercel.
- [x] **Incrementalism**: Outline-first implementation starting with basic UI stats.

## Project Structure

### Documentation (this feature)

```text
specs/004-opponent-stats-display/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (to be created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── game/
│       ├── GameContainer.tsx (Update for opponent info and Deck integration)
│       └── Deck.tsx (New component for draw pile)
├── types/
│   └── game.ts (Verify scores and deck structures)
└── context/
    └── GameContext.tsx (Verify score/deck broadcast logic)
```

**Structure Decision**: Standard feature update to existing Next.js App Router structure.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
