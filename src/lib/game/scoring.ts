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

export function calculateConnectedGroup(board: Board, startX: number, startY: number): Set<string> {
  const topTile = getTopTile(board, startX, startY);
  if (!topTile) return new Set();

  const ownerId = topTile.ownerId;
  const connected = new Set<string>();
  const queue: [number, number][] = [[startX, startY]];
  connected.add(`${startX},${startY}`);

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const currentTile = getTopTile(board, x, y);
    if (!currentTile) continue;

    const currentExits = getRotatedConnections(currentTile.type, currentTile.rotation);

    for (const exit of currentExits) {
      const { dx, dy } = DELTA[exit];
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
        if (connected.has(`${nx},${ny}`)) continue;

        const neighborTile = getTopTile(board, nx, ny);
        if (neighborTile && neighborTile.ownerId === ownerId) {
          const neighborExits = getRotatedConnections(neighborTile.type, neighborTile.rotation);
          if (neighborExits.includes(OPPOSITE[exit])) {
            connected.add(`${nx},${ny}`);
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  return connected;
}

function getTopTile(board: Board, x: number, y: number): Tile | null {
  const cell = board[y][x];
  return cell.layers.length > 0 ? cell.layers[cell.layers.length - 1] : null;
}
