import axios from "axios";

// Constants
const API_URL = "https://418f-35-160-232-33.ngrok-free.app/get-reading-time";
const SECRET_CODE = "amrseccode";

// Define the type for the API response
type ApiResponse = {
  formatted_text?: string;
  error?: string;
  status_code: number;
  content?: string;  // Add content property to ApiResponse
};

// Function to send the POST request
export async function getPunch(next: string): Promise<ApiResponse> {
  try {
    const response = await axios.post<ApiResponse>(API_URL, {
      secret_code: SECRET_CODE,
      content: next,
    });

    // Return the response with formatted_text as content
    return {
      content: response.data.formatted_text || "No content returned",
      status_code: 200,
    };
  } catch (error: any) {
    // Return the error with a failure status code
    return {
      error: error.response?.data || "Failed to get response from the server.",
      status_code: 500,
    };
  }
}
