# Feature Specification: Accessibility and Score UI Improvement

**Feature Branch**: `010-accessibility-score-ui`  
**Created**: 2026-03-01  
**Status**: Draft  
**Input**: User description: "wcag aaに準拠しているかどうか再確認したいです。また、自分の得点がわかりやすいように少し大きくしたいです。"

## Clarifications

### Session 2026-03-01
- Q: How should score contrast and visibility be ensured? → A: Option A: Maintain sufficient contrast against current board colors via color adjustments, combined with increased font size.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clear Score Visibility (Priority: P1)

As a player, I want to easily see my current score during the game so that I can make quick strategic decisions without straining my eyes.

**Why this priority**: Knowing the score is a core part of the game loop. If players can't easily see it, the gameplay experience is significantly degraded.

**Independent Test**: Can be tested by opening the game and checking if the player's score is visually prominent and larger than other secondary UI elements.

**Acceptance Scenarios**:

1. **Given** the player is in a game room, **When** they look at the score display area, **Then** their score should be significantly larger and easier to read than it was previously.
2. **Given** the player's score changes, **When** the new score is displayed, **Then** it should maintain the increased size and clear visibility.

---

### User Story 2 - WCAG AA Compliance Verification (Priority: P2)

As a user with visual impairments or specific accessibility needs, I want the game UI (especially the score) to meet WCAG AA standards so that I can play the game comfortably using assistive technologies or in high-contrast situations.

**Why this priority**: Ensuring accessibility is a legal/ethical requirement and expands the potential user base to include those with varying visual abilities.

**Independent Test**: Can be tested using accessibility auditing tools (like Lighthouse or Axe) and manual checks for color contrast and screen reader compatibility.

**Acceptance Scenarios**:

1. **Given** a standard game session, **When** checked with a contrast analyzer, **Then** all text (including the score) must have a contrast ratio of at least 4.5:1 against its background.
2. **Given** a screen reader is active, **When** the score changes, **Then** the screen reader should be able to announce the updated score clearly.

---

### Edge Cases

- **Large Scores**: What happens when the score reaches 3 or more digits? Does the larger font size cause layout breaking or overlap with other elements?
- **Small Screens**: How does the score display look on very small mobile screens (e.g., iPhone SE) when the font is increased? We must ensure it doesn't push other critical game controls off-screen.
- **Dynamic Backgrounds**: If the game board background changes colors, how does the score maintain its contrast ratio?

### Accessibility and Compliance *(mandatory)*

- **Contrast Compliance**: Score text color and background color will be adjusted to maintain a minimum 4.5:1 ratio against existing game board colors, ensuring high legibility without requiring a separate high-contrast theme.
- **Color Vision Diversity**: We will use font weight, borders, or distinct containers to highlight the player's score, ensuring that color is not the only means of conveying information.
- **Responsive Layout**: On mobile, we will use responsive font sizing (e.g., using `rem` or `vw` units) to ensure the score remains large relative to other elements without causing layout overflows.

### Connectivity and Architecture *(mandatory)*

- **P2P Strategy**: The score data is synchronized via PeerJS. This UI enhancement is purely a presentation layer change and does not affect the P2P synchronization logic.
- **Serverless Compatibility**: This is a frontend-only UI/UX improvement, fully compatible with the existing Vercel-native Next.js architecture.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display the player's current score in a font size that is at least 1.5x larger than the default body text size.
- **FR-002**: All text elements in the game room MUST meet WCAG 2.1 AA contrast requirements (minimum 4.5:1 for normal text, 3.0:1 for large text).
- **FR-003**: The score display MUST be correctly labeled for assistive technologies (e.g., using `aria-live="polite"` for automatic updates or clear ARIA labels).
- **FR-004**: The UI MUST remain responsive and usable on screen widths as narrow as 320px even with increased font sizes.
- **FR-005**: The WCAG 2.1 AA audit and compliance fixes MUST cover the entire application, including landing pages, matchmaking, and game room UI.

### Key Entities *(include if feature involves data)*

- **GameSession**: Represents the active game state, containing current scores.
- **Player**: Represents a participant whose score needs to be displayed prominently.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of text elements in the targeted UI areas pass WCAG 2.1 AA contrast checks.
- **SC-002**: Screen reader users are notified of score changes automatically within 2 seconds of the update.
- **SC-003**: Score legibility is verified to be significantly improved on mobile devices (minimum font size of 24px for the primary score).
- **SC-004**: Zero UI layout regressions (overlaps, overflows) on mobile devices down to 320px width.
