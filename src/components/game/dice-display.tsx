'use client';

import type { GamePhase, BetChoice } from '@/types';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

interface DiceDisplayProps {
  phase: GamePhase;
  countdown: number;
  dice: [number, number, number];
  result: BetChoice | null;
}

const DiceIcon = ({ value }: { value: number }) => {
  const dots = React.useMemo(() => {
    const baseClasses = 'absolute w-3 h-3 bg-white rounded-full';
    switch (value) {
      case 1:
        return [<div key="1" className={cn(baseClasses, 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2')}></div>];
      case 2:
        return [
          <div key="1" className={cn(baseClasses, 'top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="2" className={cn(baseClasses, 'bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2')}></div>
        ];
      case 3:
        return [
          <div key="1" className={cn(baseClasses, 'top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="2" className={cn(baseClasses, 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="3" className={cn(baseClasses, 'bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2')}></div>
        ];
      case 4:
        return [
          <div key="1" className={cn(baseClasses, 'top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="2" className={cn(baseClasses, 'top-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="3" className={cn(baseClasses, 'bottom-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="4" className={cn(baseClasses, 'bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2')}></div>
        ];
      case 5:
        return [
          <div key="1" className={cn(baseClasses, 'top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="2" className={cn(baseClasses, 'top-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="3" className={cn(baseClasses, 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="4" className={cn(baseClasses, 'bottom-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="5" className={cn(baseClasses, 'bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2')}></div>
        ];
      case 6:
        return [
          <div key="1" className={cn(baseClasses, 'top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="2" className={cn(baseClasses, 'top-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="3" className={cn(baseClasses, 'top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="4" className={cn(baseClasses, 'top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="5" className={cn(baseClasses, 'bottom-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2')}></div>,
          <div key="6" className={cn(baseClasses, 'bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2')}></div>
        ];
      default:
        return [];
    }
  }, [value]);

  return <div className="relative w-16 h-16 bg-primary rounded-lg shadow-lg">{dots}</div>;
};

export function DiceDisplay({ phase, countdown, dice, result }: DiceDisplayProps) {
  const sum = dice[0] + dice[1] + dice[2];
  const [rollingValues, setRollingValues] = useState<[number, number, number]>([1, 2, 3]);

  useEffect(() => {
    if (phase === 'rolling') {
      const intervalId = setInterval(() => {
        setRollingValues([
          Math.floor(Math.random() * 6) + 1 as number,
          Math.floor(Math.random() * 6) + 1 as number,
          Math.floor(Math.random() * 6) + 1 as number
        ]);
      }, 150);
      return () => clearInterval(intervalId);
    }
  }, [phase]);


  const renderContent = () => {
    switch (phase) {
      case 'betting':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-lg text-muted-foreground mb-4">Place your bets</div>
            <div className="text-7xl font-bold font-code animate-pulse-strong text-primary">{countdown}</div>
          </div>
        );
      case 'rolling':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-lg text-muted-foreground mb-4">Rolling...</div>
            <div className="flex gap-4">
              {rollingValues.map((value, i) => (
                <div key={i} className="animate-dice-spin">
                  <DiceIcon value={value} />
                </div>
              ))}
            </div>
          </div>
        );
      case 'result':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex gap-4 mb-4">
              {dice.map((d, i) => (
                <div key={i} className="animate-dice-land" style={{ animationDelay: `${i * 100}ms` }}>
                  <DiceIcon value={d} />
                </div>
              ))}
            </div>
            <div className="text-2xl font-bold font-code text-white">
              Total: {sum}
            </div>
            <div className={cn("text-6xl font-extrabold uppercase mt-2 text-gradient", {
              'text-primary': result === 'xiu',
              'text-yellow-400': result === 'tai',
            })}>
              {result}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative bg-card border rounded-lg aspect-video flex items-center justify-center overflow-hidden">
      {renderContent()}
    </div>
  );
}
