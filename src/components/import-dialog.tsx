'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { parseFilePath } from '@/lib/media-parser';
import type { Media } from '@/types';

type ImportDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onImport: (media: Omit<Media, 'isWatched' | 'tags' | 'posterUrl' | 'synopsis'>[]) => { addedCount: number; duplicateCount: number };
};

export function ImportDialog({ isOpen, onOpenChange, onImport }: ImportDialogProps) {
  const [paths, setPaths] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleProcess = () => {
    setIsProcessing(true);
    try {
      const lines = paths.split('\n').filter((line) => line.trim() !== '');
      const allNewMedia = lines.map((line) => {
        const { title, year, type } = parseFilePath(line);
        return {
          id: crypto.randomUUID(),
          filePath: line,
          title,
          year,
          type,
        };
      });

      const { addedCount, duplicateCount } = onImport(allNewMedia);

      if (addedCount > 0) {
        toast({
          title: 'Import Successful',
          description: `${addedCount} new items are being saved to your library.`,
        });
      }

      if (duplicateCount > 0) {
        toast({
          variant: 'default',
          title: 'Duplicates Found',
          description: `${duplicateCount} items were already in your library and were not added again.`,
        });
      }
      
      if (addedCount === 0 && duplicateCount > 0) {
        // All items were duplicates
      } else {
        setPaths('');
        onOpenChange(false);
      }

    } catch (error) {
      console.error('Import failed', error);
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: 'An error occurred while processing the file paths.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>Import Media</DialogTitle>
          <DialogDescription>Paste file paths below, one per line, to import new media.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder={'F:\\Entertainment\\Movies\\The Martian (2015) [YTS.AG]\nF:\\Entertainment\\Series\\True Detective Season 1...'}
            value={paths}
            onChange={(e) => setPaths(e.target.value)}
            className="h-48"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleProcess} disabled={isProcessing || !paths.trim()}>
            {isProcessing ? 'Processing...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
