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
  if (!query) return [];
  try {
    const url = 'https://www.googleapis.com/customsearch/v1';
    const { data } = await axios.get(url, {
      params: {
        key: GOOGLE_API_KEY,
        cx: GOOGLE_CSE_ID,
        q: query,
        num: Math.min(Math.max(parseInt(maxResults, 10) || 1, 1), 10),
      },
    });
    const items = Array.isArray(data?.items) ? data.items : [];
    const links = items.map((i) => i?.link).filter(Boolean);
    return links.slice(0, maxResults);
  } catch (error) {
    // Log and continue
    console.error('Google CSE error:', error.response?.data || error.message);
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
  try {
    if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
      return res.status(500).json({
        error: 'Server not configured',
        message: 'Missing GOOGLE_API_KEY or GOOGLE_CSE_ID',
      });
    }

    const companiesRaw = Array.isArray(req.body?.companies) ? req.body.companies : [];
    const companies = companiesRaw.map((c) => (typeof c === 'string' ? c.trim() : '')).filter(Boolean);
    const location = typeof req.body?.location === 'string' ? req.body.location : '';

    if (companies.length === 0) {
      return res.status(400).json({ error: 'No companies provided' });
    }

    const results = [];
    for (const company of companies) {
      const linkedinQuery = buildQuery(company, 'linkedin', location);
      const websiteQuery = buildQuery(company, 'website', location);
      const hrQuery = buildQuery(company, 'hr_linkedin', location);

      const [companyLinkedInLinks, websiteLinks, hrLinkedInLinks] = [
        await searchGoogle(linkedinQuery, 1),
        await searchGoogle(websiteQuery, 1),
        await searchGoogle(hrQuery, 3),
      ];

      const companyLinkedInUrl = companyLinkedInLinks[0] || null;
      const website = websiteLinks[0] || null;
      const hrLinkedInUrl = hrLinkedInLinks[0] || null;

      const [firstName, lastName] = extractNameFromLinkedIn(hrLinkedInUrl);

      results.push({
        'Company Name': company,
        'Website': website,
        'Company LinkedIn URL': companyLinkedInUrl,
        'HR LinkedIn URL': hrLinkedInUrl,
        'HR LinkedIn URLs': hrLinkedInLinks,
        'HR First Name': firstName,
        'HR Last Name': lastName,
      });

      // Small throttle to be gentle with API quotas
      await new Promise((r) => setTimeout(r, 300));
    }

    if (companies.length > 5) {
      const csv = toCsv(results);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=hr_results.csv');
      return res.status(200).send(csv);
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error('hrLookup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { hrLookup };


