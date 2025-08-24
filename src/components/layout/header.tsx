import { Wallet } from 'lucide-react';

type HeaderProps = {
  balance: number;
};

export function Header({ balance }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-card/50 rounded-lg border">
      <h1 className="text-2xl font-bold font-headline text-gradient">
        Lucky Dice Trader
      </h1>
      <div className="flex items-center gap-2 text-lg font-medium text-primary-foreground">
        <Wallet className="w-6 h-6 text-primary" />
        <span className="font-code text-green-400">
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </header>
  );
}
