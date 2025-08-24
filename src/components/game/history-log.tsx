'use client';

import type { HistoryItem, BetChoice } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoryLogProps {
  history: HistoryItem[];
}

const HistoryBubble = ({ result }: { result: BetChoice }) => (
  <div
    className={cn(
      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0',
      {
        'bg-primary text-primary-foreground': result === 'xiu',
        'bg-yellow-400 text-background': result === 'tai',
      }
    )}
  >
    {result === 'xiu' ? 'X' : 'T'}
  </div>
);

export function HistoryLog({ history }: HistoryLogProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Game History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 w-full">
          <div className="flex flex-wrap-reverse gap-2">
            {history.map((item) => (
              <HistoryBubble key={item.id} result={item.result} />
            ))}
          </div>
          {history.length === 0 && <p className="text-muted-foreground">No games played yet.</p>}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
