# Claude Code Configuration
## Dynamic robots.txt Generator Worker

> **Worker Purpose**: Dynamically generate robots.txt with environment-aware rules and AI crawler optimization for YWCAOfMissoula.com

---

## 🎯 Worker Overview

### Purpose
Generate dynamic `robots.txt` files that:
- Optimize for traditional search engines (Google, Bing, etc.)
- Include AI crawler-specific directives (GPTBot, Claude-Web, etc.)
- Implement environment-aware rules (dev/staging/production)
- Support rate limiting for aggressive crawlers
- Reference sitemap locations

### Routes
- `ywcaofmissoula.com/robots.txt`
- `www.ywcaofmissoula.com/robots.txt`

### Priority
**HIGH** - Controls search engine and AI crawler access to the entire platform

---

## 📋 Key Features

1. **AI Crawler Optimization**
   - GPTBot (ChatGPT)
   - Claude-Web (Claude AI)
   - Google-Extended (Gemini/Bard)
   - Perplexity
   - Other AI systems

2. **Traditional SEO**
   - Googlebot directives
   - Bing crawler rules
   - Standard search engines

3. **Security**
   - Block malicious crawlers
   - Rate limiting for aggressive bots
   - Prevent scraping tools

4. **Environment Awareness**
   - Different rules for dev/staging/production
   - Dynamic sitemap references
   - Environment-specific crawl delays

---

## 🚀 Quick Start

### Local Development
```bash
# Navigate to worker directory
cd dynamic-robots-generator-ywcaofmissoula-com

# Install dependencies
npm install

# Start local development server
wrangler dev

# Test locally
curl http://localhost:8787/robots.txt
```

### Testing
```bash
# Test the worker
curl https://ywcaofmissoula.com/robots.txt

# Test with specific user-agent
curl -H "User-Agent: GPTBot" https://ywcaofmissoula.com/robots.txt
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
| `ENVIRONMENT` | Deployment environment | No | `production` |

### wrangler.toml
```toml
name = "dynamic-robots-generator"
main = "src/worker.js"
compatibility_date = "2025-10-03"

[[routes]]
pattern = "ywcaofmissoula.com/robots.txt"
zone_name = "ywcaofmissoula.com"

[[routes]]
pattern = "www.ywcaofmissoula.com/robots.txt"
zone_name = "ywcaofmissoula.com"

[env.production]
vars = { ENVIRONMENT = "production" }

[env.staging]
vars = { ENVIRONMENT = "staging" }

[env.development]
vars = { ENVIRONMENT = "development" }
```

---

## 💡 Implementation Guidelines

### robots.txt Template Structure

```
# YWCAOfMissoula.com robots.txt
# Generated: [timestamp]
# Environment: [production/staging/development]

# Default rules for all crawlers
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/private/
Crawl-delay: 1

# AI Crawlers (allow with moderate delay)
User-agent: GPTBot
Allow: /
Crawl-delay: 2

User-agent: Claude-Web
Allow: /
Crawl-delay: 2

User-agent: Google-Extended
Allow: /

# Aggressive SEO crawlers (restrict)
User-agent: AhrefsBot
Crawl-delay: 10
Disallow: /

# Malicious bots (block)
User-agent: SiteSnagger
Disallow: /

# Sitemaps
Sitemap: https://ywcaofmissoula.com/sitemap.xml
```

### Worker Logic

```javascript
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Only handle robots.txt
      if (!url.pathname.endsWith('/robots.txt')) {
        return new Response('Not Found', { status: 404 });
      }
      
      // Generate robots.txt content
      const robotsTxt = generateRobotsTxt(env.ENVIRONMENT || 'production');
      
      // Return with proper headers
      return new Response(robotsTxt, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600', // 1 hour
          'X-Robots-Tag': 'none' // Don't index robots.txt itself
        }
      });
      
    } catch (error) {
      console.error('robots.txt generation error:', error);
      return new Response('Error generating robots.txt', { status: 500 });
    }
  }
};

