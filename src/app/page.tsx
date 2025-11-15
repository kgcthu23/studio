'use client';

import { useState, useMemo, useTransition, useEffect } from 'react';
import type { Media } from '@/types';
import { CineHeader } from '@/components/cine-header';
import { EmptyState } from '@/components/empty-state';
import { FilterControls } from '@/components/filter-controls';
import { MediaLibrary } from '@/components/media-library';
import { MediaDetailSheet } from '@/components/media-detail-sheet';
import { ImportDialog } from '@/components/import-dialog';
import { fetchMediaDetails } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useCollection, useFirebase, useMemoFirebase, useUser } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { collection, doc } from 'firebase/firestore';

export type FilterType = 'all' | 'watched' | 'unwatched';

export default function Home() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isProcessing, startTransition] = useTransition();
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const mediaCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'mediaItems');
  }, [user, firestore]);
  
  const { data: library, isLoading: isLibraryLoading } = useCollection<Media>(mediaCollectionRef);


  useEffect(() => {
    if (!user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  const handleImport = (newMedia: Omit<Media, 'isWatched' | 'tags' | 'posterUrl' | 'synopsis'>[]) => {
    if (!user || !firestore) return { addedCount: 0, duplicateCount: 0 };
  
    const existingFilePaths = new Set((library || []).map(item => item.filePath));
    const uniqueNewMedia: Media[] = [];
    let duplicateCount = 0;

    newMedia.forEach(item => {
      if (existingFilePaths.has(item.filePath)) {
        duplicateCount++;
      } else {
        uniqueNewMedia.push({
          ...item,
          isWatched: false,
          tags: [],
          posterUrl: null,
          synopsis: null,
        });
      }
    });

    if (uniqueNewMedia.length > 0) {
      uniqueNewMedia.forEach(mediaItem => {
        const docRef = doc(firestore, 'users', user.uid, 'mediaItems', mediaItem.id);
        setDocumentNonBlocking(docRef, mediaItem, { merge: true });
      });
    
      startTransition(() => {
        processMediaImports(uniqueNewMedia);
      });
    }

    return { addedCount: uniqueNewMedia.length, duplicateCount };
  };

  const processMediaImports = async (mediaToProcess: Media[]) => {
    if (!user || !firestore) return;
    const promises = mediaToProcess.map(async (media) => {
      const details = await fetchMediaDetails(media);
      const updatedMedia = details ? { ...media, ...details } : media;
      
      const docRef = doc(firestore, 'users', user.uid, 'mediaItems', updatedMedia.id);
      setDocumentNonBlocking(docRef, updatedMedia, { merge: true });

      return updatedMedia;
    });

    const detailedMedia = await Promise.all(promises);
    const fetchedCount = detailedMedia.filter(m => m.posterUrl).length;

    if (fetchedCount > 0) {
      toast({
        title: "Metadata updated",
        description: `Successfully fetched details for ${fetchedCount} of ${mediaToProcess.length} new items.`,
      });
    }
  };


  const updateMedia = (updatedMedia: Media) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, 'users', user.uid, 'mediaItems', updatedMedia.id);
    setDocumentNonBlocking(docRef, updatedMedia, { merge: true });
  };
  
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    (library || []).forEach(media => {
      media.tags?.forEach(tag => genres.add(tag));
    });
    return Array.from(genres).sort();
  }, [library]);

  const selectedMedia = useMemo(() => (library || []).find((m) => m.id === selectedMediaId) || null, [library, selectedMediaId]);

  const filteredLibrary = useMemo(() => {
    let result = library || [];

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
    
    if (selectedGenres.length > 0) {
      result = result.filter(m => 
        selectedGenres.every(genre => m.tags.includes(genre))
      );
    }

    return result;
  }, [library, filter, searchQuery, selectedGenres]);

  const isLoading = isUserLoading || isLibraryLoading;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <CineHeader onImportClick={() => setIsImporting(true)} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading your library...</p>
          </div>
        ) : (library || []).length > 0 ? (
          <div className="space-y-6">
            <FilterControls
              currentFilter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              allGenres={allGenres}
              selectedGenres={selectedGenres}
              onGenreChange={setSelectedGenres}
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
