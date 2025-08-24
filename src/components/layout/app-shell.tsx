'use client';

import { useGameEngine } from '@/hooks/use-game-engine';
import { BottomNavigation } from './bottom-navigation';
import { Header } from './header';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { playerState } = useGameEngine();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Header balance={playerState.balance} />
      </div>
      <main className="flex-1 pb-20">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
