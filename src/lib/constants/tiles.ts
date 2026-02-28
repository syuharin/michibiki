import { TileType, ConnectionPoint } from "@/types/game";

export const BOARD_SIZE = 6;
export const MAX_LAYERS = 2;
export const REVERSAL_TURNS = 5;

// Initial connections for each tile type at 0 degrees rotation
export const TILE_CONNECTIONS: Record<string, ConnectionPoint[]> = {
  STRAIGHT: ["L", "R"],
  VERTICAL: ["U", "D"],
  CORNER_LU: ["U", "L"],
  CORNER_RU: ["U", "R"],
  CORNER_LD: ["D", "L"],
  CORNER_RD: ["D", "R"],
  T_UDL: ["U", "D", "L"],
  T_UDR: ["U", "D", "R"],
  T_LRU: ["L", "R", "U"],
  T_LRD: ["L", "R", "D"],
  CROSS: ["U", "D", "L", "R"],
};

export const ROTATION_MAP: Record<ConnectionPoint, Record<number, ConnectionPoint>> = {
  U: { 0: "U", 90: "R", 180: "D", 270: "L" },
  R: { 0: "R", 90: "D", 180: "L", 270: "U" },
  D: { 0: "D", 90: "L", 180: "U", 270: "R" },
  L: { 0: "L", 90: "U", 180: "R", 270: "D" },
};

export function getRotatedConnections(type: string, rotation: number): ConnectionPoint[] {
  const base = TILE_CONNECTIONS[type] || [];
  return base.map((p) => ROTATION_MAP[p][rotation as keyof (typeof ROTATION_MAP)[typeof p]]);
}
