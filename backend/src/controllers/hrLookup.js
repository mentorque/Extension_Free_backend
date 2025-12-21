const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

function buildQuery(companyName, queryType = 'linkedin', location) {
  let query;
  if (queryType === 'linkedin') {
    query = `site:linkedin.com/company/ ${companyName}`;
  } else if (queryType === 'website') {
    query = `${companyName} website`;
  } else if (queryType === 'hr_linkedin') {
    query = `site:linkedin.com/in/ "HR Manager" OR "Human Resources" OR "Talent Acquisition" "${companyName}"`;
  } else {
    return null;
  }

  if (location) {
    query += ` ${location}`;
  }
  return query;
}

async function searchGoogle(query, maxResults = 1) {
  if (!query) {
    console.log('[HR Lookup]   ⚠️  Empty query, returning empty results');
    return [];
  }
  
  try {
    const url = 'https://www.googleapis.com/customsearch/v1';
    console.log(`[HR Lookup]   🔍 Calling Google CSE API...`);
    console.log(`[HR Lookup]   - URL: ${url}`);
    console.log(`[HR Lookup]   - Query: ${query}`);
    console.log(`[HR Lookup]   - Max results: ${maxResults}`);
    console.log(`[HR Lookup]   - Has API Key: ${!!GOOGLE_API_KEY}`);
    console.log(`[HR Lookup]   - Has CSE ID: ${!!GOOGLE_CSE_ID}`);
    
    const { data } = await axios.get(url, {
      params: {
        key: GOOGLE_API_KEY,
        cx: GOOGLE_CSE_ID,
        q: query,
        num: Math.min(Math.max(parseInt(maxResults, 10) || 1, 1), 10),
      },
    });
    
    console.log(`[HR Lookup]   ✅ Google CSE API response received`);
    console.log(`[HR Lookup]   - Response keys:`, Object.keys(data || {}));
    console.log(`[HR Lookup]   - Total items in response: ${data?.items?.length || 0}`);
    console.log(`[HR Lookup]   - Search info:`, data?.searchInformation);
    
    if (data?.error) {
      console.error(`[HR Lookup]   ❌ Google CSE API error:`, data.error);
    }
    
    const items = Array.isArray(data?.items) ? data.items : [];
    const links = items.map((i) => i?.link).filter(Boolean);
    const resultLinks = links.slice(0, maxResults);
    
    console.log(`[HR Lookup]   - Extracted links: ${resultLinks.length}`, resultLinks);
    
    return resultLinks;
  } catch (error) {
    // Log and continue
    console.error(`[HR Lookup]   ❌ Google CSE error:`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      query: query
    });
    return [];
  }
}

function extractNameFromLinkedIn(linkedinUrl) {
  if (linkedinUrl && linkedinUrl.includes('linkedin.com/in/')) {
    try {
      const afterIn = linkedinUrl.split('in/')[1];
      const slug = afterIn.split('/')[0];
      const parts = slug.split('-');
      if (parts.length >= 2) {
        return [
          parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
          parts[1].charAt(0).toUpperCase() + parts[1].slice(1),
        ];
      }
    } catch (_e) {
      /* noop */
    }
  }
  return [null, null];
}