function generateRobotsTxt(environment) {
  const timestamp = new Date().toISOString();
  const isProduction = environment === 'production';
  
  let content = `# YWCAOfMissoula.com robots.txt
# Generated: ${timestamp}
# Environment: ${environment}

`;

  // Development/staging: Restrict all crawlers
  if (!isProduction) {
    content += `# Non-production environment - restricted access
User-agent: *
Disallow: /

`;
    return content;
  }
  
  // Production: Full rules
  content += `# Default rules for all crawlers
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/private/
Crawl-delay: 1

# Google crawlers
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Google-Extended
Allow: /
Crawl-delay: 2

# OpenAI GPTBot (ChatGPT)
User-agent: GPTBot
Allow: /
Crawl-delay: 2

# Anthropic Claude-Web
User-agent: Claude-Web
Allow: /
Crawl-delay: 2

# Common Crawl
User-agent: CCBot
Allow: /
Crawl-delay: 2

# Perplexity AI
User-agent: PerplexityBot
Allow: /
Crawl-delay: 2

# Bing
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Other legitimate crawlers
User-agent: DuckDuckBot
Allow: /

User-agent: Slurp
Allow: /

# Aggressive SEO crawlers (restrict)
User-agent: AhrefsBot
Crawl-delay: 10
Disallow: /

User-agent: SemrushBot
Crawl-delay: 10
Disallow: /

User-agent: MJ12bot
Crawl-delay: 10
Disallow: /

# Malicious bots (block)
User-agent: SiteSnagger
Disallow: /

User-agent: WebZIP
Disallow: /

User-agent: HTTrack
Disallow: /

# Sitemaps
Sitemap: https://ywcaofmissoula.com/sitemap.xml
Sitemap: https://ywcaofmissoula.com/sitemap-pages.xml
Sitemap: https://ywcaofmissoula.com/sitemap-documents.xml

# Host
Host: https://ywcaofmissoula.com
`;

  return content;
}
```

---

## 🧪 Testing

### Test Cases

1. **Basic Functionality**
   ```bash
   # Should return robots.txt
   curl https://ywcaofmissoula.com/robots.txt
   ```

2. **Environment Handling**
   ```javascript
   // Development should restrict all
   // Production should allow with rules
   ```

3. **Headers**
   ```bash
   # Check headers
   curl -I https://ywcaofmissoula.com/robots.txt
   # Should have:
   # - Content-Type: text/plain
   # - Cache-Control
   # - X-Robots-Tag: none
   ```

4. **Both Routes**
   ```bash
   # Test root domain
   curl https://ywcaofmissoula.com/robots.txt
   
   # Test www subdomain
   curl https://www.ywcaofmissoula.com/robots.txt
   ```

---

## 📊 Performance Considerations

### Optimization
- **No external calls**: All content generated in-memory
- **Fast response**: < 10ms typical
- **Caching**: 1 hour browser cache
- **Minimal CPU**: < 5ms CPU time

### Monitoring
```bash
# Watch performance
wrangler tail --format pretty

# Check metrics in Cloudflare dashboard
```

---

## 🔐 Security

### Headers
- `X-Robots-Tag: none` - Don't index robots.txt itself
- `Cache-Control: public, max-age=3600` - Allow caching
- `Content-Type: text/plain; charset=utf-8` - Proper content type

### Rate Limiting
Consider adding rate limiting for aggressive requests:

```javascript
// Optional: Add rate limiting
const ip = request.headers.get('CF-Connecting-IP');
if (await isRateLimited(ip)) {
  return new Response('Rate limit exceeded', { status: 429 });
}
```

---

## 📝 Maintenance

### Regular Updates
- **Monthly**: Review crawler list
- **Quarterly**: Update crawl delays based on traffic
- **As needed**: Add new AI crawlers
- **Monitor**: Watch for aggressive crawlers

### Troubleshooting

**robots.txt not updating?**
```bash
# Clear cache
# Update worker
wrangler deploy

# Verify deployment
curl -I https://ywcaofmissoula.com/robots.txt
```

**Wrong environment rules?**
```bash
# Check environment variable
wrangler tail

# Verify wrangler.toml
cat wrangler.toml
```

---

## 🎯 Success Criteria

- [ ] Returns valid robots.txt format
- [ ] Different rules for dev/staging/production
- [ ] Includes all major AI crawlers
- [ ] Blocks malicious crawlers
- [ ] References sitemaps correctly
- [ ] Response time < 50ms
- [ ] Proper caching headers
- [ ] Both routes working (root and www)

---

## 📚 Resources

- [robots.txt Specification](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [AI Crawler User-Agents](https://developers.cloudflare.com/bots/concepts/bot/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

---

**Remember**: This file controls how search engines and AI systems access the legal advocacy content. Proper configuration ensures maximum visibility for justice and accountability.
