'use client';

import { useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import { Film, Loader2, Sparkles, Tag, Tv, Watch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { TagInput } from '@/components/tag-input';
import { fetchMediaDetails, getSynopsis } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { Media } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type MediaDetailSheetProps = {
  media: Media;
  onUpdate: (media: Media) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function MediaDetailSheet({ media, onUpdate, isOpen, onOpenChange }: MediaDetailSheetProps) {
  const [isFetchingPoster, startPosterFetch] = useTransition();
  const [isGeneratingSynopsis, startSynopsisGeneration] = useTransition();
  const { toast } = useToast();
  const placeholderImage = PlaceHolderImages.find((img) => img.id === 'poster-placeholder');

  useEffect(() => {
    if (isOpen && !media.posterUrl) {
      startPosterFetch(async () => {
        const result = await fetchMediaDetails(media.title);
        if (result.posterUrl) {
          onUpdate({ ...media, posterUrl: result.posterUrl });
        }
      });
    }
  }, [isOpen, media, onUpdate]);

  const handleGenerateSynopsis = () => {
    startSynopsisGeneration(async () => {
      const synopsis = await getSynopsis(media);
      onUpdate({ ...media, synopsis });
      toast({ title: 'Synopsis Generated', description: 'The AI-powered synopsis has been added.' });
    });
  };

  const handleWatchedChange = (checked: boolean) => {
    onUpdate({ ...media, isWatched: checked });
  };

  const handleTagsChange = (newTags: string[]) => {
    onUpdate({ ...media, tags: newTags });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-headline text-2xl">{media.title}</SheetTitle>
          <SheetDescription className="flex items-center gap-2 text-base">
            {media.type === 'movie' ? <Film className="w-4 h-4" /> : <Tv className="w-4 h-4" />}
            {media.year || 'Unknown Year'}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6">
          <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden">
            {isFetchingPoster ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <Image
                src={media.posterUrl || placeholderImage?.imageUrl || 'https://picsum.photos/seed/placeholder/400/600'}
                alt={`Poster for ${media.title}`}
                fill
                className="object-cover"
                data-ai-hint="movie poster"
              />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Synopsis</h3>
            {isGeneratingSynopsis ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : media.synopsis ? (
              <p className="text-muted-foreground">{media.synopsis}</p>
            ) : (
              <Button onClick={handleGenerateSynopsis} disabled={isGeneratingSynopsis} variant="outline" size="sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Synopsis
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="watched-switch">
                  <Watch className="inline mr-2 h-4 w-4" />
                  Status
                </Label>
                <p className="text-sm text-muted-foreground">{media.isWatched ? 'Watched' : 'Not Watched'}</p>
              </div>
              <Switch id="watched-switch" checked={media.isWatched} onCheckedChange={handleWatchedChange} />
            </div>

            <div className="rounded-lg border p-3 shadow-sm space-y-2">
              <Label>
                <Tag className="inline mr-2 h-4 w-4" />
                Tags
              </Label>
              <TagInput tags={media.tags} onTagsChange={handleTagsChange} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
