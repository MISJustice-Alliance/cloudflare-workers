# Cloudflare Worker Template
## Standard Structure for YWCAOfMissoula.com Workers

This template provides a standardized structure for creating new Cloudflare Workers in this repository.

---

## Directory Structure

```
worker-name/
├── src/
│   ├── worker.ts (or worker.js)      # Main worker entry point
│   ├── handlers/
│   │   ├── index.ts                   # Handler exports
│   │   ├── routes.ts                  # Route handlers
│   │   └── errors.ts                  # Error handlers
│   ├── utils/
│   │   ├── cache.ts                   # Caching utilities
│   │   ├── security.ts                # Security helpers
│   │   ├── validation.ts              # Input validation
│   │   └── response.ts                # Response helpers
│   ├── types/
│   │   └── index.ts                   # TypeScript type definitions
│   └── config/
│       └── constants.ts               # Configuration constants
├── tests/
│   ├── worker.test.ts                 # Worker tests
│   └── handlers.test.ts               # Handler tests
├── .gitignore
├── wrangler.toml                      # Cloudflare configuration
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config (if TS)
└── README.md                          # Worker documentation
```

---

## Worker Entry Point Template

### TypeScript (`src/worker.ts`)

```typescript
/**
 * Cloudflare Worker: [Worker Name]
 * Purpose: [Description of what this worker does]
 * Route: [Route pattern this worker handles]
 */

// Environment interface - define all env vars and bindings
export interface Env {
  // Environment variables
  ENVIRONMENT?: string;
  
  // KV Namespaces (if needed)
  // KV_NAMESPACE?: KVNamespace;
  
  // Secrets (if needed)
  // API_KEY?: string;
  
  // Durable Objects (if needed)
  // DURABLE_OBJECT?: DurableObjectNamespace;
}

// Import handlers
import { handleRoute } from './handlers/routes';
import { handleError } from './handlers/errors';
import { addSecurityHeaders } from './utils/security';

/**
 * Main worker fetch handler
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    try {
      // Parse request URL
      const url = new URL(request.url);
      
      // Log request (no sensitive data)
      console.log(`[${env.ENVIRONMENT}] ${request.method} ${url.pathname}`);
      
      // Route handling
      let response: Response;
      
      if (url.pathname === '/') {
        response = await handleRoute(request, env);
      } else if (url.pathname.startsWith('/api/')) {
        response = new Response('API endpoint', { status: 200 });
      } else {
        response = new Response('Not Found', { status: 404 });
      }
      
      // Add security headers
      response = addSecurityHeaders(response);
      
      return response;
      
    } catch (error) {
      // Handle errors
      console.error('Worker error:', error);
      return handleError(error, env);
    }
  },
  
  /**
   * Scheduled handler (if needed for cron jobs)
   */
  // async scheduled(
  //   event: ScheduledEvent,
  //   env: Env,
  //   ctx: ExecutionContext
  // ): Promise<void> {
  //   // Scheduled task implementation
  // }
};
```

### JavaScript (`src/worker.js`)

```javascript
/**
 * Cloudflare Worker: [Worker Name]
 * Purpose: [Description of what this worker does]
 * Route: [Route pattern this worker handles]
 */

import { handleRoute } from './handlers/routes.js';
import { handleError } from './handlers/errors.js';
import { addSecurityHeaders } from './utils/security.js';

/**
 * Main worker fetch handler
 */
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      console.log(`[${env.ENVIRONMENT}] ${request.method} ${url.pathname}`);
      
      let response;
      
      if (url.pathname === '/') {
        response = await handleRoute(request, env);
      } else {
        response = new Response('Not Found', { status: 404 });
      }
      
      response = addSecurityHeaders(response);
      
      return response;
      
    } catch (error) {
      console.error('Worker error:', error);
      return handleError(error, env);
    }
  }
};
```

---

## Handler Templates

### Route Handler (`src/handlers/routes.ts`)

```typescript
import { Env } from '../worker';
import { jsonResponse, textResponse } from '../utils/response';
import { getCached } from '../utils/cache';

/**
 * Main route handler
 */
export async function handleRoute(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const url = new URL(request.url);
    
    // Example: Check cache first
    const cacheKey = `route:${url.pathname}`;
    const cached = await getCached(cacheKey, env.KV_NAMESPACE);
    
    if (cached) {
      return textResponse(cached, 200, 3600);
    }
    
    // Generate response
    const content = 'Hello from worker!';
    
    // Cache response (if KV available)
    if (env.KV_NAMESPACE) {
      await env.KV_NAMESPACE.put(cacheKey, content, {
        expirationTtl: 3600 // 1 hour
      });
    }
    
    return textResponse(content);
    
  } catch (error) {
    console.error('Route handler error:', error);
    throw error;
  }
}
```

### Error Handler (`src/handlers/errors.ts`)

