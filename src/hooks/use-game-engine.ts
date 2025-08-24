'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, PlayerState, PlayerBet, HistoryItem, BetChoice } from '@/types';
import { toast } from './use-toast';

const BETTING_TIME = 30;
const ROLLING_TIME = 3;
const RESULT_TIME = 5;

const INITIAL_GAME_STATE: GameState = {
  phase: 'betting',
  countdown: BETTING_TIME,
  history: [],
  currentSession: {
    id: 1,
    taiAmount: 0,
    xiuAmount: 0,
    taiBettors: 0,
    xiuBettors: 0,
  },
  dice: [1, 1, 1],
  result: null,
  lastWin: null,
};

const INITIAL_PLAYER_STATE: PlayerState = {
  balance: 1000,
  pnl: 0,
};

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_PLAYER_STATE);
  const [playerBet, setPlayerBet] = useState<PlayerBet | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startNextRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'betting',
      countdown: BETTING_TIME,
      currentSession: {
        id: prev.currentSession.id + 1,
        taiAmount: 0,
        xiuAmount: 0,
        taiBettors: 0,
        xiuBettors: 0,
      },
      dice: [1, 1, 1],
      result: null,
    }));
    setPlayerBet(null);
  }, []);

  const handleRoll = useCallback(() => {
    const dice: [number, number, number] = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
    const sum = dice[0] + dice[1] + dice[2];
    const result: BetChoice = sum >= 4 && sum <= 10 ? 'xiu' : 'tai';

    setGameState(prev => ({
      ...prev,
      phase: 'result',
      countdown: RESULT_TIME,
      dice,
      result,
      history: [{ id: prev.currentSession.id, result, dice }, ...prev.history].slice(0, 50),
    }));

    // Calculate P/L
    if (playerBet) {
      const isWin = playerBet.choice === result;
      const pnlChange = isWin ? playerBet.amount : -playerBet.amount;
      
      setPlayerState(prev => ({
        ...prev,
        balance: prev.balance + (isWin ? playerBet.amount * 2 : 0),
        pnl: prev.pnl + pnlChange,
      }));

      if(isWin) {
          setGameState(prev => ({ ...prev, lastWin: { choice: playerBet.choice, amount: playerBet.amount }}));
          setTimeout(() => setGameState(prev => ({ ...prev, lastWin: null})), 2000);
      }
    }
  }, [playerBet]);

  useEffect(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.countdown > 1) {
          return { ...prev, countdown: prev.countdown - 1 };
        }

        // Countdown finished, transition to next phase
        switch (prev.phase) {
          case 'betting':
            return { ...prev, phase: 'rolling', countdown: ROLLING_TIME };
          case 'rolling':
            handleRoll();
            // handleRoll sets the next state, so we just return the current one
            return prev;
          case 'result':
            startNextRound();
            return prev; // startNextRound will trigger a re-render
        }
        return prev;
      });
    }, 1000);

    return () => clearTimer();
  }, [gameState.phase, handleRoll, startNextRound]);

  const placeBet = useCallback((choice: BetChoice, amount: number) => {
    if (gameState.phase !== 'betting') {
      toast({ title: 'Error', description: 'Can only bet during the betting phase.', variant: 'destructive' });
      return false;
    }
    if (amount > playerState.balance) {
      toast({ title: 'Error', description: 'Insufficient balance.', variant: 'destructive' });
      return false;
    }

    setPlayerState(prev => ({ ...prev, balance: prev.balance - amount }));
    setPlayerBet({ choice, amount });
    
    setGameState(prev => ({
        ...prev,
        currentSession: {
            ...prev.currentSession,
            [`${choice}Amount`]: prev.currentSession[`${choice}Amount`] + amount,
            [`${choice}Bettors`]: prev.currentSession[`${choice}Bettors`] + 1,
        }
    }));
    toast({ title: 'Bet Placed', description: `You bet $${amount} on ${choice.toUpperCase()}.` });
    return true;
  }, [gameState.phase, playerState.balance]);

  return { gameState, playerState, playerBet, placeBet };
};
