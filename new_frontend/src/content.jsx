// src/content.jsx
import { createRoot } from 'react-dom/client';
import Main from './Main.jsx';

const overlayContainer = document.createElement('div');
overlayContainer.id = 'linkedin-jd-overlay';

document.body.appendChild(overlayContainer);

const root = createRoot(overlayContainer);
root.render(<Main />);

function scrapeJobDetails() {
  const jobDetailsElement = document.getElementById('job-details');
  
  if (jobDetailsElement) {
    const description = jobDetailsElement.innerText.trim();
  
    
    return {
      success: true,
      description,
    };
  } else {
    return {
      success: false,
      error: "Job details element with ID 'job-details' not found"
    };
  }
}

let currentJobId = null;
let observer = null;

function startObserving() {
  if (observer) observer.disconnect();
  
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // Check if job-details element exists
        const jobDetailsContainer = document.getElementById('job-details');
        
        if (jobDetailsContainer) {
          const jobId = window.location.pathname.split('/').pop();
          if (jobId !== currentJobId) {
            currentJobId = jobId;
            setTimeout(() => {
              const jobData = scrapeJobDetails();
              if (jobData.success) {
                console.log('Job scraped successfully');
                // Send to overlay component
                window.postMessage({
                  type: 'JOB_DETAILS_SCRAPED',
                  data: jobData
                }, '*');
              } else {
                console.log('Failed to scrape job:', jobData.error);
              }
            }, 2000); // Wait for content to load
          }
        }
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Start observing when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startObserving);
} else {
  startObserving();
}

// Also check on URL changes (SPA navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(() => {
      if (url.includes('/jobs/') || url.includes('/job/')) {
        const jobData = scrapeJobDetails();
        if (jobData.success) {
          window.postMessage({
            type: 'JOB_DETAILS_SCRAPED',
            data: jobData
          }, '*');
        }
      }
    }, 2000);
  }
}).observe(document, { subtree: true, childList: true });