// src/content.js
import { createRoot } from "react-dom/client";
import Main from "./Main.jsx";
import React from "react";

// -----------------------------------------------------
// 1. Inject React App
// -----------------------------------------------------
console.log("Mentorque content script loaded");

const isTopFrame = (() => {
  try {
    return window.self === window.top;
  } catch (error) {
    console.warn("[MENTORQUE] Unable to determine frame context:", error);
    return true;
  }
})();

if (isTopFrame) {
  if (!document.getElementById("mentorque-overlay")) {
    const overlayContainer = document.createElement("div");
    overlayContainer.id = "mentorque-overlay";
    document.body.appendChild(overlayContainer);

    const root = createRoot(overlayContainer);
    root.render(
      <React.StrictMode>
        <Main />
      </React.StrictMode>
    );
    console.log("React app mounted");
  }
} else {
  console.log("[MENTORQUE] Subframe detected - overlay not mounted");
}

// -----------------------------------------------------
// 2. Chrome Storage Messaging (userData only)
// -----------------------------------------------------
// Check if chrome APIs are available
const isChromeAvailable = () => {
  try {
    return !!(typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local);
  } catch (e) {
    return false;
  }
};

window.addEventListener("message", async (event) => {
  if (event.source !== window) return;
  const { type, payload } = event.data;

  // Check chrome availability before using APIs
  if (!isChromeAvailable()) {
    console.warn("[MENTORQUE] Chrome APIs not available");
    if (type === "GET_USER_DATA") {
      window.postMessage({ type: "USER_DATA_RESPONSE", payload: null }, "*");
    }
    return;
  }

  try {
    if (type === "GET_USER_DATA") {
      const result = await chrome.storage.local.get(["userData"]);
      window.postMessage(
        { type: "USER_DATA_RESPONSE", payload: result.userData || null },
        "*"
      );
    }

    if (type === "SAVE_USER_DATA") {
      await chrome.storage.local.set({ userData: payload });
      console.log("✅ User data saved");
    }

    if (type === "CLEAR_USER_DATA") {
      await chrome.storage.local.remove("userData");
      console.log("✅ User data cleared");
    }
  } catch (err) {
    console.error("❌ Chrome storage error:", err);
    window.postMessage({ type: "USER_DATA_RESPONSE", payload: null }, "*");
  }
});

// Reflect changes across tabs - only add listener if chrome is available
if (isChromeAvailable()) {
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.userData) {
        window.postMessage(
          {
            type: "USER_DATA_RESPONSE",
            payload: changes.userData.newValue || null,
          },
          "*"
        );
      }
    });
  } catch (err) {
    console.warn("[MENTORQUE] Failed to add storage listener:", err);
  }
}

// -----------------------------------------------------
// 3a. Post scraped JOB_DETAILS_SCRAPED to app via custom event
// -----------------------------------------------------
function dispatchAppEvent(eventName, detail) {
  if (!isTopFrame) {
    try {
      if (window.top && window.top.document) {
        window.top.document.dispatchEvent(new CustomEvent(eventName, { detail }));
        return;
      }
    } catch (error) {
      console.warn(`[MENTORQUE] Failed to forward ${eventName} to top frame:`, error);
    }
  }

  document.dispatchEvent(new CustomEvent(eventName, { detail }));
}

function forwardJobDataToApp(jobData) {
  dispatchAppEvent('MENTORQUE_JOB_DATA', jobData);
}

function forwardAppliedJobToApp(jobData) {
  dispatchAppEvent('MENTORQUE_APPLIED_JOB', jobData);
}

// -----------------------------------------------------
// 3. Site Detection & Configuration
// -----------------------------------------------------
function getCurrentSite() {
  const hostname = window.location.hostname;
  if (hostname.includes('linkedin.com')) return 'linkedin';
  if (hostname.includes('indeed.com')) return 'indeed';
  if (hostname.includes('naukri.com')) return 'naukri';
  if (hostname.includes('glassdoor.co')) return 'glassdoor';
  if (hostname.includes('glassdoor.com')) return 'glassdoor';
  return 'unknown';
}

const JOB_INTERACTION_SELECTORS = {
  linkedin: [
    '.jobs-search-results__list-item',
    '.job-card-container',
    '.job-card-list__entity-lockup',
    '[data-view-name="job-card"]',
    '[data-occludable-job-id]'
  ],
  indeed: [
    '.job_seen_beacon',
    '.resultContent',
    '.jobCard_mainContent',
    '.tapItem',
    'a[data-testid="jobTitle"]'
  ]
};

let jobInteractionListenersSetup = false;
const MIN_LINKEDIN_DESCRIPTION_LENGTH = 80;
const LINKEDIN_HEADING_REGEX = /^(about\s+the\s+job|role\s+overview|job\s+summary|about\s+this\s+job)/i;
const MAX_JOB_RETRIES = 4;
let jobRetryState = { key: null, count: 0 };

function isLinkedInHeading(text) {
  if (!text) return false;
  return LINKEDIN_HEADING_REGEX.test(normalizeText(text));
}

function cleanLinkedInDescription(text) {
  if (!text) return '';
  let cleaned = normalizeText(text);
  while (LINKEDIN_HEADING_REGEX.test(cleaned)) {
    cleaned = cleaned.replace(/^(about\s+the\s+job|role\s+overview|job\s+summary|about\s+this\s+job)\s*[:\-–—]*/i, '').trim();
  }
  return cleaned;
}

