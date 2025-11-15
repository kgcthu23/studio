'use client';

import { MediaCard } from '@/components/media-card';
import type { Media } from '@/types';

type MediaLibraryProps = {
  media: Media[];
  onSelectMedia: (id: string) => void;
};

export function MediaLibrary({ media, onSelectMedia }: MediaLibraryProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
      {media.map((item) => (
        <MediaCard key={item.id} media={item} onSelect={() => onSelectMedia(item.id)} />
      ))}
    </div>
  );
}
