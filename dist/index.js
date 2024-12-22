"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  analyzeText: () => analyzeText
});
module.exports = __toCommonJS(index_exports);
var import_sentiment = __toESM(require("sentiment"));
var DEFAULT_READING_SPEED = 200;
function analyzeText(text, wordsPerMinute = DEFAULT_READING_SPEED) {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid text input. Please provide a valid string.");
  }
  const cleanText = cleanTextInput(text);
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
function cleanTextInput(text) {
  return text.replace(/\s+/g, " ").trim();
}
function calculateWordCount(text) {
  return text.split(/\s+/).length;
}
function calculateCharacterCount(text) {
  return text.replace(/\s+/g, "").length;
}
function calculateSentenceCount(text) {
  return (text.match(/[.!?]+/g) || []).length;
}
function calculateReadingTime(wordCount, wordsPerMinute) {
  if (wordCount === 0) return { minutes: 0, seconds: 0 };
  const readingTimeInMinutes = wordCount / wordsPerMinute;
  const minutes = readingTimeInMinutes.toFixed(2);
  const seconds = ((readingTimeInMinutes - Math.floor(readingTimeInMinutes)) * 60).toFixed(2);
  return { minutes: parseFloat(minutes), seconds: parseFloat(seconds) };
}
function countLinks(text) {
  const linkRegex = /https?:\/\/[^\s]+/g;
  const matches = text.match(linkRegex);
  return matches ? matches.length : 0;
}
function calculateReadabilityScore(text) {
  const wordCount = calculateWordCount(text);
  const sentenceCount = calculateSentenceCount(text);
  const syllableCount = calculateSyllableCount(text);
  if (wordCount === 0 || sentenceCount === 0) return 0;
  return 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
}
function calculateSyllableCount(text) {
  return (text.match(/[aeiouy]{1,2}/g) || []).length;
}
function analyzeSentiment(text) {
  const sentiment = new import_sentiment.default();
  const result = sentiment.analyze(text);
  return result.score > 0 ? "Positive" : result.score < 0 ? "Negative" : "Neutral";
}
function extractKeywords(text) {
  const words = text.toLowerCase().split(/\s+/);
  const wordFrequency = /* @__PURE__ */ new Map();
  const stopWords = /* @__PURE__ */ new Set([
    "the",
    "and",
    "a",
    "to",
    "of",
    "in",
    "on",
    "for",
    "with",
    "at",
    "by",
    "an",
    "this",
    "that",
    "it",
    "is",
    "was",
    "for",
    "as",
    "be",
    "are",
    "which",
    "or",
    "but",
    "not",
    "from",
    "have",
    "has"
  ]);
  words.forEach((word) => {
    if (!isStopWord(word, stopWords) && word.length > 2) {
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    }
  });
  const nGrams = extractNGrams(words);
  nGrams.forEach((nGram) => {
    if (!isStopWord(nGram, stopWords)) {
      wordFrequency.set(nGram, (wordFrequency.get(nGram) || 0) + 1);
    }
  });
  return Array.from(wordFrequency).sort(([, countA], [, countB]) => countB - countA).slice(0, 5).map(([key]) => key);
}
function extractNGrams(words) {
  const nGrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    nGrams.push(words[i] + " " + words[i + 1]);
    if (i < words.length - 2) {
      nGrams.push(words[i] + " " + words[i + 1] + " " + words[i + 2]);
    }
  }
  return nGrams;
}
function isStopWord(word, stopWords) {
  return stopWords.has(word);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  analyzeText
});
