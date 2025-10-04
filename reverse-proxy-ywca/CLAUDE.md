# Claude Code Configuration
## Reverse Proxy Worker - Main Traffic Routing

> **Worker Purpose**: Primary traffic routing and management for YWCAOfMissoula.com with security, analytics, and request/response modification

---

## 🎯 Worker Overview

### Purpose
Main entry point for all traffic to YWCAOfMissoula.com. Handles:
- Traffic routing to Super.so (Notion backend)
- Security header injection
- Request/response modification
- Analytics tracking
- Performance optimization
- Error handling

### Routes
- `ywcaofmissoula.com/*` - ALL traffic
- `www.ywcaofmissoula.com/*` - ALL www traffic

### Priority
**CRITICAL** - This worker handles ALL site traffic. Any issues immediately impact the entire platform.

---

## 📋 Key Features

1. **Reverse Proxy**
   - Route to Super.so backend
   - Transparent to users
   - Handle redirects properly
   - Maintain session state

2. **Security**
   - Comprehensive security headers
   - CSP (Content Security Policy)
   - HSTS enforcement
   - XSS protection
   - Frame protection

3. **Performance**
   - Edge caching
   - Response compression
   - Header optimization
   - Fast failover

4. **Analytics**
   - Request logging
   - Performance metrics
   - Error tracking
   - User analytics

5. **Resilience**
   - Error handling
   - Fallback responses
   - Health monitoring
   - Graceful degradation

---

## 🚀 Quick Start

### Local Development
```bash
# Navigate to worker directory
cd reverse-proxy-ywca

# Install dependencies
npm install

# Start local development server
wrangler dev

# Test locally
curl http://localhost:8787/
```

### Testing
```bash
# Test live site
curl https://ywcaofmissoula.com/

# Check security headers
curl -I https://ywcaofmissoula.com/

# Test specific paths
curl https://ywcaofmissoula.com/summary
curl https://ywcaofmissoula.com/timeline
```

### Deployment
```bash
# CRITICAL: Test thoroughly before production deployment

# Deploy to staging first
wrangler deploy --env staging

# Test staging thoroughly
curl https://staging.ywcaofmissoula.com/

# Deploy to production
wrangler deploy --env production

# Monitor closely
wrangler tail --env production --format pretty
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `BACKEND_URL` | Super.so backend URL | Yes | - |
| `ENVIRONMENT` | Deployment environment | No | `production` |
| `ANALYTICS_ID` | Google Analytics ID | No | - |
| `ENABLE_DEBUG` | Debug logging | No | `false` |

### wrangler.toml
```toml
name = "reverse-proxy-ywca"
main = "src/worker.js"
compatibility_date = "2025-01-01"

[[routes]]
pattern = "ywcaofmissoula.com/*"
zone_name = "ywcaofmissoula.com"

[[routes]]
pattern = "www.ywcaofmissoula.com/*"
zone_name = "ywcaofmissoula.com"

[env.production]
vars = { 
  BACKEND_URL = "https://ywcaofmissoula.super.site",
  ENVIRONMENT = "production" 
}

[env.staging]
vars = { 
  BACKEND_URL = "https://staging.ywcaofmissoula.super.site",
  ENVIRONMENT = "staging" 
}
```

---

## 💡 Implementation Guidelines

### Core Worker Structure

```javascript
export default {
  async fetch(request, env, ctx) {
    try {
      // 1. Parse request
      const url = new URL(request.url);
      
      // 2. Log request (no sensitive data)
      console.log(`[${env.ENVIRONMENT}] ${request.method} ${url.pathname}`);
      
      // 3. Check for special paths (robots.txt handled by different worker)
      // These should be handled by their dedicated workers
      
      // 4. Build backend request
      const backendUrl = new URL(url.pathname + url.search, env.BACKEND_URL);
      
      // 5. Forward request to backend
      const backendRequest = new Request(backendUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'follow'
      });
      
      // 6. Fetch from backend
      let response = await fetch(backendRequest);
      
      // 7. Clone response for modification
      response = new Response(response.body, response);
      
      // 8. Add security headers
      response = addSecurityHeaders(response);
      
      // 9. Add performance headers
      response = addPerformanceHeaders(response);
      
      // 10. Return modified response
      return response;
      
    } catch (error) {
      console.error('Reverse proxy error:', error);
      return handleError(error, env);
    }
  }
};

function addSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  
  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "connect-src 'self' https://www.google-analytics.com; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  );
  
  // HSTS - Force HTTPS
  headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // Prevent MIME sniffing
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');
  
  // XSS Protection
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=()'
  );
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function addPerformanceHeaders(response) {
  const headers = new Headers(response.headers);
  
  // Add caching headers for static assets
  const url = new URL(response.url);
  
  if (url.pathname.match(/\.(js|css|jpg|jpeg|png|gif|svg|woff|woff2)$/)) {
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (url.pathname.match(/\.(html|htm)$/)) {
    headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function handleError(error, env) {
  // Log error details
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    environment: env.ENVIRONMENT
  });
  
  // Return user-friendly error page
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Service Temporarily Unavailable</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 600px;
          margin: 100px auto;
          padding: 20px;
          text-align: center;
        }
        h1 { color: #c00; }
        p { line-height: 1.6; }
      </style>
    </head>
    <body>
      <h1>Service Temporarily Unavailable</h1>
      <p>We're experiencing technical difficulties. Please try again in a few moments.</p>
      <p>If the problem persists, please contact support.</p>
    </body>
    </html>
  `;
  
  return new Response(html, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '60'
    }
  });
}
```

---

## 🔐 Security Implementation

### Critical Security Headers

1. **Content-Security-Policy (CSP)**
   - Prevents XSS attacks
   - Controls resource loading
   - Blocks inline scripts (unless necessary)

2. **Strict-Transport-Security (HSTS)**
   - Forces HTTPS
   - Includes subdomains
   - Preload ready

3. **X-Frame-Options**
   - Prevents clickjacking
   - Set to DENY

4. **X-Content-Type-Options**
   - Prevents MIME sniffing
   - Set to nosniff

5. **Referrer-Policy**
   - Controls referrer information
   - Privacy-focused

### Testing Security Headers

```bash
# Check all security headers
curl -I https://ywcaofmissoula.com/ | grep -E "Content-Security|Strict-Transport|X-Frame|X-Content"

# Use online tools
# https://securityheaders.com
# https://observatory.mozilla.org
```

---

## 📊 Performance Optimization

### Caching Strategy

```javascript
function getCacheHeaders(pathname) {
  // Static assets - long cache
  if (pathname.match(/\.(js|css|woff2|jpg|png|svg)$/)) {
    return 'public, max-age=31536000, immutable';
  }
  
  // HTML - short cache with revalidation
  if (pathname.match(/\.(html|htm)$/)) {
    return 'public, max-age=3600, must-revalidate';
  }
  
  // API responses - no cache
  if (pathname.startsWith('/api/')) {
    return 'no-cache, no-store, must-revalidate';
  }
  
  // Default - moderate cache
  return 'public, max-age=300';
}
```

### Response Compression

```javascript
// Cloudflare automatically handles compression
// Ensure responses don't override with conflicting headers
```

### Performance Targets
- TTFB (Time to First Byte): < 200ms
- Total load time: < 3 seconds
- Cache hit ratio: > 80%
- Error rate: < 0.1%

---

## 🧪 Testing

### Local Testing

```bash
# Test with wrangler dev
wrangler dev

# Test various paths
curl http://localhost:8787/
curl http://localhost:8787/summary
curl http://localhost:8787/timeline
```

### Production Testing

```bash
# Test main routes
curl -I https://ywcaofmissoula.com/
curl -I https://www.ywcaofmissoula.com/

# Test specific pages
curl https://ywcaofmissoula.com/summary
curl https://ywcaofmissoula.com/timeline
curl https://ywcaofmissoula.com/documents

# Check headers
curl -I https://ywcaofmissoula.com/ | grep -i "security\|cache\|content-type"
```

### Load Testing

```bash
# Use tools like:
# - Apache Bench: ab -n 1000 -c 10 https://ywcaofmissoula.com/
# - wrk: wrk -t12 -c400 -d30s https://ywcaofmissoula.com/
```

---

## 🚨 Critical Considerations

### IMPORTANT: This Worker Handles All Traffic

**Before Making Changes**:
1. Test exhaustively in development
2. Deploy to staging first
3. Monitor staging for issues
4. Have rollback plan ready
5. Deploy during low-traffic hours
6. Monitor production closely after deployment

### Monitoring Checklist After Deployment
- [ ] Check error rate in dashboard
- [ ] Monitor response times
- [ ] Verify security headers present
- [ ] Check cache hit ratios
- [ ] Watch for 5xx errors
- [ ] Monitor user reports

### Rollback Procedure
```bash
# If issues detected:
wrangler deployments list
wrangler rollback [previous-deployment-id]

# Verify rollback
curl -I https://ywcaofmissoula.com/
wrangler tail
```

---

## 📊 Analytics & Monitoring

### Key Metrics to Monitor

1. **Traffic Metrics**
   - Requests per second
   - Bandwidth usage
   - Geographic distribution

2. **Performance Metrics**
   - Response times
   - Cache hit ratios
   - CPU usage

3. **Error Metrics**
   - 4xx errors
   - 5xx errors
   - Timeout errors

4. **Security Metrics**
   - Blocked requests
   - Suspicious patterns
   - Rate limit hits

### Monitoring Commands

```bash
# Real-time logs
wrangler tail --format pretty

# Filter errors
wrangler tail --status error

# View in dashboard
# https://dash.cloudflare.com → Workers → reverse-proxy-ywca
```

---

## 🎯 Success Criteria

- [ ] All routes working correctly
- [ ] Security headers on all responses
- [ ] Performance within targets
- [ ] Error rate < 0.1%
- [ ] Cache hit ratio > 80%
- [ ] No user-reported issues
- [ ] Monitoring and alerting configured

---

## 📚 Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Security Headers Guide](https://developers.cloudflare.com/workers/examples/security-headers/)
- [Caching Guide](https://developers.cloudflare.com/workers/runtime-apis/cache/)

---

## 🆘 Troubleshooting

### Common Issues

**Site Down / 502 Errors**
```bash
# Check backend URL
echo $BACKEND_URL

# Test backend directly
curl -I https://ywcaofmissoula.super.site

# Check worker logs
wrangler tail
```

**Slow Response Times**
```bash
# Check cache hit ratios
# Cloudflare dashboard → Analytics

# Verify caching headers
curl -I https://ywcaofmissoula.com/
```

**Security Header Missing**
```bash
# Verify worker deployed
wrangler deployments list

# Check response headers
curl -I https://ywcaofmissoula.com/ | grep -i security
```

---

**CRITICAL REMINDER**: This worker is the front door to the legal advocacy platform. Reliability and security directly impact access to justice. Test thoroughly, deploy carefully, monitor constantly.
