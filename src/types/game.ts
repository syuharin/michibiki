export type PlayerRole = "HOST" | "GUEST";

export type TurnOrderOption = "HOST_FIRST" | "GUEST_FIRST" | "RANDOM" | "UNSELECTED";

export type TileType = "I" | "L" | "T" | "X" | "CORNER" | "STRAIGHT" | "VERTICAL"; // Simplified for logic, mapping to rulebook shapes

export type ConnectionPoint = "U" | "D" | "L" | "R";

export interface TileCoordinate {
  x: number;
  y: number;
}

export interface ScoreEffectEvent {
  id: string;
  timestamp: number;
  totalPoints: number;
  originCoords: TileCoordinate;
  path: TileCoordinate[];
  duration: number;
}

export interface Tile {
  id: string;
  type: TileType;
  ownerId: string; // PeerID
  rotation: 0 | 90 | 180 | 270;
  isReversal: boolean;
  turnsLeft: number | null;
}

export interface Cell {
  x: number;
  y: number;
  layers: Tile[]; // max 2
}

export type Board = Cell[][];

export interface GameState {
  roomId: string;
  status: "WAITING_FOR_GUEST" | "IN_PROGRESS" | "FINISHED" | "REMATCH_WAITING";
  turnOwnerId: string; // PeerID
  hostPeerId: string;
  guestPeerId: string | null;
  board: Board;
  scores: Record<string, number>; // PeerID -> Score
  decks: Record<string, Tile[]>; // PeerID -> Deck
  hands: Record<string, Tile[]>; // PeerID -> Hand
  turnOrderConfig: TurnOrderOption;
  startingPlayerId: string | null;
  rematchReady: Record<string, boolean>; // PeerID -> Ready Status
  winnerId: string | null; // PeerID or "DRAW"
  effects: ScoreEffectEvent[];
}

export type GameAction =
  | { type: "START_GAME"; guestPeerId: string; turnOwnerId: string; initialDecks: Record<string, Tile[]>; initialHands: Record<string, Tile[]> }
  | { type: "SET_GUEST_ID"; guestPeerId: string }
  | { type: "SET_TURN_ORDER"; config: TurnOrderOption }
  | { type: "PLACE_TILE"; tileId: string; x: number; y: number; rotation: number }
  | { type: "ROTATE_HAND_TILE"; tileId: string }
  | { type: "CONFIRM_TURN" } // Deprecated: Use automated logic after PLACE_TILE or PASS_TURN for manual skip
  | { type: "PASS_TURN" }
  | { type: "SYNC_STATE"; state: GameState }
  | { type: "SET_REMATCH_READY"; peerId: string; ready: boolean }
  | { type: "RESET_GAME" }
  | { type: "ADD_SCORE_EFFECT"; effect: ScoreEffectEvent }
  | { type: "REMOVE_SCORE_EFFECT"; effectId: string };

export interface RulebookContent {
  content: string;
  isLoading: boolean;
  error: string | null;
}
