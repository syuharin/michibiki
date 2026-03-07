import { Board, ConnectionPoint, Tile } from "@/types/game";
import { getRotatedConnections, BOARD_SIZE } from "@/lib/constants/tiles";

const OPPOSITE: Record<ConnectionPoint, ConnectionPoint> = {
  U: "D",
  D: "U",
  L: "R",
  R: "L",
};

const DELTA: Record<ConnectionPoint, { dx: number; dy: number }> = {
  U: { dx: 0, dy: -1 },
  D: { dx: 0, dy: 1 },
  L: { dx: -1, dy: 0 },
  R: { dx: 1, dy: 0 },
};

/**
 * Calculates all tiles involved in scoring connections for a newly placed tile.
 * Returns an array of coordinates where duplicates represent a tile contributing to multiple routes.
 */
export function calculateConnectedTiles(board: Board, startX: number, startY: number): string[] {
  const topTile = getTopTile(board, startX, startY);
  if (!topTile) return [];

  const ownerId = topTile.ownerId;
  const currentExits = getRotatedConnections(topTile.type, topTile.rotation);
  
  const allInvolvedSet = new Set<string>();
  allInvolvedSet.add(`${startX},${startY}`);
  let connectedAny = false;

  for (const exit of currentExits) {
    const { dx, dy } = DELTA[exit];
    const nx = startX + dx;
    const ny = startY + dy;

    if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
      const neighborTile = getTopTile(board, nx, ny);
      if (neighborTile && neighborTile.ownerId === ownerId) {
        const neighborExits = getRotatedConnections(neighborTile.type, neighborTile.rotation);
        if (neighborExits.includes(OPPOSITE[exit])) {
          connectedAny = true;
          const branchTiles = findTilesInBranch(board, nx, ny, ownerId, new Set([`${startX},${startY}`]));
          branchTiles.forEach(t => allInvolvedSet.add(t));
        }
      }
    }
  }

  if (!connectedAny) {
    return [`${startX},${startY}`];
  }

  return Array.from(allInvolvedSet);
}

/**
 * Helper to find all tiles in a specific branch using BFS, avoiding the origin.
 */
function findTilesInBranch(board: Board, x: number, y: number, ownerId: string, visited: Set<string>): string[] {
  const branch: string[] = [];
  const queue: [number, number][] = [[x, y]];
  visited.add(`${x},${y}`);
  branch.push(`${x},${y}`);

  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    const tile = getTopTile(board, cx, cy);
    if (!tile) continue;

    const exits = getRotatedConnections(tile.type, tile.rotation);
    for (const exit of exits) {
      const { dx, dy } = DELTA[exit];
      const nx = cx + dx;
      const ny = cy + dy;

      if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
        const coord = `${nx},${ny}`;
        if (visited.has(coord)) continue;

        const neighbor = getTopTile(board, nx, ny);
        if (neighbor && neighbor.ownerId === ownerId) {
          const neighborExits = getRotatedConnections(neighbor.type, neighbor.rotation);
          if (neighborExits.includes(OPPOSITE[exit])) {
            visited.add(coord);
            branch.push(coord);
            queue.push([nx, ny]);
          }
        }
      }
    }
  }
  return branch;
}

// Keep the old one for compatibility or internal use if needed, 
// but update it to use the new logic if it was intended to match spec.
export function calculateConnectedGroup(board: Board, x: number, y: number): Set<string> {
  return new Set(calculateConnectedTiles(board, x, y));
}

function getTopTile(board: Board, x: number, y: number): Tile | null {
  const cell = board[y][x];
  return cell.layers.length > 0 ? cell.layers[cell.layers.length - 1] : null;
}

export function calculateWinner(scores: Record<string, number>, hostPeerId: string, guestPeerId: string | null): string {
  const hostScore = scores[hostPeerId] || 0;
  const guestScore = guestPeerId ? (scores[guestPeerId] || 0) : 0;

  if (hostScore > guestScore) return hostPeerId;
  if (guestScore > hostScore) return guestPeerId || "GUEST";
  return "DRAW";
}
