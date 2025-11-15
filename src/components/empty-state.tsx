'use client';

import { Film, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EmptyStateProps = {
  onImportClick: () => void;
};

export function EmptyState({ onImportClick }: EmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center h-full">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-muted p-4 rounded-full">
          <Film className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold font-headline">Your Library is Empty</h2>
        <p className="max-w-xs text-muted-foreground">Get started by importing your movies and TV shows collection.</p>
        <Button onClick={onImportClick} className="mt-2">
          <Plus className="mr-2 h-4 w-4" />
          Import Media
        </Button>
      </div>
    </div>
  );
}
