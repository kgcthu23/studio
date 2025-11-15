# **App Name**: CineScope

## Core Features:

- Media Import: Bulk import movies and TV shows by parsing filepath names and extracting titles.
- Automated Title Extraction: Automatically parse titles and years from imported filepath.
- API Data Fetch: Fetch specific movie and show data, including posters, from an external API, like TMDB.
- Custom Tagging: Allow users to add custom tags to each media entry for personalized organization.
- Watched/Owned Status: Enable users to mark media as watched or owned (on disk) to track their collection.
- Status Filtering: Implement filtering options to view media based on watched, unwatched, or owned status.
- Title Info Tool: Use the LLM to generate short synopses from combined database record and API metadata to help choose which movies to watch. The AI tool will only update the database field when a movie title is clicked on.

## Style Guidelines:

- Background: Dark background (#121212) to reduce eye strain and enhance the viewing experience.
- Primary: Muted purple (#8E44AD) to create a sophisticated and calming feel.
- Accent: Muted blue (#3498DB) used for interactive elements and highlights to maintain visual interest without overwhelming the user.
- Body font: 'Inter', a grotesque-style sans-serif, will be used for general UI elements.
- Headline font: 'Space Grotesk' sans-serif for headlines and titles.
- Use simple, outline-style icons in muted blue to represent different media categories and actions.
- Employ a card-based layout for media entries to display key information and artwork efficiently.
- Incorporate subtle transitions and animations to provide feedback and enhance the user experience when interacting with the app.