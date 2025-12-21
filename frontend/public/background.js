// background.js - Service Worker for Chrome Extension
console.log('Mentorque background script loaded');

// Handle API requests from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[BACKGROUND] Received message:', request);
  console.log('[BACKGROUND] Sender:', sender);
  
  if (request.type === 'API_REQUEST') {
    console.log('[BACKGROUND] Processing API request...');
    handleApiRequest(request, sendResponse);
    return true; // Keep the message channel open for async response
  } else if (request.type === 'DOWNLOAD_CSV') {
    console.log('[BACKGROUND] Processing CSV download request...');
    handleCsvDownload(request, sendResponse);
    return true; // Keep the message channel open for async response
  } else {
    console.log('[BACKGROUND] Unknown message type:', request.type);
    sendResponse({ success: false, error: { message: 'Unknown message type' } });
  }
});

async function handleApiRequest(request, sendResponse) {
  try {
    console.log('[BACKGROUND] Making API request:', {
      url: request.url,
      method: request.method,
      hasApiKey: !!request.headers['x-api-key'],
      hasContentType: !!request.headers['content-type'],
      bodyLength: request.body ? request.body.length : 0
    });
    
    // Validate URL format
    if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) {
      console.error('[BACKGROUND] Invalid URL format - URL does not start with http:// or https://:', request.url);
      sendResponse({
        success: false,
        error: {
          message: `Invalid URL format: ${request.url}. URL must be a full URL starting with http:// or https://`
        }
      });
      return;
    }
    
    // Ensure Content-Type is set for POST requests with body
    const headers = { ...request.headers };
    if (request.method === 'POST' && request.body) {
      headers['content-type'] = 'application/json';
    }
    
    console.log('[BACKGROUND] Request headers:', headers);
    console.log('[BACKGROUND] Request body preview:', request.body ? (typeof request.body === 'string' ? request.body.substring(0, 200) + '...' : JSON.stringify(request.body).substring(0, 200) + '...') : 'No body');
    
    // Use body as-is since apiClient already stringifies it
    let bodyToSend = request.body;
    
    const response = await fetch(request.url, {
      method: request.method,
      headers: headers,
      body: bodyToSend,
      mode: 'cors',
      credentials: 'omit'
    });
    
    console.log('[BACKGROUND] Raw response:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      contentType: response.headers.get('content-type')
    });
    
    // Log 400 errors specifically
    if (response.status === 400) {
      console.error('[BACKGROUND] 400 Bad Request - Request details:', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        bodyPreview: request.body ? (typeof request.body === 'string' ? request.body.substring(0, 500) : JSON.stringify(request.body).substring(0, 500)) : 'No body'
      });
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type') || '';
    let responseData;
    
    if (contentType.includes('application/json')) {
      try {
        responseData = await response.json();
        console.log('[BACKGROUND] JSON response:', responseData);
      } catch (jsonError) {
        console.error('[BACKGROUND] JSON parse error:', jsonError);
        const textResponse = await response.text();
        console.log('[BACKGROUND] Raw response text:', textResponse.substring(0, 200));
        throw new Error(`Invalid JSON response: ${jsonError.message}`);
      }
    } else {
      // Handle non-JSON responses (CSV, text, etc.)
      const textResponse = await response.text();
      console.log('[BACKGROUND] Non-JSON response (content-type:', contentType, '):', textResponse.substring(0, 200));
      // Return as text property so frontend can access it
      responseData = { text: textResponse, contentType: contentType };
    }
    
    sendResponse({
      success: true,
      status: response.status,
      ok: response.ok,
      data: responseData
    });
  } catch (error) {
    console.error('[BACKGROUND] API request failed:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    sendResponse({
      success: false,
      error: {
        message: error.message,
        name: error.name
      }
    });
  }
}

async function handleCsvDownload(request, sendResponse) {
  try {
    console.log('[BACKGROUND] Downloading CSV:', {
      filename: request.filename || 'hr_results.csv',
      csvLength: request.csvText ? request.csvText.length : 0
    });
    
    if (!request.csvText) {
      throw new Error('No CSV text provided');
    }
    
    // Use data URL (works in service workers, no blob URL needed)
    const dataUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent(request.csvText);
    
    console.log('[BACKGROUND] Created data URL, length:', dataUrl.length);
    
    // Use Chrome downloads API with data URL
    chrome.downloads.download({
      url: dataUrl,
      filename: request.filename || 'hr_results.csv',
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('[BACKGROUND] Download error:', chrome.runtime.lastError);
        sendResponse({
          success: false,
          error: {
            message: chrome.runtime.lastError.message
          }
        });
      } else {
        console.log('[BACKGROUND] ✅ Download started, ID:', downloadId);
        sendResponse({
          success: true,
          downloadId: downloadId
        });
      }
    });
  } catch (error) {
    console.error('[BACKGROUND] CSV download failed:', error);
    sendResponse({
      success: false,
      error: {
        message: error.message
      }
    });
  }
}
