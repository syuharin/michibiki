# Feature Specification: Score Gain Feedback

**Feature Branch**: `011-score-gain-feedback`  
**Created**: 2026-03-07  
**Status**: Draft  
**Input**: User description: "獲得した得点がわかるようにしたいです。繋がったタイルを一定時間強調することはできますか？また得られた得点を「+[数字]」のように置いたタイルの横に一定時間表示したいです。"

## Clarifications

### Session 2026-03-07
- Q: 1回のタイル配置で複数の得点ルート（例：縦と横の両方で得点）が発生した場合、どのように表示しますか？ → A: **各タイル表示:** 繋がったタイル1枚ごとに「+1」を表示する（例：5枚繋がった場合は、5枚それぞれの右上に「+1」が表示される）。
- Q: 繋がったタイルの「強調」は、具体的にどのような視覚効果を想定していますか？ → A: **発光 (Glow):** タイルの周囲を柔らかく光らせる。
- Q: 強調表示（発光）の色は何色にしますか？ → A: **共通色 (Gold/Yellow):** 得点を象徴する金色または黄色で光らせる。
- Q: スコア表示（「+X」）のアニメーションはどのように動かしますか？ → A: **上昇フェード:** 上方向に浮き上がりながらフェードアウトする。
- Q: スコア表示（「+X」）はタイルのどの位置を起点に表示しますか？ → A: **右上 (Top Right):** タイルの右上の角付近に表示する。
- Q: 1つのタイルが複数の得点ルート（例：縦と横の両方）に含まれる場合、どのように表示しますか？ → A: **合算表示 (+2など):** そのタイルが貢献した合計値（2ルートなら「+2」）を1つのインジケーターとして表示する。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Immediate Score Visibility (Priority: P1)

As a player, I want to see exactly how many points I earned immediately after placing a tile, so that I can feel rewarded and understand the impact of my move.

**Why this priority**: This is the core request. Without immediate feedback, the player might be confused about how their score increased.

**Independent Test**: Can be tested by placing a scoring tile and verifying that "+[N]" indicators appear at the **top right** of **each** tile in the connection, where N is the number of paths that tile belongs to.

**Acceptance Scenarios**:

1. **Given** it is my turn, **When** I place a tile that completes a 3-tile connection, **Then** I see "+1" appear at the **top right** of each of the 3 tiles and float upwards while fading out for 2 seconds.
2. **Given** my opponent just moved, **When** they place a tile that earns points, **Then** I see the "+1" indicators on their tiles as well, to understand their gain.
3. **Given** a move creates multiple scoring connections (e.g., vertical and horizontal), **When** points are calculated, **Then** each tile involved shows its total contribution (e.g., "+2" if part of two paths) at its top right.

---

### User Story 2 - Connection Highlighting (Priority: P2)

As a player, I want the tiles that contributed to my score to be highlighted, so that I can clearly see the "path" or "group" that resulted in the points.

**Why this priority**: Provides clarity on the game logic and makes the scoring event more visually satisfying.

**Independent Test**: Can be tested by placing a scoring tile and verifying that all connected tiles involved in that score temporarily change their visual state (e.g., glow).

**Acceptance Scenarios**:

1. **Given** a scoring move is made, **When** the score is calculated, **Then** all tiles in the scoring connection are highlighted with a **Gold/Yellow glow effect** for 2 seconds.
2. **Given** a move creates multiple scoring connections, **When** the animation triggers, **Then** all tiles in all active connections are highlighted simultaneously with a Gold/Yellow glow.

---

### Edge Cases

- **Rapid Moves**: If a move happens while a previous animation is active, the new animation should either queue or overlap without breaking the UI.
- **Zero Score**: If a tile is placed but earns 0 points, no "+0" should be displayed to avoid clutter, unless specifically required for feedback.
- **Board Edge**: If a tile is placed at the edge of the board, the "+[number]" text should remain within the viewport/container.

### Accessibility and Compliance *(mandatory)*

- **Contrast Compliance**: Floating score text must use a high-contrast color (e.g., white with a black outline or dark background) to remain legible over various tile colors.
- **Color Vision Diversity**: Use distinct animations or symbols (like the "+" sign) rather than relying solely on color changes to indicate a score gain. The **Gold/Yellow glow** should be bright enough to be distinguished even by players with color vision deficiencies.
- **Responsive Layout**: On mobile, the "+[number]" text should be sized appropriately to be readable without obscuring too much of the board.

### Connectivity and Architecture *(mandatory)*

- **P2P Strategy**: The score event (points earned and connection coordinates) must be synchronized via PeerJS so both players see the same animation simultaneously.
- **Serverless Compatibility**: Animations are client-side only; state synchronization follows existing P2P patterns.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a `FloatingScore` component ("+[N]") starting from the **top right** of **every** tile involved in a scoring connection when points are earned.
- **FR-002**: The `FloatingScore` MUST **animate upwards while fading out** over a duration defined by `SCORE_EFFECT_DURATION` (default: 2 seconds).
- **FR-003**: System MUST highlight all tiles belonging to all active scoring connection(s) with a **Gold/Yellow glow effect** simultaneously immediately after placement.
- **FR-004**: Highlights MUST persist for the same duration as the `FloatingScore`.
- **FR-005**: Score feedback and highlights MUST be synchronized across P2P peers.
- **FR-006**: The `FloatingScore` MUST NOT obscure critical board information and should ideally animate upwards or outwards.

### Key Entities *(include if feature involves data)*

- **ScoreEffectEvent**: Represents a single scoring occurrence, containing the point value, the origin coordinates (placed tile), and a list of connected tile coordinates.
- **AnimationState**: Manages the lifecycle of the visual feedback (active, duration, target elements).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Score feedback appears within 100ms of the tile placement action being processed.
- **SC-002**: 100% of scoring connections are visually identified via highlights (Gold/Yellow glow) and per-tile `FloatingScore` indicators during the feedback phase.
- **SC-003**: Feedback animations are visible and synchronized on both players' screens in 95% of P2P sessions.
- **SC-004**: Users report improved understanding of scoring rules due to visual feedback in playtesting.
