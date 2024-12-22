
# Text Analysis Tool

A simple text analysis tool that provides insights into text such as reading time, word count, sentiment, readability score, link count, and SEO-friendly keywords.

## Features

-   **Reading Time**: Estimates how long it will take to read the given text based on a default or custom reading speed (words per minute).
    
-   **Word Count**: Counts the number of words in the text.
    
-   **Character Count**: Counts the number of characters (excluding spaces) in the text.
    
-   **Sentence Count**: Counts the number of sentences based on punctuation marks.
    
-   **Link Count**: Detects and counts the number of URLs in the text.
    
-   **Readability Score**: Calculates the Flesch Reading Ease score to evaluate the text's readability.
    
-   **Sentiment Analysis**: Analyzes the sentiment of the text (Positive, Negative, or Neutral).
    
-   **SEO-friendly Keywords**: Extracts the top 5 SEO-friendly keywords or key phrases (bi-grams and tri-grams) from the text.
    

## Installation

To install the package from npm, run:
``` bash
npm install text-analysis-tool 
```


Or using yarn:
```bash
yarn  add get-reading-time
```

## Usage

Here’s how you can use the analyzeText function to analyze a piece of text:
```bash
import  { analyzeText }  from  'get-reading-time';
```
// Example input text
```javascript
const text =  "This is an example of text. It contains words, sentences, and links like https://example.com.";

const result =  analyzeText(text);

console.log(result);
```
### Example Output
```json
json{
 "readingTime":  {
 "minutes":  0.05,
 "seconds":  5.23
 },
 "wordCount":  13,
 "characterCount":  68,
 "sentenceCount":  2,
 "linkCount":  1,
 "readabilityScore":  78.5,
 "sentiment":  "Positive",
 "keywords":  ["example",  "text",  "words",  "sentences",  "links"]
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
    
-   **isStopWord(word: string, stopWords: Set<string>)**: Checks if a word is a stop word to exclude from keyword extraction.
    

## Contributing

Feel free to fork the repository, make your changes, and submit a pull request. Any contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, feel free to contact [[06nurahmed@gmail.com](06nurahmed@gmail.com)].