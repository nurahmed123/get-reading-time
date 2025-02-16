import Sentiment from "sentiment";

// --------------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------------

/** Default reading speed in words per minute. */
const DEFAULT_READING_SPEED = 200;

// --------------------------------------------------------------------------
// Type Definitions
// --------------------------------------------------------------------------

/**
 * Represents the result of the text analysis.
 */
interface TextAnalysisResult {
    /** Estimated reading time (minutes and seconds) */
    readingTime: { minutes: number; seconds: number };
    /** Total word count */
    wordCount: number;
    /** Total character count (excluding spaces) */
    characterCount: number;
    /** Total sentence count */
    sentenceCount: number;
    /** Total number of links found */
    linkCount: number;
    /** Array of detected links */
    links: string[];
    /** Flesch Reading Ease score */
    readabilityScore: number;
    /** Overall sentiment ("Positive", "Negative", or "Neutral") */
    sentiment: string;
    /** Top 5 SEO-friendly keywords or key phrases */
    keywords: string[];
}

// --------------------------------------------------------------------------
// Main Analysis Function
// --------------------------------------------------------------------------

/**
 * Analyzes the given text and returns various metrics, including reading time, word count,
 * character count, sentence count, link count, readability score, sentiment, and keywords.
 *
 * @param text - The text to be analyzed.
 * @param wordsPerMinute - The reading speed (optional, defaults to DEFAULT_READING_SPEED).
 * @returns A TextAnalysisResult object with detailed analysis metrics.
 *
 * @throws {Error} Throws an error if the input text is not a valid string.
 *
 * @example
 * ```typescript
 * const text = "This is an example text with a link: https://example.com";
 * const result = analyzeText(text);
 * console.log(result.readingTime); // { minutes: 0.05, seconds: 3.00 }
 * console.log(result.wordCount);   // 10
 * console.log(result.links);       // ["https://example.com"]
 * ```
 */
export function analyzeText(
    text: string,
    wordsPerMinute: number = DEFAULT_READING_SPEED
): TextAnalysisResult {
    if (!text || typeof text !== "string") {
        throw new Error("Invalid text input. Please provide a valid string.");
    }

    // Clean the input text for further analysis
    const cleanText = cleanTextInput(text);

    // Perform various analyses on the cleaned text
    const wordCount = calculateWordCount(cleanText);
    const characterCount = calculateCharacterCount(cleanText);
    const sentenceCount = calculateSentenceCount(cleanText);
    const { minutes, seconds } = calculateReadingTime(wordCount, wordsPerMinute);
    const links = countLinks(cleanText);
    const readabilityScore = calculateReadabilityScore(cleanText);
    const sentiment = analyzeSentiment(cleanText);
    const keywords = extractKeywords(cleanText);

    return {
        readingTime: { minutes, seconds },
        wordCount,
        characterCount,
        sentenceCount,
        linkCount: links.length,
        links,
        readabilityScore,
        sentiment,
        keywords
    };
}

// --------------------------------------------------------------------------
// Helper Functions
// --------------------------------------------------------------------------

/**
 * Cleans the input text by removing extra spaces.
 *
 * @param text - The raw text input.
 * @returns A trimmed and normalized string.
 */
function cleanTextInput(text: string): string {
    return text.replace(/\s+/g, " ").trim();
}

/**
 * Calculates the number of words in the text.
 *
 * @param text - The cleaned text.
 * @returns The word count.
 */
function calculateWordCount(text: string): number {
    return text.split(/\s+/).length;
}

/**
 * Calculates the number of characters in the text, excluding spaces.
 *
 * @param text - The cleaned text.
 * @returns The character count.
 */
function calculateCharacterCount(text: string): number {
    return text.replace(/\s+/g, "").length;
}

/**
 * Calculates the number of sentences in the text based on punctuation.
 *
 * @param text - The cleaned text.
 * @returns The sentence count.
 */
function calculateSentenceCount(text: string): number {
    return (text.match(/[.!?]+/g) || []).length;
}