function extractLinkedInDescription(element) {
  if (!element) return '';
  const clone = element.cloneNode(true);
  const removalSelectors = [
    '.artdeco-inline-feedback',
    '.jobs-description__details',
    '.jobs-description__heading',
    '.jobs-description__heading-container',
    '.jobs-description__job-criteria',
    '.jobs-unified-description__details',
    '.jobs-unified-description__footer',
    '.jobs-description__infogrowl',
    '.jobs-unified-description__heading',
    '.jobs-unified-description__bullet',
    'header'
  ];

  removalSelectors.forEach((selector) => {
    clone.querySelectorAll(selector).forEach((node) => node.remove());
  });

  clone.querySelectorAll('h1, h2, h3, strong').forEach((node) => {
    if (isLinkedInHeading(node.textContent || node.innerText || '')) {
      node.remove();
    }
  });

  return cleanLinkedInDescription(clone.textContent || clone.innerText || '');
}

// -----------------------------------------------------
// 2.5. Text Normalization Utility (Windows-compatible)
// -----------------------------------------------------
// Normalizes text extraction to handle Windows line breaks and whitespace issues
function normalizeText(text) {
  if (!text) return '';
  // Replace all types of whitespace (spaces, tabs, newlines, etc.) with single spaces
  // This fixes issues on Windows where line breaks might be converted incorrectly
  return text
    .replace(/[\s\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g, ' ') // Replace all whitespace with single space
    .trim();
}

// -----------------------------------------------------
// 3a. LinkedIn Scrapers
// -----------------------------------------------------
function expandLinkedInDescription() {
  const buttonSelectors = [
    'button[data-control-name="show_more"]',
    '.show-more-less-html__button',
    'button.jobs-description__footer-button',
    'button.jobs-unified-description__read-more-button',
    'button[data-test="show-more"]'
  ];

  try {
    for (const selector of buttonSelectors) {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach((button) => {
        const label = normalizeText(button.textContent || button.getAttribute('aria-label') || '');
        const isCollapsed = button.getAttribute('aria-expanded') === 'false';
        if ((label && label.toLowerCase().includes('more')) || isCollapsed) {
          button.click();
        }
      });
    }
  } catch (error) {
    console.warn('[MENTORQUE] Failed to expand LinkedIn description:', error);
  }
}

function scrapeJobDetailsLinkedIn() {
  expandLinkedInDescription();

  const descSelectors = [
    '#job-details',
    '.jobs-description__container',
    '.jobs-description__content',
    '.jobs-description-content__text',
    '.jobs-unified-description__content',
    '.jobs-unified-description__section',
    '.jobs-box__html-content',
    '[data-test-description-section]',
    'section.jobs-description',
    'article.jobs-description'
  ];
  
  let description = '';
  for (const selector of descSelectors) {
    const element = document.querySelector(selector);
    if (!element) continue;
    const text = extractLinkedInDescription(element);
    if (!text) continue;

    if (text.length >= MIN_LINKEDIN_DESCRIPTION_LENGTH) {
      description = text;
      break;
    }

    if (!description) {
      description = text;
    }
  }

  if (description.length < MIN_LINKEDIN_DESCRIPTION_LENGTH) {
    const paragraphSelectors = [
      '[data-test-description-section] p',
      '#job-details p',
      '.jobs-description__content p',
      '.jobs-description-content__text p',
      '.jobs-unified-description__content p'
    ];

    const paragraphNodes = document.querySelectorAll(paragraphSelectors.join(', '));
    if (paragraphNodes.length) {
      const aggregatedText = cleanLinkedInDescription(
        Array.from(paragraphNodes)
          .map((node) => {
            const text = cleanLinkedInDescription(node.textContent || node.innerText || '');
            return isLinkedInHeading(text) ? '' : text;
          })
          .filter(Boolean)
          .join(' ')
      );

      if (aggregatedText.length >= MIN_LINKEDIN_DESCRIPTION_LENGTH) {
        description = aggregatedText;
      }
    }
  }

  if (!description || description.length < MIN_LINKEDIN_DESCRIPTION_LENGTH) {
    return { success: false };
  }
  
  // Title
  const titleEl = document.querySelector('h1, .jobs-unified-top-card__job-title, .job-details-jobs-unified-top-card__job-title');
  const title = titleEl ? normalizeText(titleEl.textContent || titleEl.innerText || '') : '';
  
  // Company
  const companyEl = document.querySelector(
    '.jobs-unified-top-card__company-name, .job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__subtitle-primary-grouping a'
  );
  const company = companyEl ? normalizeText(companyEl.textContent || companyEl.innerText || '') : '';

  // Location
  const locationEl = document.querySelector(
    '.jobs-unified-top-card__bullet, .job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__workplace-type'
  );
  const location = locationEl ? normalizeText(locationEl.textContent || locationEl.innerText || '') : '';
  
  return { success: true, description, title, company, location };
}

function checkIfAppliedLinkedIn() {
  const appliedSelectors = [
    '.jobs-details-top-card__apply-status',
    '.jobs-apply-button--applied',
    '[data-control-name="applied_status"]',
    '.artdeco-inline-feedback--success',
    '.jobs-unified-top-card__job-insight-text-button',
  ];

  let isApplied = false;
  let appliedText = '';

  // Check for "Applied" text in various locations
  for (const selector of appliedSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = normalizeText(element.textContent || element.innerText || '');
      if (text.match(/Applied\s+(\d+\s+(minute|hour|day|week|month)s?\s+ago|just now)/i)) {
        isApplied = true;
        appliedText = text;
        break;
      }
    }
  }

  // Additional check: Look for any text containing "Applied X ago" in the top card area
  if (!isApplied) {
    const topCard = document.querySelector('.jobs-unified-top-card, .jobs-details-top-card');
    if (topCard) {
      const normalizedText = normalizeText(topCard.textContent || topCard.innerText || '');
      const match = normalizedText.match(/Applied\s+(\d+\s+(minute|hour|day|week|month)s?\s+ago|just now)/i);
      if (match) {
        isApplied = true;
        appliedText = match[0];
      }
    }
  }

  // Check if the apply button shows "Applied"
  if (!isApplied) {
    const applyButton = document.querySelector('button.jobs-apply-button, button[aria-label*="pplied"]');
    if (applyButton) {
      const buttonText = normalizeText(applyButton.textContent || applyButton.innerText || '');
      const ariaLabel = normalizeText(applyButton.getAttribute('aria-label') || '');
      if (buttonText.toLowerCase().includes('applied') || ariaLabel.toLowerCase().includes('applied')) {
        isApplied = true;
        appliedText = buttonText || ariaLabel;
      }
    }
  }

  return { isApplied, appliedText };
}

