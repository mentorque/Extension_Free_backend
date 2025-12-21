// src/hooks/useApi.jsx
import { useState } from 'react';
import { API_BASE_URL } from '../constants';

const useApi = (endpoint) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const postData = async (body, contentType = 'application/json') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      console.error("API Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, postData };
};

export default useApi;