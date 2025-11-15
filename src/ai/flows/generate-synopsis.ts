// src/ai/flows/generate-synopsis.ts
'use server';

/**
 * @fileOverview A flow to generate a short synopsis for a movie title by combining data from a database and an external API.
 *
 * - generateSynopsis - A function that generates the synopsis and updates the database.
 * - GenerateSynopsisInput - The input type for the generateSynopsis function, including the movie title and external API data.
 * - GenerateSynopsisOutput - The return type for the generateSynopsis function, which is a string containing the synopsis.
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
  return generateSynopsisFlow(input);
}

const generateSynopsisPrompt = ai.definePrompt({
  name: 'generateSynopsisPrompt',
  input: {schema: GenerateSynopsisInputSchema},
  output: {schema: GenerateSynopsisOutputSchema},
  prompt: `You are a movie critic. Generate a short synopsis for the movie based on the following information:\n\nDatabase Data: {{{databaseData}}}\nAPI Data: {{{apiData}}}\n\nTitle: {{{title}}}\n\nSynopsis:`,
});

const generateSynopsisFlow = ai.defineFlow(
  {
    name: 'generateSynopsisFlow',
    inputSchema: GenerateSynopsisInputSchema,
    outputSchema: GenerateSynopsisOutputSchema,
  },
  async input => {
    const {output} = await generateSynopsisPrompt(input);
    return output!;
  }
);
