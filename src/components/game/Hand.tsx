"use client";

import { useGame } from "@/context/GameContext";
import Tile from "./Tile";

export default function Hand({ peerId, isMyTurn }: { peerId: string; isMyTurn: boolean }) {
  const { state } = useGame();
  const myHand = state.hands[peerId] || [];

  return (
    <div className="w-full max-w-4xl bg-michibiki-white border-t-2 border-michibiki-black p-4 flex flex-col items-center gap-2">
      <h3 className="font-bold text-sm text-michibiki-gray-dark uppercase tracking-widest">
        Your Hand {isMyTurn ? "(Your Turn)" : "(Waiting...)"}
      </h3>
      <div className="flex gap-4 min-h-[80px] items-center justify-center">
        {myHand.length > 0 ? (
          myHand.map((tile) => (
            <Tile 
              key={tile.id} 
              tile={tile} 
              isDraggable={isMyTurn}
              className="hover:scale-105 transition-transform shadow-md" 
            />
          ))
        ) : (
          <p className="text-michibiki-gray italic py-4">No tiles in hand</p>
        )}
      </div>
    </div>
  );
}
