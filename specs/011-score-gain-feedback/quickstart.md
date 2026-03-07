# Quickstart: Score Gain Feedback

## Feature Overview
- Immediate feedback of total points earned from a move.
- Floating "+N" indicator at the top-right of the newly placed tile.
- Gold/Yellow glow effect for all tiles contributing to the score.

## Implementation Guide

### 1. Define Message Type
Add `SCORE_GAIN_EFFECT` to the P2P protocol (`src/lib/p2p/protocol.ts`).

### 2. Update Context/Hooks
Update `useGameLogic.ts` or `GameContext.tsx` to handle the `ScoreEffectEvent`.

### 3. Build UI Components
- **FloatingScore**: A component that renders absolute-positioned text with a 2-second float-up-and-fade animation.
- **BoardTile Extension**: Add a `glow` state and Tailwind transition for highlighting.

### 4. Synchronization
Ensure `SCORE_GAIN_EFFECT` is broadcasted whenever a move results in a score increase (points > 0).

## Verification
1. Run `npm test` for logic verification.
2. Manually verify the animation by placing a scoring tile in a P2P session.
3. Check WCAG contrast (text vs tile).
