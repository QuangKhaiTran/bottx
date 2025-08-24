import { Wallet } from 'lucide-react';

type HeaderProps = {
  balance: number;
};

export function Header({ balance }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-card/80 backdrop-blur-sm border-b">
      <h1 className="text-xl font-bold font-headline text-gradient">
        Lucky Dice Trader
      </h1>
      <div className="flex items-center gap-2 text-base font-medium text-primary-foreground">
        <Wallet className="w-5 h-5 text-primary" />
        <span className="font-code text-green-400">
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </header>
  );
}
