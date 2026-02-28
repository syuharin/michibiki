# Implementation Plan: Board Coordinate Markers

**Branch**: `006-board-coordinate-markers` | **Date**: 2026-02-28 | **Spec**: [specs/006-board-coordinate-markers/spec.md]
**Input**: Feature specification from `/specs/006-board-coordinate-markers/spec.md`

## Summary

Implement external coordinate markers (A-F for columns, 1-6 for rows) by modifying the `Board` component to use a 7x7 grid layout. The internal cell coordinates will be removed to provide a cleaner game board aesthetic.

## Technical Context

**Language/Version**: TypeScript / Next.js 14+ (App Router)
**Primary Dependencies**: React, Tailwind CSS, @dnd-kit (for board interactions)
**Storage**: N/A (Client-side UI)
**Testing**: Vitest
**Target Platform**: Web (Vercel-native)
**Project Type**: Web Application
**Performance Goals**: Zero impact on game logic performance; smooth UI scaling.
**Constraints**: WCAG AA (4.5:1), Monotone Aesthetics.
**Scale/Scope**: 6x6 Board UI upgrade.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **WCAG AA Compliance**: Markers will use `michibiki-black` on `michibiki-white` for maximum contrast.
- [x] **P2P Implementation**: No backend or P2P changes required for this UI feature.
- [x] **Accessibility (Line Styles)**: Not applicable for labels, but information is conveyed via text (A-F, 1-6).
- [x] **Responsiveness**: Grid-based layout ensures labels scale perfectly with board cells.
- [x] **Vercel Native**: Pure client-side UI modification.
- [x] **Incrementalism**: Phase 1 focuses on the UI transition from internal to external markers.

## Project Structure

### Documentation (this feature)

```text
specs/006-board-coordinate-markers/
├── plan.md              # This file
├── research.md          # Implementation decisions
├── data-model.md        # Coordinate mapping logic
├── quickstart.md        # Verification steps
└── tasks.md             # Implementation tasks (Phase 2)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── game/
│       ├── Board.tsx    # Modify grid layout and add markers
│       └── Cell.tsx     # (If exists) or CellComponent in Board.tsx - Remove internal span
└── lib/
    └── constants/
        └── coordinates.ts # Alphanumeric mapping constants
```

**Structure Decision**: Modify the existing `Board.tsx` component to handle both the grid labels and the game cells.

## Complexity Tracking

*No violations detected.*