/**
 * Calculates the estimated reading time in minutes and seconds.
 *
 * @param wordCount - The total word count.
 * @param wordsPerMinute - The reading speed.
 * @returns An object with minutes and seconds.
 */
function calculateReadingTime(
    wordCount: number,
    wordsPerMinute: number
): { minutes: number; seconds: number } {
    if (wordCount === 0) return { minutes: 0, seconds: 0 };

    const readingTimeInMinutes = wordCount / wordsPerMinute;
    const minutes = parseFloat(readingTimeInMinutes.toFixed(2));
    const seconds = parseFloat(
        (((readingTimeInMinutes - Math.floor(readingTimeInMinutes)) * 60).toFixed(2))
    );

    return { minutes, seconds };
}

/**
 * Counts the number of links (URLs) in the text and returns them.
 *
 * @param text - The cleaned text.
 * @returns An array of URLs found in the text.
 */
function countLinks(text: string): string[] {
    const linkRegex = /https?:\/\/[^\s]+/g;
    const matches = text.match(linkRegex);
    return matches || [];
}

/**
 * Calculates the Flesch Reading Ease score for the text.
 *
 * @param text - The cleaned text.
 * @returns The readability score.
 */
function calculateReadabilityScore(text: string): number {
    const wordCount = calculateWordCount(text);
    const sentenceCount = calculateSentenceCount(text);
    const syllableCount = calculateSyllableCount(text);

    if (wordCount === 0 || sentenceCount === 0) return 0;

    return 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
}

/**
 * Counts syllables in the text based on vowel groupings (simplified approach).
 *
 * @param text - The cleaned text.
 * @returns The syllable count.
 */
function calculateSyllableCount(text: string): number {
    return (text.match(/[aeiouy]{1,2}/gi) || []).length;
}

/**
 * Analyzes the sentiment of the text using Sentiment.js.
 *
 * @param text - The cleaned text.
 * @returns "Positive", "Negative", or "Neutral" based on the sentiment score.
 */
function analyzeSentiment(text: string): string {
    const sentimentAnalyzer = new Sentiment();
    const result = sentimentAnalyzer.analyze(text);
    return result.score > 0 ? "Positive" : result.score < 0 ? "Negative" : "Neutral";
}

/**
 * Extracts the top 5 SEO-friendly keywords from the text.
 *
 * @param text - The cleaned text.
 * @returns An array of keywords.
 */
function extractKeywords(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const wordFrequency: Map<string, number> = new Map();

    // Define common stop words to ignore
    const stopWords = new Set([
        "the", "and", "a", "to", "of", "in", "on", "for", "with", "at", "by", "an", "this",
        "that", "it", "is", "was", "as", "be", "are", "which", "or", "but", "not", "from", "have", "has"
    ]);

    // Count frequency for individual words
    words.forEach(word => {
        if (!isStopWord(word, stopWords) && word.length > 2) {
            wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
        }
    });

    // Extract and count n-grams (bi-grams and tri-grams)
    const nGrams = extractNGrams(words);
    nGrams.forEach(nGram => {
        if (!isStopWord(nGram, stopWords)) {
            wordFrequency.set(nGram, (wordFrequency.get(nGram) || 0) + 1);
        }
    });

    // Return the top 5 keywords or key phrases based on frequency
    return Array.from(wordFrequency)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 5)
        .map(([keyword]) => keyword);
}

/**
 * Extracts bi-grams and tri-grams from a list of words.
 *
 * @param words - Array of words from the text.
 * @returns An array of n-grams.
 */
function extractNGrams(words: string[]): string[] {
    const nGrams: string[] = [];
    for (let i = 0; i < words.length - 1; i++) {
        // Bi-gram
        nGrams.push(`${words[i]} ${words[i + 1]}`);
        // Tri-gram
        if (i < words.length - 2) {
            nGrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
        }
    }
    return nGrams;
}

/**
 * Checks if a word (or phrase) is in the set of stop words.
 *
 * @param word - The word or phrase to check.
 * @param stopWords - A set of stop words.
 * @returns True if the word is a stop word, false otherwise.
 */
function isStopWord(word: string, stopWords: Set<string>): boolean {
    return stopWords.has(word);
}
