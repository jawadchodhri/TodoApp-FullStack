let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
rawUrl = rawUrl.replace(/\/+$/, '');
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

export async function apiRequest(endpoint, options = {}) {
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${formattedEndpoint}`;

  // Retrieve stored token if available
  const token = localStorage.getItem('todo_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: 'include',
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