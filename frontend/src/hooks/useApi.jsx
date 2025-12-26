import { useState, useMemo } from 'react';
import { apiClient } from '../utils/apiClient';

// Backward + forward compatible API hook
// - Screens expect: { isLoading, error, postData }
// - Also expose: { loading, get, post, put, delete }
const useApi = (baseUrl) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const start = Date.now();
      console.log('[useApi] Request', { endpoint, method: options.method || 'GET', headers: options.headers, bodyPreview: typeof options.body === 'string' ? options.body.slice(0, 200) : options.body });
      
      const response = await apiClient.request(endpoint, {
        ...options,
        headers: {
          ...options.headers
        }
      });

      if (!response.ok) {
        console.error('[useApi] Error response', { 
          status: response.status, 
          endpoint,
          method: options.method || 'GET'
        });
        
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error || errorData.message) {
            errorMessage = errorData.error || errorData.message;
          }
        } catch (e) {
          // If we can't parse the error response, use the status
          console.warn('[useApi] Could not parse error response:', e);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('[useApi] Success JSON', { endpoint, ms: Date.now() - start });
      return data;
    } catch (err) {
      setError(err.message || 'Request failed');
      console.error('[useApi] Request failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const get = (endpoint, options = {}) => {
    const url = baseUrl || endpoint;
    return makeRequest(url, {
      ...options,
      method: 'GET'
    });
  };

  const post = async (endpoint, body, options = {}) => {
    const url = baseUrl || endpoint;
    setLoading(true);
    setError(null);

    try {
      const start = Date.now();
      console.log('[useApi] POST Request', { endpoint: url, bodyPreview: typeof body === 'string' ? body.slice(0, 200) : body });
      
      const response = await apiClient.post(url, body, {
        ...options,
        headers: {
          ...options.headers
        }
      });

      if (!response.ok) {
        console.error('[useApi] Error response', { 
          status: response.status, 
          endpoint: url
        });
        
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error || errorData.message) {
            errorMessage = errorData.error || errorData.message;
          }
        } catch (e) {
          // If we can't parse the error response, use the status
          console.warn('[useApi] Could not parse error response:', e);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('[useApi] Success response', { 
        endpoint: url, 
        ms: Date.now() - start,
        dataType: typeof data,
        hasText: !!data.text,
        isArray: Array.isArray(data),
        dataPreview: data.text ? data.text.substring(0, 100) : (Array.isArray(data) ? `Array(${data.length})` : JSON.stringify(data).substring(0, 100))
      });
      return data;
    } catch (err) {
      setError(err.message || 'Request failed');
      console.error('[useApi] Request failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const put = (endpoint, body, options = {}) => {
    const url = baseUrl || endpoint;
    return makeRequest(url, {
      ...options,
      method: 'PUT',
      body: body // Don't stringify here, let apiClient handle it
    });
  };

  const del = (endpoint, options = {}) => {
    const url = baseUrl || endpoint;
    return makeRequest(url, {
      ...options,
      method: 'DELETE'
    });
  };

  // Compatibility wrapper matching screens' expected API
  const postData = useMemo(() => {
    return async (bodyOrUrl, maybeBody) => {
      if (baseUrl) return post(baseUrl, bodyOrUrl);
      return post(bodyOrUrl, maybeBody);
    };
  }, [baseUrl]);

  const getData = useMemo(() => {
    return async (url) => get(url);
  }, []);

  return {
    loading,
    isLoading: loading,
    error,
    get,
    post,
    put,
    delete: del,
    postData,
    getData,
  };
};

export default useApi;