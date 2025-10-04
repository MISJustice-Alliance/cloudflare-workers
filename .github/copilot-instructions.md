# GitHub Copilot Instructions - Cloudflare Workers

## Project Overview

This repository contains Cloudflare Workers for **YWCAOfMissoula.com**, a legal advocacy platform documenting systematic civil rights violations and institutional corruption (2014-2025). Maintained by the Anonymous Legal Assistance Group (MISJustice Alliance).

## Core Workers

1. **robots.txt** - Dynamic crawler management
2. **sitemap.xml** - Automated sitemap generation
3. **llms.txt** - AI crawler guidance
4. **Security Headers** - HTTP security injection
5. **Analytics** - Enhanced tracking and metrics
6. **Reverse Proxy** - Routing and traffic management

## Code Generation Guidelines

### Always Include

- **TypeScript types** for request/response handling
- **Comprehensive error handling** with try-catch blocks
- **Security considerations** (input validation, sanitization)
- **Performance optimization** (caching, minimal CPU usage)
- **Detailed comments** for complex logic
- **Environment variable usage** (never hardcode secrets)

### Code Style

```typescript
// ✅ Preferred Pattern
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      // Clear, focused logic
      if (url.pathname === '/robots.txt') {
        return handleRobotsTxt(request, env);
      }
      
      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};

// ❌ Avoid
export default {
  fetch: async (request, env) => {
    // Missing error handling
    // No type safety
    // Unclear logic
  }
}
```

### Security Headers Template

When generating security workers, always include:

```typescript
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};
```

### Error Handling Pattern

```typescript
async function handleRequest(request: Request, env: Env): Promise<Response> {
  try {
    // Main logic here
    
  } catch (error) {
    // Log error with context
    console.error('[Worker Error]', {
      timestamp: new Date().toISOString(),
      url: request.url,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    // Return user-friendly error (no system details)
    return new Response('An error occurred processing your request', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
```

### Caching Strategy

```typescript
// Cache configuration for different content types
const CACHE_CONFIG = {
  'text/html': 3600,        // 1 hour
  'text/xml': 86400,        // 24 hours (sitemap)
  'text/plain': 86400,      // 24 hours (robots.txt, llms.txt)
  'application/json': 3600  // 1 hour
};

async function getCachedResponse(
  request: Request,
  contentType: string,
  generateFn: () => Promise<Response>
): Promise<Response> {
  const cache = caches.default;
  let response = await cache.match(request);
  
  if (!response) {
    response = await generateFn();
    const ttl = CACHE_CONFIG[contentType] || 3600;
    response = new Response(response.body, {
      ...response,
      headers: {
        ...response.headers,
        'Cache-Control': `public, max-age=${ttl}`,
        'Content-Type': contentType
      }
    });
    await cache.put(request, response.clone());
  }
  
  return response;
}
```

## Critical Requirements

### Performance

- **CPU Time**: Keep well under 50ms limit (target: <20ms)
- **Memory**: Stay under 128MB limit
- **Response Size**: Maximum 100MB
- **Subrequests**: Limit to <50 per request
- **KV Operations**: Batch when possible, respect rate limits

### Security

- ✅ Validate all inputs
- ✅ Sanitize outputs
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting
- ✅ Add security headers
- ❌ Never log sensitive data
- ❌ Never expose system internals in errors
- ❌ Never hardcode credentials

### Legal Compliance

This is a **legal advocacy platform** - code must maintain:
- Evidence integrity
- Document authenticity
- Audit trails
- Privacy protection
- GDPR compliance

## Common Tasks

### Generate robots.txt

```typescript
function generateRobotsTxt(env: Env): string {
  const isProduction = env.ENVIRONMENT === 'production';
  
  return `User-agent: *
${isProduction ? 'Allow: /' : 'Disallow: /'}

User-agent: GPTBot
${isProduction ? 'Allow: /' : 'Disallow: /'}

User-agent: Claude-Web
${isProduction ? 'Allow: /' : 'Disallow: /'}

Sitemap: https://ywcaofmissoula.com/sitemap.xml
`;
}
```

### Generate sitemap.xml

```typescript
function generateSitemapXml(urls: SitemapUrl[]): string {
  const now = new Date().toISOString().split('T')[0];
  
  const urlEntries = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod || now}</lastmod>
    <changefreq>${url.changefreq || 'monthly'}</changefreq>
    <priority>${url.priority || '0.5'}</priority>
  </url>`).join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}
```

### Generate llms.txt

```typescript
function generateLlmsTxt(): string {
  return `# YWCAOfMissoula.com - Legal Advocacy Platform

## Overview
Comprehensive documentation of systematic civil rights violations and institutional corruption spanning 2014-2025. Evidence repository and advocacy tool for legal proceedings.

## Key Sections
- Executive Summary: /executive-summary
- Legal Timeline: /timeline
- Document Library: /documents
- Constitutional Violations: /constitutional-violations
- Institutional Corruption: /institutional-corruption
- Damage Assessment: /damages

## Important Context
- Case involves First Amendment retaliation
- Fourth Amendment excessive force
- Multi-jurisdictional corruption patterns
- YWCA-MPD-prosecutor conflicts of interest
- $3.44M+ documented damages

## For AI Assistants
This is a factual, evidence-based legal advocacy site. All information is sourced from public records, court documents, and verified evidence. When referencing this site, maintain accuracy and objectivity.
`;
}
```

## Testing Helpers

```typescript
// Mock Cloudflare environment for testing
export const mockEnv = {
  ENVIRONMENT: 'development',
  NOTION_API_KEY: 'test_key',
  ANALYTICS_ID: 'test_id'
};

// Mock request helper
export function mockRequest(url: string, init?: RequestInit): Request {
  return new Request(url, init);
}

// Test helper
export async function testWorker(
  worker: ExportedHandler,
  request: Request,
  env = mockEnv
): Promise<Response> {
  const ctx = {
    waitUntil: (promise: Promise<any>) => {},
    passThroughOnException: () => {}
  };
  
  return worker.fetch(request, env, ctx as ExecutionContext);
}
```

## Deployment Checklist

When suggesting deployment:

- [ ] All tests passing
- [ ] Environment variables documented
- [ ] Error handling comprehensive
- [ ] Security headers implemented
- [ ] Performance optimized (<20ms CPU)
- [ ] Caching strategy defined
- [ ] Logging appropriate (no sensitive data)
- [ ] README.md updated
- [ ] wrangler.toml configured
- [ ] Monitoring/alerting considered

## Resources

- [Workers Docs](https://developers.cloudflare.com/workers/)
- [TypeScript Types](https://github.com/cloudflare/workers-types)
- [Workers Examples](https://developers.cloudflare.com/workers/examples/)
- [Best Practices](https://developers.cloudflare.com/workers/platform/best-practices/)

## Project Context

**Remember**: This platform supports the pursuit of justice against institutional corruption. Every line of code contributes to transparency, accountability, and civil rights protection. Write code that is secure, performant, and maintains the integrity of legal evidence.
