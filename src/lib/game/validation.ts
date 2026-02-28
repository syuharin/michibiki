import { Board, Tile } from "@/types/game";
import { MAX_LAYERS } from "@/lib/constants/tiles";

/**
 * Checks if a tile can be legally placed on a specific cell.
 * Note: Reversal tiles can be placed on cells with 1 existing tile.
 * Standard tiles can only be placed on empty cells.
 * Maximum layers is 2.
 */
export function isLegalPlacement(board: Board, tile: Tile, x: number, y: number): boolean {
  const cell = board[y][x];
  const currentLayers = cell.layers.length;

  if (currentLayers >= MAX_LAYERS) return false;

  if (tile.isReversal) {
    // Reversal can be placed on empty (0) or on top of 1 existing tile
    return currentLayers === 0 || currentLayers === 1;
  } else {
    // Standard tiles must be placed on empty cells
    return currentLayers === 0;
  }
}

/**
 * Scans the entire board to see if ANY tile in the hand can be placed in ANY rotation.
 */
export function hasLegalMove(board: Board, hand: Tile[]): boolean {
  if (hand.length === 0) return false;

  const BOARD_SIZE = board.length;

  for (const tile of hand) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (isLegalPlacement(board, tile, x, y)) {
          return true;
        }
      }
    }
  }

  return false;
}
