'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { BotState, GameState, BetChoice, Strategy } from '@/types';
import { predictTaiXiu, type PredictTaiXiuOutput } from '@/ai/flows/predict-tai-xiu';
import { toast } from './use-toast';

const INITIAL_BOT_STATE: BotState = {
  isActive: false,
  strategy: 'ai',
  balance: 1000,
  initialBetAmount: 10,
  currentBetAmount: 10,
  stopLoss: 500,
  takeProfit: 1000,
  martingaleCount: 0,
  fibonacciIndex: 0,
  stats: {
    pnl: 0,
    winRate: 0,
    wins: 0,
    losses: 0,
    totalBets: 0,
  },
  aiPrediction: {
    isLoading: false,
    predictedOutcome: 'tai',
    confidenceScore: 0,
    reasoning: '',
  },
};

const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];

export const useBotController = (
  gameState: GameState,
  placeBet: (choice: BetChoice, amount: number) => boolean
) => {
  const [botState, setBotState] = useState<BotState>(INITIAL_BOT_STATE);
  const previousPhase = useRef<GameState['phase']>();
  const hasBetted = useRef(false);
  const lastBotBet = useRef<{ choice: BetChoice; amount: number } | null>(null);

  const updateBotStats = useCallback((isWin: boolean, amount: number) => {
    setBotState(prev => {
      const newWins = prev.stats.wins + (isWin ? 1 : 0);
      const newLosses = prev.stats.losses + (isWin ? 0 : 1);
      const totalBets = newWins + newLosses;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          pnl: prev.stats.pnl + (isWin ? amount : -amount),
          wins: newWins,
          losses: newLosses,
          totalBets,
          winRate: totalBets > 0 ? (newWins / totalBets) * 100 : 0,
        },
      };
    });
  }, []);

  const getAIPrediction = useCallback(async () => {
    setBotState(prev => ({ ...prev, aiPrediction: { ...prev.aiPrediction!, isLoading: true } }));
    try {
      const prediction = await predictTaiXiu({
        gameHistory: gameState.history.map(h => h.result).slice(0, 10).reverse(),
        currentTaiAmount: gameState.currentSession.taiAmount,
        currentXiuAmount: gameState.currentSession.xiuAmount,
        timeRemaining: gameState.countdown,
      });
      setBotState(prev => ({ ...prev, aiPrediction: { ...prediction, isLoading: false } }));
      return prediction;
    } catch (error) {
      console.error("AI Prediction Error:", error);
      toast({ title: 'AI Error', description: 'Could not get prediction from AI.', variant: 'destructive' });
      setBotState(prev => ({ ...prev, aiPrediction: { ...INITIAL_BOT_STATE.aiPrediction!, isLoading: false } }));
      return null;
    }
  }, [gameState]);

  useEffect(() => {
    if (!botState.isActive) return;

    // On new round start
    if (gameState.phase === 'betting' && previousPhase.current !== 'betting') {
      hasBetted.current = false;
      lastBotBet.current = null;
      
      const decideAndPlaceBet = async () => {
        if(hasBetted.current) return;

        let choice: BetChoice | null = null;
        let betAmount = botState.currentBetAmount;

        // Stop-loss / Take-profit checks
        if(botState.stats.pnl <= -botState.stopLoss || botState.stats.pnl >= botState.takeProfit) {
            setBotState(prev => ({ ...prev, isActive: false }));
            toast({ title: "Bot Deactivated", description: "Stop-loss or take-profit limit reached." });
            return;
        }
        
        switch (botState.strategy) {
          case 'ai':
            const prediction = await getAIPrediction();
            choice = prediction?.predictedOutcome ?? null;
            break;
          case 'martingale':
          case 'fibonacci':
          case 'fixed':
            choice = Math.random() > 0.5 ? 'tai' : 'xiu'; // Random choice for non-analytical strategies
            break;
          case 'follow-trend':
            choice = gameState.history.length > 0 ? gameState.history[0].result : (Math.random() > 0.5 ? 'tai' : 'xiu');
            break;
          case 'anti-trend':
            choice = gameState.history.length > 0 ? (gameState.history[0].result === 'tai' ? 'xiu' : 'tai') : (Math.random() > 0.5 ? 'tai' : 'xiu');
            break;
        }

        if (choice && betAmount > 0 && betAmount <= botState.balance && !hasBetted.current) {
          const success = placeBet(choice, betAmount);
          if(success) {
            hasBetted.current = true;
            lastBotBet.current = { choice, amount: betAmount };
            // Deduct from bot's internal balance for UI feedback
            setBotState(prev => ({ ...prev, balance: prev.balance - betAmount }));
          }
        }
      };

      // Bet near the end of the timer for more accurate data for AI
      const betTimeout = gameState.countdown > 5 ? (botState.strategy === 'ai' ? 3000 : 1000) : 1000;
      const timeoutId = setTimeout(decideAndPlaceBet, (gameState.countdown * 1000) - betTimeout);
      
      return () => clearTimeout(timeoutId);
    }
    
    // On result phase
    if (gameState.phase === 'result' && previousPhase.current === 'rolling' && hasBetted.current && lastBotBet.current) {
        const { choice, amount } = lastBotBet.current;
        const isWin = gameState.result === choice;

        updateBotStats(isWin, amount);

        // Update balance and bet amount for next round
        setBotState(prev => {
            let nextBet = prev.initialBetAmount;
            let nextMartingaleCount = prev.martingaleCount;
            let nextFibIndex = prev.fibonacciIndex;
            const newBalance = prev.balance + (isWin ? amount * 2 : 0);

            if (isWin) {
                nextMartingaleCount = 0;
                nextFibIndex = 0;
            } else { // Loss
                switch(prev.strategy) {
                    case 'martingale':
                        nextMartingaleCount++;
                        nextBet = prev.initialBetAmount * Math.pow(2, nextMartingaleCount);
                        break;
                    case 'fibonacci':
                        nextFibIndex = Math.min(prev.fibonacciIndex + 1, fibonacci.length - 1);
                        nextBet = prev.initialBetAmount * fibonacci[nextFibIndex];
                        break;
                }
            }
            return {
                ...prev,
                balance: newBalance,
                currentBetAmount: nextBet,
                martingaleCount: nextMartingaleCount,
                fibonacciIndex: nextFibIndex
            };
        });
        hasBetted.current = false; // Reset for next round
    }

    previousPhase.current = gameState.phase;

  }, [gameState, botState, placeBet, updateBotStats, getAIPrediction]);

  return { botState, setBotState };
};
