# Dynamic Robots.txt Generator for YWCAOfMissoula.com

A sophisticated Cloudflare Worker that generates dynamic robots.txt files optimized for legal advocacy platforms, AI crawlers, and traditional search engines.

## Overview

This worker serves as the backbone for SEO and AI crawler optimization for the YWCAOfMissoula.com legal advocacy platform. It dynamically generates robots.txt files based on:

- **Crawler type** (Google, Bing, AI crawlers like GPTBot, Claude-Web)
- **Geographic location** (country-specific rules)
- **Legal advocacy requirements** (optimized for evidence repository access)
- **Performance constraints** (caching, rate limiting)

## Features

### 🤖 AI Crawler Optimization
- **GPTBot** (ChatGPT) - Optimized for legal research
- **Claude-Web** (Anthropic) - Enhanced for civil rights documentation
- **Google-Extended** - AI training data access
- **PerplexityBot** - Research and fact-checking support

### 🌍 Geographic Intelligence
- **US**: Full access to legal documents and evidence
- **RU/CN**: Restricted access to sensitive content
- **DE**: GDPR-compliant content filtering
- **Global**: Standard access with appropriate crawl delays

### 🚀 Performance Features
- **Intelligent Caching**: KV-based caching with TTL
- **Rate Limiting**: Prevents abuse and ensures fair access
- **Security Headers**: Comprehensive security implementation
- **Analytics**: Detailed monitoring and logging

### ⚖️ Legal Advocacy Focus
- **Evidence Repository Access**: Optimized for legal professionals
- **Civil Rights Documentation**: AI-friendly content structure
- **Institutional Accountability**: Transparent access patterns
- **Research Support**: Enhanced for academic and legal research

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Request       │───▶│  Rate Limiter    │───▶│  Cache Check    │
│  (robots.txt)   │    │  (IP-based)     │    │  (KV Storage)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Response      │◀───│  Security Headers│◀───│ Content Generator│
│  (robots.txt)   │    │  (CSP, HSTS, etc)│    │  (Dynamic Rules) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Installation

### Prerequisites
- Node.js 18+
- Wrangler CLI
- Cloudflare account with Workers enabled

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create KV namespace**:
   ```bash
   npm run kv:create
   ```

3. **Update wrangler.toml**:
   - Replace `your-kv-namespace-id` with actual KV namespace ID
   - Configure routes for your domain

4. **Deploy**:
   ```bash
   npm run deploy
   ```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ENVIRONMENT` | `production` | Environment (dev/staging/production) |
| `CACHE_TTL` | `3600` | Cache TTL in seconds |
| `RATE_LIMIT_REQUESTS` | `100` | Max requests per window |
| `RATE_LIMIT_WINDOW` | `60000` | Rate limit window in ms |
| `ANALYTICS_ENABLED` | `true` | Enable analytics logging |

### Crawler Rules

The worker maintains a comprehensive database of crawlers with specific rules:

#### AI Crawlers (Legal Research Optimized)
- **GPTBot**: 2s crawl delay, full access for legal research
- **Claude-Web**: 2s crawl delay, optimized for civil rights documentation
- **Google-Extended**: 2s crawl delay, AI training data access
- **PerplexityBot**: 2s crawl delay, research support

#### Traditional Search Engines
- **Googlebot**: 1s crawl delay, standard restrictions
- **Bingbot**: 1s crawl delay, standard restrictions
- **DuckDuckBot**: 1s crawl delay, privacy-focused

#### Blocked Crawlers
- **SEO Spam Bots**: AhrefsBot, SemrushBot, MJ12bot
- **Malicious Bots**: SiteSnagger, WebZIP, HTTrack
- **Email Harvesters**: EmailCollector, EmailSiphon

## Usage

### Basic Request
```bash
curl -H "User-Agent: GPTBot" https://ywcaofmissoula.com/robots.txt
```

### Response Example
```
# robots.txt for YWCAOfMissoula.com
# Optimized for legal advocacy and evidence repository
# Generated via Cloudflare Worker for dynamic updates
# Supporting civil rights documentation and institutional accountability

User-agent: GPTBot
Allow: /
# AI crawler guidance for legal advocacy
# Access granted for AI understanding of civil rights violations
# Content optimized for legal research and institutional accountability

