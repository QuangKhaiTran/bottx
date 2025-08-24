'use client';

import type { BotState } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Percent, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BotStatsProps {
  botState: BotState;
}

const StatCard = ({ icon, title, value, valueClass }: { icon: React.ReactNode, title: string, value: string, valueClass?: string }) => (
  <div className="bg-secondary p-3 rounded-lg flex items-center gap-3">
    <div className="text-accent">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={cn("text-lg font-bold font-code", valueClass)}>{value}</p>
    </div>
  </div>
);

export function BotStats({ botState }: BotStatsProps) {
  const { pnl, winRate, wins, losses, totalBets } = botState.stats;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Bot Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <StatCard
          icon={pnl >= 0 ? <TrendingUp /> : <TrendingDown />}
          title="P&L"
          value={`${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`}
          valueClass={cn({ 'text-green-400': pnl >= 0, 'text-red-400': pnl < 0 })}
        />
        <StatCard
          icon={<Percent />}
          title="Win Rate"
          value={`${winRate.toFixed(2)}%`}
        />
        <StatCard
          icon={<Hash />}
          title="Total Bets"
          value={String(totalBets)}
        />
        <div className="bg-secondary p-3 rounded-lg flex items-center gap-3">
            <div>
                <p className="text-sm text-muted-foreground">W / L</p>
                <p className="text-lg font-bold font-code">
                    <span className='text-green-400'>{wins}</span> / <span className='text-red-400'>{losses}</span>
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
