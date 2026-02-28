"use client";

import { useSearchParams } from "next/navigation";
import { GameProvider } from "@/context/GameContext";
import GameContainer from "@/components/game/GameContainer";

export default function RoomPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const isHost = searchParams.get("host") === "true";
  const roomId = params.id;

  // We need a unique PeerID for the user. 
  // For the host, we use the roomId itself as the ID to allow guest to connect.
  // For the guest, PeerJS will assign a random ID.
  
  return (
    <GameProvider initialRoomId={roomId} hostPeerId={roomId}>
      <GameContainer roomId={roomId} isHost={isHost} />
    </GameProvider>
  );
}