// -----------------------------------------------------
// 3b. Indeed Scrapers
// -----------------------------------------------------
function cleanIndeedTitle(text) {
  if (!text) return '';
  // Remove " - job post" suffix that Indeed appends
  return normalizeText(text.replace(/\s*-\s*job\s*post\s*$/i, ''));
}

function scrapeJobDetailsIndeed() {
  // Title - IMPORTANT: Prioritize the job DETAIL panel selectors, not job list selectors
  // The job detail panel uses .jobsearch-JobInfoHeader-title
  // The job LIST uses .jobTitle (which would give wrong job!)
  const detailPanelTitleSelectors = [
    'h1.jobsearch-JobInfoHeader-title',
    'h2.jobsearch-JobInfoHeader-title',
    '.jobsearch-JobInfoHeader-title',
    '[data-testid="jobsearch-JobInfoHeader-title"]',
    '[class*="JobInfoHeader"] h1',
    '[class*="JobInfoHeader"] h2',
    '[class*="jobsearch-JobInfoHeader-title"]'
  ];
  
  let title = '';
  
  // First, try job detail panel selectors (these are the correct ones)
  for (const selector of detailPanelTitleSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = cleanIndeedTitle(element.textContent || element.innerText || '');
      if (text && text.length > 3 && text.length < 200) {
        title = text;
        console.log(`[MENTORQUE] Indeed: Found title via detail panel selector: ${selector}`);
        break;
      }
    }
  }
  
  // Company - from the job detail panel
  const companySelectors = [
    '[data-company-name="true"]',
    'div[data-testid="inlineHeader-companyName"]',
    '[data-testid="company-name"]',
    '[class*="companyName"]',
    '[class*="company-name"]',
    'a[data-testid="company-name"]'
  ];
  
  let company = '';
  for (const selector of companySelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = normalizeText(element.textContent || element.innerText || '');
      if (text && text.length > 0 && text.length < 150) {
        company = text;
        break;
      }
    }
  }
  
  // Description - Get container that includes the heading and description
  let description = '';
  const descContainerEl = document.querySelector('#jobDescriptionText');
  if (descContainerEl) {
    description = normalizeText(descContainerEl.textContent || descContainerEl.innerText || '');
  } else {
    // Fallback: Try getting from heading's parent
    const headingEl = document.querySelector('#jobDescriptionTitleHeading');
    if (headingEl && headingEl.parentElement) {
      description = normalizeText(headingEl.parentElement.textContent || headingEl.parentElement.innerText || '');
    }
  }
  
  // Validation - Title is critical, description is optional
  if (!title) {
    console.log('[MENTORQUE] Indeed scrape failed: No title found in detail panel');
    return { success: false };
  }
  
  console.log('[MENTORQUE] Indeed scrape success:', { title, company, descLength: description.length });
  
  return { 
    success: true, 
    title, 
    company, 
    location: '', 
    description 
  };
}

function checkIfAppliedIndeed() {
  const appliedSelectors = [
    '[data-testid="already-applied"]',
    '.indeed-apply-button-label'
  ];

  let isApplied = false;
  let appliedText = '';

  for (const selector of appliedSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = normalizeText(element.textContent || element.innerText || '');
      if (text.match(/Applied/i)) {
        isApplied = true;
        appliedText = text;
        break;
      }
    }
  }

  return { isApplied, appliedText };
}

