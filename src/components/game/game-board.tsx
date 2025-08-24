'use client';

import { useGameEngine } from '@/hooks/use-game-engine';
import { useBotController } from '@/hooks/use-bot-controller';
import { DiceDisplay } from '@/components/game/dice-display';
import { BettingControls } from '@/components/game/betting-controls';
import { HistoryLog } from '@/components/game/history-log';
import { BotPanel } from '@/components/bot/bot-panel';
import { BotStats } from '@/components/bot/bot-stats';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, DollarSign, Construction } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Header } from '../layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PvPLobby } from '../pvp/pvp-lobby';


const ConfettiPiece = ({ id }: { id: number }) => {
    const [style, setStyle] = useState({});
  
    useEffect(() => {
      setStyle({
        left: `${Math.random() * 100}%`,
        backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
        animationDelay: `${Math.random() * 2}s`,
        transform: `rotate(${Math.random() * 360}deg)`,
      });
    }, []);
  
    return <div className="absolute top-0 w-3 h-5 animate-confetti-fall" style={style}></div>;
  };

const FlyingNumber = ({ amount, choice }: { amount: number, choice: 'tai' | 'xiu' }) => {
    return (
        <div className={cn(
            "absolute bottom-1/2 left-1/2 -translate-x-1/2 font-bold text-3xl animate-fly-up pointer-events-none",
            choice === 'tai' ? "text-yellow-400" : "text-primary"
            )}>
            +${amount.toFixed(2)}
        </div>
    );
};

export function GameBoard() {
  const { gameState, playerState, placeBet } = useGameEngine();
  const { botState, setBotState } = useBotController(gameState, placeBet);

  return (
    <div className="relative min-h-screen bg-background text-foreground p-4 overflow-hidden">
        {gameState.lastWin && <FlyingNumber amount={gameState.lastWin.amount} choice={gameState.lastWin.choice} />}
        {gameState.lastWin && Array.from({ length: 100 }).map((_, i) => <ConfettiPiece key={i} id={i} />)}
        
      <div className="max-w-7xl mx-auto space-y-4">
        <Tabs defaultValue="tai-xiu" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tai-xiu">Tài Xỉu (Bot)</TabsTrigger>
            <TabsTrigger value="pvp">Tài Xỉu (PvP)</TabsTrigger>
            <TabsTrigger value="chan-le">Chẵn Lẻ</TabsTrigger>
          </TabsList>
          <TabsContent value="tai-xiu">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4">
              <div className="lg:col-span-3 space-y-4">
                <DiceDisplay 
                  phase={gameState.phase}
                  countdown={gameState.countdown}
                  dice={gameState.dice}
                  result={gameState.result}
                />
                <BettingControls 
                  onPlaceBet={placeBet} 
                  isBettingPhase={gameState.phase === 'betting'}
                  balance={playerState.balance}
                />
              </div>
              <div className="lg:col-span-2 space-y-4">
                <BotPanel botState={botState} setBotState={setBotState} />
                <BotStats botState={botState} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4">
                 <div className="lg:col-span-3">
                    <HistoryLog history={gameState.history} />
                </div>
                 <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Session #{gameState.currentSession.id}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="grid grid-cols-2 gap-4 text-center">
                               <div>
                                    <h3 className="text-2xl font-bold text-primary">Xỉu</h3>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                       <Users className="w-4 h-4 text-muted-foreground"/> 
                                       <span className="font-code">{gameState.currentSession.xiuBettors}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mt-1">
                                       <DollarSign className="w-4 h-4 text-muted-foreground"/> 
                                       <span className="font-code text-green-400">{gameState.currentSession.xiuAmount.toFixed(2)}</span>
                                    </div>
                               </div>
                               <div>
                                    <h3 className="text-2xl font-bold text-yellow-400">Tài</h3>
                                     <div className="flex items-center justify-center gap-2 mt-2">
                                       <Users className="w-4 h-4 text-muted-foreground"/> 
                                       <span className="font-code">{gameState.currentSession.taiBettors}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mt-1">
                                       <DollarSign className="w-4 h-4 text-muted-foreground"/> 
                                       <span className="font-code text-green-400">{gameState.currentSession.taiAmount.toFixed(2)}</span>
                                    </div>
                               </div>
                           </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
          </TabsContent>
           <TabsContent value="pvp">
              <PvPLobby />
           </TabsContent>
          <TabsContent value="chan-le">
             <Card className="mt-4">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                        <Construction className="w-16 h-16 text-muted-foreground mb-4"/>
                        <h2 className="text-2xl font-bold">Chẵn Lẻ Game</h2>
                        <p className="text-muted-foreground">This game is currently under construction. Check back later!</p>
                    </div>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
