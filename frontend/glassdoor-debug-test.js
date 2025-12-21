// ============================================
// GLASSDOOR SCRAPER DEBUG TEST
// Run this in the console on a Glassdoor job page
// ============================================

console.log('=== GLASSDOOR SCRAPER DEBUG TEST ===\n');

// 1. TEST TITLE SELECTORS
console.log('--- TITLE SELECTORS ---');
const titleSelectors = [
  'h1[data-test="job-title"]',
  'div[data-test="job-title"]',
  'h1',
  'header[data-test="job-details-header"] h1',
  'header[data-test="job-details-header"] div[class*="jobTitle"]',
  '.JobDetails_jobDetailsHeader__Hd9M3 h1',
  '.JobDetails_jobDetailsHeader__Hd9M3 div',
  'div[class*="JobDetails_jobDetailsHeader"] h1',
  'div[class*="JobDetails_jobDetailsHeader"] > div:first-child'
];

let title = '';
let titleSelector = '';
for (const selector of titleSelectors) {
  const el = document.querySelector(selector);
  if (el) {
    const text = el.textContent.trim();
    if (text && text.length > 0) {
      title = text;
      titleSelector = selector;
      console.log(`✅ FOUND: "${title}" | Selector: ${selector}`);
      break;
    } else {
      console.log(`❌ Found element but empty: ${selector}`);
    }
  } else {
    console.log(`❌ Not found: ${selector}`);
  }
}

if (!title) {
  console.log('⚠️ NO TITLE FOUND!');
}

console.log('\n--- COMPANY SELECTORS ---');
const companySelectors = [
  'div[data-test="employerName"]',
  'a[data-test="employer-name"]',
  'header[data-test="job-details-header"] a[href*="/Overview/"]',
  'header[data-test="job-details-header"] div[class*="employer"]',
  '.JobDetails_jobDetailsHeader__Hd9M3 a[href*="/Overview/"]',
  'div[data-test="emp-name"]'
];

let company = '';
let companySelector = '';
let companyOriginal = '';

for (const selector of companySelectors) {
  const el = document.querySelector(selector);
  if (el) {
    let text = el.textContent.trim();
    const originalText = text;
    
    console.log(`\nTesting: ${selector}`);
    console.log(`  Original text: "${originalText}"`);
    
    // Clean up: remove title if it's concatenated
    if (title) {
      if (text.endsWith(title)) {
        text = text.substring(0, text.length - title.length).trim();
        console.log(`  After removing title from end: "${text}"`);
      } else if (text.startsWith(title)) {
        text = text.substring(title.length).trim();
        console.log(`  After removing title from start: "${text}"`);
      } else if (text.includes(title)) {
        const titleRegex = new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        text = text.replace(titleRegex, '').trim();
        console.log(`  After removing title from anywhere: "${text}"`);
      }
    }
    
    // Additional cleanup
    const beforeClean = text;
    text = text.replace(/^[0-9.★\s]+/, '').trim();
    text = text.replace(/[0-9.★\s]+$/, '').trim();
    text = text.replace(/\s*Easy Apply.*$/i, '').trim();
    text = text.replace(/^Easy Apply\s*/i, '').trim();
    if (beforeClean !== text) {
      console.log(`  After rating cleanup: "${text}"`);
    }
    
    // Validate
    const isValid = text && 
                    text.length > 0 && 
                    text.length < 150 && 
                    !text.includes('Easy Apply') && 
                    !text.match(/^[0-9.★\s]+$/) && 
                    text !== title;
    
    console.log(`  Final cleaned: "${text}"`);
    console.log(`  Valid: ${isValid ? '✅ YES' : '❌ NO'}`);
    
    if (isValid) {
      company = text;
      companySelector = selector;
      companyOriginal = originalText;
      console.log(`\n✅ COMPANY FOUND: "${company}" | Selector: ${selector}`);
      break;
    }
  } else {
    console.log(`❌ Not found: ${selector}`);
  }
}

