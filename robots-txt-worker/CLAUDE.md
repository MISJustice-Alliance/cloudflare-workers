# Claude Code Configuration
## robots.txt Worker - Static robots.txt Serving

> **Worker Purpose**: Serve static robots.txt file as a fast, reliable fallback or alternative to dynamic generation

---

## 🎯 Worker Overview

### Purpose
Serve a static, pre-configured robots.txt file with:
- Fast response times (< 5ms)
- High reliability (no external dependencies)
- Consistent output
- Simple deployment
- Fallback option for dynamic generator

### Routes
- `ywcaofmissoula.com/robots.txt`
- `www.ywcaofmissoula.com/robots.txt`

### Priority
**MEDIUM** - Alternative/fallback to dynamic-robots-generator worker

---

## 📋 Key Features

1. **Static Serving**
   - Pre-configured content
   - No external calls
   - Fastest possible response
   - No computation required

2. **Reliability**
   - No dependencies
   - No API calls
   - No database queries
   - Always available

3. **Simplicity**
   - Easy to update
   - Clear code
   - Minimal maintenance
   - Quick deployment

4. **Performance**
   - Sub-5ms response time
   - Minimal CPU usage
   - Edge caching
   - Low memory footprint

---

## 🚀 Quick Start

### Local Development
```bash
# Navigate to worker directory
cd robots-txt-worker

# Install dependencies (minimal or none)
npm install

# Start local development server
wrangler dev

# Test locally
curl http://localhost:8787/robots.txt
```

### Testing
```bash
# Test live
curl https://ywcaofmissoula.com/robots.txt

# Test both domains
curl https://ywcaofmissoula.com/robots.txt
curl https://www.ywcaofmissoula.com/robots.txt

# Check headers
curl -I https://ywcaofmissoula.com/robots.txt
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
name = "robots-txt-worker"
main = "src/worker.js"
compatibility_date = "2025-01-01"

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
```

---

## 💡 Implementation

### Simple Worker Structure

```javascript
/**
 * Static robots.txt worker
 * Serves pre-configured robots.txt content
 */

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Only handle robots.txt
      if (!url.pathname.endsWith('/robots.txt')) {
        return new Response('Not Found', { status: 404 });
      }
      
      // Get robots.txt content
      const robotsTxt = getRobotsTxtContent(env.ENVIRONMENT || 'production');
      
      // Return with proper headers
      return new Response(robotsTxt, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400', // 24 hours
          'X-Robots-Tag': 'none' // Don't index robots.txt itself
        }
      });
      
    } catch (error) {
      console.error('robots.txt serving error:', error);
      return new Response('Error serving robots.txt', { status: 500 });
    }
  }
};

function getRobotsTxtContent(environment) {
  // For non-production: Restrict all crawlers
  if (environment !== 'production') {
    return `# YWCAOfMissoula.com robots.txt
# Environment: ${environment}
# Non-production - restricted access

User-agent: *
Disallow: /
`;
  }
  
  // For production: Full rules
  return `# YWCAOfMissoula.com robots.txt
# Civil Rights Documentation & Legal Advocacy Platform
# Managed by: Anonymous Legal Assistance Group (MISJustice Alliance)

# Default rules for all crawlers
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/private/
Crawl-delay: 1

# Google crawlers
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Googlebot-Image
Allow: /
Crawl-delay: 1

User-agent: Google-Extended
Allow: /
Crawl-delay: 2

# OpenAI GPTBot (ChatGPT crawler)
User-agent: GPTBot
Allow: /
Crawl-delay: 2

# Anthropic Claude-Web (Claude AI crawler)
User-agent: Claude-Web
Allow: /
Crawl-delay: 2

# Common Crawl (Internet archive and research)
User-agent: CCBot
Allow: /
Crawl-delay: 2

# Perplexity AI
User-agent: PerplexityBot
Allow: /
Crawl-delay: 2

# Bing crawlers
User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: BingPreview
Allow: /

# Other AI/ML crawlers
User-agent: anthropic-ai
Allow: /
Crawl-delay: 2

User-agent: Applebot
Allow: /
Crawl-delay: 1

User-agent: Applebot-Extended
Allow: /
Crawl-delay: 2

# Meta/Facebook crawlers
User-agent: FacebookBot
Allow: /
Crawl-delay: 1

# Twitter/X crawler
User-agent: Twitterbot
Allow: /

# LinkedIn crawler
User-agent: LinkedInBot
Allow: /

# Other legitimate search engines
User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

User-agent: YandexBot
Allow: /
Crawl-delay: 2

# Aggressive/problematic crawlers (more restrictive)
User-agent: AhrefsBot
Crawl-delay: 10
Disallow: /

User-agent: SemrushBot
Crawl-delay: 10
Disallow: /

User-agent: MJ12bot
Crawl-delay: 10
Disallow: /

User-agent: DotBot
Crawl-delay: 10
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: MegaIndex
Disallow: /

# Malicious/spam bots (block completely)
User-agent: SiteSnagger
Disallow: /

User-agent: WebZIP
Disallow: /

User-agent: WebCopier
Disallow: /

User-agent: HTTrack
Disallow: /

User-agent: EmailCollector
Disallow: /

User-agent: EmailSiphon
Disallow: /

User-agent: EmailWolf
Disallow: /

