import axios from "axios";

// Constants
const API_URL = "https://ai.hackclub.com/chat/completions";

// ✅ Define supported languages for better autocomplete in VS Code
type SupportedLanguages =
    | "English"
    | "Spanish"
    | "French"
    | "German"
    | "Finnish"
    | "Chinese"
    | "Japanese"
    | "Arabic"
    | "Russian"
    | "Hindi"
    | "Bengali"
    | "Portuguese"
    | "Korean"
    | "Italian"
    | "Dutch"
    | "Turkish"
    | "Polish"
    | "Swedish"
    | "Thai"
    | "Greek"
    | "Hebrew"
    | "Vietnamese"
    | "Indonesian"
    | "Filipino"
    | "Romanian"
    | "Czech"
    | "Hungarian"
    | "Danish"
    | "Norwegian"
    | "Ukrainian"
    | "Malay"
    | "Urdu"
    | "Persian (Farsi)"
    | "Tamil"
    | "Telugu"
    | "Marathi"
    | "Gujarati"
    | "Punjabi"
    | "Swahili"
    | "Hausa"
    | "Yoruba"
    | "Zulu"
    | "Burmese"
    | "Khmer"
    | "Lao"

// ✅ Define the type for the API response
type mainApiResponse = {
    choices?: { message?: { content?: string } }[];
};

// ✅ Define the response format for our function
type ApiResponse = {
    /** The translated content */
    content?: string;
    /** Error message, if any */
    error?: string;
    /** Status code: 200 (success) or 500 (error) */
    status_code: number;
};

/**
 * 🌎 Translates a given text into a specified language.
 *
 * @param content - The text you want to translate.
 * @param language - The target language for translation. Use one of the supported languages.
 * @returns A Promise resolving to an object with the translated text or an error message.
 *
 * @example
 * ```typescript
 * const result = await langTrans("Hello, world!", "French");
 * console.log(result.content); // "Bonjour, monde!"
 * ```
 */
export async function langTrans(content: string, language: SupportedLanguages): Promise<ApiResponse> {
    try {
        const response = await axios.post<mainApiResponse>(API_URL, {
            messages: [
                {
                    role: "user",
                    content: `Translate this content "${content}" into "${language}".`,
                },
            ],
        });

        const translatedText = response.data.choices?.[0]?.message?.content?.trim();

        if (!translatedText) {
            console.warn("API returned no content.");
            return { content: "No content generated", status_code: 200 };
        }

        return { content: translatedText, status_code: 200 };
    } catch (error: any) {
        console.error("Error :", error);

        return {
            error:
                error.response?.data?.error ||
                "Failed to get response from the AI server.",
            status_code: 500,
        };
    }
}