// Fallback company search
if (!company) {
  console.log('\n--- COMPANY FALLBACK SEARCH ---');
  const header = document.querySelector('header[data-test="job-details-header"]');
  if (header) {
    const candidates = header.querySelectorAll('a[href*="/Overview/"], a[href*="/company/"], div[class*="employer"], div[class*="company"]');
    console.log(`Found ${candidates.length} candidate elements in header`);
    candidates.forEach((candidate, idx) => {
      let text = candidate.textContent.trim();
      console.log(`  Candidate ${idx + 1}: "${text}"`);
    });
  }
}

console.log('\n--- DESCRIPTION SELECTORS ---');
const descSelectors = [
  'div[data-test="job-description"]',
  '[data-test="job-description"]',
  'div[class*="JobDetails_jobDescription"]',
  'div[class*="jobDescription"]',
  'div[class*="JobDescription"]',
  '#JobDescriptionContainer',
  '.JobDetails_jobDetailsContainer__y9P3L div[class*="description"]',
  'div[class*="JobDetails_jobDetailsContainer"] div[class*="description"]'
];

let description = '';
let descSelector = '';

for (const selector of descSelectors) {
  const el = document.querySelector(selector);
  if (el) {
    const text = el.textContent.trim();
    console.log(`Testing: ${selector}`);
    console.log(`  Found text length: ${text.length} chars`);
    console.log(`  Preview: "${text.substring(0, 100)}..."`);
    
    if (text && text.length > 100) {
      description = text;
      descSelector = selector;
      console.log(`✅ FOUND: Description (${text.length} chars) | Selector: ${selector}`);
      break;
    } else {
      console.log(`❌ Too short (${text.length} chars)`);
    }
  } else {
    console.log(`❌ Not found: ${selector}`);
  }
}

// Description fallback
if (!description) {
  console.log('\n--- DESCRIPTION FALLBACK SEARCH ---');
  const container = document.querySelector('.JobDetails_jobDetailsContainer__y9P3L') ||
                   document.querySelector('div[class*="JobDetails_jobDetailsContainer"]');
  if (container) {
    console.log('Container found, searching for sections...');
    const sections = container.querySelectorAll('div, section');
    console.log(`Found ${sections.length} sections/divs`);
    
    let maxLength = 0;
    let bestSection = null;
    
    sections.forEach((section, idx) => {
      const text = section.textContent.trim();
      const heading = section.querySelector('h2, h3, [class*="heading"], [class*="title"]');
      const headingText = heading ? heading.textContent.trim().toLowerCase() : '';
      
      if (text.length > maxLength && text.length > 200) {
        const hasButton = section.querySelector('button[class*="apply"]');
        const isHeader = section.closest('[class*="header"]');
        
        console.log(`  Section ${idx + 1}: ${text.length} chars, heading: "${headingText}", hasButton: ${!!hasButton}, isHeader: ${!!isHeader}`);
        
        if (!hasButton && !isHeader && !text.includes('Easy Apply')) {
          maxLength = text.length;
          bestSection = section;
        }
      }
    });
    
    if (bestSection) {
      description = bestSection.textContent.trim();
      console.log(`✅ FOUND in fallback: Description (${description.length} chars)`);
    }
  } else {
    console.log('❌ Container not found');
  }
}

// FINAL SUMMARY
console.log('\n=== FINAL SCRAPE RESULT ===');
const result = {
  success: !!title,
  title: title || '',
  company: company || '',
  description: description || '',
  location: '',
  url: window.location.href,
  selectors: {
    title: titleSelector || 'NOT FOUND',
    company: companySelector || 'NOT FOUND',
    description: descSelector || (description ? 'FALLBACK' : 'NOT FOUND')
  },
  raw: {
    companyOriginal: companyOriginal || 'N/A',
    title: title || 'N/A'
  }
};

console.log(JSON.stringify(result, null, 2));

console.log('\n=== ELEMENT INSPECTION ===');
console.log('To inspect elements manually:');
if (titleSelector) {
  console.log(`  Title element: document.querySelector('${titleSelector}')`);
}
if (companySelector) {
  console.log(`  Company element: document.querySelector('${companySelector}')`);
}
if (descSelector) {
  console.log(`  Description element: document.querySelector('${descSelector}')`);
}

console.log('\n=== TEST COMPLETE ===');

