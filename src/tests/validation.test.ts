import { describe, it, expect } from "vitest";
import { hasLegalMove, isLegalPlacement } from "../lib/game/validation";
import { Board, Tile, Cell } from "../types/game";

const createEmptyBoard = (size: number): Board => {
  const board: Board = [];
  for (let y = 0; y < size; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < size; x++) {
      row.push({ x, y, layers: [] });
    }
    board.push(row);
  }
  return board;
};

const mockTile = (id: string, isReversal: boolean = false): Tile => ({
  id,
  type: "STRAIGHT",
  ownerId: "player1",
  rotation: 0,
  isReversal,
  turnsLeft: isReversal ? 5 : null,
});

describe("isLegalPlacement", () => {
  it("should allow placing standard tile on empty cell", () => {
    const board = createEmptyBoard(6);
    const tile = mockTile("t1");
    expect(isLegalPlacement(board, tile, 0, 0)).toBe(true);
  });

  it("should not allow placing standard tile on non-empty cell", () => {
    const board = createEmptyBoard(6);
    board[0][0].layers.push(mockTile("t_existing"));
    const tile = mockTile("t1");
    expect(isLegalPlacement(board, tile, 0, 0)).toBe(false);
  });

  it("should allow placing reversal tile on non-empty cell with 1 layer", () => {
    const board = createEmptyBoard(6);
    board[0][0].layers.push(mockTile("t_existing"));
    const tile = mockTile("t1", true);
    expect(isLegalPlacement(board, tile, 0, 0)).toBe(true);
  });

  it("should not allow placing reversal tile on non-empty cell with 2 layers", () => {
    const board = createEmptyBoard(6);
    board[0][0].layers.push(mockTile("t1"));
    board[0][0].layers.push(mockTile("t2"));
    const tile = mockTile("t3", true);
    expect(isLegalPlacement(board, tile, 0, 0)).toBe(false);
  });
});

describe("hasLegalMove", () => {
  it("should return false for empty hand", () => {
    const board = createEmptyBoard(6);
    expect(hasLegalMove(board, [])).toBe(false);
  });

  it("should return true if any placement is possible", () => {
    const board = createEmptyBoard(6);
    const hand = [mockTile("t1")];
    expect(hasLegalMove(board, hand)).toBe(true);
  });

  it("should return false if board is full and hand has only standard tiles", () => {
    const board = createEmptyBoard(6);
    // Fill every cell with 1 layer
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
        board[y][x].layers.push(mockTile(`fill-${x}-${y}`));
      }
    }
    const hand = [mockTile("t1")];
    expect(hasLegalMove(board, hand)).toBe(false);
  });

  it("should return true if board has 1 layer cells and hand has a reversal tile", () => {
    const board = createEmptyBoard(6);
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
        board[y][x].layers.push(mockTile(`fill-${x}-${y}`));
      }
    }
    const hand = [mockTile("t1", true)];
    expect(hasLegalMove(board, hand)).toBe(true);
  });
});
