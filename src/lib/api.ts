/**
 * Utility function for making API requests
 */
export async function apiRequest(
  method: string,
  endpoint: string,
  data?: any
): Promise<Response> {
  // For local storage-based implementation
  if (endpoint === '/api/Savings' && method === 'POST') {
    const { storageService } = await import('./storage');
    try {
      const Saving = storageService.createSaving(data);
      // Create a response with the same structure as a fetch response
      return new Response(JSON.stringify(Saving), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Important for session handling
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    // Try to get error message from response
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If we can't parse the error, use status text
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  return response;
}