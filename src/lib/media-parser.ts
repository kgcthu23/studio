export function parseFilePath(filePath: string): { title: string; year: string | null; type: 'movie' | 'tv' } {
  const fileName = filePath.split(/[\\/]/).pop()?.trim() || '';

  // Match year in parentheses, e.g., (2007)
  const yearMatch = fileName.match(/\((\d{4})\)/);
  const year = yearMatch ? yearMatch[1] : null;

  // Remove year and anything in square brackets or other parentheses
  let title = fileName;
  if (yearMatch) {
    title = title.replace(yearMatch[0], '');
  }
  
  title = title
    .replace(/\[.*?\]/g, '') // Remove content in square brackets
    .replace(/\(.*?\)/g, '') // Remove remaining content in parentheses
    .replace(/\./g, ' ') // Replace dots with spaces
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/-(?![a-zA-Z0-9])/g, ' ') // Replace hyphens that are not part of words
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();

  // Special cases from user examples
  title = title.replace(/COMPLETE/ig, '').trim();
  
  // Heuristic to determine type
  const isTV = /season|s\d{1,2}e\d{1,2}/i.test(fileName.toLowerCase());
  
  if (title.length === 0) {
    // Fallback to original filename if cleaning results in empty string, after some basic cleanup
    title = fileName.split('[')[0].split('(')[0].replace(/\./g, ' ').trim();
  }

  return { title, year, type: isTV ? 'tv' : 'movie' };
}
