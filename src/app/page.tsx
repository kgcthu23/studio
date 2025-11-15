'use client';

import { useState, useMemo } from 'react';
import type { Media } from '@/types';
import { CineHeader } from '@/components/cine-header';
import { EmptyState } from '@/components/empty-state';
import { FilterControls } from '@/components/filter-controls';
import { MediaLibrary } from '@/components/media-library';
import { MediaDetailSheet } from '@/components/media-detail-sheet';
import { ImportDialog } from '@/components/import-dialog';

export type FilterType = 'all' | 'watched' | 'unwatched';

export default function Home() {
  const [library, setLibrary] = useState<Media[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = (newMedia: Media[]) => {
    setLibrary((prev) => {
      const existingPaths = new Set(prev.map((item) => item.filePath));
      const uniqueNewMedia = newMedia.filter((item) => !existingPaths.has(item.filePath));
      return [...prev, ...uniqueNewMedia];
    });
  };

  const updateMedia = (updatedMedia: Media) => {
    setLibrary((prev) => prev.map((m) => (m.id === updatedMedia.id ? updatedMedia : m)));
  };

  const selectedMedia = useMemo(() => library.find((m) => m.id === selectedMediaId) || null, [library, selectedMediaId]);

  const filteredLibrary = useMemo(() => {
    let result = library;

    if (filter === 'watched') {
      result = result.filter((m) => m.isWatched);
    } else if (filter === 'unwatched') {
      result = result.filter((m) => !m.isWatched);
    }

    if (searchQuery) {
      result = result.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [library, filter, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <CineHeader onImportClick={() => setIsImporting(true)} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {library.length > 0 ? (
          <div className="space-y-6">
            <FilterControls
              currentFilter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <MediaLibrary media={filteredLibrary} onSelectMedia={setSelectedMediaId} />
          </div>
        ) : (
          <EmptyState onImportClick={() => setIsImporting(true)} />
        )}
      </main>

      <ImportDialog isOpen={isImporting} onOpenChange={setIsImporting} onImport={handleImport} />

      {selectedMedia && (
        <MediaDetailSheet
          media={selectedMedia}
          onUpdate={updateMedia}
          isOpen={!!selectedMedia}
          onOpenChange={(open) => !open && setSelectedMediaId(null)}
        />
      )}
    </div>
  );
}
