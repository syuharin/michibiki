"use client";

import { HelpCircle } from "lucide-react";

interface RulebookButtonProps {
  onClick: () => void;
}

export default function RulebookButton({ onClick }: RulebookButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-3 bg-white border-4 border-michibiki-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-michibiki-gray-light hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 group"
      title="Rulebook"
      aria-label="Open Rulebook"
    >
      <HelpCircle className="w-6 h-6 text-michibiki-black" />
      <span className="font-black italic tracking-tighter uppercase text-sm hidden sm:inline">Rules</span>
    </button>
  );
}
