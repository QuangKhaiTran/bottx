'use client';

import { PvPLobby } from '@/components/pvp/pvp-lobby';
import { Header } from '@/components/layout/header';
import { useGameEngine } from '@/hooks/use-game-engine';

export default function PvPPage() {
  const { playerState } = useGameEngine(); // We might need player balance here too
  return (
    <>
      <Header balance={playerState.balance} />
      <div className="p-4">
        <PvPLobby />
      </div>
    </>
  );
}
