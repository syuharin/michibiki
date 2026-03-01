# Feature Specification: Rulebook Display

**Feature Branch**: `009-rulebook-display`  
**Created**: 2026-03-01  
**Status**: Draft  
**Input**: User description: "ゲーム内でルールブックを参照できるようにしたいです。ボタンを押すとルールが表示されます。"

## Clarifications

### Session 2026-03-01
- Q: 他のモーダルが開いている場合にルールブックをどう扱うべきか？ → A: ルールブックを表示する前に、開いている他のモーダルを閉じる。
- Q: ルールブックの言語は？ → A: 日本語のみ。
- Q: ルールブックのデータ管理方法は？ → A: 外部Markdownファイル（.md）から非同期で読み込む。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Rules During Play (Priority: P1)

A player who is currently in a game room wants to verify a specific rule without leaving the room or refreshing the page.

**Why this priority**: Essential for supporting new players and resolving confusion during active gameplay without interrupting the peer-to-peer session.

**Independent Test**: Can be fully tested by clicking the rulebook button during a match and verifying the rules are displayed correctly without disconnecting the player.

**Acceptance Scenarios**:

1. **Given** a player is in an active game room, **When** they click the "Rulebook" button, **Then** a modal overlay appears containing the game rules.
2. **Given** the rulebook modal is open, **When** the player clicks the "Close" button or clicks outside the modal, **Then** the modal closes and the game state remains exactly as it was.
3. **Given** another modal (e.g., settings) is open, **When** the player clicks the "Rulebook" button, **Then** the settings modal closes and the rulebook modal opens.

---

### User Story 2 - Mobile-Friendly Rule Viewing (Priority: P2)

A player using a smartphone wants to read the rules easily despite the smaller screen size.

**Why this priority**: Ensures the game remains accessible and playable across all supported devices.

**Independent Test**: Open the rulebook on a mobile viewport and verify text is legible and the close button is reachable.

**Acceptance Scenarios**:

1. **Given** a player is on a mobile device, **When** they open the rulebook, **Then** the content scales appropriately and is scrollable if it exceeds the screen height.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a dedicated button (e.g., a "?" icon or "Rulebook" text) accessible from both the lobby and the active game room.
- **FR-002**: System MUST display rulebook content in a non-disruptive overlay (modal) that sits above the game board.
- **FR-003**: The rulebook modal MUST include a prominent "Close" button.
- **FR-004**: Opening or closing the rulebook MUST NOT trigger any page reloads or peer-to-peer reconnections.
- **FR-005**: Rulebook content MUST be loaded from an external Markdown file (e.g., in `/public`) and rendered for clarity, including sections for "Game Flow", "Card Types", and "Winning Conditions".
- **FR-006**: Opening the rulebook MUST close any other currently active UI modals to prevent visual stacking and interaction conflicts.
- **FR-007**: Rulebook content MUST be provided in Japanese for the initial implementation.
- **FR-008**: System MUST display a loading indicator or placeholder if the external Markdown file takes time to load.

### Key Entities

- **Rulebook**: Represents the structured text content defining how the game is played.
- **UI Overlay**: The component responsible for rendering the rulebook without affecting the underlying GameContext state.

## Accessibility and Compliance *(mandatory)*

- **Contrast Compliance**: Text in the rulebook will use high-contrast colors (e.g., black/dark grey on a white/light grey background) to ensure WCAG AA compliance.
- **Color Vision Diversity**: Use headers and bullet points instead of color-coded text to distinguish different rule categories.
- **Responsive Layout**: On desktop, the modal will occupy a centered portion of the screen; on mobile, it will expand to fill most of the viewport with touch-friendly scroll areas.

## Connectivity and Architecture *(mandatory)*

- **P2P Strategy**: The rulebook feature is entirely client-side UI and does not require PeerJS data synchronization.
- **Serverless Compatibility**: The rulebook content will be bundled with the client-side code, maintaining full serverless compatibility on Vercel.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can access the rules in a single interaction (one click/tap).
- **SC-002**: 100% of the rulebook text is legible on devices with a minimum width of 320px.
- **SC-003**: Closing the rulebook returns the user to the game state in less than 200ms without state loss.
