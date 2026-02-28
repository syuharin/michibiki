export type PlayerRole = "HOST" | "GUEST";

export type TileType = "I" | "L" | "T" | "X" | "CORNER" | "STRAIGHT"; // Simplified for logic, mapping to rulebook shapes

export type ConnectionPoint = "U" | "D" | "L" | "R";

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
  status: "WAITING_FOR_GUEST" | "IN_PROGRESS" | "FINISHED";
  turnOwnerId: string; // PeerID
  hostPeerId: string;
  guestPeerId: string | null;
  board: Board;
  scores: Record<string, number>; // PeerID -> Score
  deck: Tile[];
  hands: Record<string, Tile[]>; // PeerID -> Hand
}

export type GameAction =
  | { type: "START_GAME"; guestPeerId: string }
  | { type: "PLACE_TILE"; tileId: string; x: number; y: number; rotation: number }
  | { type: "CONFIRM_TURN" } // Deprecated: Use automated logic after PLACE_TILE or PASS_TURN for manual skip
  | { type: "PASS_TURN" }
  | { type: "SYNC_STATE"; state: GameState };
