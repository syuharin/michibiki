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

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      // Prevent double initialization
      if (state.status !== "WAITING_FOR_GUEST") return state;

      const allTiles: Tile[] = [];
      const players = [state.hostPeerId, action.guestPeerId];
      
      players.forEach(pid => {
        const types: TileType[] = ["STRAIGHT", "VERTICAL", "CORNER", "T", "X"];
        for (let i = 0; i < 13; i++) {
          const uniqueId = `tile-${pid}-${i}-${Math.random().toString(36).substring(2, 11)}`;
          allTiles.push({
            id: uniqueId,
            type: types[i % types.length],
            ownerId: pid,
            rotation: 0,
            isReversal: i === 0 || i === 1,
            turnsLeft: i === 0 || i === 1 ? 5 : null,
          });
        }
      });

      const shuffled = [...allTiles].sort(() => Math.random() - 0.5);
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
      
      if (isInitialPlacement) {
        if (cell.layers.length >= 2) return state;
        if (cell.layers.length === 1 && !tile.isReversal) return state;
      }

      const updatedTile: Tile = { 
        ...tile, 
        id: isInitialPlacement ? `placed-${tile.id}-${Date.now()}` : tile.id,
        rotation: rotation as 0 | 90 | 180 | 270,
        turnsLeft: isInitialPlacement ? null : tile.turnsLeft // Stop countdown if just placed
      };
      
      if (existingTileInCell) {
        const newLayers = [...cell.layers];
        newLayers[newLayers.length - 1] = updatedTile;
        newBoard[y][x] = { ...cell, layers: newLayers };
      } else {
        newBoard[y][x] = { ...cell, layers: [...cell.layers, updatedTile] };
      }

      const newScores = { ...state.scores };
      if (isInitialPlacement) {
        const connectedGroup = calculateConnectedGroup(newBoard, x, y);
        newScores[state.turnOwnerId] = (newScores[state.turnOwnerId] || 0) + connectedGroup.size;
      }

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
    case "PASS_TURN":
    case "CONFIRM_TURN": {
      const currentPlayerId = state.turnOwnerId;
      
      // 1. Decrement turns for reversal tiles IN HAND for the current player
      const newHands: Record<string, Tile[]> = {};
      Object.keys(state.hands).forEach(pid => {
        let currentHand = [...state.hands[pid]];
        if (pid === currentPlayerId) {
          // Only decrement for the player who just finished their turn
          currentHand = currentHand
            .map(tile => {
              if (tile.isReversal && tile.turnsLeft !== null) {
                return { ...tile, turnsLeft: tile.turnsLeft - 1 };
              }
              return tile;
            })
            // Filter out tiles that reached 0 or less
            .filter(tile => !tile.isReversal || tile.turnsLeft === null || tile.turnsLeft > 0);
        }
        newHands[pid] = currentHand;
      });

      // 2. Refill hands from deck
      let newDeck = [...state.deck];
      Object.keys(newHands).forEach(pid => {
        let currentHand = [...newHands[pid]];
        while (currentHand.length < 3) {
          const deckIdx = newDeck.findIndex(t => t.ownerId === pid);
          if (deckIdx === -1) break;
          const [tile] = newDeck.splice(deckIdx, 1);
          currentHand = [...currentHand, tile];
        }
        newHands[pid] = currentHand;
      });

      let nextTurnOwner = state.turnOwnerId === state.hostPeerId ? (state.guestPeerId || state.hostPeerId) : state.hostPeerId;
      
      // US2: Automatic skip logic
      const isPlayerEmpty = (pid: string) => {
        const hand = newHands[pid] || [];
        const hasTilesInDeck = newDeck.some(t => t.ownerId === pid);
        return hand.length === 0 && !hasTilesInDeck;
      };

      if (isPlayerEmpty(nextTurnOwner)) {
        // If next player is empty, check if CURRENT player is also empty (Game Over)
        if (isPlayerEmpty(state.turnOwnerId)) {
          return {
            ...state,
            hands: newHands,
            deck: newDeck,
            status: "FINISHED"
          };
        }
        // Otherwise, skip the empty player and stay with current
        nextTurnOwner = state.turnOwnerId;
      }

      return {
        ...state,
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
