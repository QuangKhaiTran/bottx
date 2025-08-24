'use client';

import type { BotState, Strategy } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Bot, BrainCircuit, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

interface BotPanelProps {
  botState: BotState;
  setBotState: React.Dispatch<React.SetStateAction<BotState>>;
}

const strategies: { value: Strategy; label: string }[] = [
  { value: 'ai', label: 'AI-Based (Gemini)' },
  { value: 'martingale', label: 'Martingale' },
  { value: 'fibonacci', label: 'Fibonacci' },
  { value: 'fixed', label: 'Fixed Bet' },
  { value: 'follow-trend', label: 'Follow Trend' },
  { value: 'anti-trend', label: 'Anti-Trend' },
];

export function BotPanel({ botState, setBotState }: BotPanelProps) {

  const handleStrategyChange = (value: string) => {
    setBotState(prev => ({...prev, strategy: value as Strategy}));
  }
  
  const handleFieldChange = (field: keyof BotState, value: any) => {
    setBotState(prev => ({...prev, [field]: value}));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-accent" />
          Trading Bot Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="bot-active" className="text-lg">Activate Bot</Label>
          <Switch
            id="bot-active"
            checked={botState.isActive}
            onCheckedChange={(checked) => handleFieldChange('isActive', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="strategy">Strategy</Label>
          <Select value={botState.strategy} onValueChange={handleStrategyChange}>
            <SelectTrigger id="strategy">
              <SelectValue placeholder="Select a strategy" />
            </SelectTrigger>
            <SelectContent>
              {strategies.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {botState.strategy === 'ai' && botState.aiPrediction && (
          <div className="bg-secondary p-3 rounded-lg border border-accent/30 text-sm">
            <div className="flex items-center gap-2 font-bold mb-2">
              <BrainCircuit className="w-5 h-5 text-accent"/>
              AI Prediction
            </div>
            {botState.aiPrediction.isLoading ? (
                <p className="text-muted-foreground animate-pulse">AI is thinking...</p>
            ) : botState.aiPrediction.predictedOutcome ? (
                <>
                    <p>Outcome: <Badge variant={botState.aiPrediction.predictedOutcome === 'tai' ? 'tai' : 'default'}>{botState.aiPrediction.predictedOutcome.toUpperCase()}</Badge></p>
                    <p>Confidence: <span className='font-code'>{Math.round(botState.aiPrediction.confidenceScore * 100)}%</span></p>
                    <p className="text-muted-foreground mt-1 text-xs">{botState.aiPrediction.reasoning}</p>
                </>
            ) : (
                <p className="text-muted-foreground flex items-center gap-1"><AlertCircle className='w-4 h-4'/> Could not get prediction.</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="initial-bet">Initial Bet</Label>
            <Input
              id="initial-bet"
              type="number"
              value={botState.initialBetAmount}
              onChange={(e) => handleFieldChange('initialBetAmount', Number(e.target.value))}
              className="font-code"
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="current-bet">Current Bet</Label>
            <Input
              id="current-bet"
              type="number"
              value={botState.currentBetAmount}
              readOnly
              className="font-code bg-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stop-loss">Stop-Loss</Label>
            <Input
              id="stop-loss"
              type="number"
              value={botState.stopLoss}
              onChange={(e) => handleFieldChange('stopLoss', Number(e.target.value))}
              className="font-code"
              placeholder="e.g., 100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="take-profit">Take-Profit</Label>
            <Input
              id="take-profit"
              type="number"
              value={botState.takeProfit}
              onChange={(e) => handleFieldChange('takeProfit', Number(e.target.value))}
              className="font-code"
              placeholder="e.g., 200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
