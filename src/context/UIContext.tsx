"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isRulebookOpen: boolean;
  setRulebookOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isRulebookOpen, setIsRulebookOpen] = useState(false);

  const setRulebookOpen = (open: boolean) => {
    // When opening rulebook, we could potentially close others if we had their state here
    setIsRulebookOpen(open);
  };

  return (
    <UIContext.Provider value={{ isRulebookOpen, setRulebookOpen }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
}
