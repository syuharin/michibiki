# Implementation Plan: Michibiki Core Game Logic

**Branch**: `001-michibiki-game-core` | **Date**: 2026-02-28 | **Spec**: [specs/001-michibiki-game-core/spec.md]
**Input**: Phased implementation plan for the core board game logic.

## Summary

Implement the core game loop for "Michibiki" (Pipeline) using Next.js and PeerJS. This includes P2P matchmaking, a 6x6 grid with drag-and-drop tile placement, cumulative scoring via BFS, and reversal tiles with 5-turn timers.

## Technical Context

**Language/Version**: TypeScript / Next.js 14+ (App Router)  
**Primary Dependencies**: PeerJS, @dnd-kit, Tailwind CSS, qrcode.react  
**Storage**: Client-side memory (Ephemeral)  
**Testing**: Vitest (Unit tests for scoring logic), Playwright (P2P integration)  
**Target Platform**: Vercel (Web / Mobile Responsive)
**Project Type**: Web Application (P2P Game)  
**Performance Goals**: <50ms scoring calculation, 60fps UI  
**Constraints**: Serverless (No backend DB), WCAG AA Contrast, Color Vision Diversity (Line Styles)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **WCAG AA Compliance**: Design will use monotone palette with 4.5:1 contrast ratio.
- [x] **P2P Implementation**: Using PeerJS; Host-authoritative conflict resolution.
- [x] **Accessibility (Line Styles)**: Host uses Solid lines; Guest uses Double lines.
- [x] **Responsiveness**: Tailwind-based grid scaling for mobile/desktop.
- [x] **Vercel Native**: No external dependencies beyond PeerJS signaling.
- [x] **Incrementalism**: Starting with P2P connectivity and basic grid logic.

## Project Structure

### Documentation (this feature)

```text
specs/001-michibiki-game-core/
├── plan.md              # This file
├── research.md          # Technical research notes
├── data-model.md        # Detailed entity definitions
├── quickstart.md        # Local setup and P2P testing guide
├── contracts/           # P2P message schema definitions
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── app/                 # Next.js App Router (pages/layout)
├── components/          # UI Components (Board, Tile, Hand, QR)
├── hooks/               # Custom hooks (usePeer, useGameLogic)
├── lib/                 # Shared utilities (BFS scoring, constants)
├── types/               # TypeScript definitions
└── tests/               # Unit and Integration tests
```

**Structure Decision**: Single project Next.js application. State managed via React context or custom hooks synchronized over PeerJS.

## Phase 0: Research & Data Design

- **P2P Synchronization**: Finalized "Host-authoritative" model. Host will broadcast the definitive `BoardState` after every turn.
- **Scoring Algorithm**: BFS to find all connected tiles of the same owner starting from the placement cell.
- **Timer Logic**: Reversal tiles will have a `turnsLeft` property. Decrement happens at the end of the owner's turn on the Host's side.

## Phase 1: Interactive Design

- **Tile States**: `IN_HAND`, `PLACED_UNCONFIRMED` (allows rotation), `CONFIRMED`.
- **Animations**: CSS transitions for tile rotation; Keyframe pulse animation for reversal tiles with 1 turn left.

## Phase 2: Implementation Sequence

### Milestone 1: P2P Communication Foundation and QR Code Sharing
- [ ] Setup Next.js boilerplate and PeerJS signaling hook.
- [ ] Implement Room ID generation and QR code display (`qrcode.react`).
- [ ] Verify Host/Guest handshake and state mirroring.

### Milestone 2: 6x6 Board and D&D Tile Placement UI
- [ ] Build the `Board` (6x6 grid) and `Tile` components.
- [ ] Integrate `@dnd-kit` for hand-to-grid movement.
- [ ] Implement tile rotation logic for unconfirmed placements.

### Milestone 3: Connection Detection Algorithm (BFS/DFS) and Cumulative Scoring
- [ ] Implement BFS utility to calculate connected pipeline size.
- [ ] Build the `ScoreBoard` component.
- [ ] Integrate cumulative scoring logic into the turn confirmation flow.

### Milestone 4: Reversal Tile UI and Countdown/Replenishment Logic
- [ ] Implement overlay logic for reversal tiles (max 2 layers per cell).
- [ ] Build the countdown display and pulse animation for `turnsLeft === 1`.
- [ ] Implement turn-based timer decrement and auto-removal/draw logic.

### Milestone 5: WCAG AA Compliant Design Adjustments
- [ ] Finalize the monotone theme with `slate-900` / `slate-50`.
- [ ] Verify contrast ratios and accessibility markers (Line Styles).
- [ ] Polish responsive layouts for mobile viewports.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| P2P State Mirroring | Essential for real-time multiplayer without a server. | Polling a central DB is rejected to maintain serverless principle. |
| Layered Board Cells | Required for reversal tiles overwriting existing ones. | Replacing the tile completely would lose the underlying state when the reversal tile expires. |
