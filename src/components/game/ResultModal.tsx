"use client";

import { useGame } from "@/context/GameContext";
import { Trophy, Handshake, LogOut, RotateCcw } from "lucide-react";
import { useUI } from "@/context/UIContext";

interface ResultModalProps {
  isHost: boolean;
  onRematch: () => void;
  onReturnToLobby: () => void;
}

export default function ResultModal({ isHost, onRematch, onReturnToLobby }: ResultModalProps) {
  const { state } = useGame();
  const { isRulebookOpen } = useUI();
  
  if (state.status !== "FINISHED" && state.status !== "REMATCH_WAITING") return null;
  if (isRulebookOpen) return null;

  const myPeerId = isHost ? state.hostPeerId : state.guestPeerId;
  const isWinner = state.winnerId === myPeerId;
  const isDraw = state.winnerId === "DRAW";
  
  const hostScore = state.scores[state.hostPeerId] || 0;
  const guestScore = state.guestPeerId ? (state.scores[state.guestPeerId] || 0) : 0;

  const myScore = isHost ? hostScore : guestScore;
  const opponentScore = isHost ? guestScore : hostScore;

  const isReady = state.rematchReady[myPeerId || ""] || false;
  const opponentPeerId = isHost ? state.guestPeerId : state.hostPeerId;
  const opponentReady = opponentPeerId ? (state.rematchReady[opponentPeerId] || false) : false;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-michibiki-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white border-4 border-michibiki-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-8 flex flex-col items-center gap-8 animate-in zoom-in-95 duration-300">
        
        {/* Result Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          {isDraw ? (
            <>
              <Handshake className="w-16 h-16 text-michibiki-black" />
              <h2 className="text-4xl font-black italic tracking-tighter uppercase">Draw</h2>
            </>
          ) : isWinner ? (
            <>
              <Trophy className="w-16 h-16 text-michibiki-black" />
              <h2 className="text-4xl font-black italic tracking-tighter uppercase">Victory</h2>
              <p className="text-xs font-bold text-michibiki-gray-dark uppercase">Congratulations!</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 border-4 border-michibiki-black rounded-none flex items-center justify-center grayscale">
                <span className="text-4xl font-black">!</span>
              </div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase text-michibiki-black">Defeat</h2>
              <p className="text-xs font-bold text-michibiki-gray-dark uppercase">Better luck next time</p>
            </>
          )}
        </div>

        {/* Scores */}
        <div className="w-full grid grid-cols-2 gap-4 border-y-2 border-michibiki-black py-6">
          <div className="flex flex-col items-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-michibiki-gray-dark">You</p>
            <p className="text-3xl font-black tabular-nums">{myScore}</p>
          </div>
          <div className="flex flex-col items-center border-l-2 border-michibiki-black">
            <p className="text-[10px] font-bold uppercase tracking-widest text-michibiki-gray-dark">Opponent</p>
            <p className="text-3xl font-black tabular-nums">{opponentScore}</p>
          </div>
        </div>

        {/* Rematch Status */}
        {(isReady || opponentReady) && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black text-michibiki-gray-dark uppercase tracking-widest">Rematch Readiness</p>
            <div className="flex gap-3">
              <div className={`px-3 py-1 text-[10px] font-black border-2 transition-colors ${isReady ? "bg-michibiki-black text-white border-michibiki-black" : "border-michibiki-gray text-michibiki-gray-dark"}`}>
                YOU: {isReady ? "READY" : "WAITING"}
              </div>
              <div className={`px-3 py-1 text-[10px] font-black border-2 transition-colors ${opponentReady ? "bg-michibiki-black text-white border-michibiki-black" : "border-michibiki-gray text-michibiki-gray-dark"}`}>
                OPPONENT: {opponentReady ? "READY" : "WAITING"}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onRematch}
            disabled={isReady}
            className={`w-full py-4 flex items-center justify-center gap-3 font-black text-xl transition-all shadow-[0_4px_0_rgb(51,65,85)] active:translate-y-1 active:shadow-none ${
              isReady 
                ? "bg-michibiki-gray text-michibiki-gray-dark cursor-not-allowed opacity-50 shadow-none translate-y-1" 
                : "bg-michibiki-black text-white hover:bg-michibiki-gray-dark"
            }`}
          >
            <RotateCcw className={`w-6 h-6 ${isReady ? "animate-[spin_3s_linear_infinite]" : ""}`} />
            {isReady ? "Waiting for Opponent..." : "Rematch"}
          </button>
          
          <button
            onClick={onReturnToLobby}
            className="w-full py-3 flex items-center justify-center gap-2 font-bold text-michibiki-black border-2 border-michibiki-black hover:bg-michibiki-black hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Return to Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
