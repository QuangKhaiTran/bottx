'use client';

import type { GamePhase, BetChoice } from '@/types';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

// SVG Dice Components
const DiceBase = ({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="26" height="26" rx="5" fill="currentColor" />
    {children}
  </svg>
);
const Dot = ({ cx, cy }: { cx: number, cy: number }) => <circle cx={cx} cy={cy} r={2.5} fill="#f0f0f0" />;

const DiceOneIcon = (props: any) => <DiceBase {...props}><Dot cx={16} cy={16} /></DiceBase>;
const DiceTwoIcon = (props: any) => <DiceBase {...props}><Dot cx={9} cy={9} /><Dot cx={23} cy={23} /></DiceBase>;
const DiceThreeIcon = (props: any) => <DiceBase {...props}><Dot cx={9} cy={9} /><Dot cx={16} cy={16} /><Dot cx={23} cy={23} /></DiceBase>;
const DiceFourIcon = (props: any) => <DiceBase {...props}><Dot cx={9} cy={9} /><Dot cx={9} cy={23} /><Dot cx={23} cy={9} /><Dot cx={23} cy={23} /></DiceBase>;
const DiceFiveIcon = (props: any) => <DiceBase {...props}><Dot cx={9} cy={9} /><Dot cx={9} cy={23} /><Dot cx={16} cy={16} /><Dot cx={23} cy={9} /><Dot cx={23} cy={23} /></DiceBase>;
const DiceSixIcon = (props: any) => <DiceBase {...props}><Dot cx={9} cy={9} /><Dot cx={9} cy={16} /><Dot cx={9} cy={23} /><Dot cx={23} cy={9} /><Dot cx={23} cy={16} /><Dot cx={23} cy={23} /></DiceBase>;

const Dice = ({ value, colorClass, className, style }: { value: number, colorClass: string, className?: string, style?: React.CSSProperties }) => {
    const finalClassName = `w-16 h-16 ${colorClass} ${className || ''}`;
    const diceComponents = [DiceOneIcon, DiceTwoIcon, DiceThreeIcon, DiceFourIcon, DiceFiveIcon, DiceSixIcon];
    const DiceComponent = diceComponents[value - 1];
    return DiceComponent ? <DiceComponent className={finalClassName} style={style} /> : null;
};


export function DiceDisplay({ phase, countdown, dice, result }: DiceDisplayProps) {
  const sum = dice[0] + dice[1] + dice[2];

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
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
          </div>
        );
      case 'result':
        const diceColorClass = result === 'tai' ? 'text-yellow-400' : 'text-primary';
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex gap-4 mb-4">
                 <Dice value={dice[0]} colorClass={diceColorClass} className="animate-dice-land" />
                 <Dice value={dice[1]} colorClass={diceColorClass} className="animate-dice-land" style={{ animationDelay: '0.1s' }} />
                 <Dice value={dice[2]} colorClass={diceColorClass} className="animate-dice-land" style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="text-2xl font-bold font-code text-white">
              Total: {sum}
            </div>
            <div className={cn("text-6xl font-extrabold uppercase mt-2 text-gradient", {
              'from-primary to-pink-700': result === 'xiu',
              'from-yellow-400 to-orange-500': result === 'tai',
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
