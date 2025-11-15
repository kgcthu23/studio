'use client';

import Image from 'next/image';
import { CheckCircle2, Circle, Film, Tv } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Media } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type MediaCardProps = {
  media: Media;
  onSelect: () => void;
};

export function MediaCard({ media, onSelect }: MediaCardProps) {
  const placeholderImage = PlaceHolderImages.find((img) => img.id === 'poster-placeholder');
  
  return (
    <Card
      onClick={onSelect}
      className="overflow-hidden cursor-pointer group transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
    >
      <CardHeader className="p-0 relative aspect-[2/3]">
        <Image
          src={media.posterUrl || placeholderImage?.imageUrl || 'https://picsum.photos/seed/placeholder/400/600'}
          alt={`Poster for ${media.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint="movie poster"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={media.isWatched ? 'default' : 'secondary'} className="bg-background/70 backdrop-blur-sm">
            {media.isWatched ? (
              <CheckCircle2 className="h-4 w-4 text-accent" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      </CardHeader>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{media.title}</h3>
        <div className="flex items-center text-xs text-muted-foreground mt-1 gap-2">
          {media.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
          <span>{media.year || 'N/A'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
