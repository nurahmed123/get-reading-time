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
  aiTexGen: () => aiTexGen,
  analyzeText: () => analyzeText,
  getPunch: () => getPunch,
  langTrans: () => langTrans,
  tableMaker: () => tableMaker
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
    links,
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
  const minutes = parseFloat(readingTimeInMinutes.toFixed(2));
  const seconds = parseFloat(
    ((readingTimeInMinutes - Math.floor(readingTimeInMinutes)) * 60).toFixed(2)
  );
  return { minutes, seconds };
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
  return (text.match(/[aeiouy]{1,2}/gi) || []).length;
}
function analyzeSentiment(text) {
  const sentimentAnalyzer = new import_sentiment.default();
  const result = sentimentAnalyzer.analyze(text);
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
  return Array.from(wordFrequency).sort(([, countA], [, countB]) => countB - countA).slice(0, 5).map(([keyword]) => keyword);
}
function extractNGrams(words) {
  const nGrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    nGrams.push(`${words[i]} ${words[i + 1]}`);
    if (i < words.length - 2) {
      nGrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
  }
  return nGrams;
}
function isStopWord(word, stopWords) {
  return stopWords.has(word);
}

// src/utils/getPunch.ts
var import_axios = __toESM(require("axios"));
var API_URL = "https://ai.hackclub.com/chat/completions";
function getPunch(text) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
      const response = yield import_axios.default.post(API_URL, {
        messages: [
          {
            role: "user",
            content: `Fix the capitalization and punctuation of this text as plain text: "${text}"`
          }
        ],
        temperature: 0
        // Keep corrections consistent
      });
      const correctedText = (_d = (_c = (_b = (_a = response.data.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content) == null ? void 0 : _d.trim();
      if (!correctedText) {
        console.warn("API returned no content.");
        return { content: "No content generated", status_code: 200 };
      }
      return { content: correctedText, status_code: 200 };
    } catch (error) {
      console.error("Error :", error);
      return {
        error: ((_f = (_e = error.response) == null ? void 0 : _e.data) == null ? void 0 : _f.error) || "Failed to get response from the AI server.",
        status_code: 500
      };
    }
  });
}

// src/utils/langTrans.ts
var import_axios2 = __toESM(require("axios"));
var API_URL2 = "https://ai.hackclub.com/chat/completions";
function langTrans(content, language) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
      const response = yield import_axios2.default.post(API_URL2, {
        messages: [
          {
            role: "user",
            content: `Translate this content "${content}" into "${language}".`
          }
        ]
      });
      const translatedText = (_d = (_c = (_b = (_a = response.data.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content) == null ? void 0 : _d.trim();
      if (!translatedText) {
        console.warn("API returned no content.");
        return { content: "No content generated", status_code: 200 };
      }
      return { content: translatedText, status_code: 200 };
    } catch (error) {
      console.error("Error :", error);
      return {
        error: ((_f = (_e = error.response) == null ? void 0 : _e.data) == null ? void 0 : _f.error) || "Failed to get response from the AI server.",
        status_code: 500
      };
    }
  });
}

// src/utils/tableMaker.ts
var import_axios3 = __toESM(require("axios"));
var API_URL3 = "https://ai.hackclub.com/chat/completions";
function tableMaker(content) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!content.trim()) {
      return { error: "Input data cannot be empty.", status_code: 400 };
    }
    try {
      const response = yield import_axios3.default.post(API_URL3, {
        messages: [
          {
            role: "user",
            content: `Convert the following data into a **clean, well-aligned Markdown table**. 
- Ensure all columns have consistent widths.
- Do not wrap the output in markdown code blocks.
- Replace empty fields with "N/A".
- Do not escape "|" inside text.

Data:

"${content}"`
          }
        ],
        temperature: 0.4,
        // Lower temperature ensures more consistent formatting.
        max_tokens: 500
        // Limits the response size.
      });
      let formattedTable = ((_d = (_c = (_b = (_a = response.data.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content) == null ? void 0 : _d.trim()) || "";
      formattedTable = formattedTable.replace(/```markdown|```/g, "").trim();
      formattedTable = formatMarkdownTable(formattedTable);
      if (!formattedTable) {
        console.warn("API returned no content.");
        return { content: "No content generated.", status_code: 200 };
      }
      return { content: formattedTable, status_code: 200 };
    } catch (error) {
      console.error("Error:", error);
      return {
        error: ((_f = (_e = error.response) == null ? void 0 : _e.data) == null ? void 0 : _f.error) || "Failed to process request.",
        status_code: ((_g = error.response) == null ? void 0 : _g.status) || 500
      };
    }
  });
}
function formatMarkdownTable(table) {
  const lines = table.split("\n").map((line) => line.trim()).filter(Boolean);
  const columnWidths = [];
  lines.forEach((line) => {
    const columns = line.split("|").map((col) => col.trim());
    columns.forEach((col, index) => {
      columnWidths[index] = Math.max(columnWidths[index] || 0, col.length);
    });
  });
  const formattedLines = lines.map((line) => {
    const columns = line.split("|").map((col) => col.trim());
    return columns.map((col, index) => col.padEnd(columnWidths[index], " ")).join(" | ");
  });
  return formattedLines.join("\n");
}

// src/utils/aiTexGen.ts
var import_axios4 = __toESM(require("axios"));
var aiTexGen = class {
  // Constructor initializes the API URL
  constructor() {
    this.apiUrl = "https://ai.hackclub.com/chat/completions";
  }
  // Validate the inputs before making the API call
  validateInputs(topic, wordCount) {
    if (typeof topic !== "string" || topic.trim().length === 0) {
      throw this.createErrorResponse("INVALID_TOPIC", "Topic must be a non-empty string.", 400);
    }
    if (typeof wordCount !== "number" || wordCount <= 0) {
      console.warn("Invalid word count provided. Defaulting to 100 words.");
      wordCount = 100;
    }
  }
  /**
   * Generates content based on the topic and word count.
   * 
   * @param topic The topic for the article (e.g., "Artificial Intelligence").
   * @param wordCount The maximum number of words for the article (default is 100).
   * @param markdown If true, returns the content in Markdown format (default is false).
   * @returns A promise that resolves with the topic and generated content.
   */
  generateContent(topic, wordCount = 100, markdown = false) {
    return __async(this, null, function* () {
      var _a, _b, _c;
      try {
        this.validateInputs(topic, wordCount);
        const formatInstruction = markdown ? "Use proper Markdown formatting." : "Use plain text formatting.";
        const prompt = `Write a detailed article about ${topic}, aiming for a maximum of ${wordCount} words. ${formatInstruction}`;
        const response = yield import_axios4.default.post(this.apiUrl, {
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        });
        const content = this.processContent((_c = (_b = (_a = response.data.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content);
        return {
          topic,
          content
        };
      } catch (error) {
        console.error("Error generating content:", error);
        throw this.createErrorResponse("API_ERROR", "Failed to generate content.", 500, this.formatErrorDetails(error));
      }
    });
  }
  // Process and clean up the generated content (e.g., remove extra spaces)
  processContent(content) {
    return (content == null ? void 0 : content.trim()) || "No content generated or content is empty.";
  }
  // Create a structured error response
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
  // Format error details based on the error object
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
  getPunch,
  langTrans,
  tableMaker
});
