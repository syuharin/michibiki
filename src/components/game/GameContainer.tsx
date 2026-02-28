"use client";

import { useMemo, useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { useGame } from "@/context/GameContext";
import { usePeer } from "@/hooks/usePeer";
import { useGameLogic } from "@/hooks/useGameLogic";
import RoomShare from "@/components/matchmaking/RoomShare";
import Board from "./Board";
import Hand from "./Hand";
import Tile from "./Tile";
import { hasLegalMove } from "@/lib/game/validation";
import { Tile as TileType } from "@/types/game";

export default function GameContainer({ roomId, isHost }: { roomId: string; isHost: boolean }) {
  const { state } = useGame();
  const { isConnected, sendMessage, peerId } = usePeer(roomId, isHost);
  const { placeTile, rotateTile, passTurn } = useGameLogic(isHost, sendMessage);

  const [layout, setLayout] = useState<"bottom" | "right">("bottom");
  const [isMounted, setIsMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    let timeoutId: NodeJS.Timeout;

    const checkLayout = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isWide = window.innerWidth >= 1024;
      setLayout(isLandscape || isWide ? "right" : "bottom");
    };

    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkLayout, 100);
    };

    checkLayout();
    window.addEventListener("resize", debouncedCheck);
    return () => {
      window.removeEventListener("resize", debouncedCheck);
      clearTimeout(timeoutId);
    };
  }, []);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } });
  const sensors = useMemo(() => [mouseSensor, touchSensor], [mouseSensor, touchSensor]);
  const sensorsWrapper = useSensors(...sensors);

  const myPeerId = isHost ? state.hostPeerId : state.guestPeerId;
  const isMyTurn = state.turnOwnerId === myPeerId;
  const myHand = state.hands[myPeerId || ""] || [];
  
  const isPassAvailable = useMemo(() => 
    isMyTurn && !hasLegalMove(state.board, myHand),
    [isMyTurn, state.board, myHand]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && over.id.toString().startsWith("cell-")) {
      const tileId = active.id.toString();
      const tileData = active.data.current as TileType;
      const cellData = over.data.current as { x: number; y: number };
      
      if (tileData && cellData) {
        const success = placeTile(tileId, cellData.x, cellData.y, tileData.rotation);
        if (!success) {
          console.warn("Illegal move attempted");
        }
      }
    }
  };

  const activeTile = useMemo(() => {
    if (!activeId) return null;
    return myHand.find(t => t.id === activeId);
  }, [activeId, myHand]);

  if (state.status === "WAITING_FOR_GUEST") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 gap-8 bg-michibiki-white">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-michibiki-black">MICHIBIKI</h1>
        <div className="text-xl font-bold animate-pulse text-michibiki-gray-dark">対戦相手を待っています...</div>
        {isHost && <RoomShare roomId={roomId} />}
        {!isHost && <p className="text-lg text-michibiki-gray">ホストに接続中...</p>}
        <div className="fixed bottom-4 right-4 text-xs font-mono bg-michibiki-black text-white p-2 rounded">
          STATUS: {isConnected ? "CONNECTED" : "CONNECTING..."} | ID: {peerId}
        </div>
      </div>
    );
  }

  if (!isMounted) return <div className="min-h-screen bg-michibiki-white" />;

  return (
    <DndContext 
      sensors={sensorsWrapper} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex min-h-screen flex-col items-center p-4 gap-6 bg-michibiki-white overflow-hidden">
        {!isConnected && (
          <div className="fixed inset-0 z-[100] bg-michibiki-black/80 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center space-y-4">
              <h2 className="text-2xl font-black">接続が切れました</h2>
              <p className="text-michibiki-gray">再接続を試みています...</p>
              <div className="w-12 h-12 border-4 border-michibiki-black border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        )}

        <header className="w-full flex justify-between items-center max-w-6xl border-b-2 border-michibiki-black pb-4 shrink-0">
          <h1 className="text-3xl font-black italic tracking-tighter text-michibiki-black">MICHIBIKI</h1>
          <div className="flex gap-6 items-center">
            <div className="text-right">
              <p className="text-[10px] font-bold text-michibiki-gray uppercase">Room ID</p>
              <p className="font-mono text-sm leading-none text-michibiki-black">{roomId}</p>
            </div>
            <div className={`w-4 h-4 rounded-full ${isConnected ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500 animate-pulse"}`}></div>
          </div>
        </header>
        
        <div className={`flex-1 w-full max-w-6xl flex gap-6 overflow-hidden ${layout === "right" ? "flex-row" : "flex-col"}`}>
          <main className="flex-1 flex flex-col items-center gap-4 py-2 overflow-y-auto">
            <div className="flex justify-between w-full items-end">
              <div className={`p-2 px-3 border-2 transition-all ${isMyTurn ? "border-michibiki-black scale-105 shadow-md bg-white" : "border-michibiki-gray-light grayscale opacity-50"}`}>
                <p className="text-[8px] font-black uppercase tracking-widest text-michibiki-gray">Turn</p>
                <p className="text-lg font-black text-michibiki-black leading-none">{isMyTurn ? "YOUR MOVE" : "OPPONENT"}</p>
              </div>
              <div className="text-right p-2 px-4 bg-michibiki-black text-michibiki-white">
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-70">Score</p>
                <p className="text-2xl font-black tracking-tighter leading-none">
                  {state.scores[myPeerId || ""] || 0}
                </p>
              </div>
            </div>

            <Board />

            <div className="flex flex-col items-center gap-4">
              {isPassAvailable && (
                <button 
                  onClick={passTurn}
                  className="px-12 py-4 bg-michibiki-black text-michibiki-white font-black text-xl hover:translate-y-1 transition-all active:translate-y-2 shadow-[0_4px_0_rgb(51,65,85)] active:shadow-none"
                >
                  パス
                </button>
              )}
              <p className="text-[10px] text-michibiki-gray font-bold uppercase">
                {isMyTurn ? (isPassAvailable ? "置ける場所がありません" : "手札のタイルをクリックで回転") : "相手の行動を待っています"}
              </p>
            </div>
          </main>

          <aside className={`${layout === "right" ? "w-64" : "w-full"} shrink-0`}>
            <Hand 
              peerId={myPeerId || ""} 
              isMyTurn={isMyTurn} 
              onRotate={rotateTile} 
              layout={layout} 
            />
          </aside>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeId && activeTile ? (
          <Tile tile={activeTile} isDraggable={false} className="shadow-2xl scale-110 opacity-90 cursor-grabbing" />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
