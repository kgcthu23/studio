'use server';

import type { Media } from '@/types';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3';

async function searchTMDB(title: string, year: string | null, type: 'movie' | 'tv') {
  const searchQuery = encodeURIComponent(title);
  const searchYear = year || '';
  const url = `${TMDB_API_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${searchQuery}&year=${searchYear}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('TMDB search request failed:', response.statusText);
      return null;
    }
    const data = await response.json();
    return data.results && data.results.length > 0 ? data.results[0] : null;
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return null;
  }
}

async function getTMDBDetails(id: number, type: 'movie' | 'tv') {
  const url = `${TMDB_API_URL}/${type}/${id}?api_key=${TMDB_API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('TMDB details request failed:', response.statusText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching TMDB details:', error);
    return null;
  }
}

/**
 * Fetches media details from TMDB.
 */
export async function fetchMediaDetails(media: Media): Promise<Partial<Media> | null> {
  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY is not configured.');
    return null;
  }

  const searchResult = await searchTMDB(media.title, media.year, media.type);
  if (!searchResult) {
    return null;
  }

  const details = await getTMDBDetails(searchResult.id, media.type);
  if (!details) {
    return null;
  }

  const posterPath = details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null;
  const synopsis = details.overview || null;
  const tags = details.genres?.map((g: { name: string }) => g.name) || [];

  return {
    posterUrl: posterPath,
    synopsis: synopsis,
    tags: [...new Set([...media.tags, ...tags])], // Merge existing tags with new ones
  };
}

// This function is no longer needed as we fetch synopsis from TMDB
// but we keep it to avoid breaking other parts of the app for now.
export async function getSynopsis(media: Media): Promise<string> {
  return media.synopsis || "Synopsis not available.";
}
