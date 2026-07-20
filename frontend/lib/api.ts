export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    try {
        const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, options);
        return response;
    } catch (error) {
        console.error("Network error: Could not connect to the backend.", error);
        throw new TypeError("Failed to fetch. Network error: Could not connect to the backend.");
    }
}
