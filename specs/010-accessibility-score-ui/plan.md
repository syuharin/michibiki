# Implementation Plan: Accessibility and Score UI Improvement

**Branch**: `010-accessibility-score-ui` | **Date**: 2026-03-01 | **Spec**: [specs/010-accessibility-score-ui/spec.md](spec.md)
**Input**: Feature specification from `/specs/010-accessibility-score-ui/spec.md`

## Summary

This feature enhances the visibility of the player's score and ensures the entire application meets WCAG 2.1 AA accessibility standards. The primary technical approach involves auditing the existing monotone UI for contrast compliance (min 4.5:1), implementing responsive font scaling for the score (1.5x body size), and ensuring the UI remains robust down to 320px. The implementation adheres to the "Michibiki" constitution by maintaining monotone aesthetics and serverless P2P architecture.

## Technical Context

**Language/Version**: TypeScript (Next.js 14+ App Router)
**Primary Dependencies**: React, Tailwind CSS, PeerJS, @dnd-kit
**Storage**: Client-side state (P2P), LocalStorage for preferences
**Testing**: Vitest
**Target Platform**: Web (Vercel-native)
**Project Type**: Web application (P2P Game)
**Performance Goals**: WCAG AA contrast (4.5:1), 60fps UI interactions, responsive down to 320px
**Constraints**: Monotone-first aesthetic, No central backend, PeerJS for data sync
**Scale/Scope**: Global UI audit + targeted score visibility improvements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **WCAG AA Compliance**: Does the design maintain a 4.5:1 contrast ratio and follow monotone aesthetics? (Primary goal)
- [x] **P2P Implementation**: Does the solution use PeerJS without a centralized backend? (Maintained)
- [x] **Accessibility (Line Styles)**: Are player identities distinguished by line styles (Solid/Double) in addition to color? (Maintained)
- [x] **Responsiveness**: Is the interface optimized for both mobile and desktop? (Targeted requirement)
- [x] **Vercel Native**: Can the feature run standalone on Vercel? (Yes)
- [x] **Incrementalism**: Is the implementation following an "Outline-First, Detail-Later" approach? (Yes)

## Project Structure

### Documentation (this feature)

```text
specs/010-accessibility-score-ui/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A for this UI feature)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── app/                 # Next.js App Router (Audit & Theme adjustment)
├── components/          # UI Components (Score display, Layouts)
│   ├── game/            # Game room UI
│   └── matchmaking/     # Matchmaking UI
├── context/             # Game and UI Context
├── hooks/               # useGameLogic, usePeer
└── tests/               # Vitest accessibility/UI tests
```

**Structure Decision**: Single project structure (Option 1). We are modifying existing Next.js components and Tailwind configurations within the established `src/` directory.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*(No violations identified)*
