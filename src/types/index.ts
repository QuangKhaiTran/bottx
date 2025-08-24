import type { PredictTaiXiuOutput } from "@/ai/flows/predict-tai-xiu";

export type GamePhase = 'betting' | 'rolling' | 'result';
export type BetChoice = 'tai' | 'xiu';

export type Strategy =
  | 'martingale'
  | 'fibonacci'
  | 'fixed'
  | 'ai'
  | 'anti-trend'
  | 'follow-trend';

export interface HistoryItem {
  id: number;
  result: BetChoice;
  dice: [number, number, number];
}

export interface PlayerBet {
  choice: BetChoice;
  amount: number;
}

export interface GameState {
  phase: GamePhase;
  countdown: number;
  history: HistoryItem[];
  currentSession: {
    id: number;
    taiAmount: number;
    xiuAmount: number;
    taiBettors: number;
    xiuBettors: number;
  };
  dice: [number, number, number];
  result: BetChoice | null;
  lastWin: { choice: BetChoice, amount: number } | null;
}

export interface BotState {
  isActive: boolean;
  strategy: Strategy;
  balance: number;
  initialBetAmount: number;
  currentBetAmount: number;
  stopLoss: number;
  takeProfit: number;
  martingaleCount: number; // For Martingale strategy
  fibonacciIndex: number; // For Fibonacci strategy
  stats: {
    pnl: number;
    winRate: number;
    wins: number;
    losses: number;
    totalBets: number;
  };
  aiPrediction: (PredictTaiXiuOutput & {isLoading: boolean}) | null;
}

export interface PlayerState {
  balance: number;
  pnl: number;
}
