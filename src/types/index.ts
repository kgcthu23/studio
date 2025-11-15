export interface Media {
  id: string;
  filePath: string;
  title: string;
  year: string | null;
  type: 'movie' | 'tv';
  posterUrl: string | null;
  synopsis: string | null;
  tags: string[];
  isWatched: boolean;
}

export type FirestoreMediaItem = Omit<Media, 'id'>;