User-agent: ExtractorPro
Disallow: /

# Sitemaps
Sitemap: https://ywcaofmissoula.com/sitemap.xml
Sitemap: https://ywcaofmissoula.com/sitemap-pages.xml
Sitemap: https://ywcaofmissoula.com/sitemap-documents.xml
Sitemap: https://ywcaofmissoula.com/sitemap-timeline.xml

# Host directive
Host: https://ywcaofmissoula.com
`;
}
```

---

## 🧪 Testing

### Test Cases

```bash
# 1. Basic functionality
curl https://ywcaofmissoula.com/robots.txt

# 2. Check headers
curl -I https://ywcaofmissoula.com/robots.txt

# 3. Test www subdomain
curl https://www.ywcaofmissoula.com/robots.txt

# 4. Verify format
curl https://ywcaofmissoula.com/robots.txt | head -n 20
```

### Expected Results
- Status: 200 OK
- Content-Type: text/plain; charset=utf-8
- Cache-Control: public, max-age=86400
- X-Robots-Tag: none
- Valid robots.txt format

---

## 📊 Performance

### Optimization
- **No computation**: Static content only
- **No external calls**: Everything in memory
- **Fast response**: < 5ms typical
- **Low CPU**: < 1ms CPU time
- **Minimal memory**: < 1MB

### Caching
- Browser cache: 24 hours
- Cloudflare cache: 24 hours
- Response size: ~2KB

### Monitoring
```bash
# Check performance
wrangler tail --format pretty

# Metrics in dashboard
# Cloudflare → Workers → robots-txt-worker
```

---

## 🔐 Security

### Headers
```javascript
{
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'public, max-age=86400',
  'X-Robots-Tag': 'none',
  'X-Content-Type-Options': 'nosniff'
}
```

### Content Security
- No user input processed
- Static content only
- No sensitive information
- No external dependencies

---

## 🔄 Updating Content

### Update Process

1. **Edit worker code**:
   ```javascript
   // Update getRobotsTxtContent() function
   ```

2. **Test locally**:
   ```bash
   wrangler dev
   curl http://localhost:8787/robots.txt
   ```

3. **Deploy**:
   ```bash
   wrangler deploy --env production
   ```

4. **Verify**:
   ```bash
   curl https://ywcaofmissoula.com/robots.txt
   ```

5. **Clear cache if needed**:
   - Cloudflare dashboard → Caching → Purge Everything
   - Or wait 24 hours for cache expiry

---

## 🎯 vs. Dynamic Generator

### When to Use Static Worker

**Use static worker when**:
✅ Content rarely changes
✅ Maximum performance needed
✅ Simplicity preferred
✅ No dynamic content required
✅ Fallback/redundancy needed

**Use dynamic generator when**:
✅ Environment-specific rules needed
✅ Frequent content updates
✅ Generated timestamps required
✅ Integration with other systems
✅ A/B testing crawler rules

### Deployment Strategy

**Option 1: Primary Static**
- Use this worker as primary
- Fast and reliable
- Update via deployments

**Option 2: Fallback**
- Use dynamic generator as primary
- Use this as fallback
- Automatic failover

**Option 3: Parallel**
- Deploy both workers
- Test and compare
- Choose best performer

---

## 📝 Maintenance

### Regular Reviews
- **Monthly**: Review crawler list
- **Quarterly**: Update crawl delays
- **As needed**: Add new AI crawlers
- **Monitor**: Watch for new bot patterns

### Change Log
Keep track of changes:
```
2025-01: Initial deployment
2025-02: Added Perplexity crawler
2025-03: Updated crawl delays
```

---

## 🚨 Troubleshooting

### Common Issues

**robots.txt not updating after deployment?**
```bash
# Clear Cloudflare cache
# Dashboard → Caching → Purge Cache
# Or wait 24 hours
```

**Wrong content served?**
```bash
# Check environment variable
wrangler tail | grep ENVIRONMENT

# Verify deployment
wrangler deployments list
```

**404 errors?**
```bash
# Verify routes configured
wrangler routes list

# Check wrangler.toml
cat wrangler.toml
```

---

## 🎯 Success Criteria

- [ ] Returns valid robots.txt format
- [ ] Response time < 10ms
- [ ] Proper content type header
- [ ] Cache headers configured
- [ ] Both routes working (root and www)
- [ ] All major crawlers included
- [ ] Malicious bots blocked
- [ ] Sitemaps referenced

---

## 📚 Resources

- [robots.txt Specification](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [User-Agent List](https://developers.cloudflare.com/bots/concepts/bot/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

---

## 💡 Tips for Claude Code

### Making Changes

1. **Update content** in `getRobotsTxtContent()` function
2. **Test locally** with `wrangler dev`
3. **Deploy** to staging first
4. **Verify** content is correct
5. **Deploy** to production
6. **Monitor** for issues

### Adding New Crawler

```javascript
// Add to production content:
# New Crawler Name
User-agent: NewCrawlerBot
Allow: /
Crawl-delay: 2
```

### Blocking New Bot

```javascript
// Add to blocked section:
User-agent: BadBot
Disallow: /
```

---

**Remember**: This file controls search engine and AI system access to the legal advocacy platform. Simplicity and reliability ensure consistent crawler guidance.
