import { describe, it, expect } from "vitest";
import { gameReducer } from "@/context/GameContext";
import { GameState, Tile, Board } from "@/types/game";

const createEmptyBoard = (): Board => {
  const board: Board = [];
  for (let y = 0; y < 6; y++) {
    const row = [];
    for (let x = 0; x < 6; x++) {
      row.push({ x, y, layers: [] });
    }
    board.push(row);
  }
  return board;
};

const createMockState = (overrides: Partial<GameState> = {}): GameState => ({
  roomId: "test-room",
  status: "IN_PROGRESS",
  turnOwnerId: "host-id",
  hostPeerId: "host-id",
  guestPeerId: "guest-id",
  board: createEmptyBoard(),
  scores: { "host-id": 0, "guest-id": 0 },
  decks: { "host-id": [], "guest-id": [] },
  hands: { "host-id": [], "guest-id": [] },
  startingPlayerId: null,
  rematchReady: {},
  winnerId: null,
  effects: [],
  ...overrides,
});

describe("Reversal Tile Logic", () => {
  it("should decrement turnsLeft for reversal tiles in hand at the end of turn", () => {
    const reversalTile: Tile = {
      id: "reversal-1",
      type: "STRAIGHT",
      ownerId: "host-id",
      rotation: 0,
      isReversal: true,
      turnsLeft: 5,
    };

    const state = createMockState({
      hands: { "host-id": [reversalTile], "guest-id": [] },
    });

    const newState = gameReducer(state, { type: "CONFIRM_TURN" });

    expect(newState.hands["host-id"][0].turnsLeft).toBe(4);
  });

  it("should remove reversal tiles from hand when turnsLeft reaches 0", () => {
    const reversalTile: Tile = {
      id: "reversal-1",
      type: "STRAIGHT",
      ownerId: "host-id",
      rotation: 0,
      isReversal: true,
      turnsLeft: 1,
    };

    const state = createMockState({
      hands: { "host-id": [reversalTile], "guest-id": [] },
    });

    const newState = gameReducer(state, { type: "CONFIRM_TURN" });

    // Should be empty (unless deck has more, but deck is empty here)
    expect(newState.hands["host-id"]).toHaveLength(0);
  });

  it("should stop countdown once reversal tile is placed on the board", () => {
    const reversalTile: Tile = {
      id: "reversal-1",
      type: "STRAIGHT",
      ownerId: "host-id",
      rotation: 0,
      isReversal: true,
      turnsLeft: 5,
    };

    const state = createMockState({
      hands: { "host-id": [reversalTile], "guest-id": [] },
    });

    // 1. Place the tile
    const stateAfterPlacement = gameReducer(state, {
      type: "PLACE_TILE",
      tileId: "reversal-1",
      x: 0,
      y: 0,
      rotation: 0,
    });

    const placedTile = stateAfterPlacement.board[0][0].layers[0];
    expect(placedTile.isReversal).toBe(true);
    expect(placedTile.turnsLeft).toBeNull(); // Should be null now

    // 2. Confirm turn and verify it doesn't change or disappear
    const stateAfterConfirm = gameReducer(stateAfterPlacement, { type: "CONFIRM_TURN" });
    
    const tileOnBoard = stateAfterConfirm.board[0][0].layers[0];
    expect(tileOnBoard).toBeDefined();
    expect(tileOnBoard.turnsLeft).toBeNull();
  });

  it("should not decrement turnsLeft for tiles in opponent's hand", () => {
    const hostReversal: Tile = {
      id: "host-rev",
      type: "STRAIGHT",
      ownerId: "host-id",
      rotation: 0,
      isReversal: true,
      turnsLeft: 5,
    };
    const guestReversal: Tile = {
      id: "guest-rev",
      type: "STRAIGHT",
      ownerId: "guest-id",
      rotation: 0,
      isReversal: true,
      turnsLeft: 5,
    };

    const state = createMockState({
      turnOwnerId: "host-id",
      hands: { 
        "host-id": [hostReversal], 
        "guest-id": [guestReversal] 
      },
    });

    const newState = gameReducer(state, { type: "CONFIRM_TURN" });

    expect(newState.hands["host-id"][0].turnsLeft).toBe(4);
    expect(newState.hands["guest-id"][0].turnsLeft).toBe(5); // Guest's tile should remain at 5
  });
});

describe("Score Gain Feedback", () => {
  it("should trigger a ScoreEffectEvent when a scoring move is made", () => {
    const tile1: Tile = { id: "t1", type: "STRAIGHT", ownerId: "host-id", rotation: 0, isReversal: false, turnsLeft: null };
    const tile2: Tile = { id: "t2", type: "STRAIGHT", ownerId: "host-id", rotation: 0, isReversal: false, turnsLeft: null };
    
    const state = createMockState({
      board: createEmptyBoard(),
      hands: { "host-id": [tile1, tile2], "guest-id": [] },
      effects: []
    });

    // 1. Place first tile at (0,0)
    const state1 = gameReducer(state, { type: "PLACE_TILE", tileId: "t1", x: 0, y: 0, rotation: 0 });
    expect(state1.effects).toHaveLength(1);
    expect(state1.effects[0].totalPoints).toBe(1);

    // 2. Place second tile at (1,0) - connects to (0,0)
    // Need to ensure it's still host's turn or override turn logic for simple test
    const stateWithTurn = { ...state1, turnOwnerId: "host-id", status: "IN_PROGRESS" as const };
    const state2 = gameReducer(stateWithTurn, { type: "PLACE_TILE", tileId: "t2", x: 1, y: 0, rotation: 0 });
    
    expect(state2.effects).toHaveLength(2);
    const lastEffect = state2.effects[1];
    expect(lastEffect.totalPoints).toBe(2); // (0,0) and (1,0) connected
    expect(lastEffect.path).toContainEqual({ x: 0, y: 0 });
    expect(lastEffect.path).toContainEqual({ x: 1, y: 0 });
  });
});
