# Implementation Plan: Rulebook Display

**Branch**: `009-rulebook-display` | **Date**: 2026-03-01 | **Spec**: [/specs/009-rulebook-display/spec.md](../spec.md)
**Input**: Feature specification from `/specs/009-rulebook-display/spec.md`

## Summary

This feature adds a rulebook display to the "Michibiki" game, allowing players to view the game rules from both the lobby and the active game room. The technical approach involves storing the rules in an external Markdown file (`/public/rules.md`), fetching it asynchronously, and rendering it using a `RulebookModal` component and `react-markdown` library. This ensures the rules are easily accessible and maintainable without Disrupting the P2P connection or game flow.

## Technical Context

**Language/Version**: TypeScript / Next.js (App Router)  
**Primary Dependencies**: Tailwind CSS, PeerJS, @dnd-kit, lucide-react, react-markdown (New)  
**Storage**: Client-side only (Rules from static Markdown file)  
**Testing**: Vitest  
**Target Platform**: Web (Vercel)
**Project Type**: Web application  
**Performance Goals**: Modal opens < 200ms  
**Constraints**: Monotone theme, WCAG AA, No backend  
**Scale/Scope**: Single feature (Rulebook Display)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **WCAG AA Compliance**: Does the design maintain a 4.5:1 contrast ratio and follow monotone aesthetics? (Yes, follows existing modal patterns)
- [x] **P2P Implementation**: Does the solution use PeerJS without a centralized backend? (Yes, client-side only)
- [x] **Accessibility (Line Styles)**: Are player identities distinguished by line styles (Solid/Double) in addition to color? (Yes, uses text-based content with headers and bullets)
- [x] **Responsiveness**: Is the interface optimized for both mobile and desktop? (Yes, uses responsive modal layout)
- [x] **Vercel Native**: Can the feature run standalone on Vercel? (Yes, Next.js native)
- [x] **Incrementalism**: Is the implementation following an "Outline-First, Detail-Later" approach? (Yes, starts with static content and basic UI)

## Project Structure

### Documentation (this feature)

```text
specs/009-rulebook-display/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
public/
├── rules.md             # Rule content in Japanese

src/
├── components/
│   ├── rulebook/
│   │   ├── RulebookButton.tsx
│   │   └── RulebookModal.tsx
├── app/
│   ├── layout.tsx       # Integrate rulebook button/modal
```

**Structure Decision**: Option 1: Single project (DEFAULT). New components will be housed in `src/components/rulebook` to keep it organized. The rulebook will be integrated into the `RootLayout` to ensure availability across all views.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

(No violations)
