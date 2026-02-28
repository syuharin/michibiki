"use client";

import { Layers } from "lucide-react";

interface DeckProps {
  count: number;
}

export default function Deck({ count }: DeckProps) {
  return (
    <div className={`relative flex flex-col items-center justify-center p-2 border-2 border-michibiki-black bg-white transition-opacity ${count === 0 ? "opacity-50" : "opacity-100"}`}>
      <Layers className="w-8 h-8 text-michibiki-black" />
      <div className="absolute -top-2 -right-2 bg-michibiki-black text-michibiki-white text-[10px] font-black px-1.5 py-0.5 min-w-[20px] text-center rounded-full border border-michibiki-white shadow-sm">
        {count}
      </div>
      <p className="text-[8px] font-bold uppercase tracking-widest text-michibiki-gray mt-1">Deck</p>
    </div>
  );
}
