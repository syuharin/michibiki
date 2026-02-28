# Data Model: Board Coordinate Markers

## Coordinate Mapping

The coordinate system translates internal 0-indexed integer coordinates used in `GameState` into user-facing alphanumeric labels.

### Column Mapping (X-axis)
| Internal X | Label |
|------------|-------|
| 0          | A     |
| 1          | B     |
| 2          | C     |
| 3          | D     |
| 4          | E     |
| 5          | F     |

### Row Mapping (Y-axis)
| Internal Y | Label |
|------------|-------|
| 0          | 1     |
| 1          | 2     |
| 2          | 3     |
| 3          | 4     |
| 4          | 5     |
| 5          | 6     |

## UI Layout Model

The board area will be structured as a 7x7 grid:
- **Cell (0,0)**: Empty (Corner space)
- **Cells (1-6, 0)**: Column labels A-F
- **Cells (0, 1-6)**: Row labels 1-6
- **Cells (1-6, 1-6)**: Game board cells
