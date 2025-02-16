
Here’s the updated README with the added **Markdown Table Converter** and **langTrans (Language Translation)** features:


# Text Analysis Tool

A simple text analysis tool that provides insights into text such as reading time, word count, sentiment, readability score, link count, SEO-friendly keywords, Markdown table conversion, and language translation.

## Features

- **Reading Time**: Estimates how long it will take to read the given text based on a default or custom reading speed (words per minute).
- **Word Count**: Counts the number of words in the text.
- **Character Count**: Counts the number of characters (excluding spaces) in the text.
- **Sentence Count**: Counts the number of sentences based on punctuation marks.
- **Link Count**: Detects and counts the number of URLs in the text.
- **Readability Score**: Calculates the Flesch Reading Ease score to evaluate the text's readability.
- **Sentiment Analysis**: Analyzes the sentiment of the text (Positive, Negative, or Neutral).
- **SEO-friendly Keywords**: Extracts the top 5 SEO-friendly keywords or key phrases (bi-grams and tri-grams) from the text.
 -  **aiTexGen**: Allows users to generate content based on a search prompt using the Cohere AI API, with a specified word count.

-  **Automatic Punctuation and Capitalization**: Automatically adds proper punctuation and capitalizes the beginning of sentences in a provided text.
- **Markdown Table Converter**: Converts tabular data from a string or text format into a structured markdown table.
- **langTrans (Language Translation)**: Translates text into any supported language.

## Installation

To install the package from npm, run:

```bash
npm i get-reading-time

```

Or using yarn:

```bash
yarn add get-reading-time

```

## Usage
### Text Analyze

Here’s how you can use the analyzeText function to analyze a piece of text:

```bash
import { analyzeText } from "get-reading-time/dist/index.js";

```

### Example Code

```javascript
const text = `This is an example of text. It contains words, sentences, and links like there are https://linkedin.com/in/06nurahmed https://github.com/nurahmed123`;

const result = analyzeText(text);

// Analyze the text
try {
  const result = analyzeText(text);

  // Output the analysis results
  console.log("Text Analysis Result:");
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  // Narrow the type of error to Error
  if (error instanceof Error) {
    console.error("Error analyzing text:", error.message);
  } else {
    console.error("Unknown error:", error);
  }
}

```

### Example Output

```json
{
  "readingTime": {
    "minutes": 0.09,
    "seconds": 5.1
  },
  "wordCount": 17,
  "characterCount": 132,
  "sentenceCount": 3,
  "linkCount": 2,
  "links": [
    "https://linkedin.com/in/06nurahmed",
    "https://github.com/nurahmed123"
  ],
  "readabilityScore": 21.93039215686275,
  "sentiment": "Neutral",
  "keywords": ["example", "text.", "contains", "words,", "sentences,"]
}

```

### Markdown Table Converter

This feature allows you to convert plain text content into a well-formatted markdown table.

### Example Code

```javascript
import { tableMaker } from "get-reading-time/dist/index.js";

const content = `Fazle Rabbi Khadem  Senior Brand Executive at Meghna Group of Industries  rabbi@example.com  
Abu Obaida Imon  Brand Manager at Partex Star Group  imon@example.com`;

async function TableConversion() {
  try {
    const result = await tableMaker(content);
    console.log("Converted Markdown Table:");
    console.log(result);
  } catch (error) {
    console.error("Error during table conversion:", error);
  }
}

TableConversion();

```

### Example Output

```markdown
| Name                | Position                                      | Email               |
|---------------------|-----------------------------------------------|---------------------|
| Fazle Rabbi Khadem  | Senior Brand Executive at Meghna Group        | rabbi@example.com   |
| Abu Obaida Imon     | Brand Manager at Partex Star Group            | imon@example.com    |

```

### langTrans: Language Translation

This feature allows you to translate any text into different languages. Simply provide the target language, and the tool will return the translated content.

### Example Code

```javascript
import { langTrans } from 'get-reading-time/dist/index.js';

const text = 'Hello, how are you?';
const targetLanguage = 'es'; // 'es' for Spanish. Full Name is also welcome

async function translateText() {
  try {
    const translated = await langTrans(text, targetLanguage);
    console.log("Translated Text:");
    console.log(translated);
  } catch (error) {
    console.error("Error during translation:", error);
  }
}

translateText();

```

### Example Output

```json
{
  "original": "Hello, how are you?",
  "translated": "Hola, ¿cómo estás?"
}

```

### aiTexGen: Generate your content

This new feature allows users to generate content using Cohere AI. You provide your Cohere API key, a search prompt, and a word count, and it will return the generated content.

### Usage

To use the **aiTexGen** feature, follow these steps:

```bash
import { aiTexGen } from "get-reading-time/dist/index.js";

```

### Example Code

```javascript
import { aiTexGen } from '../dist/index.js';

// Replace this with your Cohere API key
const generator = new aiTexGen();

