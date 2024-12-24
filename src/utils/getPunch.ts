import nlp from 'compromise';

/**
 * Formats an article by correcting punctuation and capitalization,
 * intelligently inferring sentence boundaries and adding missing punctuation.
 *
 * @param {string} article - The raw input string to be formatted.
 * @returns {{ original: string, formatted: string }} - A JSON object with the original and formatted strings.
 * @throws {TypeError} If the input is not a valid non-empty string.
 */
export const getPunch = (article: string): { original: string; formatted: string } => {
  // Validate input: ensure article is a non-empty string
  if (typeof article !== 'string' || article.trim().length === 0) {
    throw new TypeError('Invalid input: article must be a non-empty string.');
  }

  try {
    // Use compromise to process the text into sentences
    const doc = nlp(article);

    // Normalize the case and punctuation
    const formatted = doc
      .sentences()        // Split article into individual sentences
      .normalize()        // Normalize capitalization and punctuation
      .out('text');       // Get the formatted text as plain text

    // Return the original and formatted text
    return {
      original: article.trim(),
      formatted,
    };
  } catch (error) {
    // Catch unexpected errors and provide a clear error message
    throw new Error(`Error processing the article: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default getPunch;
