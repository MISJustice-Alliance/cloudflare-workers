# Claude Code Configuration
## Sitemap Generator Worker

> **Worker Purpose**: Dynamically generate sitemap.xml files for YWCAOfMissoula.com with Notion integration and SEO optimization

---

## 🎯 Worker Overview

### Purpose
Generate comprehensive XML sitemaps that:
- Include all public pages with proper prioritization
- Update automatically from Notion database
- Support multiple sitemap files (index, pages, documents)
- Optimize for search engine crawling
- Track change frequency and last modification dates

### Routes
- `ywcaofmissoula.com/sitemap.xml` - Main sitemap index
- `ywcaofmissoula.com/sitemap-pages.xml` - Page sitemap
- `ywcaofmissoula.com/sitemap-documents.xml` - Document sitemap
- `ywcaofmissoula.com/sitemap-timeline.xml` - Timeline sitemap

### Priority
**HIGH** - Critical for SEO and search engine discoverability

---

## 📋 Key Features

1. **Dynamic Generation**
   - Query Notion database for pages
   - Auto-update on content changes
   - Real-time freshness

2. **Multiple Sitemaps**
   - Sitemap index for organization
   - Category-specific sitemaps
   - Scalable structure

3. **SEO Optimization**
   - Priority values (0.0-1.0)
   - Change frequency tracking
   - Last modification dates
   - Proper XML formatting

4. **Performance**
   - Edge caching
   - Fast generation
   - Compressed output
   - Low CPU usage

---

## 🚀 Quick Start

### Local Development
```bash
# Navigate to worker directory
cd sitemap-ywcaofmissoula-com

# Install dependencies
npm install

# Start local development server
wrangler dev

# Test locally
curl http://localhost:8787/sitemap.xml
```

### Testing
```bash
# Test sitemap index
curl https://ywcaofmissoula.com/sitemap.xml

# Test specific sitemaps
curl https://ywcaofmissoula.com/sitemap-pages.xml
curl https://ywcaofmissoula.com/sitemap-documents.xml

# Validate sitemap
# Use: https://www.xml-sitemaps.com/validate-xml-sitemap.html
```

### Deployment
```bash
# Deploy to production
wrangler deploy --env production

# Monitor logs
wrangler tail --env production
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NOTION_API_KEY` | Notion integration token | Yes | - |
| `NOTION_DATABASE_ID` | Main content database ID | Yes | - |
| `SITE_URL` | Base site URL | No | `https://ywcaofmissoula.com` |
| `ENVIRONMENT` | Deployment environment | No | `production` |

### wrangler.toml
```toml
name = "sitemap-ywcaofmissoula-com"
main = "src/worker.js"
compatibility_date = "2025-01-01"

[[routes]]
pattern = "ywcaofmissoula.com/sitemap*.xml"
zone_name = "ywcaofmissoula.com"

[env.production]
vars = { 
  SITE_URL = "https://ywcaofmissoula.com",
  ENVIRONMENT = "production"
}

# Secrets (set via wrangler secret put)
# NOTION_API_KEY
# NOTION_DATABASE_ID
```

---

## 💡 Implementation Guidelines

### Worker Structure

```javascript
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Route to appropriate sitemap
      if (url.pathname === '/sitemap.xml') {
        return generateSitemapIndex(env);
      } else if (url.pathname === '/sitemap-pages.xml') {
        return generatePagesSitemap(env);
      } else if (url.pathname === '/sitemap-documents.xml') {
        return generateDocumentsSitemap(env);
      } else if (url.pathname === '/sitemap-timeline.xml') {
        return generateTimelineSitemap(env);
      }
      
      return new Response('Not Found', { status: 404 });
      
    } catch (error) {
      console.error('Sitemap generation error:', error);
      return new Response('Error generating sitemap', { status: 500 });
    }
  }
};

async function generateSitemapIndex(env) {
  const siteUrl = env.SITE_URL || 'https://ywcaofmissoula.com';
  const lastmod = new Date().toISOString().split('T')[0];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}/sitemap-pages.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}/sitemap-documents.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}/sitemap-timeline.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // 1 hour
      'X-Robots-Tag': 'noindex'
    }
  });
}

async function generatePagesSitemap(env) {
  const siteUrl = env.SITE_URL || 'https://ywcaofmissoula.com';
  
  // Define static pages with priorities
  const pages = [
    { loc: '/', priority: '1.0', changefreq: 'daily', lastmod: '2025-01-15' },
    { loc: '/summary', priority: '1.0', changefreq: 'weekly', lastmod: '2025-01-10' },
    { loc: '/timeline', priority: '0.9', changefreq: 'daily', lastmod: '2025-01-14' },
    { loc: '/documents', priority: '0.9', changefreq: 'weekly', lastmod: '2025-01-12' },
    { loc: '/violations', priority: '0.8', changefreq: 'monthly', lastmod: '2025-01-05' },
    { loc: '/violations/first-amendment', priority: '0.8', changefreq: 'monthly' },
    { loc: '/violations/fourth-amendment', priority: '0.8', changefreq: 'monthly' },
    { loc: '/violations/fourteenth-amendment', priority: '0.8', changefreq: 'monthly' },
    { loc: '/corruption', priority: '0.8', changefreq: 'monthly', lastmod: '2025-01-08' },
    { loc: '/damages', priority: '0.7', changefreq: 'quarterly', lastmod: '2025-01-03' },
    { loc: '/legal-resources', priority: '0.6', changefreq: 'monthly' },
    { loc: '/media', priority: '0.6', changefreq: 'weekly' },
    { loc: '/community', priority: '0.5', changefreq: 'monthly' }
  ];
  
  // Generate URL entries
  const urlEntries = pages.map(page => {
    const lastmod = page.lastmod || new Date().toISOString().split('T')[0];
    return `  <url>
    <loc>${siteUrl}${page.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex'
    }
  });
}

