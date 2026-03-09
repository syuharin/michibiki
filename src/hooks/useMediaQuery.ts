"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to detect if a media query matches.
 * Useful for responsive logic in components.
 * 
 * @param query The media query to check (e.g., "(max-width: 640px)")
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Initial check
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);

    // Modern API with fallback for older browsers
    if (media.addEventListener) {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } else {
      // Deprecated but required for some older mobile browsers
      media.addListener(listener);
      return () => media.removeListener(listener);
    }

  }, [matches, query]);

  return matches;
}
