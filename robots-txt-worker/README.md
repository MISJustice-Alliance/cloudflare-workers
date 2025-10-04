# robots.txt Worker

Dynamic robots.txt generator for YWCAOfMissoula.com with comprehensive AI crawler optimization.

## Purpose

This Cloudflare Worker dynamically generates the `robots.txt` file for the YWCAOfMissoula.com legal advocacy platform, with special consideration for:
- Traditional search engine crawlers (Google, Bing, etc.)
- AI/LLM crawlers (GPTBot, Claude-Web, etc.)
- Aggressive SEO crawlers (rate-limited or blocked)
- Malicious bots (blocked)

## Features

✅ **Environment-Aware**: Different rules for development, staging, and production
✅ **AI Optimization**: Optimized directives for AI crawlers
✅ **Rate Limiting**: Crawl-delay settings for different user-agents
✅ **Sitemap References**: Automatic sitemap.xml references
✅ **Security**: Blocks malicious crawlers and scrapers
✅ **Caching**: 1-hour cache for performance

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ENVIRONMENT` | Deployment environment | `production` |
| `SITE_URL` | Base URL of the site | `https://ywcaofmissoula.com` |

### Routes

- **Production**: `ywcaofmissoula.com/robots.txt`
- **Staging**: `staging.ywcaofmissoula.com/robots.txt`
- **Development**: `dev.ywcaofmissoula.com/robots.txt`

## Development

### Local Testing

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test locally
curl http://localhost:8787/robots.txt
```

### Deployment

```bash
# Deploy to development
npm run deploy:dev

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## robots.txt Rules

### Allowed Crawlers (Full Access)

- **Google**: Googlebot, Googlebot-Image, Googlebot-News
- **Bing**: Bingbot, BingPreview
- **AI Crawlers**: GPTBot, Claude-Web, Google-Extended, PerplexityBot
- **Social**: FacebookBot, Twitterbot, LinkedInBot
- **Other Search Engines**: DuckDuckBot, Baiduspider, YandexBot
- **Archival**: CCBot (Common Crawl)

### Rate-Limited Crawlers

- **SEO Tools**: AhrefsBot, SemrushBot (crawl-delay: 10)
- **Others**: MJ12bot, DotBot (crawl-delay: 10)

### Blocked Crawlers

- **Malicious**: HTTrack, WebCopier, WebZIP
- **Spam**: EmailCollector, EmailSiphon, EmailWolf
- **Aggressive**: BLEXBot, MegaIndex

### Disallowed Paths

- `/admin/` - Administrative areas
- `/api/private/` - Private API endpoints
- `/.well-known/` - System files
- `/cgi-bin/` - Legacy paths

## AI Crawler Optimization

This worker is designed to support AI systems in understanding the YWCAOfMissoula.com content:

```
User-agent: GPTBot
Allow: /
Crawl-delay: 2
# Allow access for AI understanding of civil rights documentation

User-agent: Claude-Web
Allow: /
Crawl-delay: 2
# Allow access for AI assistance with legal advocacy
```

Additional AI guidance files:
- `/llms.txt` - AI optimization guide
- `/llms-full.txt` - Comprehensive AI content map

## Environment Behavior

### Development
- **Blocks all crawlers** to prevent indexing
- Useful for testing without SEO impact

### Staging
- **Blocks most crawlers** except Googlebot for testing
- Allows validation before production

### Production
- **Full configuration** with optimized rules
- Allows beneficial crawlers, blocks malicious ones

## Sitemap References

The worker automatically includes references to:
- `sitemap.xml` - Main sitemap index
- `sitemap-pages.xml` - Content pages
- `sitemap-documents.xml` - Evidence library
- `sitemap-timeline.xml` - Timeline events

## Monitoring

```bash
# View live logs
npm run tail

# View production logs
npm run tail:production
```

### Key Metrics

- Request count
- Cache hit ratio
- User-agent distribution
- Response time

## Customization

### Adding New Crawler Rules

Edit `src/worker.ts` and add to the production section:

```typescript
# New crawler
User-agent: NewBot
Allow: /
Crawl-delay: 2
```

### Blocking New Malicious Bots

```typescript
User-agent: MaliciousBot
Disallow: /
```

### Updating Crawl Delays

Adjust based on server load and crawler behavior:

```typescript
User-agent: AggressiveBot
Crawl-delay: 20  # Increase delay
```

## Testing

### Test Different Environments

```bash
# Development
curl https://dev.ywcaofmissoula.com/robots.txt

# Staging
curl https://staging.ywcaofmissoula.com/robots.txt

# Production
curl https://ywcaofmissoula.com/robots.txt
```

### Validate Syntax

Use online validators:
- https://www.google.com/webmasters/tools/robots-testing-tool
- https://technicalseo.com/tools/robots-txt/

## Troubleshooting

### Issue: Crawler not respecting rules

**Solution**: Some crawlers don't respect robots.txt. Use Cloudflare WAF rules for enforcement.

### Issue: Wrong environment rules

**Solution**: Check `ENVIRONMENT` variable in wrangler.toml

### Issue: Sitemap URLs not working

**Solution**: Verify sitemap workers are deployed and routes are correct

## Performance

- **Response time**: < 10ms (edge cached)
- **Cache duration**: 1 hour
- **Global distribution**: Via Cloudflare Edge Network

## Security

- No sensitive information in robots.txt
- Blocks known malicious user-agents
- Rate limiting for aggressive crawlers
- Regular review and updates

## Maintenance

### Monthly Tasks
- [ ] Review crawler behavior
- [ ] Update blocked user-agents
- [ ] Adjust crawl delays as needed
- [ ] Verify sitemap references

### Quarterly Tasks
- [ ] Comprehensive review
- [ ] Update crawler database
- [ ] Performance optimization
- [ ] Security audit

## Related Workers

- **sitemap-generator**: Generates sitemap.xml files
- **llms-txt-server**: Serves AI optimization files
- **reverse-proxy**: Main traffic routing

## Resources

- [Google robots.txt Specification](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [SEO Best Practices](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

## License

Apache License 2.0 - See LICENSE file for details

## Support

For issues or questions:
- GitHub Issues: Technical problems
- Documentation: [SEO-GEO-GUIDE.md](../docs/SEO-GEO-GUIDE.md)

---

**Remember**: This worker serves the YWCAOfMissoula.com mission of exposing institutional corruption and protecting civil rights. Optimize for discoverability while protecting from abuse.
