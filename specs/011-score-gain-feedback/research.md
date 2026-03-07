# Research: Score Gain Feedback

## Decision: Visual Feedback Implementation

- **Highlight (Glow)**: Use CSS custom properties and `box-shadow` or `filter: drop-shadow` to create a Gold/Yellow glow effect. Tailwind CSS 4.x `shadow-[color]` or a custom class in `globals.css` will be used.
- **Floating Text (+N)**: Implement using Framer Motion or simple CSS transitions managed by React state. A dedicated `EffectOverlay` component will render these ephemeral UI elements based on the `ScoreEvent`.
- **Synchronization**: The `ScoreEvent` will be broadcasted as a specific P2P message type. Upon receipt, both clients trigger the local animation logic simultaneously.

## Rationale

- **CSS Glow**: `drop-shadow` is more performant than heavy SVG filters and fits the monotone/clean aesthetic well.
- **React-managed Effects**: Managing the lifecycle of these animations in React state allows for easy clean-up and handling of "Rapid Moves" edge cases (queueing or overlapping).
- **P2P Sync**: Explicitly sending the scoring coordinates and value ensures consistency even if latency varies slightly between peers.

## Alternatives Considered

- **SVG Filters**: Rejected for complexity and potential performance issues on lower-end mobile devices.
- **Canvas-based overlays**: Rejected as the current UI is DOM-based (Board, Tiles), and integrating a Canvas overlay adds unnecessary complexity for simple text/glow effects.
- **Server-side timing**: Rejected as it violates the Vercel-native/Serverless P2P constitution.

## Technical Details

### Glow Effect (CSS)
```css
.tile-glow {
  box-shadow: 0 0 15px 5px rgba(255, 215, 0, 0.6); /* Gold */
  transition: box-shadow 0.3s ease-in-out;
}
```

### Floating Animation (Tailwind/CSS)
```css
@keyframes float-up-fade {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-20px); opacity: 0; }
}
.animate-score {
  animation: float-up-fade 2s forwards;
}
```
