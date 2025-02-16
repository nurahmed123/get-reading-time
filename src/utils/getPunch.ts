import axios from "axios";

// ✅ API Endpoint
const API_URL = "https://ai.hackclub.com/chat/completions";

// ✅ Define API response structure
type mainApiResponse = {
  choices?: { message?: { content?: string } }[];
};

// ✅ Define the expected return type
type ApiResponse = {
  /** The corrected text output */
  content?: string;
  /** Error message if the request fails */
  error?: string;
  /** HTTP Status Code (200 = Success, 500 = Error) */
  status_code: number;
};

/**
 * ✨ Fixes capitalization and punctuation in a given text.
 * 
 * @param text - The text that needs correction.
 * @returns A Promise resolving to an object with the corrected text or an error message.
 *
 * @example
 * ```typescript
 * const result = await getPunch("hELLo, HOW Are YOU?");
 * console.log(result.content); // "Hello, how are you?"
 * ```
 */
export async function getPunch(text: string): Promise<ApiResponse> {
  try {
    // ✅ API Request
    const response = await axios.post<mainApiResponse>(API_URL, {
      messages: [
        {
          role: "user",
          content: `Fix the capitalization and punctuation of this text as plain text: "${text}"`,
        },
      ],
      temperature: 0, // Keep corrections consistent
    });

    // ✅ Extract AI response
    const correctedText = response.data.choices?.[0]?.message?.content?.trim();

    // ✅ Handle empty response
    if (!correctedText) {
      console.warn("API returned no content.");
      return { content: "No content generated", status_code: 200 };
    }

    return { content: correctedText, status_code: 200 };
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
