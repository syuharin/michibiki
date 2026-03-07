import { describe, it, expect } from "vitest";
import { gameReducer } from "../context/GameContext";
import { GameState, Tile } from "../types/game";

const mockTile = (id: string, ownerId: string): Tile => ({
  id,
  type: "STRAIGHT",
  ownerId,
  rotation: 0,
  isReversal: false,
  turnsLeft: null,
});

describe("Auto-Turn Integration", () => {
  it("should switch turn after PLACE_TILE is processed with auto-transition logic", () => {
    const hostId = "host-1";
    const guestId = "guest-1";
    
    const initialState: GameState = {
      roomId: "room-1",
      status: "IN_PROGRESS",
      turnOwnerId: hostId,
      hostPeerId: hostId,
      guestPeerId: guestId,
      board: Array(6).fill(null).map((_, y) => Array(6).fill(null).map((_, x) => ({ x, y, layers: [] }))),
      scores: { [hostId]: 0, [guestId]: 0 },
      decks: { [hostId]: [mockTile("deck-1", hostId)], [guestId]: [] },
      hands: {
        [hostId]: [mockTile("tile-1", hostId)],
        [guestId]: [mockTile("tile-2", guestId)],
      },
      turnOrderConfig: "HOST_FIRST",
      startingPlayerId: hostId,
      rematchReady: {},
      winnerId: null,
      effects: []
    };

    // 1. Place a tile - this should now automatically finalize the turn and refill hand
    const stateAfterPlacement = gameReducer(initialState, {
      type: "PLACE_TILE",
      tileId: "tile-1",
      x: 0,
      y: 0,
      rotation: 0,
    });

    expect(stateAfterPlacement.turnOwnerId).toBe(guestId);
    expect(stateAfterPlacement.hands[hostId].length).toBe(1); // Should have refilled from deck
    expect(stateAfterPlacement.hands[hostId][0].id).toBe("deck-1");
  });
});
