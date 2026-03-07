# michibiki Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-28

## Active Technologies
- TypeScript / Next.js 14+ (App Router) + PeerJS (P2P), @dnd-kit/core (DnD), React (Hooks/Context) (002-auto-turn-transition)
- N/A (Client-side GameContext synced via PeerJS) (002-auto-turn-transition)
- [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION] + [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION] (003-compact-hand-layout)
- [if applicable, e.g., PostgreSQL, CoreData, files or N/A] (003-compact-hand-layout)
- TypeScript / React 18 + Next.js App Router, Tailwind CSS, @dnd-kit (003-compact-hand-layout)
- N/A (Client-side / PeerJS) (003-compact-hand-layout)
- TypeScript 5.4+ (Next.js 14+) + React 18, Tailwind CSS 4.x, Lucide React, PeerJS (004-opponent-stats-display)
- N/A (Client-side game state) (004-opponent-stats-display)
- TypeScript / Next.js 14+ (App Router) + React, Tailwind CSS, PeerJS, Lucide React (icons) (005-choose-turn-order)
- Client-side state (GameContext), P2P synchronization via PeerJS (005-choose-turn-order)
- TypeScript / Next.js 14+ (App Router) + React, Tailwind CSS, @dnd-kit (for board interactions) (006-board-coordinate-markers)
- N/A (Client-side UI) (006-board-coordinate-markers)
- TypeScript 5.0+, Next.js 14/15 (App Router) + PeerJS, Tailwind CSS, lucide-react, @dnd-kit (007-game-result-no-cards)
- Ephemeral (Client-side memory) (007-game-result-no-cards)
- TypeScript / Next.js (App Router) + Tailwind CSS, PeerJS, @dnd-kit, lucide-react, react-markdown (New) (009-rulebook-display)
- Client-side only (Rules from static Markdown file) (009-rulebook-display)
- TypeScript (Next.js 14+ App Router) + React, Tailwind CSS, PeerJS, @dnd-kit (010-accessibility-score-ui)
- Client-side state (P2P), LocalStorage for preferences (010-accessibility-score-ui)

- TypeScript / Next.js 14+ (App Router) + PeerJS, @dnd-kit, Tailwind CSS, qrcode.react (001-michibiki-game-core)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test; npm run lint

## Code Style

TypeScript / Next.js 14+ (App Router): Follow standard conventions

## Recent Changes
- 011-score-gain-feedback: Implemented visual score feedback with floating indicators and tile glow effects synchronized via PeerJS.
- 010-accessibility-score-ui: Added TypeScript (Next.js 14+ App Router) + React, Tailwind CSS, PeerJS, @dnd-kit
- 009-rulebook-display: Added TypeScript / Next.js (App Router) + Tailwind CSS, PeerJS, @dnd-kit, lucide-react, react-markdown (New)
- 008-mobile-ui-fixes: Added mobile responsiveness fixes and layout adjustments.


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
