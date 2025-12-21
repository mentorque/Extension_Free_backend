// utils/apiClient.js - API client that communicates with background script

// Check if chrome runtime is available
const isChromeRuntimeAvailable = () => {
  try {
    return !!(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage);
  } catch (e) {
    return false;
  }
};

export const apiClient = {
  async request(url, options = {}) {
    console.log('[API_CLIENT] Making request through background script:', { url, method: options.method });
    
    // Check if chrome runtime is available
    if (!isChromeRuntimeAvailable()) {
      console.error('[API_CLIENT] Chrome runtime not available. Extension context may be invalidated.');
      return Promise.reject(new Error('Extension context invalidated. Please refresh the page.'));
    }
    
    return new Promise((resolve, reject) => {
      console.log('[API_CLIENT] Sending message to background script...');
      
      try {
        chrome.runtime.sendMessage({
          type: 'API_REQUEST',
          url,
          method: options.method || 'GET',
          headers: options.headers || {},
          body: options.body
        }, (response) => {
          // Check for runtime errors first
          const lastError = chrome.runtime?.lastError;
          if (lastError) {
            console.error('[API_CLIENT] Runtime error:', lastError);
            reject(new Error(lastError.message || 'Extension context invalidated. Please refresh the page.'));
            return;
          }
          
          console.log('[API_CLIENT] Received response from background:', response);
          
          if (!response) {
            console.error('[API_CLIENT] No response from background script');
            reject(new Error('No response from background script. Please refresh the page.'));
            return;
          }
          
          if (response.success) {
            console.log('[API_CLIENT] Request successful:', response);
            resolve({
              ok: response.ok,
              status: response.status,
              json: () => Promise.resolve(response.data)
            });
          } else {
            console.error('[API_CLIENT] Request failed:', response.error);
            reject(new Error(response.error.message || 'Request failed'));
          }
        });
      } catch (error) {
        console.error('[API_CLIENT] Failed to send message:', error);
        reject(new Error('Extension context invalidated. Please refresh the page.'));
      }
    });
  },
  
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  },
  
  async post(url, body, options = {}) {
    console.log('[API_CLIENT] POST request:', {
      url,
      bodyType: typeof body,
      bodyKeys: body ? Object.keys(body) : 'no body',
      hasContentType: !!options.headers?.['content-type']
    });
    
    return this.request(url, {
      ...options,
      method: 'POST',
      headers: {
        ...options.headers
      },
      body: JSON.stringify(body)
    });
  }
};
