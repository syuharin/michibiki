"use client";

import { useGame } from "@/context/GameContext";
import { useCallback } from "react";

export function useGameLogic(isHost: boolean, sendMessage: (msg: any) => void) {
  const { state, dispatch } = useGame();

  const placeTile = useCallback((tileId: string, x: number, y: number) => {
    const myPeerId = isHost ? state.hostPeerId : state.guestPeerId;
    if (state.turnOwnerId !== myPeerId) return;

    if (isHost) {
      dispatch({ type: "PLACE_TILE", tileId, x, y, rotation: 0 });
    } else {
      sendMessage({
        type: "PLAYER_INTENT",
        action: "PLACE_TILE",
        payload: { tileId, x, y, rotation: 0 }
      });
    }
  }, [state, isHost, dispatch, sendMessage]);

  const rotateTile = useCallback((x: number, y: number) => {
    const myPeerId = isHost ? state.hostPeerId : state.guestPeerId;
    if (state.turnOwnerId !== myPeerId) return;

    const cell = state.board[y][x];
    if (cell.layers.length === 0) return;
    
    const topTile = cell.layers[cell.layers.length - 1];
    if (topTile.ownerId !== myPeerId) return;

    const newRotation = ((topTile.rotation + 90) % 360) as 0 | 90 | 180 | 270;

    if (isHost) {
      // For simplicity, reusing PLACE_TILE logic but we'd need a ROTATE_TILE action
      // Or just re-dispatch with existing tile ID to update it.
      // Let's assume PLACE_TILE updates if tileId already in cell or we add ROTATE_TILE
      // I'll add a quick ROTATE_TILE to the reducer in next step.
      dispatch({ type: "PLACE_TILE", tileId: topTile.id, x, y, rotation: newRotation });
    } else {
      sendMessage({
        type: "PLAYER_INTENT",
        action: "ROTATE_TILE",
        payload: { x, y, rotation: newRotation }
      });
    }
  }, [state, isHost, dispatch, sendMessage]);

  const confirmTurn = useCallback(() => {
    const myPeerId = isHost ? state.hostPeerId : state.guestPeerId;
    if (state.turnOwnerId !== myPeerId) return;

    if (isHost) {
      dispatch({ type: "CONFIRM_TURN" });
    } else {
      sendMessage({
        type: "PLAYER_INTENT",
        action: "CONFIRM_TURN",
        payload: {}
      });
    }
  }, [state, isHost, dispatch, sendMessage]);

  return { placeTile, rotateTile, confirmTurn };
}
