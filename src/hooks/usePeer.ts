"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Peer, { DataConnection } from "peerjs";
import { useGame } from "@/context/GameContext";
import { P2PMessage, deserializeMessage, serializeMessage } from "@/lib/p2p/protocol";

export function usePeer(roomId: string, isHost: boolean) {
  const { state, dispatch } = useGame();
  const [peerId, setPeerId] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);

  const sendMessage = useCallback((msg: P2PMessage) => {
    if (connRef.current?.open) {
      connRef.current.send(serializeMessage(msg));
    }
  }, []);

  useEffect(() => {
    const peer = new Peer(isHost ? roomId : undefined);
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      if (!isHost) {
        // Guest connects to Host
        const conn = peer.connect(roomId);
        setupConnection(conn);
      }
    });

    peer.on("connection", (conn) => {
      if (isHost) {
        setupConnection(conn);
      } else {
        conn.close(); // Only host accepts incoming connections
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
            dispatch({ type: "START_GAME", guestPeerId: msg.guestPeerId });
            // Host immediately sends initial state back
            // (BOARD_SYNC will be handled in a separate effect or manually)
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
                dispatch({ type: "PASS_TURN" });
                break;
              case "ROTATE_TILE": {
                const cell = state.board[msg.payload.y][msg.payload.x];
                if (cell.layers.length > 0) {
                  const topTile = cell.layers[cell.layers.length - 1];
                  dispatch({ 
                    type: "PLACE_TILE", 
                    tileId: topTile.id, 
                    x: msg.payload.x, 
                    y: msg.payload.y, 
                    rotation: msg.payload.rotation 
                  });
                }
                break;
              }
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

  // Sync state from Host to Guest whenever it changes
  useEffect(() => {
    if (isHost && isConnected && state.status !== "WAITING_FOR_GUEST") {
      sendMessage({ type: "BOARD_SYNC", state });
    }
  }, [isHost, isConnected, state, sendMessage]);

  return { peerId, isConnected, sendMessage };
}