// -----------------------------------------------------
// 3c. Naukri Scrapers
// -----------------------------------------------------
function scrapeJobDetailsNaukri() {
  // Title
  const titleEl = document.querySelector('h1');
  const title = titleEl ? normalizeText(titleEl.textContent || titleEl.innerText || '') : '';
  
  // Company - Extract the actual hiring company (e.g., "Sara Interiors")
  let company = '';
  
  // Primary selector: Company name link with specific class structure
  const companySelectors = [
    '#job_header > div.styles_jhc__top__BUxpc > div.styles_jhc__jd-top-head__MFoZl > div.styles_jd-header-comp-name__MvqAI > a',
    'div[class*="jd-header-comp-name"] > a',
    '.styles_jd-header-comp-name__MvqAI > a',
    '[class*="comp-name"] a',
    'a[href*="/company/"]',
    'a[title][class*="hiring-for"]'
  ];
  
  for (const selector of companySelectors) {
    const companyEl = document.querySelector(selector);
    if (companyEl) {
      company = normalizeText(companyEl.textContent || companyEl.innerText || '');
      if (company) {
        console.log(`[MENTORQUE] Found Naukri company via selector: ${selector}`);
        break;
      }
    }
  }
  
  // Description
  const descEl = document.querySelector('div[class*="dang-inner-html"]') ||
                 document.querySelector('.job-description') ||
                 document.querySelector('[class*="JDC"]');
  const description = descEl ? normalizeText(descEl.textContent || descEl.innerText || '') : '';
  
  // Validation
  if (!title || !description) {
    return { success: false };
  }
  
  console.log('[MENTORQUE] Naukri scrape result:', {
    title: title.substring(0, 50) + '...',
    company: company,
    hasDescription: !!description
  });
  
  return { 
    success: true, 
    title, 
    company, 
    location: '', 
    description 
  };
}

function checkIfAppliedNaukri() {
  const appliedSelectors = [
    'button[class*="applied"]',
    '[class*="applied"]',
    '.application-status'
  ];

  let isApplied = false;
  let appliedText = '';

  for (const selector of appliedSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = normalizeText(element.textContent || element.innerText || '');
      if (text.match(/Applied/i)) {
        isApplied = true;
        appliedText = text;
        break;
      }
    }
  }

  return { isApplied, appliedText };
}

