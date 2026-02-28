# Feature Specification: Choose Turn Order

**Feature Branch**: `005-choose-turn-order`  
**Created**: 2026-02-28  
**Status**: Draft  
**Input**: User description: "現在ホストが必ず先行です。ゲーム開始前に先行、後攻を決められるようにしたいです。"

## Clarifications

### Session 2026-02-28
- Q: 「ランダム」設定の確定タイミングはいつにすべきか？ → A: A (「ゲーム開始」ボタンを押した瞬間)
- Q: ホストが選択中のゲスト側の表示はどうすべきか？ → A: A (「ホストが選択中...」などの状態を表示)
- Q: UIへの表示内容はどのようにすべきか？ → A: B (「先行」「後攻」といった用語を使用)
- Q: 「ランダム」結果の通知方法はどのようにすべきか？ → A: A (「先行：〇〇」といった結果を強調表示)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Host decides turn order (Priority: P1)

As a host, I want to be able to select whether I go first or second before the game starts, so that we can play according to our preference.

**Why this priority**: This is the core requirement of the feature, allowing the turn order to be changed from the current fixed state.

**Independent Test**: Can be tested by the host selecting "Second" in the room setup, starting the game, and verifying that the Guest is the first player.

**Acceptance Scenarios**:

1. **Given** a game room with a Host and a Guest, **When** the Host selects "Host is First-mover", **Then** the game starts with the Host as the first player.
2. **Given** a game room with a Host and a Guest, **When** the Host selects "Guest is First-mover", **Then** the game starts with the Guest as the first player.

---

### User Story 2 - Random turn order selection (Priority: P2)

As a host, I want to select a "Random" option for the turn order, so that the starting player is determined fairly by the system.

**Why this priority**: Randomness is a standard and expected feature in competitive games to ensure fairness.

**Independent Test**: Can be tested by selecting "Random" multiple times across different game sessions and verifying that both Host and Guest eventually get to go first.

**Acceptance Scenarios**:

1. **Given** the room setup phase, **When** the Host selects "Random" turn order and starts the game, **Then** the system randomly assigns one player as the First-mover and displays a message (e.g., "First-mover: [Player Name]") for 3 seconds to inform both players before automatically hiding.

---

### User Story 3 - Guest visibility of turn order (Priority: P3)

As a guest, I want to see whether the host has already chosen the turn order or is still deciding, so that I can stay informed about the game progress.

**Why this priority**: Important for transparency and user experience, ensuring the Guest knows what to expect and that they are waiting for the Host.

**Independent Test**: Can be tested by connecting a Guest to a room and verifying that the Guest sees "Host is choosing..." when the Host has not yet made a selection, and the updated turn order once a selection is made.

**Acceptance Scenarios**:

1. **Given** a Guest is connected to a Host's room, **When** the Host has not yet selected a turn order, **Then** the Guest's screen displays "Host is choosing...".
2. **Given** a Guest is connected to a Host's room, **When** the Host selects a turn order setting, **Then** the Guest's screen displays the updated turn order.

---

### Edge Cases

- **What happens when the Guest disconnects after turn order is set?**: The turn order setting should persist if the Guest reconnects, or reset to default if a new Guest joins.
- **How does the system handle simultaneous actions?**: Since only the Host can change settings, race conditions are avoided by only enabling these controls on the Host's interface.

### Accessibility and Compliance *(mandatory)*

- **Contrast Compliance**: Turn order selection buttons and labels must maintain WCAG AA (4.5:1) contrast against the background.
- **Color Vision Diversity**: Use distinct icons (e.g., "1st" and "2nd" badges) or text labels rather than just color (e.g., Red/Blue) to indicate turn order.
- **Responsive Layout**: The turn order selection UI must be easily tappable on mobile devices and clearly visible on desktop room lobbies.

### Connectivity and Architecture *(mandatory)*

- **P2P Strategy**: The Host will broadcast the selected turn order state to the Guest via PeerJS data channels whenever it changes.
- **Serverless Compatibility**: No external server is required; all state transitions happen within the P2P connection or local state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a UI in the game lobby for selecting the turn order.
- **FR-002**: System MUST allow the Host to choose between "Host First", "Guest First", and "Random".
- **FR-003**: System MUST synchronize the turn order state between Host and Guest in real-time.
- **FR-004**: System MUST use the selected turn order to initialize the game state when the "Start Game" action is triggered. If "Random" is selected, the system MUST perform the drawing at this moment and broadcast the result.
- **FR-005**: The turn order MUST start in an "Unselected" state when a room is created, and the system MUST prevent the "Start Game" action until a selection is made by the Host.

### Key Entities *(include if feature involves data)*

- **TurnOrderConfig**: Represents the chosen starting player (Host, Guest, or Random).
- **GameState**: The initialized game state, which now depends on the TurnOrderConfig.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of games started after a turn order selection must correctly assign the first turn to the designated player.
- **SC-002**: Turn order selection changes by the host must be reflected on the guest's screen in under 500ms.
- **SC-003**: 100% of players can identify who will go first before the game starts via the UI.
