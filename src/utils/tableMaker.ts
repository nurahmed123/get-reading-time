import axios from "axios";

// ========================================================================
// Configuration & Type Definitions
// ========================================================================

/**
 * API Endpoint for the markdown table conversion service.
 * Replace the URL with your actual endpoint if needed.
 */
const API_URL = "https://ai.hackclub.com/chat/completions"; // Consider changing this URL if necessary

/**
 * Represents the raw response from the chat completions API.
 */
interface ChatCompletionResponse {
    choices?: { message?: { content?: string } }[];
}

/**
 * Represents the final response returned by the tableMaker function.
 */
interface ApiResponse {
    /** The well-formatted Markdown table */
    content?: string;
    /** Error message if the request fails */
    error?: string;
    /** HTTP Status Code (200 = Success, 500 = Error) */
    status_code: number;
}

// ========================================================================
// Main Function: tableMaker
// ========================================================================

/**
 * Converts raw text data into a well-formatted Markdown table.
 * 
 * This function sends the provided text to an AI service, which converts it into a 
 * clean, aligned Markdown table. The response is then post-processed to ensure that
 * each column is uniformly spaced.
 *
 * @param content - The raw text data to be converted into a Markdown table.
 * @returns A Promise that resolves to an object containing the formatted Markdown table or an error message.
 *
 * @example
 * ```typescript
 * const rawData = `This is bob and his age is 25 and lives in Los Angeles. Moreover, Alice lives in New York and her age is 30.`;
 * const result = await tableMaker(rawData);
 * console.log(result.content);
 * // Expected output:
 * // | Name  | Age | City        |
 * // |-------|-----|-------------|
 * // | Alice | 30  | New York    |
 * // | Bob   | 25  | Los Angeles |
 * ```
 */
export async function tableMaker(content: string): Promise<ApiResponse> {
    // Validate input: ensure content is not empty.
    if (!content.trim()) {
        return { error: "Input data cannot be empty.", status_code: 400 };
    }

    try {
        // Send a POST request to the AI text conversion service.
        const response = await axios.post<ChatCompletionResponse>(API_URL, {
            messages: [
                {
                    role: "user",
                    content: `Convert the following data into a **clean, well-aligned Markdown table**. 
- Ensure all columns have consistent widths.
- Do not wrap the output in markdown code blocks.
- Replace empty fields with "N/A".
- Do not escape "|" inside text.

Data:\n\n"${content}"`,
                },
            ],
            temperature: 0.4, // Lower temperature ensures more consistent formatting.
            max_tokens: 500,  // Limits the response size.
        });

        // Extract the table from the API response.
        let formattedTable = response.data.choices?.[0]?.message?.content?.trim() || "";

        // Remove any markdown code block markers, if present.
        formattedTable = formattedTable.replace(/```markdown|```/g, "").trim();

        // Process the table to ensure consistent column alignment.
        formattedTable = formatMarkdownTable(formattedTable);

        // If the formatted table is empty, log a warning and return a default message.
        if (!formattedTable) {
            console.warn("API returned no content.");
            return { content: "No content generated.", status_code: 200 };
        }

        // Return the well-formatted table.
        return { content: formattedTable, status_code: 200 };
    } catch (error: any) {
        console.error("Error:", error);
        // Return a structured error response if the API call fails.
        return {
            error: error.response?.data?.error || "Failed to process request.",
            status_code: error.response?.status || 500,
        };
    }
}

// ========================================================================
// Helper Function: formatMarkdownTable
// ========================================================================

/**
 * Cleans and aligns a raw Markdown table string.
 * 
 * This helper function splits the table into lines, calculates the maximum width for
 * each column, and then pads each cell accordingly so that all columns are uniformly spaced.
 *
 * @param table - The raw Markdown table string.
 * @returns A well-formatted Markdown table string with consistent column widths.
 */
function formatMarkdownTable(table: string): string {
    // Split the table into lines, trim whitespace, and remove empty lines.
    const lines = table.split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    // Calculate the maximum width for each column.
    const columnWidths: number[] = [];
    lines.forEach(line => {
        // Split the line by the '|' character and trim each cell.
        const columns = line.split("|").map(col => col.trim());
        columns.forEach((col, index) => {
            columnWidths[index] = Math.max(columnWidths[index] || 0, col.length);
        });
    });

    // Reconstruct each line with cells padded to the maximum column width.
    const formattedLines = lines.map(line => {
        const columns = line.split("|").map(col => col.trim());
        return columns.map((col, index) => col.padEnd(columnWidths[index], " ")).join(" | ");
    });

    // Join the formatted lines into a single string.
    return formattedLines.join("\n");
}