// -----------------------------------------------------
// 3d. Glassdoor Scrapers
// -----------------------------------------------------
function scrapeJobDetailsGlassdoor() {
  // Title - Try multiple selectors (reordered based on test results)
  const titleSelectors = [
    'h1', // Most reliable - works in test
    'h1[data-test="job-title"]',
    'div[data-test="job-title"]',
    'header[data-test="job-details-header"] h1',
    'header[data-test="job-details-header"] div[class*="jobTitle"]',
    '.JobDetails_jobDetailsHeader__Hd9M3 h1',
    '.JobDetails_jobDetailsHeader__Hd9M3 div',
    'div[class*="JobDetails_jobDetailsHeader"] h1',
    'div[class*="JobDetails_jobDetailsHeader"] > div:first-child'
  ];
  
  let title = '';
  for (const selector of titleSelectors) {
    const el = document.querySelector(selector);
    if (el) {
      title = normalizeText(el.textContent || el.innerText || '');
      if (title) break;
    }
  }
  
  // Company - Use same selectors as computeJobKey() but with better cleaning
  // Order matters: put the most reliable selector first (based on debug test)
  const companySelectors = [
    'header[data-test="job-details-header"] div[class*="employer"]', // Most reliable based on test
    'div[data-test="employerName"]',
    'a[data-test="employer-name"]',
    'header[data-test="job-details-header"] a[href*="/Overview/"]',
    '.JobDetails_jobDetailsHeader__Hd9M3 a[href*="/Overview/"]',
    'div[data-test="emp-name"]'
  ];
  
  let company = '';
  let companyElement = null;
  
  for (const selector of companySelectors) {
    const el = document.querySelector(selector);
    if (el) {
      let text = normalizeText(el.textContent || el.innerText || '');
      const originalText = text;
      
      // Clean up: remove title if it's concatenated (at start or end)
      if (title) {
        // Remove title from end (most common case: "Company NameJob Title")
        if (text.endsWith(title)) {
          text = text.substring(0, text.length - title.length).trim();
        }
        // Remove title from start
        else if (text.startsWith(title)) {
          text = text.substring(title.length).trim();
        }
        // Remove title from anywhere (as fallback) - use regex for better matching
        else if (text.includes(title)) {
          // Use regex to remove title and any surrounding whitespace
          const titleRegex = new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          text = text.replace(titleRegex, '').trim();
        }
      }
      
      // Additional cleanup: remove common suffixes/prefixes
      text = normalizeText(text.replace(/^[0-9.★\s]+/, '')); // Remove ratings at start
      text = normalizeText(text.replace(/[0-9.★\s]+$/, '')); // Remove ratings at end
      text = normalizeText(text.replace(/\s*Easy Apply.*$/i, ''));
      text = normalizeText(text.replace(/^Easy Apply\s*/i, ''));
      
      // Validate: should be reasonable company name
      // Be more lenient - if we have text after cleaning and it's different from title, use it
      if (text && 
          text.length > 0 && 
          text.length < 150 && // Increased limit slightly
          !text.includes('Easy Apply') && 
          !text.match(/^[0-9.★\s]+$/) && // Not just ratings
          text !== title) { // Not the same as title
        company = text;
        companyElement = el;
        console.log('[MENTORQUE] Glassdoor: Found company:', company, '| Original:', originalText, '| Title:', title);
        break;
      } 
      // Fallback: If cleaning removed everything but original was reasonable, try using original with manual cleanup
      else if (originalText && 
               originalText.length > 0 && 
               originalText.length < 150 &&
               originalText !== title &&
               !originalText.match(/^[0-9.★\s]+$/) &&
               !originalText.includes('Easy Apply')) {
        // Try one more time with just basic cleanup (no title removal)
        let fallbackText = normalizeText(originalText
          .replace(/^[0-9.★\s]+/, '')
          .replace(/[0-9.★\s]+$/, '')
          .replace(/\s*Easy Apply.*$/i, ''));
        
        if (fallbackText && fallbackText.length > 0 && fallbackText !== title) {
          company = fallbackText;
          companyElement = el;
          console.log('[MENTORQUE] Glassdoor: Using fallback company:', company, '| Original:', originalText);
          break;
        }
      }
    }
  }
  
  // Fallback: Try to find company in header structure (more aggressive)
  if (!company) {
    const header = document.querySelector('header[data-test="job-details-header"]');
    if (header) {
      // Look for all links and divs, find the one that's most likely the company
      const candidates = header.querySelectorAll('a[href*="/Overview/"], a[href*="/company/"], div[class*="employer"], div[class*="company"]');
      for (const candidate of candidates) {
        let text = normalizeText(candidate.textContent || candidate.innerText || '');
        const originalText = text;
        
        // Clean title contamination
        if (title) {
          if (text.endsWith(title)) {
            text = text.substring(0, text.length - title.length).trim();
          } else if (text.startsWith(title)) {
            text = text.substring(title.length).trim();
          } else if (text.includes(title)) {
            text = text.replace(title, '').trim();
          }
        }
        
        // Clean ratings and other junk
        text = normalizeText(text.replace(/^[0-9.★\s]+/, ''));
        text = normalizeText(text.replace(/[0-9.★\s]+$/, ''));
        text = normalizeText(text.replace(/\s*Easy Apply.*$/i, ''));
        
        if (text && 
            text.length > 0 && 
            text.length < 100 && 
            text !== title && 
            originalText !== title &&
            !text.includes('Easy Apply')) {
          company = text;
          companyElement = candidate;
          break;
        }
      }
    }
  }
  
  // Description - Try multiple selectors with better fallbacks
  // Order matters: put the most reliable selector first (based on debug test)
  const descSelectors = [
    'div[class*="JobDetails_jobDescription"]', // Most reliable based on test
    'div[data-test="job-description"]',
    '[data-test="job-description"]',
    'div[class*="jobDescription"]',
    'div[class*="JobDescription"]',
    '#JobDescriptionContainer',
    '.JobDetails_jobDetailsContainer__y9P3L div[class*="description"]',
    'div[class*="JobDetails_jobDetailsContainer"] div[class*="description"]'
  ];
  
  let description = '';
  for (const selector of descSelectors) {
    const el = document.querySelector(selector);
    if (el) {
      description = normalizeText(el.textContent || el.innerText || '');
      // Make sure we got a substantial description (not just a few words)
      if (description && description.length > 100) {
        break;
      }
    }
  }
  
  // Fallback: Try to find description in the main container by looking for sections
  if (!description) {
    const container = document.querySelector('.JobDetails_jobDetailsContainer__y9P3L') ||
                     document.querySelector('div[class*="JobDetails_jobDetailsContainer"]');
    if (container) {
      // Look for sections with headings like "Job Description", "About", etc.
      const sections = container.querySelectorAll('div, section');
      for (const section of sections) {
        const text = normalizeText(section.textContent || section.innerText || '');
        const heading = section.querySelector('h2, h3, [class*="heading"], [class*="title"]');
        const headingText = heading ? normalizeText(heading.textContent || heading.innerText || '').toLowerCase() : '';
        
        // Check if this section is likely the job description
        if (text.length > 200 && 
            (headingText.includes('description') || 
             headingText.includes('about') || 
             headingText.includes('job') ||
             !heading)) { // Or no heading at all (might be main description)
          // Skip if it contains buttons or is too short
          if (!section.querySelector('button[class*="apply"]') &&
              !text.includes('Easy Apply') &&
              !text.includes('Save Job')) {
            description = text;
            break;
          }
        }
      }
      
      // Last resort: Find the largest text block
      if (!description) {
        const allDivs = container.querySelectorAll('div');
        let maxLength = 0;
        for (const div of allDivs) {
          const text = normalizeText(div.textContent || div.innerText || '');
          // Skip if it contains buttons, links to other sections, etc.
          if (text.length > maxLength && 
              text.length > 200 && 
              !text.includes('Easy Apply') &&
              !text.includes('Save Job') &&
              !div.querySelector('button[class*="apply"]') &&
              !div.closest('[class*="header"]')) { // Not in header
            description = text;
            maxLength = text.length;
          }
        }
      }
    }
  }
  
  // Validation - Title is required, description is optional
  if (!title) {
    console.log('[MENTORQUE] Glassdoor scrape failed:', {
      hasTitle: !!title,
      hasCompany: !!company,
      hasDescription: !!description,
      title: '',
      company: company ? company.substring(0, 50) : ''
    });
    return { success: false };
  }
  
  // Description is optional - we can still track the job without it
  // But log a warning if missing
  if (!description) {
    console.log('[MENTORQUE] Glassdoor: Description not found, but proceeding with title and company');
  }
  
  return { 
    success: true, 
    title, 
    company, 
    location: '', 
    description 
  };
}