```typescript
import { Env } from '../worker';
import { jsonResponse } from '../utils/response';

/**
 * Central error handler
 */
export function handleError(error: any, env: Env): Response {
  // Log error details
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    environment: env.ENVIRONMENT
  });
  
  // Determine error type and response
  if (error.name === 'ValidationError') {
    return jsonResponse({
      error: 'Invalid request',
      message: error.message
    }, 400);
  }
  
  if (error.name === 'NotFoundError') {
    return jsonResponse({
      error: 'Resource not found'
    }, 404);
  }
  
  // Default error response (don't expose internal details)
  return jsonResponse({
    error: 'Internal server error',
    ...(env.ENVIRONMENT === 'development' && {
      message: error.message
    })
  }, 500);
}
```

---

## Utility Templates

### Response Utilities (`src/utils/response.ts`)

```typescript
/**
 * Create JSON response with proper headers
 */
export function jsonResponse(
  data: any,
  status: number = 200,
  headers?: Record<string, string>
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      ...headers
    }
  });
}

/**
 * Create text response with caching
 */
export function textResponse(
  text: string,
  status: number = 200,
  maxAge: number = 3600,
  headers?: Record<string, string>
): Response {
  return new Response(text, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': `public, max-age=${maxAge}`,
      ...headers
    }
  });
}

/**
 * Create HTML response
 */
export function htmlResponse(
  html: string,
  status: number = 200,
  headers?: Record<string, string>
): Response {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...headers
    }
  });
}

/**
 * Create redirect response
 */
export function redirectResponse(
  url: string,
  status: number = 302
): Response {
  return Response.redirect(url, status);
}
```

### Security Utilities (`src/utils/security.ts`)

```typescript
/**
 * Add comprehensive security headers to response
 */
export function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  
  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://www.google-analytics.com;"
  );
  
  // HSTS
  headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // Other security headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=()'
  );
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

/**
 * Rate limiting check
 */
export async function checkRateLimit(
  identifier: string,
  kv: KVNamespace,
  limit: number = 100,
  window: number = 60
): Promise<boolean> {
  const key = `ratelimit:${identifier}`;
  const current = await kv.get(key);
  const count = parseInt(current || '0');
  
  if (count >= limit) {
    return false; // Rate limit exceeded
  }
  
  await kv.put(key, (count + 1).toString(), {
    expirationTtl: window
  });
  
  return true; // Within rate limit
}

/**
 * Sanitize input string
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .substring(0, 1000); // Limit length
}
```

### Cache Utilities (`src/utils/cache.ts`)

```typescript
/**
 * Get cached value from KV or Cloudflare Cache
 */
export async function getCached(
  key: string,
  kv?: KVNamespace
): Promise<string | null> {
  // Try KV first
  if (kv) {
    const cached = await kv.get(key);
    if (cached) return cached;
  }
  
  // Try Cloudflare Cache
  const cache = caches.default;
  const cacheKey = new Request(key);
  const response = await cache.match(cacheKey);
  
  if (response) {
    return await response.text();
  }
  
  return null;
}

/**
 * Set cached value
 */
export async function setCached(
  key: string,
  value: string,
  ttl: number = 3600,
  kv?: KVNamespace
): Promise<void> {
  // Store in KV if available
  if (kv) {
    await kv.put(key, value, { expirationTtl: ttl });
  }
  
  // Store in Cloudflare Cache
  const cache = caches.default;
  const response = new Response(value, {
    headers: {
      'Cache-Control': `public, max-age=${ttl}`
    }
  });
  
  await cache.put(new Request(key), response);
}
```

---

## Configuration Files

### wrangler.toml

```toml
name = "worker-name"
main = "src/worker.js"
compatibility_date = "2024-01-01"
account_id = "" # Set during deployment

# Environment variables
[vars]
ENVIRONMENT = "production"

# KV Namespaces (if needed)
# [[kv_namespaces]]
# binding = "KV_NAMESPACE"
# id = ""
# preview_id = "" # For wrangler dev

# Durable Objects (if needed)
# [[durable_objects.bindings]]
# name = "DURABLE_OBJECT"
# class_name = "DurableObjectClass"
# script_name = "worker-name"

# Routes
[[routes]]
pattern = "ywcaofmissoula.com/path/*"
zone_name = "ywcaofmissoula.com"

# Build configuration
[build]
command = ""
# For TypeScript: command = "npm run build"

# Development environment
[env.development]
name = "worker-name-dev"
vars = { ENVIRONMENT = "development" }

# Staging environment
[env.staging]
name = "worker-name-staging"
vars = { ENVIRONMENT = "staging" }

# Production environment
[env.production]
vars = { ENVIRONMENT = "production" }
```

### package.json

