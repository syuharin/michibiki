import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { GameState, GameAction, Board, Tile, TileType } from "@/types/game";
import { BOARD_SIZE } from "@/lib/constants/tiles";
import { SCORE_EFFECT_DURATION } from "@/lib/constants/game";
import { calculateConnectedTiles } from "@/lib/game/scoring";
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
  decks: {},
  hands: {},
  turnOrderConfig: "UNSELECTED",
  startingPlayerId: null,
  rematchReady: {},
  winnerId: null,
  effects: [],
};

// Helper to handle turn transition, hand refilling, and game end detection
function finalizeTurn(state: GameState, board: Board, hands: Record<string, Tile[]>, decks: Record<string, Tile[]>, scores: Record<string, number>): GameState {
  if (state.status !== "IN_PROGRESS") return state;
  const currentPlayerId = state.turnOwnerId;
  const newHands: Record<string, Tile[]> = {};
  const newDecks: Record<string, Tile[]> = { ...decks };
  
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

  const newBoard = board;

  // 2. Refill hands from deck
  playerIds.forEach(pid => {
    let currentHand = [...newHands[pid]];
    let playerDeck = [...(newDecks[pid] || [])];
    while (currentHand.length < 3) {
      if (playerDeck.length === 0) break;
      const [tile, ...remaining] = playerDeck;
      currentHand = [...currentHand, tile];
      playerDeck = remaining;
    }
    newHands[pid] = currentHand;
    newDecks[pid] = playerDeck;
  });

  // 3. Determine next turn owner (with skip logic)
  let nextTurnOwner = state.turnOwnerId === state.hostPeerId ? (state.guestPeerId || state.hostPeerId) : state.hostPeerId;
  
  const isPlayerEmpty = (pid: string) => {
    const hand = newHands[pid] || [];
    const deck = newDecks[pid] || [];
    return hand.length === 0 && deck.length === 0;
  };

  const hasActiveReversalTiles = newBoard.some(row => 
    row.some(cell => 
      cell.layers.some(tile => tile.isReversal && tile.turnsLeft !== null && tile.turnsLeft > 0)
    )
  );

  if (isPlayerEmpty(nextTurnOwner)) {
    if (isPlayerEmpty(state.turnOwnerId)) {
      if (!hasActiveReversalTiles) {
        return { ...state, board: newBoard, hands: newHands, decks: newDecks, scores, status: "FINISHED" };
      }
      // Automate turn progression until reversal tiles expire
      return finalizeTurn({ ...state, board: newBoard, turnOwnerId: nextTurnOwner }, newBoard, newHands, newDecks, scores);
    }
    nextTurnOwner = state.turnOwnerId;
  }

  return {
    ...state,
    board: newBoard,
    hands: newHands,
    decks: newDecks,
    scores,
    turnOwnerId: nextTurnOwner,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_GUEST_ID":
      return { ...state, guestPeerId: action.guestPeerId };
    case "SET_TURN_ORDER":
      return { ...state, turnOrderConfig: action.config };
    case "START_GAME": {
      // Prevent double initialization
      if (state.status !== "WAITING_FOR_GUEST") return state;

      return {
        ...state,
        status: "IN_PROGRESS",
        guestPeerId: action.guestPeerId,
        turnOwnerId: action.turnOwnerId,
        startingPlayerId: action.turnOwnerId,
        hands: action.initialHands,
        decks: action.initialDecks,
        scores: { [state.hostPeerId]: 0, [action.guestPeerId]: 0 },
      };
    }
    case "SYNC_STATE":
      return { ...action.state, effects: state.effects };
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

      const involvedTiles = calculateConnectedTiles(newBoard, x, y);
      const totalPoints = involvedTiles.length;
      
      const newScores = { 
        ...state.scores,
        [state.turnOwnerId]: (state.scores[state.turnOwnerId] || 0) + totalPoints
      };

      const nextHands = { ...state.hands };
      nextHands[state.turnOwnerId] = playerHand.filter((t) => t.id !== tileId);

      const newEffect = {
        id: `score-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        totalPoints,
        originCoords: { x, y },
        path: involvedTiles.map(coord => {
          const [tx, ty] = coord.split(",").map(Number);
          return { x: tx, y: ty };
        }),
        duration: SCORE_EFFECT_DURATION
      };

      const finalState = finalizeTurn(state, newBoard, nextHands, state.decks, newScores);
      return {
        ...finalState,
        effects: [...(state.effects || []), newEffect]
      };
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
      return finalizeTurn(state, state.board, state.hands, state.decks, state.scores);
    }
    case "SET_REMATCH_READY": {
      return {
        ...state,
        status: "REMATCH_WAITING",
        rematchReady: {
          ...state.rematchReady,
          [action.peerId]: action.ready
        }
      };
    }
    case "RESET_GAME": {
      return {
        ...initialState,
        roomId: state.roomId,
        hostPeerId: state.hostPeerId,
        guestPeerId: state.guestPeerId,
        scores: { [state.hostPeerId]: 0, [state.guestPeerId || ""]: 0 },
      };
    }
    case "ADD_SCORE_EFFECT":
      return { ...state, effects: [...(state.effects || []), action.effect] };
    case "REMOVE_SCORE_EFFECT":
      return { ...state, effects: (state.effects || []).filter(e => e.id !== action.effectId) };
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children, initialRoomId, hostPeerId }: { children: ReactNode; initialRoomId: string; hostPeerId: string }) {
  const [state, dispatch] = useReducer(gameReducer, { ...initialState, roomId: initialRoomId, hostPeerId, turnOwnerId: "" });

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
