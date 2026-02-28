"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Tile as TileType } from "@/types/game";
import { useGame } from "@/context/GameContext";

interface TileProps {
  tile: TileType;
  isDraggable?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function Tile({ tile, isDraggable, onClick, className = "", style }: TileProps) {
  const { state } = useGame();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tile.id,
    disabled: !isDraggable,
    data: tile,
  });

  const draggableStyle = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    zIndex: isDragging ? 100 : undefined,
    touchAction: isDraggable ? "none" : "auto" as const,
    ...style,
  };

  const contentStyle = {
    rotate: `${tile.rotation}deg`,
  };

  const isOwnerHost = tile.ownerId === state.hostPeerId;

  return (
    <div 
      ref={setNodeRef}
      style={draggableStyle}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`relative w-16 h-16 bg-white border border-michibiki-gray-light flex items-center justify-center cursor-pointer transition-[border,background] ${className} ${isDraggable ? "hover:border-michibiki-black" : ""} ${tile.isReversal && tile.turnsLeft === 1 ? "reversal-pulse border-red-500 border-2" : ""} ${isDragging ? "opacity-0" : "shadow-md"}`}
    >
      <div style={contentStyle} className="w-full h-full flex items-center justify-center transition-transform duration-200">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <TileSVGContent type={tile.type} isHost={isOwnerHost} />
        </svg>
      </div>
      {tile.isReversal && (
        <div className="absolute top-0 right-0 bg-michibiki-black text-white text-[10px] px-1 rounded-bl font-mono">
          {tile.turnsLeft}
        </div>
      )}
    </div>
  );
}

function TileSVGContent({ type, isHost }: { type: string, isHost: boolean }) {
  const stroke = isHost ? "black" : "#64748B";
  const strokeWidth = 10;

  const renderLine = (x1: number, y1: number, x2: number, y2: number) => (
    <>
      {/* Base stroke */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Double line effect for Guest (white core) */}
      {!isHost && (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={strokeWidth / 2} strokeLinecap="round" />
      )}
    </>
  );

  const renderCorner = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    // Simplified corner using two lines for now to ensure connectivity logic clarity
    // In a final version, this would be an SVG <path> arc
    if (cx === 0 && cy === 0) return <>{renderLine(0, 50, 50, 50)}{renderLine(50, 0, 50, 50)}</>; // LU
    if (cx === 100 && cy === 0) return <>{renderLine(100, 50, 50, 50)}{renderLine(50, 0, 50, 50)}</>; // RU
    if (cx === 0 && cy === 100) return <>{renderLine(0, 50, 50, 50)}{renderLine(50, 100, 50, 50)}</>; // LD
    return <>{renderLine(100, 50, 50, 50)}{renderLine(50, 100, 50, 50)}</>; // RD
  };

  switch (type) {
    case "STRAIGHT":
    case "VERTICAL":
      // Since the div container handles rotation, we only need one base orientation
      return renderLine(0, 50, 100, 50);
    case "CORNER":
      return renderCorner(0, 0, 50, 0, 0); // Default corner shape
    case "T":
      return <>{renderLine(0, 50, 100, 50)}{renderLine(50, 50, 50, 0)}</>;
    case "X":
      return <>{renderLine(0, 50, 100, 50)}{renderLine(50, 0, 50, 100)}</>;
    default:
      return <circle cx="50" cy="50" r="10" fill={stroke} />;
  }
}
