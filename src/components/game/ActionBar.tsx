"use client";

import { RotateCw } from "lucide-react";

interface ActionBarProps {
  onRotate: () => void;
  isVisible: boolean;
}

export default function ActionBar({ onRotate, isVisible }: ActionBarProps) {
  if (!isVisible) return null;

  const handleRotate = () => {
    // Haptic feedback (vibration) for supported mobile devices
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
    onRotate();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={handleRotate}
        className="
          w-16 h-16 
          bg-michibiki-black text-white 
          border-4 border-white
          shadow-[4px_4px_0_0_rgba(0,0,0,1)]
          active:translate-y-1 active:translate-x-1 active:shadow-none
          transition-all
          flex items-center justify-center
          rounded-none
        "
        aria-label="Rotate Tile"
        title="Rotate Tile"
      >
        <RotateCw className="w-8 h-8" />
      </button>
    </div>
  );
}
