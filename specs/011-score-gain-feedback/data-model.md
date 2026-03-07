# Data Model: Score Gain Feedback

## Entities

### ScoreEffectEvent
Represents a visual scoring event to be synchronized and displayed on both clients.

- **id**: `string` (unique animation ID)
- **timestamp**: `number` (to handle ordering if needed)
- **totalPoints**: `number` (total score earned from the move)
- **originCoords**: `{ x: number, y: number }` (location of the placed tile)
- **contributingTiles**: `TileCoordinate[]` (list of all tiles in scoring connection)
- **duration**: `number` (ms, default: 2000)

### TileCoordinate
A simple object representing board positions.
- **x**: `number`
- **y**: `number`

## UI States

### ActiveAnimations (Store)
- **currentEffects**: `ScoreEffectEvent[]` (active or queued animations)

### BoardTile (Enhanced)
- **isHighlighted**: `boolean` (current glow state)
- **highlightColor**: `string` (Gold/Yellow for scoring)