function checkIfAppliedGlassdoor() {
  const appliedSelectors = [
    'button[data-test="applied"]',
    '[class*="applied"]',
    'button[aria-label*="pplied"]'
  ];

  let isApplied = false;
  let appliedText = '';

  for (const selector of appliedSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = normalizeText(element.textContent || element.innerText || '');
      if (text.match(/Applied/i)) {
        isApplied = true;
        appliedText = text;
        break;
      }
    }
  }

  // Fallback: Check all buttons for "Applied" text
  if (!isApplied) {
    const buttons = document.querySelectorAll('button');
    for (const button of buttons) {
      const text = normalizeText(button.textContent || button.innerText || '');
      if (text.match(/Applied/i)) {
        isApplied = true;
        appliedText = text;
        break;
      }
    }
  }

  return { isApplied, appliedText };
}

// -----------------------------------------------------
// 3e. Unified Scrapers (with site detection)
// -----------------------------------------------------
function scrapeJobDetails() {
  const site = getCurrentSite();
  console.log(`[MENTORQUE] Scraping job from: ${site}`);
  
  switch(site) {
    case 'linkedin':
      return scrapeJobDetailsLinkedIn();
    case 'indeed':
      return scrapeJobDetailsIndeed();
    case 'naukri':
      return scrapeJobDetailsNaukri();
    case 'glassdoor':
      return scrapeJobDetailsGlassdoor();
    default:
      console.log('[MENTORQUE] Unknown site, skipping scrape');
      return { success: false };
  }
}

function checkIfApplied() {
  const site = getCurrentSite();
  console.log(`[MENTORQUE] Checking if job is applied on ${site}...`);
  
  let result = { isApplied: false, appliedText: '' };
  
  switch(site) {
    case 'linkedin':
      result = checkIfAppliedLinkedIn();
      break;
    case 'indeed':
      result = checkIfAppliedIndeed();
      break;
    case 'naukri':
      result = checkIfAppliedNaukri();
      break;
    case 'glassdoor':
      result = checkIfAppliedGlassdoor();
      break;
  }
  
  console.log(`[MENTORQUE] Applied status check result:`, result);
  return result;
}

// -----------------------------------------------------
// 4. Job Key & Change Detection
// -----------------------------------------------------
let currentJobKey = null;

function computeJobKey() {
  const site = getCurrentSite();
  const urlPart = window.location.pathname + window.location.search;
  
  // Get title based on site
  let titleEl = null;
  let companyEl = null;
  switch(site) {
    case 'linkedin':
      titleEl = document.querySelector('h1, .jobs-unified-top-card__job-title');
      break;
    case 'indeed':
      titleEl = document.querySelector('h1.jobsearch-JobInfoHeader-title, h2.jobTitle');
      break;
    case 'naukri':
      titleEl = document.querySelector('h1');
      break;
    case 'glassdoor':
      // For Glassdoor, try multiple selectors to get title
      const titleSelectors = [
        'h1[data-test="job-title"]',
        'header[data-test="job-details-header"] h1',
        'header[data-test="job-details-header"] div[class*="jobTitle"]',
        '.JobDetails_jobDetailsHeader__Hd9M3 h1',
        '.JobDetails_jobDetailsHeader__Hd9M3 div:first-child',
        'h1'
      ];
      for (const sel of titleSelectors) {
        const el = document.querySelector(sel);
        if (el) {
          const text = normalizeText(el.textContent || el.innerText || '');
          if (text && text.length > 0) {
            titleEl = el;
            break;
          }
        }
      }
      
      // Also get company for better uniqueness (since URL doesn't change in split-view)
      const companySelectors = [
        'div[data-test="employerName"]',
        'a[data-test="employer-name"]',
        'header[data-test="job-details-header"] a[href*="/Overview/"]',
        'header[data-test="job-details-header"] div[class*="employer"]',
        '.JobDetails_jobDetailsHeader__Hd9M3 a[href*="/Overview/"]'
      ];
      for (const sel of companySelectors) {
        const el = document.querySelector(sel);
        if (el) {
          const text = normalizeText(el.textContent || el.innerText || '');
          if (text && text.length > 0 && text.length < 100 && !text.includes('Easy Apply')) {
            companyEl = el;
            break;
          }
        }
      }
      break;
  }
  
  const title = titleEl ? normalizeText(titleEl.textContent || titleEl.innerText || '') : '';
  const company = companyEl ? normalizeText(companyEl.textContent || companyEl.innerText || '') : '';
  
  // For Glassdoor split-view, include company in key since URL doesn't change
  if (site === 'glassdoor') {
    // Always include company slot (even if empty) for consistency
    return `${site}::${urlPart}::${title}::${company}`;
  }
  
  return `${site}::${urlPart}::${title}`;
}

