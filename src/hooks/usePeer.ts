"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Peer, { DataConnection } from "peerjs";
import { useGame } from "@/context/GameContext";
import { P2PMessage, deserializeMessage, serializeMessage } from "@/lib/p2p/protocol";
import { Tile, TileType } from "@/types/game";

/**
 * Fisher-Yates Shuffle algorithm for uniform distribution.
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function usePeer(roomId: string, isHost: boolean) {
  const { state, dispatch } = useGame();
  const [peerId, setPeerId] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const sendMessage = useCallback((msg: P2PMessage) => {
    if (connRef.current?.open) {
      connRef.current.send(serializeMessage(msg));
    }
  }, []);

  useEffect(() => {
    const peer = isHost ? new Peer(roomId) : new Peer();
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      if (!isHost) {
        const conn = peer.connect(roomId);
        setupConnection(conn);
      }
    });

    peer.on("connection", (conn) => {
      if (isHost) {
        setupConnection(conn);
      } else {
        conn.close();
      }
    });

    const setupConnection = (conn: DataConnection) => {
      connRef.current = conn;
      conn.on("open", () => {
        setIsConnected(true);
        if (!isHost) {
          sendMessage({ type: "JOIN_ROOM", guestPeerId: peer.id });
        }
      });

      conn.on("data", (data) => {
        const msg = deserializeMessage(data as string);
        handleMessage(msg);
      });

      conn.on("close", () => setIsConnected(false));
    };

    const handleMessage = (msg: P2PMessage) => {
      switch (msg.type) {
        case "JOIN_ROOM":
          if (isHost) {
            dispatch({ type: "SET_GUEST_ID", guestPeerId: msg.guestPeerId });
          }
          break;
        case "BOARD_SYNC":
          if (!isHost) {
            dispatch({ type: "SYNC_STATE", state: msg.state });
          }
          break;
        case "PLAYER_INTENT":
          if (isHost) {
            switch (msg.action) {
              case "PLACE_TILE":
                dispatch({ 
                  type: "PLACE_TILE", 
                  tileId: msg.payload.tileId, 
                  x: msg.payload.x, 
                  y: msg.payload.y, 
                  rotation: msg.payload.rotation 
                });
                break;
              case "ROTATE_HAND_TILE":
                dispatch({ 
                  type: "ROTATE_HAND_TILE", 
                  tileId: msg.payload.tileId
                });
                break;
              case "PASS_TURN":
              case "CONFIRM_TURN":
                dispatch({ type: "PASS_TURN" });
                break;
            }
          }
          break;
      }
    };

    return () => {
      peer.destroy();
    };
  }, [roomId, isHost, dispatch, sendMessage]);

  const startGame = useCallback(() => {
    const { guestPeerId, hostPeerId, turnOrderConfig } = state;
    if (!isHost || !guestPeerId || turnOrderConfig === "UNSELECTED") return;

    const allTiles: Tile[] = [];
    const players = [hostPeerId, guestPeerId];

    players.forEach((pid) => {
      const tilePool: { type: TileType; isReversal: boolean }[] = [
        { type: "STRAIGHT", isReversal: true },
        { type: "STRAIGHT", isReversal: false },
        { type: "VERTICAL", isReversal: false },
        { type: "CORNER", isReversal: false },
        { type: "CORNER", isReversal: false },
        { type: "CORNER", isReversal: false },
        { type: "CORNER", isReversal: false },
        { type: "T", isReversal: true },
        { type: "T", isReversal: false },
        { type: "T", isReversal: false },
        { type: "T", isReversal: false },
        { type: "T", isReversal: false },
        { type: "X", isReversal: false },
      ];

      tilePool.forEach((t, i) => {
        const uniqueId = `t-${pid === hostPeerId ? "h" : "g"}-${i}-${Math.random().toString(36).substring(2, 6)}`;
        allTiles.push({
          id: uniqueId,
          type: t.type,
          ownerId: pid,
          rotation: 0,
          isReversal: t.isReversal,
          turnsLeft: t.isReversal ? 5 : null,
        });
      });
    });

    const shuffled = shuffle(allTiles);
    const initialHands: Record<string, Tile[]> = {};
    const initialDecks: Record<string, Tile[]> = {};

    players.forEach((pid) => {
      const playerTiles = shuffled.filter((t) => t.ownerId === pid);
      initialHands[pid] = playerTiles.slice(0, 3);
      initialDecks[pid] = playerTiles.slice(3);
    });

    let turnOwnerId = "";
    if (turnOrderConfig === "HOST_FIRST") {
      turnOwnerId = hostPeerId;
    } else if (turnOrderConfig === "GUEST_FIRST") {
      turnOwnerId = guestPeerId;
    } else if (turnOrderConfig === "RANDOM") {
      turnOwnerId = Math.random() < 0.5 ? hostPeerId : guestPeerId;
    }

    dispatch({
      type: "START_GAME",
      guestPeerId,
      turnOwnerId,
      initialHands,
      initialDecks,
    });
  }, [isHost, state, dispatch]);

  useEffect(() => {
    if (isHost && isConnected && (state.status === "IN_PROGRESS" || state.status === "WAITING_FOR_GUEST")) {
      sendMessage({ type: "BOARD_SYNC", state: stateRef.current });
    }
  }, [
    isHost, 
    isConnected, 
    state.status, 
    state.turnOrderConfig, 
    state.guestPeerId, 
    state.board, 
    state.hands, 
    state.turnOwnerId,
    sendMessage
  ]);

  return { peerId, isConnected, sendMessage, startGame };
}
