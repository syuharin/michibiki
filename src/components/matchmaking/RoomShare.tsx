"use client";

import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function RoomShare({ roomId }: { roomId: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/room/${roomId}`);
  }, [roomId]);

  const copyToClipboard = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white border-2 border-michibiki-black rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold">部屋をシェアする</h2>
      
      <div className="bg-white p-4 border border-michibiki-gray-light rounded">
        <QRCodeSVG value={url} size={200} marginSize={2} />
      </div>

      <div className="flex items-center gap-2 w-full max-w-sm">
        <input 
          readOnly 
          value={url} 
          className="flex-1 p-2 text-sm border border-michibiki-gray-dark rounded bg-michibiki-white overflow-hidden text-ellipsis text-michibiki-black"
        />
        <button 
          onClick={copyToClipboard}
          className="p-2 bg-michibiki-black text-michibiki-white rounded hover:bg-michibiki-gray-dark transition-colors"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
      </div>
      
      <p className="text-sm text-michibiki-gray-dark italic">
        対戦相手にこのURLを共有するか、QRコードをスキャンしてもらってください。
      </p>
    </div>
  );
}
