'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dice5, User, Settings } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Game', icon: Dice5 },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen sticky top-0 flex flex-col items-center gap-4 border-r bg-card p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
        <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-b from-white to-primary-foreground/50">
          L
        </span>
      </div>
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4">
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link href={item.href}>
                  <Button
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    size="icon"
                    className={cn(
                      'rounded-lg',
                      pathname === item.href && 'bg-primary/20 text-primary hover:bg-primary/30'
                    )}
                    aria-label={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <div className="mt-auto flex flex-col items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Settings
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </aside>
  );
}
