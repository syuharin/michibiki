"use client";

import React, { useEffect } from "react";
import { useGame } from "@/context/GameContext";

interface FloatingScoreProps {
  id: string;
  points: number;
  duration: number;
}

export function FloatingScore({ id, points, duration }: FloatingScoreProps) {
  const { dispatch } = useGame();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "REMOVE_SCORE_EFFECT", effectId: id });
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, dispatch]);

  return (
    <div 
      className="absolute -top-2 -right-2 z-50 pointer-events-none"
      style={{
        animation: `float-up-fade ${duration}ms ease-out forwards`,
      }}
    >
      <span 
        className="text-3xl font-black text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
        style={{
          WebkitTextStroke: "1px rgba(0,0,0,0.5)"
        }}
      >
        +{points}
      </span>
    </div>
  );
}
