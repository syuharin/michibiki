"use client";

import { useDraggable } from "@dnd-kit/core";
import { Tile as TileType, ConnectionPoint } from "@/types/game";
import { TILE_CONNECTIONS } from "@/lib/constants/tiles";

interface TileProps {
  tile: TileType;
  isDraggable?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Tile({ tile, isDraggable, onClick, className = "" }: TileProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: tile.id,
    disabled: !isDraggable,
    data: tile,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined;

  const rotationClasses = {
    0: "rotate-0",
    90: "rotate-90",
    180: "rotate-180",
    270: "rotate-270",
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`relative w-16 h-16 bg-white border border-michibiki-gray-light flex items-center justify-center cursor-pointer transition-transform ${rotationClasses[tile.rotation]} ${className} ${isDraggable ? "hover:border-michibiki-black" : ""} ${tile.isReversal && tile.turnsLeft === 1 ? "reversal-pulse border-red-500 border-2" : ""}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Render connections based on tile type */}
        <TileSVGContent type={tile.type} ownerId={tile.ownerId} />
      </svg>
      {tile.isReversal && (
        <div className="absolute top-0 right-0 bg-michibiki-black text-white text-[10px] px-1 rounded-bl">
          {tile.turnsLeft}
        </div>
      )}
    </div>
  );
}

function TileSVGContent({ type, ownerId }: { type: string, ownerId: string }) {
  // In a real impl, we'd check if ownerId === hostPeerId
  const isHost = true; 
  const stroke = isHost ? "black" : "#64748B";
  const strokeWidth = 8;

  const renderLine = (x1: number, y1: number, x2: number, y2: number) => (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
      {!isHost && (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={strokeWidth / 2} strokeLinecap="round" />
      )}
    </>
  );

  switch (type) {
    case "STRAIGHT":
      return renderLine(0, 50, 100, 50);
    case "VERTICAL":
      return renderLine(50, 0, 50, 100);
    // Add more types as defined in constants
    default:
      return <circle cx="50" cy="50" r="10" fill={stroke} />;
  }
}
