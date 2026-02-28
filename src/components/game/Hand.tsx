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
        : "w-full max-w-4xl border-t-2 flex-col p-4"
      } 
      bg-michibiki-white border-michibiki-black flex items-center gap-2
    `}>
      {!isVertical && (
        <h3 className="font-bold text-sm text-michibiki-gray-dark uppercase tracking-widest">
          Your Hand {isMyTurn ? "(Your Turn)" : "(Waiting...)"}
        </h3>
      )}
      <div className={`
        flex gap-4 min-h-[80px] items-center justify-center
        ${isVertical ? "flex-col !gap-0 !justify-start w-full" : ""}
      `}>
        {myHand.length > 0 ? (
          myHand.map((tile, index) => {
            // Calculate dynamic overlap: the more cards, the tighter the stack
            // Only start overlapping when space is actually needed
            const baseOverlap = isVertical && myHand.length > OVERLAP_THRESHOLD ? VERTICAL_BASE_OVERLAP : 0;
            const adaptiveOverlap = isVertical && myHand.length > ADAPTIVE_THRESHOLD 
              ? Math.min(MAX_OVERLAP, baseOverlap + (myHand.length - ADAPTIVE_THRESHOLD) * OVERLAP_STEP) 
              : baseOverlap;
            
            const overlapStyle = isVertical && index > 0 
              ? { marginTop: `-${adaptiveOverlap}px` } 
              : {};
            
            return (
              <Tile 
                key={tile.id} 
                tile={tile} 
                isDraggable={isMyTurn}
                onClick={() => isMyTurn && onRotate(tile.id)}
                style={overlapStyle}
                className={`
                  transition-all shadow-md z-0 hover:z-10
                  ${isVertical 
                    ? "hover:-translate-x-4 cursor-pointer" 
                    : "hover:scale-105"
                  }
                `} 
              />
            );
          })
        ) : (
          <p className="text-michibiki-gray italic py-4 text-center">No tiles</p>
        )}
      </div>
    </div>
  );
}
