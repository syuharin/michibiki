# Feature Specification: Compact UI & Right-side Hand Layout

**Feature Branch**: `003-compact-hand-layout`  
**Created**: 2026-02-28  
**Status**: Draft  
**Input**: User description: "画面をコンパクトにしたいです。手札をボードの下ではなく、右にしたいです。"

## Clarifications

### Session 2026-02-28
- Q: Vertical card alignment on the right-side → A: Top-aligned (Descending)
- Q: Card hover behavior in vertical layout → A: Expand Leftwards
- Q: Right-side hand gutter width → A: Fixed Width (Single Card)
- Q: Hand container visual header → A: No Header
- Q: Vertical card spacing logic → A: Adaptive Overlap

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Right-side Hand Layout (Priority: P1)

As a player, I want my hand of cards to be displayed on the right side of the board instead of the bottom on widescreen displays so that I can see the board and my cards more effectively.

**Why this priority**: This is the core request from the user and significantly changes the primary UI layout for the main target (desktop/widescreen).

**Independent Test**: Can be fully tested by opening the game room on a landscape window and verifying that the hand container is positioned to the right of the central game board.

**Acceptance Scenarios**:

1. **Given** a game in progress on a landscape screen, **When** the UI renders, **Then** the player's hand cards are displayed in a vertical column on the right side of the screen.
2. **Given** the hand is on the right, **When** a player selects a card, **Then** the card is highlighted and ready for play just as it was in the bottom layout.

---

### User Story 2 - Responsive Layout Adaptation (Priority: P1)

As a player on a mobile device or narrow window, I want the hand to remain at the bottom so that the cards remain large enough to interact with easily.

**Why this priority**: Essential for maintaining playability across all devices (Mobile First/Responsive principle).

**Independent Test**: Resize the browser window to a portrait aspect ratio; the hand should automatically move from the right side to the bottom.

**Acceptance Scenarios**:

1. **Given** a landscape layout with hand on the right, **When** the window is resized to a portrait aspect ratio, **Then** the hand smoothly transitions to the bottom of the screen.
2. **Given** a mobile device in portrait mode, **When** the game starts, **Then** the hand is displayed at the bottom by default.

---

### User Story 3 - Compact Board Layout (Priority: P2)

As a player, I want the game board and UI elements to be more compact so that more information is visible on the screen without unnecessary whitespace.

**Why this priority**: High priority as it fulfills the "compact" part of the user request, improving the overall feel of the game on smaller windows.

**Independent Test**: Compare the new layout's vertical and horizontal footprint against the previous version; the game board should occupy a smaller or more efficient area.

**Acceptance Scenarios**:

1. **Given** the game room UI, **When** compact mode is active, **Then** margins between board elements are reduced and font sizes for non-critical information are optimized for space.

---

### Edge Cases

- **Large Hand Sizes**: What happens when a player has more cards than can fit vertically on the right side? (e.g., more than 10-12 cards). **Assumption**: Vertical scrolling will be enabled.
- **Z-Index/Overlays**: Do card detail popups or tooltips correctly appear over the right-side hand without being clipped by the screen edge?
- **Intermediate Aspect Ratios**: Ensure there is no "dead zone" or overlapping during the transition between landscape and portrait.

### Accessibility and Compliance *(mandatory)*

- **Contrast Compliance**: UI elements in the compact layout must maintain a contrast ratio of at least 4.5:1.
- **Color Vision Diversity**: Use distinct icons or borders to indicate "active" or "selectable" cards in the hand, ensuring functionality is not dependent on color alone.
- **Responsive Layout**: The UI uses CSS Flexbox/Grid and Media Queries (aspect-ratio) to handle the layout switch seamlessly.

### Connectivity and Architecture *(mandatory)*

- **P2P Strategy**: The layout change is purely client-side; data synchronization via PeerJS for card states remains unchanged.
- **Serverless Compatibility**: No server-side dependencies are introduced by this layout change.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST position the player's hand container to the right of the main game board area when the screen aspect ratio is landscape (wide).
- **FR-002**: The system MUST position the player's hand container at the bottom when the screen aspect ratio is portrait (narrow).
- **FR-003**: The hand container MUST display cards in a vertical orientation (top-aligned column) when positioned on the right.
- **FR-004**: The game board MUST automatically resize to fill the remaining horizontal space after the hand is moved to the right.
- **FR-005**: The system MUST support vertical scrolling within the hand container if the cards exceed the available viewport height on the right side.
- **FR-006**: All card animations (drawing, playing) MUST be updated to originate from/terminate at the current hand position (right or bottom).
- **FR-007**: Cards in the vertical hand MUST expand to the left when hovered or selected to ensure full visibility without clipping.
- **FR-008**: The hand container MUST have a fixed width optimized for a single vertical card column to maintain maximum compactness.
- **FR-009**: The hand area MUST NOT contain a text header or label to maximize usable vertical space.
- **FR-010**: The hand container MUST implement adaptive overlapping for cards as hand size increases, ensuring the hand remains compact and within the viewport limits before scrolling.

### Key Entities *(include if feature involves data)*

- **Hand Container**: Represents the UI component holding the player's current cards. Cards are top-aligned in vertical mode, expand leftwards on interaction, reside in a fixed-width gutter, and use adaptive overlapping.
- **Game Board**: The central area where cards are played and game state is visualized.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On landscape screens, the vertical height occupied by the game UI is reduced by at least 20% compared to the bottom-hand layout.
- **SC-002**: 100% of existing card interactions (drag-and-drop, click-to-play) function correctly in both right-side and bottom layouts.
- **SC-003**: Users can view up to 8 cards in their hand without needing to scroll on a standard laptop screen (1366x768) in landscape mode.
- **SC-004**: The layout switch between right and bottom occurs automatically without requiring a page refresh.