async function GenerateContent() {
    try {
        // Define a topic and word count for testing
        const topic = 'Arduino';
        const wordCount = 100;

        // Call the generateContent method
        const result = await generator.generateContent(topic, wordCount, false);
        //TODO: True is for **Markdown Formate**

        // Output the result in JSON format
        console.log('Generated Content (JSON Format):');
        console.log(JSON.stringify(result, null, 2)); // Pretty print the JSON output

    } catch (error) {
        console.error('Error during content generation:', error);
    }
}
// Run the test
GenerateContent();

```

### Example Output

```json
{
  "topic": "arduino",
  "content": "Arduino is an open-source electronics platform based on easy-to-use hardware and software. It's designed to make interactive projects accessible to everyone, from artists and designers to hobbyists and engineers. \n\nAt the heart of the Arduino platform is the Arduino board, a simple microcontroller board that can read inputs and turn them into outputs, such as turning on an LED light or activating a motor. \n\nWhat makes Arduino unique is its user-friendly approach, with a simplified programming language and easy-to-use hardware, making it a popular choice for beginners and professionals alike. With its versatility and robust community support, Arduino has become a go-to platform for creating interactive, sensor-based projects and prototypes."
}

```

### Automatic Punctuation and Capitalization

You can now pass an article to the `analyzeText` function, and it will automatically fix punctuation and capitalize the first letter of sentences. This feature helps to improve the readability of raw text.

#### Example Code

Import the package and follow the steps:

```javascript
import { getPunch } from 'get-reading-time/dist/index.js';

```

```javascript
// Example to test with a string
import { getPunch } from '../dist/index.js';
// Example to test with a string
const content = "once a lion a fox and a wolf went hunting they ultimately spotted a stag and killed him for their food while sharing the hunt quarter me this stag roared the lion and other animals skinned and cut the spoil into four equal parts";
async function GetPunch() {
    try {
        // Call the getPunch function with content
        const result = await getPunch(content, true); 
        // TODO: true is for markdown | False is Default

        // Check the result and log it as a formatted JSON response
        if (result.status_code === 200) {
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.error("Error:", JSON.stringify(result, null, 2));
        }
    } catch (error) {
        // Handle unexpected errors
        console.error("Unexpected Error:", error);
    }
}
// Run the test
GetPunch();

```

### Example Output

```json
{
  "content": "Once a Lion, a Fox and a Wolf went hunting, they ultimately found a stag and killed him for their food while sharing the hunt quarter me. This stag roared the Lion and other animals skinned and cut the spoil into four equal parts.",
  "status_code": 200
}

```

## Parameters

-   text: The text to be analyzed (required).
-   wordsPerMinute: The reading speed in words per minute (optional, default is 200 words per minute).

## Functions

### analyzeText(text: string, wordsPerMinute: number)

Analyzes the provided text and returns an object containing:

-   readingTime: Estimated reading time in minutes and seconds.
-   wordCount: Total word count.
-   characterCount: Total character count (excluding spaces).
-   sentenceCount: Total sentence count.
-   linkCount: Number of links (URLs) in the text.
-   readabilityScore: Flesch Reading Ease score (higher is easier to read).
-   sentiment: Sentiment of the text (Positive, Negative, or Neutral).
-   keywords: Top 5 SEO-friendly keywords or key phrases.

### Generate Content(topic: string, wordCount: number)

Generates content based on the given topic and word count using the Cohere AI API and returns the generated content.

### Helper Functions

-   **cleanTextInput(text: string)**: Cleans and normalizes the input text.
-   **calculateWordCount(text: string)**: Counts the number of words.
-   **calculateCharacterCount(text: string)**: Counts the number of characters (excluding spaces).
-   **calculateSentenceCount(text: string)**: Counts the number of sentences based on punctuation.
-   **countLinks(text: string)**: Counts the number of links (URLs) in the text.
-   **calculateReadabilityScore(text: string)**: Calculates the Flesch Reading Ease score.
-   **analyzeSentiment(text: string)**: Analyzes sentiment using Sentiment.js.
-   **extractKeywords(text: string)**: Extracts the top 5 SEO-friendly keywords or key phrases.
-   **extractNGrams(words: string[])**: Extracts bi-grams and tri-grams from the list of words.
-   **isStopWord(word: string, stopWords: Set)**: Checks if a word is a stop word to exclude from keyword extraction.
-   **generateContent(words: string[])**: Generates text based on the query and word limit.
-   **autoPunctuateAndCapitalize(text: string)**: Adds punctuation and capitalization to the content.

## Contributing

Feel free to fork the repository, make your changes, and submit a pull request. Any contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/nurahmed123/get-reading-time/blob/main/LICENSE) file for details. [![npm version](https://badge.fury.io/js/get-reading-time.svg)](https://www.npmjs.com/get-reading-time)

## Contact

For issues or suggestions, please open an issue or contact me directly via my [LinkedIn](https://www.linkedin.com/in/06nurahmed) or [GitHub](https://github.com/nurahmed123).
