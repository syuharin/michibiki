# Data Model: Michibiki Core Game Logic

## GameState (Singleton)
- `roomId`: string (UUID or short code)
- `status`: `WAITING_FOR_GUEST` | `IN_PROGRESS` | `FINISHED`
- `turnOwnerId`: string (PeerID)
- `hostPeerId`: string
- `guestPeerId`: string | null
- `board`: `Cell[][]` (6x6 array)
- `scores`: Record<string, number> (PeerID -> Score)
- `deck`: `Tile[]` (Array of remaining tiles)
- `hands`: Record<string, Tile[]> (PeerID -> Tiles)

## Cell
- `x`: number (0-5)
- `y`: number (0-5)
- `layers`: `Tile[]` (Array from bottom to top; max length 2)
- `isActive`: boolean (Derived: true if layers.length > 0)

## Tile
- `id`: string (Unique ID for D&D tracking)
- `type`: `I` | `L` | `T` | `X` | etc. (Connector shape)
- `ownerId`: string (PeerID)
- `rotation`: `0` | `90` | `180` | `270`
- `isReversal`: boolean
- `turnsLeft`: number | null (5 if reversal, null otherwise)
- `connections`: `('U'|'D'|'L'|'R')[]` (Calculated based on type and rotation)

## P2P Messages (Contracts)
- `JOIN_ROOM`: Guest -> Host (Contains guestPeerId)
- `BOARD_SYNC`: Host -> Guest (Authoritative state update)
- `PLAYER_INTENT`: Guest -> Host (Actions: Place tile, rotate, confirm)
- `GAME_OVER`: Host -> Guest (Final score)

## State Transitions
- `WAITING_FOR_GUEST` -> `IN_PROGRESS` (when guestPeerId is set)
- `IN_PROGRESS` -> `FINISHED` (when all tiles are placed/deck empty)
