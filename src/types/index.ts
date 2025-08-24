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

// PvP Types

export interface HousePlayer {
  id: string;
  username: string;
  balance: number;
  currentGameId: string | null;
  houseStats: {
    totalGamesAsHouse: number;
    totalWinningsAsHouse: number;
    winRateAsHouse: number;
  };
}

export interface PvPPlayer {
  id: string;
  username: string;
  balance: number;
  currentBet: {
    amount: number;
    type: 'tai' | 'xiu';
    timestamp: number;
  } | null;
  playerStats: {
    totalGamesPlayed: number;
    totalWinnings: number;
    winRate: number;
  };
}

export interface PvPGameSession {
  id: string;
  houseId: string;
  maxPlayers: number;
  currentPlayers: PvPPlayer[];
  gameState: 'waiting' | 'betting' | 'rolling' | 'finished';
  countdown: number;
  betDuration: number; 
  minBet: number;
  maxBet: number;
  result: { dice: [number, number, number], result: BetChoice } | null;
  createdAt: number;
}


export interface ChatMessage {
  id: string;
  playerId: string;
  username: string;
  message: string;
  timestamp: number;
  type: 'chat' | 'system' | 'result';
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    reward: number;
}

export interface PvPProfile {
  stats: {
    totalGamesAsHouse: number;
    totalGamesAsPlayer: number;
    avgWinRateAsHouse: number;
    avgWinRateAsPlayer: number;
    biggestWin: number;
    favoritePosition: 'tai' | 'xiu';
  };
  achievements: Achievement[];
  reputation: number;
  level: number;
}
