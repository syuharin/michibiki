"use client";

import { useMemo, useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { useGame } from "@/context/GameContext";
import { usePeer } from "@/hooks/usePeer";
import { useGameLogic } from "@/hooks/useGameLogic";
import RoomShare from "@/components/matchmaking/RoomShare";
import { Trophy } from "lucide-react";
import Board from "./Board";
import Hand from "./Hand";
import Tile from "./Tile";
import Deck from "./Deck";
import TurnOrderSelector from "./TurnOrderSelector";
import ResultModal from "./ResultModal";
import RulebookButton from "@/components/rulebook/RulebookButton";
import { useUI } from "@/context/UIContext";
import { hasLegalMove } from "@/lib/game/validation";
import { Tile as TileType } from "@/types/game";

export default function GameContainer({ roomId, isHost }: { roomId: string; isHost: boolean }) {
  const { state } = useGame();
  const { isConnected, sendMessage, peerId, startGame } = usePeer(roomId, isHost);
  const { placeTile, rotateTile, passTurn, setTurnOrder, handleRematch, handleReturnToLobby } = useGameLogic(isHost, sendMessage);
  const { setRulebookOpen } = useUI();

  const myPeerId = isHost ? state.hostPeerId : state.guestPeerId;

  const [layout, setLayout] = useState<"bottom" | "right">("bottom");
  const [isMounted, setIsMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [startMessage, setStartMessage] = useState<string | null>(null);

  useEffect(() => {
    if (state.status === "IN_PROGRESS" && state.startingPlayerId) {
      const isMe = state.startingPlayerId === myPeerId;
      setStartMessage(`先行: ${isMe ? "あなた" : "相手"}`);
      const timer = setTimeout(() => setStartMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.status, state.startingPlayerId, myPeerId]);

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
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 50, tolerance: 10 } });
  const sensors = useMemo(() => [mouseSensor, touchSensor], [mouseSensor, touchSensor]);
  const sensorsWrapper = useSensors(...sensors);

  const opponentPeerId = isHost ? state.guestPeerId : state.hostPeerId;
  const isMyTurn = state.turnOwnerId === myPeerId;
  
  const myHand = useMemo(() => state.hands[myPeerId || ""] || [], [state.hands, myPeerId]);
  
  const myScore = state.scores[myPeerId || ""] || 0;
  const opponentScore = opponentPeerId ? (state.scores[opponentPeerId] || 0) : 0;

  const myDeckCount = myPeerId ? (state.decks[myPeerId]?.length || 0) : 0;
  const opponentDeckCount = opponentPeerId ? (state.decks[opponentPeerId]?.length || 0) : 0;

  const isPassAvailable = useMemo(() => 
    isMyTurn && !hasLegalMove(state.board, myHand),
    [isMyTurn, state.board, myHand]
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (activeId) return;
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
        
        <div className="w-full max-w-xl flex flex-col gap-6">
          {!state.guestPeerId ? (
            <div className="text-xl font-bold animate-pulse text-center text-michibiki-gray-dark">対戦相手を待っています...</div>
          ) : (
            <>
              <div className="text-xl font-bold text-center text-michibiki-black">対戦相手が参加しました！</div>
              <TurnOrderSelector 
                currentOption={state.turnOrderConfig} 
                onSelect={setTurnOrder} 
                isHost={isHost} 
              />
              
              {isHost && (
                <button
                  onClick={startGame}
                  disabled={state.turnOrderConfig === "UNSELECTED"}
                  className={`w-full py-4 font-black text-xl transition-all shadow-[0_4px_0_rgb(51,65,85)] active:translate-y-1 active:shadow-none ${
                    state.turnOrderConfig === "UNSELECTED"
                      ? "bg-michibiki-gray text-michibiki-white cursor-not-allowed opacity-50"
                      : "bg-michibiki-black text-white hover:bg-michibiki-gray-dark"
                  }`}
                >
                  ゲーム開始
                </button>
              )}
            </>
          )}
        </div>

        {isHost && <RoomShare roomId={roomId} />}
        {!isHost && !state.guestPeerId && <p className="text-lg text-michibiki-gray-dark">ホストに接続中...</p>}
        
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
      <div className="flex h-screen max-h-screen flex-col items-center p-2 sm:p-4 gap-2 sm:gap-6 bg-michibiki-white overflow-hidden">
        {startMessage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none">
            <div className="bg-michibiki-black text-white px-12 py-6 rounded-none border-4 border-white shadow-2xl animate-in zoom-in duration-300">
              <p className="text-4xl font-black uppercase tracking-widest">{startMessage}</p>
            </div>
          </div>
        )}
        {!isConnected && (
          <div className="fixed inset-0 z-[100] bg-michibiki-black/80 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center space-y-4">
              <h2 className="text-2xl font-black">接続が切れました</h2>
              <p className="text-michibiki-gray-dark">再接続を試みています...</p>
              <div className="w-12 h-12 border-4 border-michibiki-black border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        )}

        <header className="w-full flex justify-between items-center max-w-6xl border-b-2 border-michibiki-black pb-2 sm:pb-4 shrink-0">
          <h1 className="text-xl sm:text-3xl font-black italic tracking-tighter text-michibiki-black leading-none">MICHIBIKI</h1>
          <div className="flex gap-4 sm:gap-6 items-center">
            <div className="text-right">
              <p className="text-[8px] font-bold text-michibiki-gray-dark uppercase">Room</p>
              <p className="font-mono text-xs sm:text-sm leading-none text-michibiki-black">{roomId}</p>
            </div>
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500 animate-pulse"}`}></div>
          </div>
        </header>
        
        <div className={`flex-1 w-full max-w-6xl flex gap-2 sm:gap-6 overflow-hidden ${layout === "right" ? "flex-row" : "flex-col"}`}>
          <main className="flex-1 flex flex-col items-center gap-2 sm:gap-4 py-1 sm:py-2 overflow-y-auto overflow-x-hidden">
            {/* Stats Bar */}
            <div className="flex justify-between w-full items-center bg-white border-2 border-michibiki-black p-1.5 sm:p-3 shadow-sm shrink-0">
              <div className={`p-1 sm:p-2 px-2 sm:px-3 border-2 transition-all ${isMyTurn ? "border-michibiki-black bg-michibiki-black text-white" : "border-michibiki-gray text-michibiki-gray-dark grayscale opacity-50"}`}>
                <p className="text-[6px] sm:text-[8px] font-black uppercase tracking-widest opacity-70">Status</p>
                <p className="text-[10px] sm:text-sm font-black leading-none">{isMyTurn ? "YOUR TURN" : "RIVAL TURN"}</p>
              </div>

              <div className="flex gap-1.5 sm:gap-4 items-center">
                <div className="text-right p-1 sm:p-2 px-1.5 sm:px-3 border-2 border-michibiki-black flex items-center gap-1.5 sm:gap-4">
                  <Deck count={myDeckCount} />
                  <div aria-live="polite">
                    <p className="text-[6px] sm:text-[8px] font-bold uppercase tracking-widest text-michibiki-gray-dark">You</p>
                    <p className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">{myScore}</p>
                  </div>
                  <Trophy className="w-4 h-4 sm:w-8 sm:h-8 text-michibiki-black" />
                </div>
                {state.status === "IN_PROGRESS" && opponentPeerId && (
                  <div className="text-right p-1 sm:p-2 px-1.5 sm:px-3 border-2 border-michibiki-gray-dark flex items-center gap-1.5 sm:gap-4 bg-michibiki-white">
                    <Deck count={opponentDeckCount} />
                    <div aria-live="polite">
                      <p className="text-[6px] sm:text-[8px] font-bold uppercase tracking-widest text-michibiki-gray-dark">Rival</p>
                      <p className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">{opponentScore}</p>
                    </div>
                    <Trophy className="w-4 h-4 sm:w-8 sm:h-8 text-michibiki-gray-dark" />
                  </div>
                )}
              </div>
            </div>

            <Board />

            <div className="flex flex-col items-center gap-1 sm:gap-4">
              {isPassAvailable && (
                <button 
                  onClick={passTurn}
                  className="px-6 sm:px-12 py-2 sm:py-4 bg-michibiki-black text-michibiki-white font-black text-sm sm:text-xl hover:translate-y-1 transition-all active:translate-y-2 shadow-[0_4px_0_rgb(51,65,85)] active:shadow-none"
                >
                  パス
                </button>
              )}
              <p className="text-[8px] sm:text-[10px] text-michibiki-gray-dark font-bold uppercase">
                {isMyTurn ? (isPassAvailable ? "置ける場所がありません" : "手札をタップで回転") : "相手を待っています"}
              </p>
            </div>
          </main>

          <aside className={`${layout === "right" ? "w-64" : "w-full"} shrink-0 transition-all duration-300`}>
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
          <div className="w-16 h-16 md:w-20 md:h-20">
            <Tile tile={activeTile} isDraggable={false} className="shadow-2xl scale-110 opacity-90 cursor-grabbing" />
          </div>
        ) : null}
      </DragOverlay>

      <ResultModal 
        isHost={isHost} 
        onRematch={handleRematch} 
        onReturnToLobby={handleReturnToLobby} 
      />

      <div className="fixed bottom-6 left-6 z-[250]">
        <RulebookButton onClick={() => setRulebookOpen(true)} />
      </div>
    </DndContext>
  );
}
