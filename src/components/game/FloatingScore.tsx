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
      className="absolute top-0 right-0 z-50 pointer-events-none"
      style={{
        animation: `float-up-fade ${duration}ms forwards`,
      }}
    >
      <span className="text-xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        +{points}
      </span>
    </div>
  );
}
