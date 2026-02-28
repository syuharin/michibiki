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

  // Keep a ref to the latest state to avoid stale closure issues in handleMessage
  // while preventing effect re-runs that would reset the P2P connection.
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
      const currentState = stateRef.current;
      switch (msg.type) {
        case "JOIN_ROOM":
          if (isHost) {
            // Generate initial tiles and shuffle (Move from reducer to action creator)
            const allTiles: any[] = [];
            const players = [currentState.hostPeerId, msg.guestPeerId];
            
            players.forEach(pid => {
              // Rulebook: 13 tiles per player
              // STRAIGHT: 2 (1 is reversal)
              // VERTICAL: 1
              // CORNER: 4
              // T: 5 (1 is reversal)
              // X: 1
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
                const uniqueId = `t-${pid === currentState.hostPeerId ? 'h' : 'g'}-${i}-${Math.random().toString(36).substring(2, 6)}`;
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

            const shuffled = [...allTiles].sort(() => Math.random() - 0.5);
            const initialHands: Record<string, any[]> = {};
            const initialDeck: any[] = [];
            
            players.forEach(pid => {
              const playerTiles = shuffled.filter(t => t.ownerId === pid);
              initialHands[pid] = playerTiles.slice(0, 3);
              initialDeck.push(...playerTiles.slice(3));
            });

            dispatch({ 
              type: "START_GAME", 
              guestPeerId: msg.guestPeerId,
              initialHands,
              initialDeck
            });
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
                // PASS_TURN is now handled atomically inside PLACE_TILE reducer
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

  // Sync state from Host to Guest whenever meaningful game state changes
  useEffect(() => {
    if (isHost && isConnected && state.status === "IN_PROGRESS") {
      sendMessage({ type: "BOARD_SYNC", state });
    }
  }, [isHost, isConnected, state.board, state.hands, state.scores, state.turnOwnerId, state.status, sendMessage]);

  return { peerId, isConnected, sendMessage };
}
