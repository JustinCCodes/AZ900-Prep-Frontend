const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5148/api";

// Generic function to make API requests
export async function apiRequest<T>(
  endpoint: string, // API endpoint
  options?: RequestInit // Fetch options
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options, // Spread custom options
    headers: {
      "Content-Type": "application/json", // Default header
      ...options?.headers, // Merge with any custom headers
    },
  });

  // Handles non-OK responses
  if (!response.ok) {
    const error = await response
      .json() // Parse error response
      .catch(() => ({ description: "An unknown error occurred" })); // Fallback error
    // Throw error with description
    throw new Error(
      error.description || `HTTP error! status: ${response.status}`
    );
  }

  // Parse and return JSON response
  return response.json() as Promise<T>;
}