function toCsv(rows) {
  const headers = [
    'Company Name',
    'Website',
    'Company LinkedIn URL',
    'HR LinkedIn URL',
    'HR LinkedIn URLs',
    'HR First Name',
    'HR Last Name',
  ];
  const escape = (value) => {
    if (value == null) return '';
    const str = String(value);
    if (/[",\n]/.test(str)) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(
      [
        escape(row['Company Name']),
        escape(row['Website']),
        escape(row['Company LinkedIn URL']),
        escape(row['HR LinkedIn URL']),
        escape(Array.isArray(row['HR LinkedIn URLs']) ? row['HR LinkedIn URLs'].join('; ') : ''),
        escape(row['HR First Name']),
        escape(row['HR Last Name']),
      ].join(',')
    );
  }
  return lines.join('\n');
}

async function hrLookup(req, res) {
  const startTime = Date.now();
  console.log('\n========================================');
  console.log('[HR Lookup] 🎯 HR Lookup Request Received');
  console.log('[HR Lookup] Timestamp:', new Date().toISOString());
  console.log('========================================\n');
  
  try {
    // Check which credentials are missing
    const missing = [];
    if (!GOOGLE_API_KEY) missing.push('GOOGLE_API_KEY');
    if (!GOOGLE_CSE_ID) missing.push('GOOGLE_CSE_ID');
    
    if (missing.length > 0) {
      console.error('[HR Lookup] ❌ Missing required environment variables:', missing.join(', '));
      return res.status(500).json({
        error: `Missing required environment variables: ${missing.join(', ')}`,
        message: `Missing required environment variables: ${missing.join(', ')}`,
        details: 'HR Lookup requires Google Custom Search API credentials. Please add them to your .env file.',
        instructions: {
          GOOGLE_API_KEY: 'Get from https://console.cloud.google.com/apis/credentials',
          GOOGLE_CSE_ID: 'Get from https://programmablesearchengine.google.com/controlpanel/create'
        }
      });
    }

    const companiesRaw = Array.isArray(req.body?.companies) ? req.body.companies : [];
    const companies = companiesRaw.map((c) => (typeof c === 'string' ? c.trim() : '')).filter(Boolean);
    const location = typeof req.body?.location === 'string' ? req.body.location : '';

    console.log('[HR Lookup] 📥 Request Details:');
    console.log('[HR Lookup]   - Companies:', companies.length, companies);
    console.log('[HR Lookup]   - Location:', location || '(not specified)');
    console.log('');

    if (companies.length === 0) {
      console.error('[HR Lookup] ❌ No companies provided');
      return res.status(400).json({ error: 'No companies provided' });
    }

    const results = [];
    console.log(`[HR Lookup] 🔍 Processing ${companies.length} companies...\n`);
    
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      console.log(`[HR Lookup] [${i + 1}/${companies.length}] Processing: ${company}`);
      
      const linkedinQuery = buildQuery(company, 'linkedin', location);
      const websiteQuery = buildQuery(company, 'website', location);
      const hrQuery = buildQuery(company, 'hr_linkedin', location);

      console.log(`[HR Lookup]   - LinkedIn query: ${linkedinQuery}`);
      console.log(`[HR Lookup]   - Website query: ${websiteQuery}`);
      console.log(`[HR Lookup]   - HR query: ${hrQuery}`);

      const [companyLinkedInLinks, websiteLinks, hrLinkedInLinks] = [
        await searchGoogle(linkedinQuery, 1),
        await searchGoogle(websiteQuery, 1),
        await searchGoogle(hrQuery, 3),
      ];

      console.log(`[HR Lookup]   - Company LinkedIn links: ${companyLinkedInLinks.length}`, companyLinkedInLinks);
      console.log(`[HR Lookup]   - Website links: ${websiteLinks.length}`, websiteLinks);
      console.log(`[HR Lookup]   - HR LinkedIn links: ${hrLinkedInLinks.length}`, hrLinkedInLinks);

      const companyLinkedInUrl = companyLinkedInLinks[0] || null;
      const website = websiteLinks[0] || null;
      const hrLinkedInUrl = hrLinkedInLinks[0] || null;

      const [firstName, lastName] = extractNameFromLinkedIn(hrLinkedInUrl);

      const result = {
        'Company Name': company,
        'Website': website,
        'Company LinkedIn URL': companyLinkedInUrl,
        'HR LinkedIn URL': hrLinkedInUrl,
        'HR LinkedIn URLs': hrLinkedInLinks,
        'HR First Name': firstName,
        'HR Last Name': lastName,
      };

      console.log(`[HR Lookup]   - Result:`, result);
      results.push(result);
      console.log('');

      // Small throttle to be gentle with API quotas
      await new Promise((r) => setTimeout(r, 300));
    }

    const duration = Date.now() - startTime;
    console.log(`[HR Lookup] ✅ Processing complete (${duration}ms)`);
    console.log(`[HR Lookup] 📊 Total results: ${results.length}`);
    console.log(`[HR Lookup] 📋 Results:`, JSON.stringify(results, null, 2));
    console.log('');

    // Always return JSON for consistency with apiClient
    // If more than 5 companies, include CSV as text field for download
    if (companies.length > 5) {
      const csv = toCsv(results);
      console.log(`[HR Lookup] 📄 Returning CSV wrapped in JSON (${csv.length} bytes)`);
      console.log(`[HR Lookup] CSV preview (first 200 chars):`, csv.substring(0, 200));
      console.log('========================================\n');
      
      // Return JSON with CSV as text field - frontend can extract and download
      return res.status(200).json({
        format: 'csv',
        text: csv,
        filename: 'hr_results.csv',
        results: results, // Also include results array for display
        count: results.length
      });
    }

    console.log(`[HR Lookup] 📤 Returning JSON response`);
    console.log(`[HR Lookup] Response preview:`, JSON.stringify(results, null, 2).substring(0, 500));
    console.log('========================================\n');

    return res.status(200).json(results);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('\n========================================');
    console.error('[HR Lookup] ❌ Error occurred');
    console.error('[HR Lookup] Duration:', duration, 'ms');
    console.error('[HR Lookup] Error:', error.message);
    console.error('[HR Lookup] Stack:', error.stack);
    console.error('========================================\n');
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

module.exports = { hrLookup };


