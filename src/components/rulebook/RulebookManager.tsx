"use client";

import { useUI } from "@/context/UIContext";
import RulebookModal from "@/components/rulebook/RulebookModal";

export default function RulebookManager() {
  const { isRulebookOpen, setRulebookOpen } = useUI();

  return (
    <RulebookModal 
      isOpen={isRulebookOpen} 
      onClose={() => setRulebookOpen(false)} 
    />
  );
}
