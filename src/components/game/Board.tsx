"use client";

import { useDroppable } from "@dnd-kit/core";
import { useGame } from "@/context/GameContext";
import Tile from "./Tile";
import { Cell as CellType } from "@/types/game";

export default function Board() {
  const { state } = useGame();

  return (
    <div className="grid grid-cols-6 grid-rows-6 gap-1 bg-michibiki-black p-1 border-4 border-michibiki-black shadow-2xl aspect-square w-full max-w-[500px]">
      {state.board.map((row, y) =>
        row.map((cell, x) => (
          <CellComponent key={`${x}-${y}`} cell={cell} />
        ))
      )}
    </div>
  );
}

function CellComponent({ cell }: { cell: CellType }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${cell.x}-${cell.y}`,
    data: { x: cell.x, y: cell.y },
  });

  return (
    <div 
      ref={setNodeRef}
      className={`bg-michibiki-white w-full h-full flex items-center justify-center relative ${isOver ? "bg-michibiki-gray-light" : ""}`}
    >
      {cell.layers.length > 0 && (
        <Tile tile={cell.layers[cell.layers.length - 1]} />
      )}
      <span className="absolute bottom-0 left-0 text-[8px] text-michibiki-gray-light p-0.5">
        {cell.x},{cell.y}
      </span>
    </div>
  );
}
