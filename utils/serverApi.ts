const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL || '';

export async function fetchFromApi(endpoint: string) {
  try {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

