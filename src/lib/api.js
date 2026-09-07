// Get raw URL or fallback to localhost
let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 1. Remove any trailing slashes
rawUrl = rawUrl.replace(/\/+$/, '');

// 2. Automatically append /api if it was left off
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

export async function apiRequest(endpoint, options = {}) {
  // Ensure endpoint starts with a single slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${formattedEndpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Sends & receives httpOnly cookies
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}