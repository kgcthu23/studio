// src/ai/flows/generate-synopsis.ts
'use server';

/**
 * @fileOverview This file is now deprecated as synopsis is fetched from TMDB.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSynopsisInputSchema = z.object({
  title: z.string().describe('The title of the movie.'),
  apiData: z.string().describe('Movie data from an external API.'),
  databaseData: z.string().describe('Movie data from the local database.'),
});

export type GenerateSynopsisInput = z.infer<typeof GenerateSynopsisInputSchema>;

const GenerateSynopsisOutputSchema = z.string().describe('A short synopsis of the movie.');

export type GenerateSynopsisOutput = z.infer<typeof GenerateSynopsisOutputSchema>;

export async function generateSynopsis(input: GenerateSynopsisInput): Promise<GenerateSynopsisOutput> {
  // This flow is no longer the primary source for the synopsis.
  // Returning a placeholder.
  return "Synopsis is now fetched from TMDB.";
}
