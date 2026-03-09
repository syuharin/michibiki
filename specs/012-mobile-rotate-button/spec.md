# Feature Specification: Mobile Tile Rotation Button

**Feature Branch**: `012-mobile-rotate-button`  
**Created**: 2026-03-09  
**Status**: Draft  
**Input**: User description: "スマホの場合のみタップでタイルの回転するのではなく専用のボタンを用意してほしいです。"

## Clarifications

### Session 2026-03-09
- Q: Where should the rotation button be placed on mobile? → A: Fixed in a dedicated "Action Bar" at the bottom.
- Q: What should be displayed on the rotation button? → A: Icon only (rotating arrow).
- Q: What feedback should be provided when the button is pressed? → A: Visual change (scaling/color) plus light haptic feedback (vibration).
- Q: Under what exact conditions should the button be visible? → A: Only during the player's own turn AND when a tile is currently selected from the hand.
- Q: Where within the action bar should the button be placed? → A: Fixed to the right side of the screen (optimized for right-handed thumb access).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Rotate Tile on Mobile (Priority: P1)

As a mobile player, I want to rotate my selected tile using a dedicated button so that I don't accidentally rotate it when trying to place it or select it.

**Why this priority**: Core gameplay mechanic improvement. Accidental rotations on small screens are a major frustration and impact game strategy.

**Independent Test**: On a mobile device, select a tile and tap the "Rotate" button. The tile should rotate. Tapping the tile itself should not rotate it.

**Acceptance Scenarios**:

1. **Given** a mobile device and a selected tile, **When** the "Rotate" button is tapped, **Then** the tile rotates 90 degrees clockwise.
2. **Given** a mobile device and a selected tile, **When** the tile itself is tapped, **Then** the tile does NOT rotate.

---

### User Story 2 - Contextual Visibility (Priority: P2)

As a mobile player, I want the rotation button to only be visible when I have a tile selected, to keep the UI clean.

**Why this priority**: Improves UX by reducing visual clutter and preventing confusion about when rotation is possible.

**Independent Test**: Check button visibility during different game phases (idle vs. tile selected).

**Acceptance Scenarios**:

1. **Given** no tile is selected, **When** viewing the game UI, **Then** the "Rotate" button is hidden.
2. **Given** a tile is selected from the hand, **When** viewing the game UI, **Then** the "Rotate" button becomes visible.

---

### Edge Cases

- **Rapid Tapping**: What happens when the user taps the rotate button very quickly? (System should process each tap and update the state correctly).
- **Placement Preview**: Does the button stay visible if the tile is "held" over the board for preview? (Yes, for convenience).
- **Desktop with Touch**: How does the system handle hybrid devices (laptops with touchscreens)? (Should follow mobile behavior if touch is the primary interaction).

### Accessibility and Compliance *(mandatory)*

- **Contrast Compliance**: The rotation button icon/background will maintain at least 4.5:1 contrast ratio against the game board/UI background.
- **Touch Target Size**: The button will have a minimum touch target size of 44x44 points to ensure ease of use for all users.
- **Icon Clarity**: Use a clear "circular arrow" icon to indicate rotation, ensuring the action is understandable without text.

### Connectivity and Architecture *(mandatory)*

- **P2P Strategy**: The rotation state is part of the tile's local state and is synchronized via PeerJS only when the tile is officially placed or if a real-time preview is implemented.
- **Serverless Compatibility**: Entirely client-side UI logic; no server-side changes required.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a dedicated "Rotate" button (icon only) UI element fixed on the **right side** of a dedicated "Action Bar" at the bottom of the screen on mobile devices.
- **FR-002**: On mobile devices, tapping the tile itself MUST NOT trigger rotation.
- **FR-003**: The "Rotate" button MUST only be visible during the player's active turn AND when a tile is currently selected.
- **FR-004**: Each interaction with the "Rotate" button MUST rotate the active tile 90 degrees clockwise.
- FR-005: Desktop devices MUST NOT show the "Rotate" button and MUST retain the current click-to-rotate behavior.
- **FR-006**: The rotation button MUST provide both visual feedback (e.g., brief scale or color change) and light haptic feedback (vibration) when pressed on supported mobile devices.
- **FR-007**: System MUST clear the `selectedTileId` when a user clicks/taps outside the hand area or when a tile is successfully placed.

### Key Entities *(include if feature involves data)*

- **RotationState**: Represents the orientation of a tile (0, 90, 180, 270 degrees).
- **Tile**: The game object being rotated, which holds its current `RotationState`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of mobile users can successfully rotate tiles using the dedicated button.
- **SC-002**: Accidental tile rotations (due to unintended taps on the tile itself) are reduced to 0 on mobile devices.
- **SC-003**: The "Rotate" button is reachable with a single thumb on 95% of common smartphone screen sizes in portrait/landscape orientation.
- **SC-004**: Rotation action is perceived as "instant" (UI update within 100ms of tap).
