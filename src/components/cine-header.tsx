'use client';

import { Clapperboard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CineHeaderProps = {
  onImportClick: () => void;
};

export function CineHeader({ onImportClick }: CineHeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Clapperboard className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">CineScope</h1>
        </div>
        <Button onClick={onImportClick} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Import Media
        </Button>
      </div>
    </header>
  );
}
