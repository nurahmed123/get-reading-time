import { CohereClientV2 } from 'cohere-ai';

interface GenerateResponse {
    message: {
        content: (string | Record<string, any>)[];  // `content` can be an array of strings or objects
    };
}

interface ErrorResponse {
    error: {
        code: string;
        message: string;
        statusCode: number;  // Adding statusCode to represent the HTTP error code
        details?: string;
    };
}

export default class AiTexGen {
    private cohereClient: CohereClientV2;

    constructor(apiKey: string) {
        // Initialize the Cohere client using the provided API key
        if (!apiKey || typeof apiKey !== 'string') {
            throw this.createErrorResponse('API_KEY_MISSING', 'A valid API key must be provided.', 400);
        }
        this.cohereClient = new CohereClientV2({ token: apiKey });
    }

    // Validate user input (topic and word count)
    private validateInputs(topic: string, wordCount: number): void {
        if (typeof topic !== 'string' || topic.trim().length === 0) {
            throw this.createErrorResponse('INVALID_TOPIC', 'Topic must be a non-empty string.', 400);
        }

        // If wordCount is not provided or invalid, default to 100
        if (typeof wordCount !== 'number' || wordCount <= 0) {
            console.warn('Invalid word count provided. Defaulting to 100 words.');
            wordCount = 100;
        }
    }

    // Generate content using Cohere's API
    public async generateContent(topic: string, wordCount: number = 100): Promise<{ topic: string; content: string }> {
        try {
            // Validate the inputs
            this.validateInputs(topic, wordCount);

            // Prepare the prompt to request from Cohere API
            const prompt = `Write a detailed article about ${topic}, aiming for maximum ${wordCount} words.`;

            // Make the request to Cohere's chat API
            const response = await this.cohereClient.chat({
                model: 'command-r-plus',  // Specify the model you want to use
                messages: [
                    {
                        role: 'user',
                        content: prompt,  // Use the prompt with the topic and word count
                    },
                ],
            });

            // Handle response.content properly and format it
            const content = this.processContent(response.message?.content);

            // Return the generated content
            return {
                topic,
                content,
            };
        } catch (error: unknown) {
            console.error('Error generating content from Cohere API:', error);
            throw this.createErrorResponse('API_ERROR', 'Failed to generate content from Cohere API.', 500, this.formatErrorDetails(error));
        }
    }

    // Helper method to process the content and format it properly
    private processContent(content: (string | Record<string, any>)[] | undefined): string {
        if (!content || content.length === 0) {
            return 'No content generated or content is empty.';
        }

        // Format and join content into a clean readable string
        return content.map(item => {
            if (typeof item === 'string') {
                // Trim extra spaces and return the string as is
                return item.trim();
            } else if (typeof item === 'object') {
                // If item is an object, extract the meaningful text content
                return this.extractTextFromObject(item);
            }
            return '';
        }).join(' ').trim();  // Join everything into a single string without \n or escaped characters
    }

    // Helper method to safely extract text from an object, if needed
    private extractTextFromObject(obj: Record<string, any>): string {
        // Extracts the text from the object and returns it as plain text
        if (obj && obj.text) {
            return obj.text.trim();  // Only return the "text" field if it exists
        }
        return '';
    }

    // Helper method to create an error response with a status code
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

    // Helper method to format error details (narrowing down the 'unknown' type)
    private formatErrorDetails(error: unknown): string {
        if (error instanceof Error) {
            // If the error is an instance of Error, return the message
            return error.message;
        } else {
            // If the error is not an instance of Error, return a generic message
            return 'An unknown error occurred.';
        }
    }
}