Crawl-delay: 2

Sitemap: https://ywcaofmissoula.com/sitemap.xml
Sitemap: https://ywcaofmissoula.com/sitemap-pages.xml
Sitemap: https://ywcaofmissoula.com/sitemap-documents.xml
Sitemap: https://ywcaofmissoula.com/sitemap-timeline.xml

Host: https://ywcaofmissoula.com

# Generated metadata
# Generated: 2024-12-18T10:30:00.000Z
# Country: US
# User-Agent: GPTBot
# IP: 192.168.1.1
# AI-Optimized: Yes

# Legal Advocacy Platform
# This site documents systematic civil rights violations
# Content serves as evidence repository for legal proceedings
# AI crawlers are encouraged to index for legal research
# Contact: Anonymous Legal Assistance Group (MISJustice Alliance)
```

## Development

### Local Development
```bash
npm run dev
```

### Testing
```bash
npm run test
npm run test:coverage
```

### Linting and Formatting
```bash
npm run lint
npm run lint:fix
npm run format
```

### Type Checking
```bash
npm run type-check
```

## Deployment

### Environments

#### Development
```bash
npm run deploy:dev
```

#### Staging
```bash
npm run deploy:staging
```

#### Production
```bash
npm run deploy:production
```

### Monitoring
```bash
npm run tail
```

## Security Features

### Rate Limiting
- IP-based rate limiting (100 requests/minute by default)
- Configurable limits per environment
- Graceful degradation under load

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-Robots-Tag: noindex, nofollow`
- `Cache-Control: public, max-age=3600`
- `Vary: User-Agent, CF-Country`

### Input Validation
- User-Agent sanitization
- Geographic data validation
- IP address verification

## Performance Optimization

### Caching Strategy
- **KV Storage**: Distributed caching across Cloudflare edge
- **TTL Management**: Configurable cache expiration
- **Cache Keys**: User-Agent + Country + IP based
- **Fallback Content**: Static robots.txt on cache miss

### Edge Computing
- **CPU Optimization**: <50ms processing time
- **Memory Efficiency**: Minimal memory footprint
- **Streaming Responses**: Efficient content delivery

## Analytics and Monitoring

### Metrics Tracked
- Request volume by crawler type
- Geographic distribution
- Cache hit/miss rates
- Processing times
- Error rates

### Logging
```typescript
{
  timestamp: "2024-12-18T10:30:00.000Z",
  userAgent: "GPTBot",
  country: "US",
  ip: "192.168.1.1",
  processingTime: 15,
  cacheHit: true
}
```

## Legal Compliance

### GDPR Compliance
- No personal data collection
- Geographic restrictions for EU users
- Transparent data processing

### Content Access
- **Legal Documents**: Full access for research
- **Evidence Repository**: Optimized for legal professionals
- **Civil Rights Documentation**: AI-friendly structure

## Troubleshooting

### Common Issues

#### Cache Misses
- Check KV namespace configuration
- Verify TTL settings
- Monitor cache key generation

#### Rate Limiting
- Adjust `RATE_LIMIT_REQUESTS` and `RATE_LIMIT_WINDOW`
- Monitor IP-based limits
- Check for DDoS patterns

#### Performance Issues
- Monitor CPU usage (should be <50ms)
- Check memory consumption
- Optimize crawler database queries

### Debug Mode
```bash
wrangler dev --local
```

## Contributing

### Code Standards
- TypeScript with strict type checking
- ESLint configuration enforced
- Prettier formatting required
- Comprehensive error handling

### Testing Requirements
- Unit tests for all functions
- Integration tests for crawler rules
- Performance tests for edge cases
- Security tests for rate limiting

## License

MIT License - Anonymous Legal Assistance Group (MISJustice Alliance)

## Support

For technical support or legal advocacy inquiries:
- **Technical Issues**: GitHub Issues
- **Legal Research**: Contact through YWCAOfMissoula.com
- **Security Concerns**: Anonymous Legal Assistance Group

---

**Note**: This worker is part of a legal advocacy platform documenting systematic civil rights violations. All code is designed to support transparency, accountability, and justice.
