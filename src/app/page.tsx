"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    // Generate a random 6-character short code
    const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/room/${newId}?host=true`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-michibiki-white">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-6xl font-black tracking-tighter text-michibiki-black">
          みちびき
        </h1>
        <p className="text-xl text-michibiki-gray-dark">
          P2P サーバーレス・ボードゲーム
        </p>

        <div className="space-y-4 pt-8">
          <button
            onClick={createRoom}
            className="w-full py-4 bg-michibiki-black text-michibiki-white text-xl font-bold rounded-none border-b-4 border-michibiki-gray-dark hover:translate-y-1 hover:border-b-0 transition-all shadow-lg"
          >
            対戦室を作成する
          </button>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-michibiki-gray-light"></div>
            <span className="flex-shrink mx-4 text-michibiki-gray-dark text-sm">または</span>
            <div className="flex-grow border-t border-michibiki-gray-light"></div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="部屋IDを入力"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="flex-1 p-4 border-2 border-michibiki-black text-lg focus:outline-none focus:ring-2 ring-michibiki-gray"
            />
            <button
              onClick={() => roomId && router.push(`/room/${roomId}`)}
              className="px-6 bg-michibiki-gray-dark text-michibiki-white font-bold hover:bg-michibiki-black transition-colors"
            >
              参加
            </button>
          </div>
        </div>

        <div className="pt-12 text-sm text-michibiki-gray-dark">
          <p>© 2026 Michibiki Project. WCAG AA Compliant.</p>
        </div>
      </div>
    </main>
  );
}
