# Data Model: Mobile Tile Rotation Button

## UI State (Client-side only)

The following state will be added to `UIContext` to manage tile selection on mobile devices.

### UIContext
| Property | Type | Description |
| :--- | :--- | :--- |
| `selectedTileId` | `string \| null` | The ID of the currently selected tile in the hand. |
| `setSelectedTileId` | `(id: string \| null) => void` | Updates the selected tile ID. |

## Persistence
This state is ephemeral and exists only during the game session in memory. It is not synchronized over PeerJS (as rotation itself is synchronized during the move, not the preview phase).