```json
{
  "name": "worker-name",
  "version": "1.0.0",
  "description": "Description of worker functionality",
  "main": "src/worker.js",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "deploy:staging": "wrangler deploy --env staging",
    "deploy:production": "wrangler deploy --env production",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "lint": "eslint src",
    "type-check": "tsc --noEmit"
  },
  "keywords": [
    "cloudflare",
    "workers",
    "edge",
    "legal-advocacy"
  ],
  "author": "MISJustice Alliance",
  "license": "Apache-2.0",
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20241127.0",
    "typescript": "^5.3.3",
    "vitest": "^1.0.0",
    "wrangler": "^3.22.0"
  }
}
```

### tsconfig.json (TypeScript)

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ES2022",
    "lib": ["ES2021"],
    "types": ["@cloudflare/workers-types"],
    "jsx": "react",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "noEmit": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

---

## Testing Template

### Basic Test (`tests/worker.test.ts`)

```typescript
import { describe, it, expect } from 'vitest';
import worker from '../src/worker';

// Mock environment
const env = {
  ENVIRONMENT: 'test'
};

// Mock execution context
const ctx = {
  waitUntil: () => {},
  passThroughOnException: () => {}
} as ExecutionContext;

describe('Worker Tests', () => {
  it('should respond to valid requests', async () => {
    const request = new Request('https://example.com/');
    const response = await worker.fetch(request, env, ctx);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/plain');
  });
  
  it('should return 404 for unknown routes', async () => {
    const request = new Request('https://example.com/unknown');
    const response = await worker.fetch(request, env, ctx);
    
    expect(response.status).toBe(404);
  });
  
  it('should include security headers', async () => {
    const request = new Request('https://example.com/');
    const response = await worker.fetch(request, env, ctx);
    
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
  });
  
  it('should handle errors gracefully', async () => {
    // Test error handling
    const request = new Request('https://example.com/error');
    const response = await worker.fetch(request, env, ctx);
    
    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
```

---

## README Template

### Worker README.md

```markdown
# [Worker Name]

Brief description of what this worker does.

## Purpose

Detailed explanation of the worker's purpose and functionality.

## Features

- Feature 1
- Feature 2
- Feature 3

## Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/path` | GET | Description |
| `/api/endpoint` | POST | Description |

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VAR_NAME` | Description | Yes | - |
| `OPTIONAL_VAR` | Description | No | `default` |

### KV Namespaces

- `KV_NAMESPACE`: Description of what's stored

## Development

\`\`\`bash
# Install dependencies
npm install

# Start local development
wrangler dev

# Run tests
npm test
\`\`\`

## Deployment

\`\`\`bash
# Deploy to development
wrangler deploy --env development

# Deploy to production
wrangler deploy --env production
\`\`\`

## Testing

\`\`\`bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
\`\`\`

## Performance

- Average response time: X ms
- Cache hit ratio: X%
- CPU time usage: X ms

## Security

- Rate limiting: X requests per minute
- Security headers: Complete implementation
- Input validation: All user inputs sanitized

## Monitoring

- Logs: Available via `wrangler tail`
- Analytics: Cloudflare dashboard
- Alerts: Configured for errors and rate limits

## Contributing

See main repository CONTRIBUTING.md for guidelines.

## License

Apache 2.0 - See LICENSE file for details.
```

---

## Best Practices Checklist

### Before Creating Worker

- [ ] Define clear purpose and scope
- [ ] Identify required routes and handlers
- [ ] Determine KV/Durable Object needs
- [ ] Plan caching strategy
- [ ] Consider security requirements
- [ ] Define error handling approach

### During Development

- [ ] Follow TypeScript/JavaScript standards
- [ ] Implement comprehensive error handling
- [ ] Add security headers to all responses
- [ ] Validate and sanitize all inputs
- [ ] Use appropriate caching
- [ ] Log appropriately (no sensitive data)
- [ ] Write tests for all handlers
- [ ] Document all functions

### Before Deployment

- [ ] Run all tests
- [ ] Check for hardcoded values
- [ ] Verify environment variables
- [ ] Test in wrangler dev
- [ ] Review security headers
- [ ] Check performance
- [ ] Update README
- [ ] Add to main repository README

### After Deployment

- [ ] Monitor logs with `wrangler tail`
- [ ] Check analytics dashboard
- [ ] Verify routes working
- [ ] Test production endpoints
- [ ] Monitor error rates
- [ ] Check performance metrics

---

## Quick Start

1. **Copy this template directory**
2. **Rename worker** and update all references
3. **Configure wrangler.toml** with routes and bindings
4. **Implement handlers** for your specific use case
5. **Add tests** for all functionality
6. **Update README** with specific details
7. **Test locally** with `wrangler dev`
8. **Deploy** to staging first, then production

---

**Remember**: This worker is part of a legal advocacy platform. Code quality, security, and reliability directly impact access to justice.
```
