# LLMS.txt Worker - AI Optimization Files Server

> Cloudflare Worker for serving AI optimization files (llms.txt and llms-full.txt) for YWCAOfMissoula.com

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)]()
[![License](https://img.shields.io/badge/license-Apache--2.0-green.svg)]()

## Overview

This Cloudflare Worker serves AI optimization files that help AI systems and LLM crawlers understand and accurately represent the content on YWCAOfMissoula.com. It implements advanced caching, security, rate limiting, and analytics for optimal performance and protection.

### Features

- ✅ **Dual File Serving**: llms.txt (summary) and llms-full.txt (comprehensive)
- ✅ **Advanced Caching**: Cloudflare Cache API + KV storage fallback
- ✅ **Security Headers**: Comprehensive security headers on all responses
- ✅ **Rate Limiting**: IP-based rate limiting with KV storage
- ✅ **ETag Support**: Conditional requests for bandwidth optimization
- ✅ **Analytics Tracking**: Privacy-preserving analytics (when enabled)
- ✅ **Health Check**: CI/CD-friendly health check endpoint
- ✅ **Environment Config**: Development, staging, production configurations
- ✅ **Content Versioning**: Version tracking for cache invalidation

### Routes

- `https://ywcaofmissoula.com/llms.txt` - Concise AI guidance file
- `https://ywcaofmissoula.com/llms-full.txt` - Comprehensive AI content map
- `https://ywcaofmissoula.com/health` - Health check endpoint

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) v3.0+
- Cloudflare account with Workers enabled

### Installation

```bash
# Navigate to worker directory
cd llms-txt-worker

# Install dependencies
npm install

# Authenticate with Cloudflare (if not already)
wrangler login
```

### Local Development

```bash
# Start local development server
npm run dev

# Test endpoints locally
curl http://localhost:8787/llms.txt
curl http://localhost:8787/llms-full.txt
curl http://localhost:8787/health
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

---

## Configuration

### Environment Variables

Configure in `wrangler.toml`:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ENVIRONMENT` | Deployment environment | `production` | No |
| `CACHE_TTL` | Cache time-to-live (seconds) | `86400` (24 hours) | No |
| `RATE_LIMIT_REQUESTS` | Max requests per window | `100` | No |
| `RATE_LIMIT_WINDOW` | Rate limit window (seconds) | `60` | No |
| `ANALYTICS_ENABLED` | Enable analytics tracking | `true` | No |

### KV Namespaces (Optional)

For dynamic content updates and rate limiting:

```toml
[[kv_namespaces]]
binding = "LLMS_CONTENT"
id = "your-kv-namespace-id"

[[kv_namespaces]]
binding = "RATE_LIMITER"
id = "your-rate-limiter-id"
```

Create KV namespaces:

```bash
# Create content namespace
wrangler kv:namespace create "LLMS_CONTENT"

# Create rate limiter namespace
wrangler kv:namespace create "RATE_LIMITER"

# Add IDs to wrangler.toml
```

---

## Content Management

### Hardcoded Content (Default)

By default, the worker serves hardcoded content for reliability and speed. Content is embedded in the worker code.

### KV Storage (Optional)

For dynamic content updates without redeployment:

```bash
# Upload content to KV storage
node scripts/upload-content.js production

# Content will be served from KV instead of hardcoded
```

The upload script:
- Reads `llms.txt` and `llms-full.txt` from repository root
- Uploads to configured KV namespace
- Supports development, staging, production environments

### Updating Content

**Option 1: Redeploy Worker (Recommended)**
```bash
# Edit content in src/worker.ts (LLMS_TXT_CONTENT and LLMS_FULL_TXT_CONTENT)
# Deploy to production
npm run deploy:production
```

**Option 2: Update KV Storage**
```bash
# Edit llms.txt and llms-full.txt in repository root
# Upload to KV
node scripts/upload-content.js production
```

---

## Testing

### Run Tests

```bash
# Run test suite
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The test suite covers:
- ✅ File serving (llms.txt, llms-full.txt)
- ✅ Security headers (all major headers)
- ✅ Caching behavior (Cache-Control, ETag)
- ✅ Health check endpoint
- ✅ Error handling
- ✅ Content validation
- ✅ CORS headers
- ✅ Performance benchmarks

### Manual Testing

```bash
# Test llms.txt
curl https://ywcaofmissoula.com/llms.txt

# Test llms-full.txt
curl https://ywcaofmissoula.com/llms-full.txt

# Test health check
curl https://ywcaofmissoula.com/health

# Test ETag support
curl -I https://ywcaofmissoula.com/llms.txt

# Test rate limiting (requires rate limiter KV)
for i in {1..150}; do curl -s -o /dev/null -w "%{http_code}\n" https://ywcaofmissoula.com/llms.txt; done
```

---

## Performance

### Optimization Features

- **Edge Caching**: Cloudflare Cache API for 24-hour cache
- **ETag Support**: 304 Not Modified for conditional requests
- **KV Fallback**: Optional KV storage for dynamic content
- **Compression**: Automatic gzip/brotli compression
- **Fast Response**: < 50ms response time

### Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Response Time | < 50ms | Cached responses |
| CPU Time | < 10ms | Worker execution |
| Cache Hit Ratio | > 95% | After warmup |
| Bandwidth Saved | > 80% | With ETag support |

### Monitoring

```bash
# Stream worker logs
npm run tail

# Stream production logs
npm run tail:production

# View metrics in Cloudflare Dashboard
# Workers → llms-txt-worker → Metrics
```

---

## Security

### Security Headers

All responses include comprehensive security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: default-src 'none'; ...`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

### Rate Limiting

IP-based rate limiting protects against abuse:

- Default: 100 requests per 60 seconds per IP
- Configurable via environment variables
- Uses KV storage for distributed state
- Returns `429 Too Many Requests` when exceeded

### Input Validation

All inputs are sanitized:

- Path sanitization (removes dangerous characters)
- Length limits (max 1000 characters)
- No script injection possible

### Privacy

- IP anonymization in analytics (last octet removed)
- No PII tracking
- Privacy-preserving logging
- GDPR/CCPA compliant

---

## Architecture

### Worker Flow

```
Request → Rate Limiter → Route Handler → Cache Check → Content Serve → Security Headers → Response
                                              ↓
                                         Cache Miss
                                              ↓
                                    KV Storage or Hardcoded
                                              ↓
                                        Cache Store
```

### Class Structure

- **ContentCache**: Manages KV and Cloudflare Cache API operations
- **RateLimiter**: IP-based rate limiting with KV storage
- **Analytics**: Privacy-preserving analytics tracking

### Content Sources

1. **Cloudflare Cache** (fastest) - 24-hour edge cache
2. **KV Storage** (optional) - Dynamic content updates
3. **Hardcoded** (fallback) - Embedded in worker code

---

## Troubleshooting

### Common Issues

**Issue: Rate limit errors during testing**
```bash
# Increase rate limit for development
# In wrangler.toml:
[env.development]
vars = { RATE_LIMIT_REQUESTS = "1000" }
```

**Issue: Content not updating**
```bash
# Clear Cloudflare cache
curl -X PURGE https://ywcaofmissoula.com/llms.txt

# Or via Cloudflare Dashboard:
# Caching → Configuration → Purge Cache → Purge by URL
```

**Issue: Worker not deploying**
```bash
# Check wrangler authentication
wrangler whoami

# Re-authenticate if needed
wrangler login

# Check for syntax errors
npm run build
```

**Issue: Health check failing**
```bash
# Check health endpoint
curl https://ywcaofmissoula.com/health

# Verify worker is deployed
wrangler deployments list
```

**Issue: KV namespace not found**
```bash
# List KV namespaces
wrangler kv:namespace list

# Create if missing
wrangler kv:namespace create "LLMS_CONTENT"

# Add ID to wrangler.toml
```

### Debug Mode

Enable verbose logging:

```bash
# Local development with logs
wrangler dev --local

# Production logs (real-time)
wrangler tail --format pretty
```

---

## CI/CD Integration

### GitHub Actions

The worker is automatically deployed via GitHub Actions:

```yaml
# .github/workflows/deploy.yml includes:
- Deploy to development (on push to develop branch)
- Deploy to staging (on push to staging branch)
- Deploy to production (on push to main branch)
- Health check verification
```

### Deployment Verification

After deployment, CI/CD verifies:

```bash
# Health check
curl -f https://ywcaofmissoula.com/health || exit 1

# llms.txt availability
curl -f https://ywcaofmissoula.com/llms.txt || exit 1

# llms-full.txt availability
curl -f https://ywcaofmissoula.com/llms-full.txt || exit 1
```

---

## API Reference

### GET /llms.txt

Serves concise AI optimization guide.

**Response:**
```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Cache-Control: public, max-age=86400
ETag: "2.0.0-9170"
X-Content-Version: 2.0.0
[security headers...]

# YWCAOfMissoula.com - AI Optimization Guide
...
```

### GET /llms-full.txt

Serves comprehensive AI content map.

**Response:**
```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Cache-Control: public, max-age=86400
ETag: "2.0.0-24413"
X-Content-Version: 2.0.0
[security headers...]

# YWCAOfMissoula.com - Comprehensive AI Content Map
...
```

### GET /health

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "environment": "production",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "services": {
    "kv": true,
    "rateLimiter": true,
    "cache": true
  }
}
```

---

## Development Workflow

### Making Changes

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes**
   ```bash
   # Edit src/worker.ts
   # Add tests to src/worker.test.ts
   ```

3. **Test locally**
   ```bash
   npm run dev
   npm test
   ```

4. **Deploy to development**
   ```bash
   npm run deploy:dev
   ```

5. **Test in staging**
   ```bash
   npm run deploy:staging
   ```

6. **Deploy to production**
   ```bash
   npm run deploy:production
   ```

### Code Style

- Use TypeScript for type safety
- Follow existing patterns (see other workers)
- Add JSDoc comments for all functions
- Include comprehensive error handling
- Add tests for new features
- Update documentation

---

## Contributing

### Guidelines

1. Follow repository coding standards (see `/CLAUDE.md`)
2. Add tests for all new features
3. Update documentation
4. Security first: validate all inputs, add security headers
5. Performance: optimize for edge computing constraints
6. Privacy: anonymize PII, respect user privacy

### Testing Checklist

- [ ] Tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] Local testing successful (`npm run dev`)
- [ ] Security headers verified
- [ ] Performance benchmarks met
- [ ] Documentation updated

---

## License

Apache License 2.0

---

## Support

- **Organization**: MISJustice Alliance
- **Website**: [YWCAOfMissoula.com](https://ywcaofmissoula.com)
- **Documentation**: See `/CLAUDE.md` and `/docs/`
- **Issues**: GitHub Issues

---

## Related Documentation

- [Repository CLAUDE.md](../CLAUDE.md) - Repository-wide coding standards
- [Worker CLAUDE.md](./CLAUDE.md) - Worker-specific guidelines
- [SEO-GEO Guide](../docs/SEO-GEO-GUIDE.md) - SEO and GEO optimization
- [Deployment Guide](../docs/DEPLOYMENT.md) - Deployment procedures
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

---

**Remember**: This worker serves AI systems that help expose institutional corruption and civil rights violations. Code quality directly impacts access to justice. Code with purpose. ⚖️
