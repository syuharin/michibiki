"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { X } from "lucide-react";
import { fetchRulebook } from "@/lib/game/rules";

interface RulebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RulebookModal({ isOpen, onClose }: RulebookModalProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      fetchRulebook()
        .then((c) => {
          if (isMounted) setContent(c);
        })
        .catch((err) => {
          if (isMounted) setError(err.message);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-michibiki-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white border-4 border-michibiki-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col h-[85vh] sm:h-auto sm:max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b-4 border-michibiki-black bg-michibiki-black text-white">
          <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase">Rulebook</h2>
          <button 
            onClick={onClose}
            className="p-2 sm:p-1 hover:bg-michibiki-gray-dark transition-colors"
            aria-label="Close"
          >
            <X className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-michibiki-black scrollbar-track-michibiki-gray-light">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-michibiki-black border-t-transparent animate-spin"></div>
              <p className="font-black italic uppercase tracking-tighter">Loading Rules...</p>
            </div>
          ) : error ? (
            <div className="text-red-600 font-bold p-4 border-2 border-red-600 bg-red-50">
              Error: {error}
            </div>
          ) : (
            <div className="rulebook-markdown prose prose-slate prose-sm sm:prose-base max-w-none prose-headings:font-black prose-headings:italic prose-headings:tracking-tighter prose-headings:uppercase prose-strong:font-black">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-black italic tracking-tighter uppercase border-b-4 border-michibiki-black pb-2 mb-6" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-black italic tracking-tighter uppercase mt-8 mb-4 border-l-4 border-michibiki-black pl-3" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-black text-michibiki-black" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4" {...props} />,
                  li: ({ node, ...props }) => <li className="font-medium" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-4 border-michibiki-black flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-michibiki-black text-white font-bold hover:bg-michibiki-gray-dark transition-all shadow-[0_4px_0_rgb(51,65,85)] active:translate-y-1 active:shadow-none"
          >
            閉じる (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
