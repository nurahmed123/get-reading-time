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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var index_exports = {};
__export(index_exports, {
  aiTexGen: () => AiTexGen,
  analyzeText: () => analyzeText,
  getPunch: () => getPunch
});
module.exports = __toCommonJS(index_exports);

// src/utils/analyzeText.ts
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
    // Link count remains for backward compatibility
    links,
    // Add all links in the result
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
  return matches || [];
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

// src/utils/getPunch.ts
var import_axios = __toESM(require("axios"));
var API_URL = "https://e4fc-35-185-85-107.ngrok-free.app/get-reading-time";
var SECRET_CODE = "amrseccode";
function getPunch(next) {
  return __async(this, null, function* () {
    var _a;
    try {
      const response = yield import_axios.default.post(API_URL, {
        secret_code: SECRET_CODE,
        content: next
      });
      return {
        content: response.data.formatted_text || "No content returned",
        status_code: 200
      };
    } catch (error) {
      return {
        error: ((_a = error.response) == null ? void 0 : _a.data) || "Failed to get response from the server.",
        status_code: 500
      };
    }
  });
}

// src/utils/aiTexGen.ts
var import_cohere_ai = require("cohere-ai");
var AiTexGen = class {
  constructor(apiKey) {
    if (!apiKey || typeof apiKey !== "string") {
      throw this.createErrorResponse("API_KEY_MISSING", "A valid API key must be provided.", 400);
    }
    this.cohereClient = new import_cohere_ai.CohereClientV2({ token: apiKey });
  }
  // Validate user input (topic and word count)
  validateInputs(topic, wordCount) {
    if (typeof topic !== "string" || topic.trim().length === 0) {
      throw this.createErrorResponse("INVALID_TOPIC", "Topic must be a non-empty string.", 400);
    }
    if (typeof wordCount !== "number" || wordCount <= 0) {
      console.warn("Invalid word count provided. Defaulting to 100 words.");
      wordCount = 100;
    }
  }
  // Generate content using Cohere's API
  generateContent(topic, wordCount = 100) {
    return __async(this, null, function* () {
      var _a;
      try {
        this.validateInputs(topic, wordCount);
        const prompt = `Write a detailed article about ${topic}, aiming for maximum ${wordCount} words.`;
        const response = yield this.cohereClient.chat({
          model: "command-r-plus",
          // Specify the model you want to use
          messages: [
            {
              role: "user",
              content: prompt
              // Use the prompt with the topic and word count
            }
          ]
        });
        const content = this.processContent((_a = response.message) == null ? void 0 : _a.content);
        return {
          topic,
          content
        };
      } catch (error) {
        console.error("Error generating content from Cohere API:", error);
        throw this.createErrorResponse("API_ERROR", "Failed to generate content from Cohere API.", 500, this.formatErrorDetails(error));
      }
    });
  }
  // Helper method to process the content and format it properly
  processContent(content) {
    if (!content || content.length === 0) {
      return "No content generated or content is empty.";
    }
    return content.map((item) => {
      if (typeof item === "string") {
        return item.trim();
      } else if (typeof item === "object") {
        return this.extractTextFromObject(item);
      }
      return "";
    }).join(" ").trim();
  }
  // Helper method to safely extract text from an object, if needed
  extractTextFromObject(obj) {
    if (obj && obj.text) {
      return obj.text.trim();
    }
    return "";
  }
  // Helper method to create an error response with a status code
  createErrorResponse(code, message, statusCode, details) {
    return {
      error: {
        code,
        message,
        statusCode,
        details: details || ""
      }
    };
  }
  // Helper method to format error details (narrowing down the 'unknown' type)
  formatErrorDetails(error) {
    if (error instanceof Error) {
      return error.message;
    } else {
      return "An unknown error occurred.";
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  aiTexGen,
  analyzeText,
  getPunch
});
