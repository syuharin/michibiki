# Implementation Plan: Compact UI & Right-side Hand Layout

**Branch**: `003-compact-hand-layout` | **Date**: 2026-02-28 | **Spec**: [specs/003-compact-hand-layout/spec.md]
**Input**: Feature specification from `specs/003-compact-hand-layout/spec.md`

## Summary

The feature introduces a more compact game board UI and repositions the player's hand to the right side of the screen on landscape/widescreen displays, utilizing Tailwind CSS for responsive aspect-ratio switching while preserving the classic bottom layout on mobile devices.

## Technical Context

**Language/Version**: TypeScript / React 18
**Primary Dependencies**: Next.js App Router, Tailwind CSS, @dnd-kit
**Storage**: N/A (Client-side / PeerJS)
**Testing**: Vitest
**Target Platform**: Web (Vercel)
**Project Type**: web application
**Performance Goals**: Smooth 60fps animations for cards, instantaneous layout switching on resize
**Constraints**: Maintain pure client-side state
**Scale/Scope**: Client side rendering updates for Hand component and Board layout.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **WCAG AA Compliance**: Does the design maintain a 4.5:1 contrast ratio and follow monotone aesthetics? (Yes, styling utilizes the existing monotone palette).
- [x] **P2P Implementation**: Does the solution use PeerJS without a centralized backend? (Yes, relies on existing PeerJS setup).
- [x] **Accessibility (Line Styles)**: Are player identities distinguished by line styles (Solid/Double) in addition to color? (Yes, no changes to this).
- [x] **Responsiveness**: Is the interface optimized for both mobile and desktop? (Yes, through aspect-ratio media queries).
- [x] **Vercel Native**: Can the feature run standalone on Vercel? (Yes).
- [x] **Incrementalism**: Is the implementation following an "Outline-First, Detail-Later" approach? (Yes).

## Project Structure

### Documentation (this feature)

```text
specs/003-compact-hand-layout/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── game/
│   │   ├── GameContainer.tsx
│   │   ├── Board.tsx
│   │   └── Hand.tsx
```

**Structure Decision**: Single project standard Next.js App Router structure. Changes are scoped to the existing UI components in `src/components/game/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