async function generateDocumentsSitemap(env) {
  const siteUrl = env.SITE_URL || 'https://ywcaofmissoula.com';
  
  // Option 1: Static document URLs
  // Option 2: Query Notion for documents
  // Option 3: Query KV for cached document list
  
  const documents = [
    { loc: '/documents/police-reports', priority: '0.7', changefreq: 'weekly' },
    { loc: '/documents/court-filings', priority: '0.7', changefreq: 'weekly' },
    { loc: '/documents/misconduct', priority: '0.7', changefreq: 'monthly' },
    { loc: '/documents/medical', priority: '0.6', changefreq: 'quarterly' },
    { loc: '/documents/financial', priority: '0.6', changefreq: 'quarterly' },
    { loc: '/documents/correspondence', priority: '0.6', changefreq: 'monthly' }
  ];
  
  const urlEntries = documents.map(doc => {
    const lastmod = new Date().toISOString().split('T')[0];
    return `  <url>
    <loc>${siteUrl}${doc.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${doc.changefreq}</changefreq>
    <priority>${doc.priority}</priority>
  </url>`;
  }).join('\n');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex'
    }
  });
}

async function generateTimelineSitemap(env) {
  // Similar to above, but for timeline entries
  // Can query Notion for timeline events
  // Or maintain static list
  
  const siteUrl = env.SITE_URL || 'https://ywcaofmissoula.com';
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/timeline</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex'
    }
  });
}
```

---

## 📊 Notion Integration (Optional)

### Querying Notion Database

```javascript
async function queryNotionPages(env) {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${env.NOTION_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: {
          property: 'Status',
          status: {
            equals: 'Published'
          }
        },
        sorts: [
          {
            property: 'Last Modified',
            direction: 'descending'
          }
        ]
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.results;
}

function notionPageToSitemapEntry(page, siteUrl) {
  // Extract page properties
  const slug = page.properties.Slug?.rich_text[0]?.plain_text || '';
  const lastmod = page.last_edited_time.split('T')[0];
  const priority = page.properties.Priority?.number || 0.5;
  const changefreq = page.properties.ChangeFreq?.select?.name || 'weekly';
  
  return {
    loc: `${siteUrl}/${slug}`,
    lastmod,
    priority,
    changefreq
  };
}
```

---

## 🧪 Testing

### Validation

```bash
# Test sitemap format
curl https://ywcaofmissoula.com/sitemap.xml | xmllint --format -

# Validate sitemap
# Use Google Search Console
# Or: https://www.xml-sitemaps.com/validate-xml-sitemap.html
```

### Test Checklist
- [ ] Valid XML format
- [ ] All URLs accessible
- [ ] Proper priority values (0.0-1.0)
- [ ] Valid change frequencies
- [ ] ISO date format for lastmod
- [ ] Sitemap index references correct files
- [ ] Headers include proper Content-Type
- [ ] No broken URLs (404s)

---

## 📊 SEO Best Practices

### Priority Guidelines
- **1.0**: Homepage, Executive Summary (most important)
- **0.9**: Timeline, Document Library (high importance)
- **0.8**: Constitutional Analysis, Corruption Evidence
- **0.7**: Individual Documents
- **0.6**: Legal Resources, Media Resources
- **0.5**: Supporting/About Pages

### Change Frequency
- **daily**: Homepage, Timeline (updated frequently)
- **weekly**: Summary, Document Library, Media
- **monthly**: Analysis pages, Resources
- **yearly**: Archive pages, Static content

### Last Modified
- Use actual modification dates when possible
- Query Notion for real lastmod dates
- Fallback to current date if unknown

---

## 🔐 Security

### Headers
```javascript
{
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600',
  'X-Robots-Tag': 'noindex', // Don't index sitemap itself
  'X-Content-Type-Options': 'nosniff'
}
```

### API Key Protection
```bash
# Never commit Notion API keys
# Set via wrangler secrets
wrangler secret put NOTION_API_KEY
wrangler secret put NOTION_DATABASE_ID
```

---

## 🎯 Success Criteria

- [ ] Valid XML sitemap format
- [ ] All public pages included
- [ ] Proper priorities assigned
- [ ] Accurate lastmod dates
- [ ] Fast generation (< 100ms)
- [ ] Cached appropriately (1 hour)
- [ ] Google Search Console accepts it
- [ ] No 404 errors in URLs

---

## 📚 Resources

- [Sitemaps.org Protocol](https://www.sitemaps.org/protocol.html)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Notion API Docs](https://developers.notion.com/)

---

## 🔄 Maintenance

### Regular Tasks
- **Weekly**: Verify all URLs accessible
- **Monthly**: Update priorities if needed
- **Quarterly**: Review page organization
- **After major updates**: Regenerate and resubmit to search engines

### Updating Sitemaps
```bash
# After content updates
# Worker auto-regenerates with cache expiry (1 hour)
# Or manually purge cache in Cloudflare dashboard

# Submit to search engines
# Google Search Console: Submit sitemap URL
# Bing Webmaster Tools: Submit sitemap URL
```

---

**Remember**: Sitemaps are critical for SEO and ensuring search engines can discover all the legal advocacy content. Accuracy and completeness directly impact visibility for justice.
