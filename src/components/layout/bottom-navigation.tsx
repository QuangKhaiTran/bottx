'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Dice5, User, Settings, Swords } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Game', icon: Dice5 },
  { href: '/pvp', label: 'PvP', icon: Swords },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t p-1 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <Link
          href={item.href}
          key={item.href}
          className={cn(
            'flex flex-col items-center gap-1 p-1 rounded-lg text-muted-foreground hover:text-primary transition-colors w-16',
            pathname === item.href && 'bg-primary/10 text-primary'
          )}
        >
          <item.icon className="h-5 w-5" />
          <span className="text-xs font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