function isJobPage() {
  const site = getCurrentSite();
  const url = window.location.href;
  
  switch(site) {
    case 'linkedin':
      return url.includes('/jobs/');
    case 'indeed':
      return url.includes('/viewjob?') || url.includes('jobs?');
    case 'naukri':
      return url.includes('/job-listings-');
    case 'glassdoor':
      // For Glassdoor, check both URL pattern AND if job detail pane is visible
      const hasJobUrl = url.includes('/job-listing/') || url.includes('/Job/') || url.includes('/job/') || url.includes('/GD_JobDetail');
      if (hasJobUrl) return true;
      
      // For split-view (search results page), check if job detail pane is visible
      if (url.includes('/Job/index.htm') || url.includes('/Job/')) {
        const jobDetailContainer = document.querySelector('.JobDetails_jobDetailsContainer__y9P3L') ||
                                  document.querySelector('div[class*="JobDetails_jobDetailsContainer"]') ||
                                  document.querySelector('header[data-test="job-details-header"]');
        const hasJobTitle = document.querySelector('h1[data-test="job-title"]') ||
                           document.querySelector('header[data-test="job-details-header"] h1');
        return !!(jobDetailContainer && hasJobTitle);
      }
      return false;
    default:
      return false;
  }
}

function handleJobChange(force = false) {
  const startTime = Date.now();
  const key = computeJobKey();
  const site = getCurrentSite();

  if (jobRetryState.key !== key) {
    jobRetryState = { key, count: 0 };
  }

  const scheduleRetry = (delay = 400) => {
    if (jobRetryState.count >= MAX_JOB_RETRIES) {
      console.warn('[MENTORQUE] Max retry attempts reached for key:', key);
      return;
    }
    jobRetryState.count += 1;
    console.log(`[MENTORQUE] Scheduling retry #${jobRetryState.count} in ${delay}ms for key: ${key}`);
    setTimeout(() => handleJobChange(true), delay);
  };
  
  console.log(`[MENTORQUE] handleJobChange called - force: ${force}, key: ${key}, currentKey: ${currentJobKey}`);
  
  // For Glassdoor, be more lenient with key comparison (title/company might load at different times)
  if (!force && key === currentJobKey) {
    // If key is the same but it's just "glassdoor::url::" (empty title/company), still process
    if (site === 'glassdoor' && key.includes('glassdoor::') && !key.split('::')[2] && !key.split('::')[3]) {
      console.log('[MENTORQUE] Glassdoor: Empty key detected, waiting for content to load...');
      // Wait a bit and try again
      setTimeout(() => handleJobChange(true), 500);
      return;
    }
    console.log('[MENTORQUE] Job key unchanged, skipping processing');
    return;
  }
  
  currentJobKey = key;
  console.log(`[MENTORQUE] Processing job change for key: ${key}`);
  
  // For Glassdoor, add a delay to ensure content is fully loaded (description loads dynamically)
  if (site === 'glassdoor' && !force) {
    // Try immediately first
    const jobData = scrapeJobDetails();
    
    if (!jobData.success || !jobData.description) {
      scheduleRetry(500);
      return;
    }
    
    jobRetryState = { key, count: 0 };
    processJobData(jobData, startTime);
    return;
  }
  
  const jobData = scrapeJobDetails();
  if (!jobData.success) {
    if (['linkedin', 'indeed', 'naukri', 'glassdoor'].includes(site)) {
      scheduleRetry(site === 'linkedin' ? 350 : 450);
      return;
    }
  }
  
  jobRetryState = { key, count: 0 };
  processJobData(jobData, startTime);
}

function processJobData(jobData, startTime) {
  if (jobData.success) {
    console.log('[MENTORQUE] Job data scraped successfully:', {
      title: jobData.title?.substring(0, 50) + (jobData.title?.length > 50 ? '...' : ''),
      company: jobData.company,
      location: jobData.location,
      url: window.location.href
    });
    
    window.postMessage({ type: "JOB_DETAILS_SCRAPED", data: jobData }, "*");
    forwardJobDataToApp(jobData);
    
    // Automatic job tracking removed - use "Track Job" button instead
    const duration = Date.now() - startTime;
    console.log(`[MENTORQUE] Job data scraped successfully (${duration}ms)`);
    console.log('[MENTORQUE] Note: Automatic job tracking is disabled. Use "Track Job" button to track applications.');
  } else {
    const duration = Date.now() - startTime;
    console.log(`[MENTORQUE] Failed to scrape job data (${duration}ms):`, jobData);
  }
}

// -----------------------------------------------------
// 5. Observers & Initialization
// -----------------------------------------------------
// Debounce function to prevent too many rapid calls
let debounceTimer = null;
let lastCheckTime = 0;
function debounceHandleJobChange(delay = 200) {
  const now = Date.now();
  // Throttle: don't check more than once per delay period
  if (now - lastCheckTime < delay) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      lastCheckTime = Date.now();
      if (isJobPage()) {
        handleJobChange();
      }
    }, delay);
  } else {
    lastCheckTime = now;
    if (isJobPage()) {
      handleJobChange();
    }
  }
}

function setupJobInteractionListeners() {
  if (!isTopFrame || jobInteractionListenersSetup) return;

  const site = getCurrentSite();
  const selectors = JOB_INTERACTION_SELECTORS[site];
  if (!selectors || selectors.length === 0) return;

  const handlePotentialInteraction = (event) => {
    const target = event.target;
    if (!target || !isJobPage()) return;
    const matched = selectors.some((selector) => target.closest(selector));
    if (matched) {
      setTimeout(() => debounceHandleJobChange(220), 150);
    }
  };

  document.addEventListener('click', handlePotentialInteraction, true);
  document.addEventListener(
    'keyup',
    (event) => {
      if (
        (event.key === 'ArrowDown' ||
          event.key === 'ArrowUp' ||
          event.key === 'Enter') &&
        isJobPage()
      ) {
        setTimeout(() => debounceHandleJobChange(220), 150);
      }
    },
    true
  );

  jobInteractionListenersSetup = true;
  console.log(`[MENTORQUE] Job interaction listeners active for ${site}`);
}

