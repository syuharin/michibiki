# Research: Board Coordinate Markers

## Decision 1: UI Layout for External Markers
- **Decision**: Wrap the board grid in a larger 7x7 grid container where the first row and first column are used for labels.
- **Rationale**: Using a single grid container ensures that the labels and cells are perfectly aligned, regardless of the board's responsive scaling.
- **Alternatives considered**: Using separate absolute positioned containers for labels. Rejected because it's harder to maintain alignment during resizing.

## Decision 2: Coordinate Mapping
- **Decision**: Columns A-F correspond to internal x-coordinates 0-5. Rows 1-6 correspond to internal y-coordinates 0-5.
- **Rationale**: Matches the user's requirement for standard board notation (A1 at top-left).

## Decision 3: Removal of Internal Markers
- **Decision**: Remove the `<span>` element within `CellComponent` that renders `{cell.x},{cell.y}`.
- **Rationale**: Directly fulfills the user request to move markers outside.

## Decision 4: Styling and Accessibility
- **Decision**: Use `michibiki-black` for marker text and `font-black` for high visibility. Ensure the container has enough padding to prevent markers from being cut off.
- **Rationale**: Adheres to Michibiki Constitution Principle I (Monotone & WCAG AA).
