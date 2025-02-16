import axios from 'axios';

// Define the interface for the API response format
interface ApiResponse {
    choices?: { message?: { content?: string } }[];
}

// Define the format for the generated content response
interface GenerateResponse {
    topic: string;
    content: string;
}

// Define the format for the error response
interface ErrorResponse {
    error: {
        code: string;
        message: string;
        statusCode: number;
        details?: string;
    };
}

export default class aiTexGen {
    private apiUrl: string;

    // Constructor initializes the API URL
    constructor() {
        this.apiUrl = 'https://ai.hackclub.com/chat/completions';
    }

    // Validate the inputs before making the API call
    private validateInputs(topic: string, wordCount: number): void {
        if (typeof topic !== 'string' || topic.trim().length === 0) {
            throw this.createErrorResponse('INVALID_TOPIC', 'Topic must be a non-empty string.', 400);
        }

        // If the word count is invalid, default it to 100
        if (typeof wordCount !== 'number' || wordCount <= 0) {
            console.warn('Invalid word count provided. Defaulting to 100 words.');
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
    public async generateContent(topic: string, wordCount: number = 100, markdown: boolean = false): Promise<GenerateResponse> {
        try {
            // Validate the inputs
            this.validateInputs(topic, wordCount);

            // Define the formatting instruction based on the markdown flag
            const formatInstruction = markdown
                ? "Use proper Markdown formatting."
                : "Use plain text formatting.";

            // Create the prompt to send to the API
            const prompt = `Write a detailed article about ${topic}, aiming for a maximum of ${wordCount} words. ${formatInstruction}`;

            // Send the request to the API
            const response = await axios.post<ApiResponse>(this.apiUrl, {
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });

            // Process and return the generated content
            const content = this.processContent(response.data.choices?.[0]?.message?.content);

            return {
                topic,
                content,
            };
        } catch (error: unknown) {
            console.error('Error generating content:', error);

            // Create and throw an error response in case of failure
            throw this.createErrorResponse('API_ERROR', 'Failed to generate content.', 500, this.formatErrorDetails(error));
        }
    }

    // Process and clean up the generated content (e.g., remove extra spaces)
    private processContent(content: string | undefined): string {
        return content?.trim() || 'No content generated or content is empty.';
    }

    // Create a structured error response
    private createErrorResponse(code: string, message: string, statusCode: number, details?: string): ErrorResponse {
        return {
            error: {
                code,
                message,
                statusCode,
                details: details || '',
            },
        };
    }

    // Format error details based on the error object
    private formatErrorDetails(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        } else {
            return 'An unknown error occurred.';
        }
    }
}
