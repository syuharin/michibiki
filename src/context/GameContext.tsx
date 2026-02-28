import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { GameState, GameAction, Board, Tile, TileType } from "@/types/game";
import { BOARD_SIZE } from "@/lib/constants/tiles";
import { calculateConnectedGroup } from "@/lib/game/scoring";


const createEmptyBoard = (): Board => {
  const board: Board = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    const row = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      row.push({ x, y, layers: [] });
    }
    board.push(row);
  }
  return board;
};

const initialState: GameState = {
  roomId: "",
  status: "WAITING_FOR_GUEST",
  turnOwnerId: "",
  hostPeerId: "",
  guestPeerId: null,
  board: createEmptyBoard(),
  scores: {},
  deck: [],
  hands: {},
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const allTiles: Tile[] = [];
      const players = [state.hostPeerId, action.guestPeerId];
      
      players.forEach(pid => {
        // Simple initial deck for each player based on rulebook (simplified for now)
        const types: TileType[] = ["STRAIGHT", "VERTICAL", "CORNER", "T", "X"];
        for (let i = 0; i < 13; i++) {
          allTiles.push({
            id: `${pid}-${i}`,
            type: types[i % types.length],
            ownerId: pid,
            rotation: 0,
            isReversal: i === 0 || i === 1, // First two are reversal
            turnsLeft: i === 0 || i === 1 ? 5 : null,
          });
        }
      });

      // Shuffle logic (simplified)
      const shuffled = allTiles.sort(() => Math.random() - 0.5);
      
      const newHands: Record<string, Tile[]> = {};
      const newDeck: Tile[] = [];
      
      players.forEach(pid => {
        const playerTiles = shuffled.filter(t => t.ownerId === pid);
        newHands[pid] = playerTiles.slice(0, 3);
        newDeck.push(...playerTiles.slice(3));
      });

      return {
        ...state,
        status: "IN_PROGRESS",
        guestPeerId: action.guestPeerId,
        turnOwnerId: state.hostPeerId,
        hands: newHands,
        deck: newDeck,
        scores: { [state.hostPeerId]: 0, [action.guestPeerId]: 0 },
      };
    }
    case "SYNC_STATE":
      return { ...action.state };
    case "PLACE_TILE": {
      const { tileId, x, y, rotation } = action;
      const playerHand = state.hands[state.turnOwnerId] || [];
      
      const newBoard = [...state.board.map(row => [...row])];
      const cell = newBoard[y][x];
      const existingTileInCell = cell.layers.find(t => t.id === tileId);
      
      let tile: Tile | undefined;
      let isInitialPlacement = false;

      if (existingTileInCell) {
        tile = existingTileInCell;
      } else {
        tile = playerHand.find((t) => t.id === tileId);
        isInitialPlacement = true;
      }

      if (!tile) return state;
      
      // Basic rule: can't place more than 2 layers, and only reversal tiles can overlap
      if (isInitialPlacement) {
        if (cell.layers.length >= 2) return state;
        if (cell.layers.length === 1 && !tile.isReversal) return state;
      }

      const updatedTile = { ...tile, rotation: rotation as 0 | 90 | 180 | 270 };
      
      if (existingTileInCell) {
        const newLayers = [...cell.layers];
        newLayers[newLayers.length - 1] = updatedTile;
        newBoard[y][x] = { ...cell, layers: newLayers };
      } else {
        newBoard[y][x] = { ...cell, layers: [...cell.layers, updatedTile] };
      }

      // Calculate score ONLY on initial placement
      const newScores = { ...state.scores };
      if (isInitialPlacement) {
        const connectedGroup = calculateConnectedGroup(newBoard, x, y);
        newScores[state.turnOwnerId] = (newScores[state.turnOwnerId] || 0) + connectedGroup.size;
      }

      // Remove from hand ONLY on initial placement
      const newHands = { ...state.hands };
      if (isInitialPlacement) {
        newHands[state.turnOwnerId] = playerHand.filter((t) => t.id !== tileId);
      }

      return {
        ...state,
        board: newBoard,
        hands: newHands,
        scores: newScores,
      };
    }
    case "CONFIRM_TURN": {
      // 1. Decrement timers for reversal tiles owned by the player whose turn just ended
      const currentPlayerId = state.turnOwnerId;
      const newBoard = [...state.board.map(row => [...row])];
      let tileRemoved = false;

      for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
          const cell = newBoard[y][x];
          if (cell.layers.length > 0) {
            const topTile = cell.layers[cell.layers.length - 1];
            if (topTile.ownerId === currentPlayerId && topTile.isReversal && topTile.turnsLeft !== null) {
              const nextTurns = topTile.turnsLeft - 1;
              if (nextTurns <= 0) {
                // Remove the reversal tile
                newBoard[y][x] = { ...cell, layers: cell.layers.slice(0, -1) };
                tileRemoved = true;
              } else {
                // Update timer
                const updatedTile = { ...topTile, turnsLeft: nextTurns };
                const newLayers = [...cell.layers];
                newLayers[newLayers.length - 1] = updatedTile;
                newBoard[y][x] = { ...cell, layers: newLayers };
              }
            }
          }
        }
      }

      // 2. Replenish hand if a tile was removed or placed
      // (Simplified: hand always tries to stay at 3 if deck allows)
      const newHands = { ...state.hands };
      const newDeck = [...state.deck];
      
      const players = [state.hostPeerId, state.guestPeerId].filter(Boolean) as string[];
      players.forEach(pid => {
        while (newHands[pid].length < 3 && newDeck.some(t => t.ownerId === pid)) {
          const deckIdx = newDeck.findIndex(t => t.ownerId === pid);
          const [tile] = newDeck.splice(deckIdx, 1);
          newHands[pid].push(tile);
        }
      });

      // 3. Switch turns
      const nextTurnOwner = state.turnOwnerId === state.hostPeerId ? (state.guestPeerId || state.hostPeerId) : state.hostPeerId;
      
      return {
        ...state,
        board: newBoard,
        hands: newHands,
        deck: newDeck,
        turnOwnerId: nextTurnOwner,
      };
    }
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children, initialRoomId, hostPeerId }: { children: ReactNode; initialRoomId: string; hostPeerId: string }) {
  const [state, dispatch] = useReducer(gameReducer, { ...initialState, roomId: initialRoomId, hostPeerId, turnOwnerId: hostPeerId });

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
}
