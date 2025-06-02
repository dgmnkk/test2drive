const BASE_URL = 'https://test2drive-back-e9lyg.ondigitalocean.app';

export const fetchData = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Помилка сервера');
  }

  return response.json();
};