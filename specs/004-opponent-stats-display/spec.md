# Feature Specification: Display Opponent Score and Deck Count

**Feature Branch**: `004-opponent-stats-display`  
**Created**: 2026-02-28  
**Status**: Draft  
**Input**: User description: "相手のスコアと山札の枚数を表示できるようにしたいです。"

## Clarifications

### Session 2026-02-28
- Q: Should the UI support multiple opponents (3+ players)? → A: Strictly 1v1: Only one opponent's stats will ever be displayed.
- Q: Format for deck count display? → A: Overlay: Display the number (e.g., "24") directly on top of the deck icon.
- Q: Specific placement for the score? → A: Beside Avatar/Name: Displayed adjacent to the opponent's avatar or username for clear attribution.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Track Opponent Progress (Priority: P1)

As a player in a 1v1 match, I want to see my opponent's current score positioned right next to their avatar so I can instantly know how they are performing.

**Why this priority**: Knowing the score is fundamental to competitive gameplay and decision making in a head-to-head match.

**Independent Test**: Can be tested by changing the opponent's score in the game state and verifying the UI updates correctly next to the opponent's avatar/name.

**Acceptance Scenarios**:

1. **Given** a 1v1 game is in progress, **When** the opponent's score changes, **Then** the new score is immediately visible next to the opponent's avatar.
2. **Given** a 1v1 game starts, **When** I look at the opponent's avatar, **Then** I see their starting score (usually 0) adjacent to it.

---

### User Story 2 - Monitor Deck Size (Priority: P2)

As a player, I want to see how many cards are left in the deck so I can anticipate when the game might end or when to play certain cards.

**Why this priority**: Deck management is a key strategic element in many card games.

**Independent Test**: Can be tested by drawing cards from the deck and verifying the displayed count decreases on the deck icon.

**Acceptance Scenarios**:

1. **Given** cards are in the deck, **When** a card is drawn, **Then** the count overlay on the deck icon decreases by 1.
2. **Given** the deck is empty, **When** I look at the deck pile, **Then** it shows "0" on top of the icon.

---

### Edge Cases

- **Empty Deck**: When the deck is empty, the count MUST show "0" and the icon opacity should be reduced to 50% to visually indicate exhaustion.
- **Negative Scores**: If the game rules allow negative scores, the UI must display the minus sign correctly without layout breaking.
- **High Scores/Counts**: Layout must accommodate up to 3-digit scores and deck counts without overlapping other UI elements.

### Accessibility and Compliance *(mandatory)*

- **Contrast Compliance**: Score and deck count text will use high-contrast colors (e.g., white text on a dark translucent background) to ensure WCAG AA (4.5:1) compatibility.
- **Color Vision Diversity**: Instead of relying on color alone, icons will be used: a "Trophy" or "Star" icon for score, and a "Layers" icon for the deck.
- **Responsive Layout**: On mobile, the stats will be integrated into the player info badges to maximize play area space.

### Connectivity and Architecture *(mandatory)*

- **P2P Strategy**: The score and deck count are synchronized as part of the global `GameState` object via PeerJS. Each score update or draw action triggers a state broadcast.
- **Serverless Compatibility**: This feature is entirely client-side and PeerJS-based, requiring no central server for state tracking.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the opponent's current score adjacent to their avatar or username in the 1v1 UI.
- **FR-002**: System MUST display the current number of cards remaining in the deck as an overlay on the deck pile icon.
- **FR-003**: System MUST update the score display automatically whenever the synchronized game state changes.
- **FR-004**: System MUST update the deck count overlay automatically whenever a card is drawn or added to the deck.
- **FR-005**: System MUST ensure that the deck count is visible to both participants in the 1v1 room.

### Key Entities *(include if feature involves data)*

- **GameState**: The shared object containing `playerScores` (map of ID to number) and `deck` (array of card objects).
- **PlayerInfoComponent**: The UI component responsible for rendering player metadata, including the score next to the avatar/name.
- **DeckComponent**: The UI component responsible for rendering the draw pile and its metadata (deck count overlay).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Score and deck count updates are visible to both players within 250ms of a state change broadcast.
- **SC-002**: The score and deck count text remain legible at a minimum font size of 14px on mobile devices.
- **SC-003**: 100% of the deck-related actions (draw, shuffle) are accurately reflected in the displayed count.
- **SC-004**: Users can identify the opponent's score and deck size within 1 second of looking at the screen.
