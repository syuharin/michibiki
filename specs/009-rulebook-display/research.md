# Research: Rulebook Display

## Decision: Markdown Rendering

- **Chosen Approach**: Use `react-markdown` library for rendering the rules.
- **Rationale**: The specification requires Markdown-formatted content. `react-markdown` is a safe, widely-used React component for this purpose that doesn't use `dangerouslySetInnerHTML`.
- **Alternatives Considered**: 
  - **Hardcoded HTML**: Rejected because it's harder to maintain and update.
  - **Manual Parser**: Rejected as it's error-prone and adds unnecessary complexity.
  - **dangerouslySetInnerHTML with marked**: Rejected for security reasons.

## Decision: Content Storage

- **Chosen Approach**: Store content in `/public/rules.md`.
- **Rationale**: Storing the rules as an external file in the public directory allows for easy updates without re-building the entire application (in some environments) and keeps the source code clean. It also aligns with the requirement to load the content asynchronously.
- **Alternatives Considered**:
  - **Embedded in code**: Rejected because it increases bundle size and makes editing harder.
  - **Remote CMS**: Rejected as it's "over-engineered" for this project's serverless/P2P nature.

## Decision: Modal Implementation

- **Chosen Approach**: Create a reusable `RulebookModal` component using the same styling patterns as `ResultModal.tsx`.
- **Rationale**: Consistency with existing UI patterns ensures a cohesive user experience and follows the "Monotone & WCAG AA" principle.
- **Alternatives Considered**:
  - **A new page**: Rejected because it would disrupt the P2P connection or game flow.
  - **Popover/Tooltip**: Rejected as it wouldn't be sufficient for large rulebook content.

## Decision: Component Placement

- **Chosen Approach**: Include the `RulebookButton` and `RulebookModal` in the `RootLayout` or a shared parent component to ensure it's available in both the Lobby and the Game Room.
- **Rationale**: The requirement is to access the rulebook from both the lobby and the active game room.
