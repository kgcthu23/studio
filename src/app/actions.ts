'use server';

import { generateSynopsis } from '@/ai/flows/generate-synopsis';
import type { Media } from '@/types';

/**
 * Fetches media details from a mock API.
 * In a real app, this would call an API like TMDB.
 */
export async function fetchMediaDetails(title: string): Promise<{ posterUrl: string | null }> {
  try {
    // The seed is generated from the title to have consistent images for the same title.
    const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      posterUrl: `https://picsum.photos/seed/${seed}/400/600`
    };
  } catch (error) {
    console.error('Failed to fetch media details:', error);
    return { posterUrl: null };
  }
}

/**
 * Generates a synopsis for a given media item using the AI flow.
 */
export async function getSynopsis(media: Media): Promise<string> {
  try {
    const synopsis = await generateSynopsis({
      title: media.title,
      // Constructing mock data that would typically come from an API and a database.
      apiData: `Release Year: ${media.year || 'Unknown'}. Type: ${media.type}.`,
      databaseData: `File Path: ${media.filePath}. User Tags: ${media.tags.join(', ')}. Watched: ${media.isWatched}.`,
    });
    return synopsis;
  } catch (error) {
    console.error('Failed to generate synopsis:', error);
    return "Could not generate a synopsis for this title.";
  }
}
