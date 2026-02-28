import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { GameState, GameAction, Board, Tile, TileType } from "@/types/game";
import { BOARD_SIZE } from "@/lib/constants/tiles";
import { calculateConnectedGroup } from "@/lib/game/scoring";
import { isLegalPlacement } from "@/lib/game/validation";

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

// Helper to handle turn transition, hand refilling, and game end detection
function finalizeTurn(state: GameState, board: Board, hands: Record<string, Tile[]>, deck: Tile[], scores: Record<string, number>): GameState {
  if (state.status !== "IN_PROGRESS") return state;
  const currentPlayerId = state.turnOwnerId;
  const newHands: Record<string, Tile[]> = {};
  
  // Ensure deterministic execution order across different JS environments
  const playerIds = [state.hostPeerId, state.guestPeerId].filter((id): id is string => !!id);

  // 1. Decrement turns for reversal tiles in the hand of the player who just moved
  playerIds.forEach(pid => {
    let currentHand = [...(hands[pid] || [])];
    if (pid === currentPlayerId) {
      currentHand = currentHand
        .map(tile => (tile.isReversal && tile.turnsLeft !== null) ? { ...tile, turnsLeft: tile.turnsLeft - 1 } : tile)
        .filter(tile => !tile.isReversal || tile.turnsLeft === null || tile.turnsLeft > 0);
    }
    newHands[pid] = currentHand;
  });

  // 2. Refill hands from deck
  let newDeck = [...deck];
  playerIds.forEach(pid => {
    let currentHand = [...newHands[pid]];
    while (currentHand.length < 3) {
      const deckIdx = newDeck.findIndex(t => t.ownerId === pid);
      if (deckIdx === -1) break;
      const [tile] = newDeck.splice(deckIdx, 1);
      currentHand = [...currentHand, tile];
    }
    newHands[pid] = currentHand;
  });

  // 3. Determine next turn owner (with skip logic)
  let nextTurnOwner = state.turnOwnerId === state.hostPeerId ? (state.guestPeerId || state.hostPeerId) : state.hostPeerId;
  
  const isPlayerEmpty = (pid: string) => {
    const hand = newHands[pid] || [];
    const hasTilesInDeck = newDeck.some(t => t.ownerId === pid);
    return hand.length === 0 && !hasTilesInDeck;
  };

  if (isPlayerEmpty(nextTurnOwner)) {
    if (isPlayerEmpty(state.turnOwnerId)) {
      return { ...state, board, hands: newHands, deck: newDeck, scores, status: "FINISHED" };
    }
    nextTurnOwner = state.turnOwnerId;
  }

  return {
    ...state,
    board,
    hands: newHands,
    deck: newDeck,
    scores,
    turnOwnerId: nextTurnOwner,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      // Prevent double initialization
      if (state.status !== "WAITING_FOR_GUEST") return state;

      return {
        ...state,
        status: "IN_PROGRESS",
        guestPeerId: action.guestPeerId,
        turnOwnerId: state.hostPeerId,
        hands: action.initialHands,
        deck: action.initialDeck,
        scores: { [state.hostPeerId]: 0, [action.guestPeerId]: 0 },
      };
    }
    case "SYNC_STATE":
      return { ...action.state };
    case "PLACE_TILE": {
      const { tileId, x, y, rotation } = action;
      const playerHand = state.hands[state.turnOwnerId] || [];
      const tile = playerHand.find((t) => t.id === tileId);

      // Validation: Ensure tile exists, placement is legal, AND it belongs to the current turn owner
      if (!tile || tile.ownerId !== state.turnOwnerId || !isLegalPlacement(state.board, tile, x, y)) {
        return state;
      }
      
      const newBoard = [...state.board.map(row => [...row])];
      const cell = newBoard[y][x];

      const updatedTile: Tile = { 
        ...tile, 
        rotation: rotation as 0 | 90 | 180 | 270,
        turnsLeft: null 
      };
      
      newBoard[y][x] = { ...cell, layers: [...cell.layers, updatedTile] };

      const newScores = { ...state.scores };
      const connectedGroup = calculateConnectedGroup(newBoard, x, y);
      newScores[state.turnOwnerId] = (newScores[state.turnOwnerId] || 0) + connectedGroup.size;

      const nextHands = { ...state.hands };
      nextHands[state.turnOwnerId] = playerHand.filter((t) => t.id !== tileId);

      return finalizeTurn(state, newBoard, nextHands, state.deck, newScores);
    }
    case "ROTATE_HAND_TILE": {
      const { tileId } = action;
      const playerHand = state.hands[state.turnOwnerId] || [];
      const tileIdx = playerHand.findIndex(t => t.id === tileId);
      
      // Ownership check: Ensure tile belongs to the current turn owner
      if (tileIdx === -1 || playerHand[tileIdx].ownerId !== state.turnOwnerId) {
        return state;
      }
      
      const newHands = { ...state.hands };
      const updatedHand = [...playerHand];
      
      const tile = updatedHand[tileIdx];
      updatedHand[tileIdx] = {
        ...tile,
        rotation: ((tile.rotation + 90) % 360) as 0 | 90 | 180 | 270
      };
      newHands[state.turnOwnerId] = updatedHand;
      
      return {
        ...state,
        hands: newHands
      };
    }
    case "PASS_TURN":
    case "CONFIRM_TURN": {
      return finalizeTurn(state, state.board, state.hands, state.deck, state.scores);
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
