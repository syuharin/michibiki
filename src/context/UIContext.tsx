"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isRulebookOpen: boolean;
  setRulebookOpen: (open: boolean) => void;
  selectedTileId: string | null;
  setSelectedTileId: (id: string | null) => void;
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isRulebookOpen, setIsRulebookOpen] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);

  const setRulebookOpen = (open: boolean) => {
    // When opening rulebook, we could potentially close others if we had their state here
    setIsRulebookOpen(open);
  };

  return (
    <UIContext.Provider value={{ 
      isRulebookOpen, 
      setRulebookOpen,
      selectedTileId,
      setSelectedTileId
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
}
