"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeText = analyzeText;
const sentiment_1 = __importDefault(require("sentiment"));
// Constants
const DEFAULT_READING_SPEED = 200; // Default reading speed (words per minute)
// Main Analysis Function
function analyzeText(text, wordsPerMinute = DEFAULT_READING_SPEED) {
    if (!text || typeof text !== "string") {
        throw new Error("Invalid text input. Please provide a valid string.");
    }
    // Clean the input text for further analysis
    const cleanText = cleanTextInput(text);
    // Perform analysis
    const wordCount = calculateWordCount(cleanText);
    const characterCount = calculateCharacterCount(cleanText);
    const sentenceCount = calculateSentenceCount(cleanText);
    const { minutes, seconds } = calculateReadingTime(wordCount, wordsPerMinute);
    const linkCount = countLinks(cleanText);
    const readabilityScore = calculateReadabilityScore(cleanText);
    const sentiment = analyzeSentiment(cleanText);
    const keywords = extractKeywords(cleanText);
    return {
        readingTime: { minutes, seconds },
        wordCount,
        characterCount,
        sentenceCount,
        linkCount,
        readabilityScore,
        sentiment,
        keywords
    };
}
// Clean the input text by removing extra spaces and special characters
function cleanTextInput(text) {
    return text.replace(/\s+/g, " ").trim();
}
// Calculate word count
function calculateWordCount(text) {
    return text.split(/\s+/).length;
}
// Calculate character count excluding spaces
function calculateCharacterCount(text) {
    return text.replace(/\s+/g, "").length;
}
// Calculate sentence count based on punctuation marks
function calculateSentenceCount(text) {
    return (text.match(/[.!?]+/g) || []).length;
}
// Calculate reading time in minutes and seconds
function calculateReadingTime(wordCount, wordsPerMinute) {
    if (wordCount === 0)
        return { minutes: 0, seconds: 0 }; // Avoid division by zero
    const readingTimeInMinutes = wordCount / wordsPerMinute;
    const minutes = readingTimeInMinutes.toFixed(2); // Convert to 2 decimal places
    const seconds = ((readingTimeInMinutes - Math.floor(readingTimeInMinutes)) * 60).toFixed(2); // Seconds as float with 2 decimal places
    return { minutes: parseFloat(minutes), seconds: parseFloat(seconds) };
}
// Count the number of links (URLs) in the text
function countLinks(text) {
    const linkRegex = /https?:\/\/[^\s]+/g;
    const matches = text.match(linkRegex);
    return matches ? matches.length : 0;
}
// Calculate readability score using Flesch Reading Ease formula
function calculateReadabilityScore(text) {
    const wordCount = calculateWordCount(text);
    const sentenceCount = calculateSentenceCount(text);
    const syllableCount = calculateSyllableCount(text);
    if (wordCount === 0 || sentenceCount === 0)
        return 0; // Avoid division by zero
    return 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
}
// Simple syllable count based on vowels (simplified version)
function calculateSyllableCount(text) {
    return (text.match(/[aeiouy]{1,2}/g) || []).length;
}
// Perform sentiment analysis using Sentiment.js
function analyzeSentiment(text) {
    const sentiment = new sentiment_1.default();
    const result = sentiment.analyze(text);
    return result.score > 0 ? "Positive" : result.score < 0 ? "Negative" : "Neutral";
}
// Extract top 5 SEO-friendly keywords from the text
function extractKeywords(text) {
    const words = text.toLowerCase().split(/\s+/);
    const wordFrequency = new Map();
    // Use a Set for fast stop word lookup
    const stopWords = new Set([
        "the", "and", "a", "to", "of", "in", "on", "for", "with", "at", "by", "an", "this",
        "that", "it", "is", "was", "for", "as", "be", "are", "which", "or", "but", "not", "from", "have", "has"
    ]);
    // Count word frequency
    words.forEach((word) => {
        if (!isStopWord(word, stopWords) && word.length > 2) { // Only consider words longer than 2 characters
            wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
        }
    });
    // Extract meaningful n-grams (bi-grams and tri-grams)
    const nGrams = extractNGrams(words);
    nGrams.forEach((nGram) => {
        if (!isStopWord(nGram, stopWords)) {
            wordFrequency.set(nGram, (wordFrequency.get(nGram) || 0) + 1);
        }
    });
    // Sort words and n-grams by frequency and return top 5
    return Array.from(wordFrequency)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 5)
        .map(([key]) => key);
}
// Extract n-grams (bi-grams and tri-grams) from the list of words
function extractNGrams(words) {
    const nGrams = [];
    for (let i = 0; i < words.length - 1; i++) {
        nGrams.push(words[i] + " " + words[i + 1]); // Bi-grams
        if (i < words.length - 2) {
            nGrams.push(words[i] + " " + words[i + 1] + " " + words[i + 2]); // Tri-grams
        }
    }
    return nGrams;
}
// Check if a word is a common stop word (to exclude from keywords)
function isStopWord(word, stopWords) {
    return stopWords.has(word);
}
