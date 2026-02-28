"use client";

import { useGame } from "@/context/GameContext";
import { useCallback } from "react";
import { isLegalPlacement } from "@/lib/game/validation";
import { TurnOrderOption } from "@/types/game";

export function useGameLogic(isHost: boolean, sendMessage: (msg: any) => void) {
  const { state, dispatch } = useGame();

  const placeTile = useCallback((tileId: string, x: number, y: number, rotation: number) => {
    const myPeerId = isHost ? state.hostPeerId : state.guestPeerId;
    if (state.turnOwnerId !== myPeerId) return false;

    // Local validation before sending intent or dispatching
    const tile = state.hands[myPeerId || ""].find(t => t.id === tileId);
    if (!tile || !isLegalPlacement(state.board, tile, x, y)) return false;

    if (isHost) {
      dispatch({ type: "PLACE_TILE", tileId, x, y, rotation });
    } else {
      sendMessage({
        type: "PLAYER_INTENT",
        action: "PLACE_TILE",
        payload: { tileId, x, y, rotation }
      });
    }
    return true;
  }, [state, isHost, dispatch, sendMessage]);

  const rotateTile = useCallback((tileId: string) => {
    const myPeerId = isHost ? state.hostPeerId : state.guestPeerId;
    if (state.turnOwnerId !== myPeerId) return;

    if (isHost) {
      dispatch({ type: "ROTATE_HAND_TILE", tileId });
    } else {
      sendMessage({
        type: "PLAYER_INTENT",
        action: "ROTATE_HAND_TILE",
        payload: { tileId }
      });
    }
  }, [state, isHost, dispatch, sendMessage]);

  const passTurn = useCallback(() => {
    const myPeerId = isHost ? state.hostPeerId : state.guestPeerId;
    if (state.turnOwnerId !== myPeerId) return;

    if (isHost) {
      dispatch({ type: "PASS_TURN" });
    } else {
      sendMessage({
        type: "PLAYER_INTENT",
        action: "PASS_TURN",
        payload: {}
      });
    }
  }, [state, isHost, dispatch, sendMessage]);

  const setTurnOrder = useCallback((config: TurnOrderOption) => {
    if (isHost) {
      dispatch({ type: "SET_TURN_ORDER", config });
    } else {
      sendMessage({
        type: "PLAYER_INTENT",
        action: "SET_TURN_ORDER",
        payload: { config }
      });
    }
  }, [isHost, dispatch, sendMessage]);

  return { placeTile, rotateTile, passTurn, setTurnOrder };
}
