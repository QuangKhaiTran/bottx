'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BetChoice } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface BettingControlsProps {
  onPlaceBet: (choice: BetChoice, amount: number) => void;
  isBettingPhase: boolean;
  balance: number;
}

export function BettingControls({ onPlaceBet, isBettingPhase, balance }: BettingControlsProps) {
  const [amount, setAmount] = useState(10);
  const [choice, setChoice] = useState<BetChoice | null>(null);

  const handlePlaceBet = () => {
    if (!choice) {
      toast({ title: "Error", description: "Please select Tài or Xỉu.", variant: "destructive" });
      return;
    }
    if (amount <= 0) {
      toast({ title: "Error", description: "Bet amount must be positive.", variant: "destructive" });
      return;
    }
    if (amount > balance) {
        toast({ title: "Error", description: "Insufficient balance.", variant: "destructive" });
        return;
    }
    onPlaceBet(choice, amount);
  };
  
  const quickBetMultipliers = [0.1, 0.25, 0.5, 1];

  return (
    <div className="bg-card border rounded-lg p-4 mt-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button
          onClick={() => setChoice('xiu')}
          className={cn(
            'h-24 text-4xl font-extrabold uppercase transition-all duration-300 transform hover:scale-105',
            'bg-gradient-to-br from-primary to-pink-700 text-white',
            choice === 'xiu' ? 'ring-4 ring-offset-2 ring-offset-background ring-primary' : ''
          )}
          disabled={!isBettingPhase}
        >
          Xỉu
          <span className="text-sm block font-normal lowercase">(Small 4-10)</span>
        </Button>
        <Button
          onClick={() => setChoice('tai')}
          className={cn(
            'h-24 text-4xl font-extrabold uppercase transition-all duration-300 transform hover:scale-105',
            'bg-gradient-to-br from-yellow-400 to-orange-500 text-background',
            choice === 'tai' ? 'ring-4 ring-offset-2 ring-offset-background ring-yellow-400' : ''
          )}
          disabled={!isBettingPhase}
        >
          Tài
          <span className="text-sm block font-normal lowercase">(Big 11-17)</span>
        </Button>
      </div>
      <div className="flex gap-2 items-center mb-4">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Bet amount"
          className="font-code text-lg"
          disabled={!isBettingPhase}
        />
        <Button onClick={() => setAmount(prev => prev * 2)} variant="secondary" disabled={!isBettingPhase}>x2</Button>
        <Button onClick={() => setAmount(prev => Math.max(1, Math.floor(prev / 2)))} variant="secondary" disabled={!isBettingPhase}>/2</Button>
      </div>
      <div className="flex gap-2 justify-center mb-4">
        {quickBetMultipliers.map(m => (
            <Button key={m} variant="outline" size="sm" onClick={() => setAmount(balance * m)} disabled={!isBettingPhase}>
                {m * 100}%
            </Button>
        ))}
      </div>
      <Button onClick={handlePlaceBet} className="w-full h-12 text-lg font-bold bg-accent" disabled={!isBettingPhase}>
        Place Bet
      </Button>
    </div>
  );
}
