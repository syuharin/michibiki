# Data Model: Accessibility and Score UI Improvement

## UI Configuration (Tailwind Extend)
- **Primary Contrast Color**: `michibiki-gray` updated to `#57657A` (slate-600) for a robust WCAG AA (min 4.5:1) compliance against `michibiki-white` (#F8FAFC).

## Component Schema Changes (Visual Only)

### Score Component (in GameContainer.tsx)
- **Current Font Classes**: `text-sm sm:text-xl font-black`
- **Updated Font Classes**: `text-lg sm:text-3xl font-black`
- **A11y Attribute**: `aria-live="polite"` on the parent score container to announce changes.

### Entity Attributes (UI Perspective)
- **Player Score**: Represented in the game state as a number.
- **Score Update Pulse**: (Visual feedback) Ensure any transition or pulse effect on the score doesn't fall below contrast requirements during animation.
