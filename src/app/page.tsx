'use client';

import { GameBoard } from '@/components/game/game-board';
import { Header } from '@/components/layout/header';
import { useGameEngine } from '@/hooks/use-game-engine';

export default function Home() {
  const { playerState } = useGameEngine();
  return (
    <>
      <Header balance={playerState.balance} />
      <GameBoard />
    </>
  );
}
