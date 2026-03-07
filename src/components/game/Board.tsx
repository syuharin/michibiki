"use client";

import { useDroppable } from "@dnd-kit/core";
import { useGame } from "@/context/GameContext";
import Tile from "./Tile";
import { FloatingScore } from "./FloatingScore";
import { Cell as CellType } from "@/types/game";
import { COLUMN_LABELS, ROW_LABELS } from "@/lib/constants/coordinates";

export default function Board() {
  const { state } = useGame();

  return (
    <div className="grid grid-cols-[1.5rem_1fr] grid-rows-[1.5rem_1fr] w-full max-w-[min(90vw,60vh)] gap-0.5 items-center mx-auto">
      {/* Top-Left Empty Space */}
      <div />
      
      {/* Top Column Labels (A-F) */}
      <div className="grid grid-cols-6 w-full h-full">
        {COLUMN_LABELS.map((label) => (
          <div 
            key={`col-label-${label}`} 
            className="flex items-center justify-center font-black text-[min(2.5vw,10px)] text-michibiki-gray-dark uppercase tracking-widest"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Left Row Labels (1-6) */}
      <div className="grid grid-rows-6 h-full w-full">
        {ROW_LABELS.map((label) => (
          <div 
            key={`row-label-${label}`} 
            className="flex items-center justify-end font-black text-[min(2.5vw,10px)] text-michibiki-gray-dark pr-1.5"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Actual 6x6 Game Board */}
      <div className="grid grid-cols-6 grid-rows-6 gap-0.5 bg-michibiki-black p-0.5 border-2 sm:border-4 border-michibiki-black shadow-2xl aspect-square">
        {state.board.map((row, y) =>
          row.map((cell, x) => (
            <CellComponent key={`${x}-${y}`} cell={cell} />
          ))
        )}
      </div>
    </div>
  );
}

function CellComponent({ cell }: { cell: CellType }) {
  const { state } = useGame();
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${cell.x}-${cell.y}`,
    data: { x: cell.x, y: cell.y },
  });

  // Find all effects that include this cell in their path and sum the points
  const activeEffects = state.effects.filter(e => 
    e.path.some(p => p.x === cell.x && p.y === cell.y)
  );

  return (
    <div 
      ref={setNodeRef}
      className={`bg-michibiki-white w-full h-full flex items-center justify-center relative ${isOver ? "bg-michibiki-gray text-white" : ""}`}
    >
      {cell.layers.length > 0 && (
        <Tile 
          tile={cell.layers[cell.layers.length - 1]} 
          isHighlighted={activeEffects.length > 0}
        />
      )}
      
      {activeEffects.map(effect => {
        // Count how many times this cell appears in the path to get per-tile contribution
        const contribution = effect.path.filter(p => p.x === cell.x && p.y === cell.y).length;
        if (contribution === 0) return null;
        
        return (
          <FloatingScore 
            key={`${effect.id}-${cell.x}-${cell.y}`}
            id={effect.id}
            points={contribution}
            duration={effect.duration}
          />
        );
      })}
    </div>
  );
}