// Observe DOM for job details
const observer = new MutationObserver(() => {
  const site = getCurrentSite();
  if (site === 'glassdoor') {
    // For Glassdoor, use debounced handler with shorter delay
    debounceHandleJobChange(150);
  } else {
    if (isJobPage()) {
      handleJobChange();
    }
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
  attributes: true
});

setupJobInteractionListeners();

setInterval(() => {
  if (isJobPage()) {
    handleJobChange();
  }
}, 3000);

// Glassdoor-specific observers: Watch multiple containers
let glassdoorObservers = [];
function setupGlassdoorObservers() {
  // Don't set up multiple times
  if (glassdoorObservers.length > 0) return;
  
  // Watch job detail container
  const jobDetailContainer = document.querySelector('.JobDetails_jobDetailsContainer__y9P3L') ||
                            document.querySelector('div[class*="JobDetails_jobDetailsContainer"]');
  
  if (jobDetailContainer) {
    const containerObserver = new MutationObserver(() => {
      debounceHandleJobChange(150);
    });
    containerObserver.observe(jobDetailContainer, { 
      childList: true, 
      subtree: true, 
      characterData: true,
      attributes: true
    });
    glassdoorObservers.push(containerObserver);
    console.log('[MENTORQUE] Glassdoor job detail container observer set up');
  }
  
  // Watch job header
  const jobHeader = document.querySelector('header[data-test="job-details-header"]');
  if (jobHeader) {
    const headerObserver = new MutationObserver(() => {
      debounceHandleJobChange(150);
    });
    headerObserver.observe(jobHeader, { 
      childList: true, 
      subtree: true, 
      characterData: true,
      attributes: true
    });
    glassdoorObservers.push(headerObserver);
    console.log('[MENTORQUE] Glassdoor job header observer set up');
  }
  
  // Watch job list container for clicks (backup detection)
  const jobListContainer = document.querySelector('[data-test="job-list"]') ||
                           document.querySelector('ul[class*="jobsList"]') ||
                           document.querySelector('div[class*="JobsList"]');
  
  if (jobListContainer) {
    // Listen for clicks on job items
    jobListContainer.addEventListener('click', (e) => {
      // Check if clicked element is a job item
      const jobItem = e.target.closest('[data-test="job-item"]') ||
                     e.target.closest('li[class*="job"]') ||
                     e.target.closest('div[class*="JobCard"]');
      if (jobItem) {
        console.log('[MENTORQUE] Glassdoor: Job item clicked, checking for changes...');
        setTimeout(() => {
          debounceHandleJobChange(200);
        }, 300);
      }
    }, true);
    console.log('[MENTORQUE] Glassdoor job list click listener set up');
  }
}

// Watch for URL changes (for SPA navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    if (isJobPage()) {
      handleJobChange();
    }
    // Re-setup Glassdoor observers if needed
    if (getCurrentSite() === 'glassdoor') {
      glassdoorObservers = []; // Reset to allow re-setup
      setTimeout(setupGlassdoorObservers, 300);
    }
  }
}).observe(document, { subtree: true, childList: true });

// Initial scrape on load if already on a job page
if (isJobPage()) {
  setTimeout(() => {
  handleJobChange(true);
    // Setup Glassdoor observers after initial load
    if (getCurrentSite() === 'glassdoor') {
      setupGlassdoorObservers();
    }
  }, 1000);
}

// Periodically check for Glassdoor job detail container (in case it loads later)
if (getCurrentSite() === 'glassdoor') {
  const checkInterval = setInterval(() => {
    if (document.querySelector('.JobDetails_jobDetailsContainer__y9P3L') || 
        document.querySelector('div[class*="JobDetails_jobDetailsContainer"]')) {
      setupGlassdoorObservers();
    }
  }, 1000);
  
  // Stop checking after 30 seconds
  setTimeout(() => clearInterval(checkInterval), 30000);
  
  // Periodic fallback check for Glassdoor (every 2 seconds)
  // This catches any job changes that the observers might miss
  setInterval(() => {
    if (isJobPage()) {
      const newKey = computeJobKey();
      if (newKey && newKey !== currentJobKey && newKey.includes('::') && newKey.split('::').length >= 3) {
        const title = newKey.split('::')[2];
        const company = newKey.split('::')[3] || '';
        // Only trigger if we have a meaningful title
        if (title && title.length > 0) {
          console.log('[MENTORQUE] Glassdoor: Periodic check detected job change:', newKey);
          handleJobChange();
        }
      }
    }
  }, 2000);
}

console.log(`[MENTORQUE] Job observer running for ${getCurrentSite()}`);

// -----------------------------------------------------
// 6. Watch for Application Success Modal (LinkedIn)
// -----------------------------------------------------
// DISABLED: Automatic job tracking is now disabled.
// Users must use the "Track Job" button to manually track applications.
function watchForApplicationModal() {
  console.log('[MENTORQUE] Application modal watcher is DISABLED - use "Track Job" button to track applications');
  // Function body removed to prevent automatic tracking
}

// Don't start watching for application modals (automatic tracking disabled)
// watchForApplicationModal();
