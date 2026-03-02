"use client";

import { TurnOrderOption } from "@/types/game";

interface TurnOrderSelectorProps {
  currentOption: TurnOrderOption;
  onSelect: (option: TurnOrderOption) => void;
  isHost: boolean;
}

export default function TurnOrderSelector({ currentOption, onSelect, isHost }: TurnOrderSelectorProps) {
  const options: { id: TurnOrderOption; label: string; description: string }[] = [
    { id: "HOST_FIRST", label: "先行", description: "ホストから開始します" },
    { id: "GUEST_FIRST", label: "後攻", description: "ゲストから開始します" },
    { id: "RANDOM", label: "ランダム", description: "システムがランダムに決定します" },
  ];

  if (!isHost) {
    return (
      <div className="flex flex-col gap-4 p-6 border-2 border-michibiki-black bg-white shadow-sm">
        <h2 className="text-xl font-black uppercase tracking-tighter">Turn Order</h2>
        <div className="flex flex-col gap-2">
          {currentOption === "UNSELECTED" ? (
            <div className="flex items-center gap-3 p-3 border-2 border-dashed border-michibiki-gray-dark text-michibiki-gray-dark animate-pulse">
              <p className="font-bold text-sm">ホストが選択中...</p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 font-black text-sm border-2 ${
                currentOption === "HOST_FIRST" ? "bg-michibiki-white border-michibiki-black" : 
                currentOption === "GUEST_FIRST" ? "bg-michibiki-black text-white border-michibiki-black" :
                "bg-michibiki-gray text-white border-michibiki-gray-dark"
              }`}>
                {currentOption === "HOST_FIRST" ? "後攻" : currentOption === "GUEST_FIRST" ? "先行" : "ランダム"}
              </div>
              <p className="text-xs font-bold text-michibiki-gray-dark">
                {currentOption === "HOST_FIRST" ? "あなたは後攻です" : 
                 currentOption === "GUEST_FIRST" ? "あなたは先行です" : 
                 "開始時に決定されます"}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6 border-2 border-michibiki-black bg-white shadow-sm">
      <h2 className="text-xl font-black uppercase tracking-tighter">Turn Order Selection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`flex flex-col items-center justify-center p-4 border-2 transition-all ${
              currentOption === opt.id
                ? "bg-michibiki-black text-white border-michibiki-black scale-[1.02]"
                : "bg-white text-michibiki-black border-michibiki-gray hover:border-michibiki-black"
            }`}
          >
            <span className={`text-lg font-black mb-1 px-3 py-1 border-2 transition-colors ${
              currentOption === opt.id 
                ? (opt.id === "HOST_FIRST" 
                    ? "bg-michibiki-black text-white border-michibiki-black border-solid" 
                    : opt.id === "GUEST_FIRST" 
                      ? "bg-white text-michibiki-black border-michibiki-black border-double border-4"
                      : "bg-michibiki-black text-white border-white border-dashed border-2")
                : (opt.id === "HOST_FIRST" 
                    ? "bg-white text-michibiki-black border-michibiki-gray border-solid opacity-50" 
                    : opt.id === "GUEST_FIRST"
                      ? "bg-white text-michibiki-black border-michibiki-gray border-double border-4 opacity-50"
                      : "bg-white text-michibiki-gray-dark border-michibiki-gray opacity-50")
            }`}>
              {opt.label}
            </span>
            <span className="text-[10px] font-bold text-center opacity-80 uppercase tracking-tighter">
              {opt.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
