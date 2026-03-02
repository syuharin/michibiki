"use client";

import { useGame } from "@/context/GameContext";
import Tile from "./Tile";

// Layout constants for vertical hand
const VERTICAL_BASE_OVERLAP = 40;
const OVERLAP_THRESHOLD = 5;
const ADAPTIVE_THRESHOLD = 6;
const MAX_OVERLAP = 52;
const OVERLAP_STEP = 4;

export default function Hand({ 
  peerId, 
  isMyTurn, 
  onRotate,
  layout = "bottom"
}: { 
  peerId: string; 
  isMyTurn: boolean; 
  onRotate: (tileId: string) => void;
  layout?: "bottom" | "right";
}) {
  const { state } = useGame();
  const myHand = state.hands[peerId] || [];

  const isVertical = layout === "right";

  return (
    <div className={`
      ${isVertical 
        ? "h-full w-full border-l-2 flex-col pt-4 px-2 overflow-y-auto overflow-x-hidden" 
        : "w-full max-w-4xl border-t-2 flex-col p-2 sm:p-4"
      } 
      bg-michibiki-white border-michibiki-black flex items-center gap-2 transition-all duration-300 relative
    `}>
      {!isVertical && (
        <h3 className="font-black text-[10px] sm:text-xs text-michibiki-gray-dark uppercase tracking-widest flex items-center gap-2 mb-1">
          Your Hand 
          <span className={`px-2 py-0.5 rounded-full text-[8px] ${isMyTurn ? "bg-michibiki-black text-white" : "bg-michibiki-gray text-michibiki-white"}`}>
            {isMyTurn ? "YOUR TURN" : "WAITING"}
          </span>
        </h3>
      )}

      {isVertical && (
        <h3 className="font-bold text-xs text-michibiki-gray-dark uppercase tracking-widest mb-4">
          Hand
        </h3>
      )}

      <div className={`
        flex gap-3 sm:gap-4 items-center justify-center transition-all duration-300 origin-bottom
        ${isVertical ? "flex-col !gap-0 !justify-start w-full" : ""}
        min-h-[60px] sm:min-h-[80px] h-auto opacity-100 scale-y-100
      `}>
        {myHand.length > 0 ? (
          myHand.map((tile, index) => {
            // Calculate dynamic overlap: the more cards, the tighter the stack
            const baseOverlap = isVertical && myHand.length > OVERLAP_THRESHOLD ? VERTICAL_BASE_OVERLAP : 0;
            const adaptiveOverlap = isVertical && myHand.length > ADAPTIVE_THRESHOLD 
              ? Math.min(MAX_OVERLAP, baseOverlap + (myHand.length - ADAPTIVE_THRESHOLD) * OVERLAP_STEP) 
              : baseOverlap;
            
            const overlapStyle = isVertical && index > 0
              ? { marginTop: `-${adaptiveOverlap}px` }
              : {};

            return (
              <div key={tile.id} style={overlapStyle} className="w-12 h-12 sm:w-16 sm:h-16 shrink-0">
                <Tile 
                  tile={tile} 
                  isDraggable={isMyTurn}
                  onClick={() => isMyTurn && onRotate(tile.id)}
                  className={`
                    transition-all shadow-md z-0 hover:z-10
                    ${isVertical 
                      ? "hover:-translate-x-4 cursor-pointer" 
                      : "hover:scale-105"
                    }
                  `} 
                />
              </div>
            );

          })
        ) : (
          <p className="text-michibiki-gray-dark italic py-2 text-center text-xs">No tiles</p>
        )}
      </div>
    </div>
  );
}
