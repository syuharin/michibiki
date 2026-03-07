import { GameState, ScoreEffectEvent } from "@/types/game";

export type P2PMessage =
  | { type: "JOIN_ROOM"; guestPeerId: string }
  | { type: "BOARD_SYNC"; state: GameState }
  | { type: "PLAYER_INTENT"; action: string; payload: any }
  | { type: "GAME_OVER"; winnerId: string; finalScores: Record<string, number> }
  | { type: "REMATCH_READY"; peerId: string; ready: boolean }
  | { type: "REMATCH_START" }
  | { type: "SCORE_GAIN_EFFECT"; effect: ScoreEffectEvent };

export function serializeMessage(msg: P2PMessage): string {
  return JSON.stringify(msg);
}

export function deserializeMessage(data: string): P2PMessage {
  return JSON.parse(data) as P2PMessage;
}
