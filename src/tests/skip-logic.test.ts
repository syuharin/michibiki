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

describe("Automatic Skip & Finish Logic", () => {
  it("should skip a player with no tiles and eventually finish the game", () => {
    const hostId = "host-1";
    const guestId = "guest-1";
    
    // Setup: Host has 1 tile, Guest has 0 tiles and empty deck
    const initialState: GameState = {
      roomId: "room-1",
      status: "IN_PROGRESS",
      turnOwnerId: hostId,
      hostPeerId: hostId,
      guestPeerId: guestId,
      board: Array(6).fill(null).map((_, y) => Array(6).fill(null).map((_, x) => ({ x, y, layers: [] }))),
      scores: { [hostId]: 0, [guestId]: 0 },
      deck: [],
      hands: {
        [hostId]: [mockTile("last-tile", hostId)],
        [guestId]: [],
      },
    };

    // 1. Host places last tile
    const stateAfterPlacement = gameReducer(initialState, {
      type: "PLACE_TILE",
      tileId: "last-tile",
      x: 0,
      y: 0,
      rotation: 0,
    });

    // 2. Trigger turn transition (Host -> Guest)
    const stateAfterHostTurn = gameReducer(stateAfterPlacement, { type: "PASS_TURN" });

    // Expectation: Normally turnOwnerId would be guestId.
    // But since guest has no tiles, US2 logic (T020) should have skipped back or finished.
    // If T020 is implemented, it should detect guest is empty.
    
    // We will verify this AFTER implementing T020. 
    // For now, let's write the test to fail.
    
    expect(stateAfterHostTurn.hands[hostId].length).toBe(0);
    expect(stateAfterHostTurn.hands[guestId].length).toBe(0);
    
    // After T020 implementation, this should be "FINISHED"
    expect(stateAfterHostTurn.status).toBe("FINISHED");
  });
});
