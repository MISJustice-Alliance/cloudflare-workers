# Claude Code Configuration
## YWCAOfMissoula.com Cloudflare Workers Repository

> **Repository Purpose**: Infrastructure code for a legal advocacy platform documenting systematic civil rights violations and institutional corruption in Missoula, Montana (2014-2025).

---

## 🎯 Project Mission

This repository contains Cloudflare Workers that power the infrastructure for **YWCAOfMissoula.com**, maintained by the Anonymous Legal Assistance Group (MISJustice Alliance). The platform serves as:
- Evidence repository for civil rights violations
- Legal advocacy tool for attorneys
- Public accountability mechanism
- Media resource for journalists

**Every line of code serves the mission of justice and institutional accountability.**

---

## 📁 Repository Structure

```
cloudflare-workers/
├── dynamic-robots-generator-ywcaofmissoula-com/  # Dynamic robots.txt generation
├── llms-txt-worker/                              # AI crawler optimization files
├── reverse-proxy-ywca/                           # Main traffic routing
├── sitemap-ywcaofmissoula-com/                   # Sitemap generation
├── robots-txt-worker/                            # robots.txt serving
├── docs/                                         # Documentation
│   ├── SEO-GEO-GUIDE.md                         # SEO & GEO optimization
│   ├── WORKER-TEMPLATE.md                       # Template for new workers
│   └── DEPLOYMENT.md                            # Deployment procedures
├── llms.txt                                      # AI optimization guide
├── llms-full.txt                                 # Comprehensive AI content map
└── robots.txt.template                           # robots.txt template
```

---

## 🚀 Quick Start for Claude Code

### Initialize Development Environment

```bash
# Navigate to repository
cd /Users/elvis/Documents/Git/MISJustice-Sites/cloudflare-workers

# Install Wrangler globally (if not installed)
npm install -g wrangler

# Authenticate with Cloudflare
wrangler login

# Navigate to a worker directory
cd reverse-proxy-ywca

# Install dependencies
npm install

# Start local development
wrangler dev
```

### Common Tasks

#### Create New Worker
```bash
# Create directory
mkdir new-worker-name
cd new-worker-name

# Initialize structure
mkdir src tests
touch src/worker.js wrangler.toml README.md CLAUDE.md
npm init -y

# Refer to docs/WORKER-TEMPLATE.md for structure
```

#### Deploy Worker
```bash
# Deploy to development
wrangler deploy --env development

# Deploy to staging
wrangler deploy --env staging

# Deploy to production
wrangler deploy --env production
```

#### Monitor Logs
```bash
# Stream real-time logs
wrangler tail

# Pretty format
wrangler tail --format pretty

# Filter by environment
wrangler tail --env production
```

---

## 🎨 Code Standards & Best Practices

### TypeScript/JavaScript Patterns

**Worker Entry Point**:
```javascript
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Route handling
      if (url.pathname === '/robots.txt') {
        return handleRobotsTxt(request, env);
      }
      
      return new Response('Not Found', { status: 404 });
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
```

**Error Handling** (always implement):
```javascript
async function safeHandler(operation, fallback) {
  try {
    return await operation();
  } catch (error) {
    console.error('Operation failed:', error);
    return fallback;
  }
}
```

**Security Headers** (required on all responses):
```javascript
function addSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return new Response(response.body, {
    status: response.status,
    headers
  });
}
```

### Critical Rules

1. ✅ **DO**:
   - Use environment variables for configuration
   - Implement comprehensive error handling
   - Add security headers to ALL responses
   - Validate and sanitize inputs
   - Log appropriately (no sensitive data)
   - Optimize for edge computing
   - Write tests for all handlers
   - Document all functions

2. ❌ **DON'T**:
   - Hardcode secrets or API keys
   - Log sensitive information (PII, credentials)
   - Use blocking synchronous operations
   - Leave promises unhandled
   - Exceed CPU time limits (50ms)
   - Ignore rate limiting
   - Skip input validation
   - Sacrifice security for convenience

---

## 🔧 Worker-Specific Context

### reverse-proxy-ywca
- **Purpose**: Main traffic routing and management
- **Routes**: `ywcaofmissoula.com/*`
- **Priority**: CRITICAL - handles all site traffic
- **Key Features**: Security headers, analytics, request modification

### sitemap-ywcaofmissoula-com
- **Purpose**: Dynamic sitemap generation
- **Routes**: `ywcaofmissoula.com/sitemap.xml`
- **Priority**: HIGH - SEO critical
- **Key Features**: Notion integration, dynamic updates, multiple sitemaps

### dynamic-robots-generator-ywcaofmissoula-com
- **Purpose**: Dynamic robots.txt with AI crawler optimization
- **Routes**: `ywcaofmissoula.com/robots.txt`
- **Priority**: HIGH - controls crawler access
- **Key Features**: AI crawler permissions, SEO optimization

### llms-txt-worker
- **Purpose**: Serve AI optimization files
- **Routes**: `ywcaofmissoula.com/llms.txt`, `/llms-full.txt`
- **Priority**: MEDIUM - GEO optimization
- **Key Features**: AI content mapping, crawler guidance

### robots-txt-worker
- **Purpose**: Static robots.txt serving
- **Routes**: `ywcaofmissoula.com/robots.txt`
- **Priority**: MEDIUM - fallback for dynamic generator
- **Key Features**: Simple, fast, reliable

---

## 🔐 Security Considerations

### CRITICAL Security Requirements

1. **Never Log Sensitive Data**:
   - No PII (personally identifiable information)
   - No API keys or secrets
   - No user credentials
   - No internal system details

2. **Input Validation**:
   ```javascript
   function sanitizeInput(input) {
     return input
       .trim()
       .replace(/[<>]/g, '') // Remove HTML tags
       .substring(0, 1000);   // Limit length
   }
   ```

3. **Rate Limiting**:
   ```javascript
   async function checkRateLimit(ip, kv, limit = 100) {
     const key = `ratelimit:${ip}`;
     const count = await kv.get(key);
     
     if (count && parseInt(count) > limit) {
       return false;
     }
     
     await kv.put(key, (parseInt(count || '0') + 1).toString(), {
       expirationTtl: 60
     });
     
     return true;
   }
   ```

4. **Headers** (always include):
   - Content-Security-Policy
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Strict-Transport-Security
   - Referrer-Policy

---

## 📊 Performance Optimization

### Targets
- Response time: < 50ms
- CPU time: < 50ms (hard limit)
- Cache hit ratio: > 80%
- Error rate: < 0.1%

### Optimization Techniques

**Caching Strategy**:
```javascript
async function getCached(key, fetcher, ttl = 3600) {
  const cache = caches.default;
  const cacheKey = new Request(key);
  
  let response = await cache.match(cacheKey);
  
  if (!response) {
    response = await fetcher();
    response.headers.set('Cache-Control', `max-age=${ttl}`);
    await cache.put(cacheKey, response.clone());
  }
  
  return response;
}
```

**KV Optimization**:
- Batch operations when possible
- Use consistent key naming: `{env}:{type}:{id}`
- Implement TTL appropriately
- Monitor usage and costs

---

## 🧪 Testing Guidelines

### Test Structure
```javascript
import { describe, it, expect } from 'vitest';

describe('Worker Tests', () => {
  it('should handle valid requests', async () => {
    const request = new Request('https://example.com/');
    const env = { ENVIRONMENT: 'test' };
    const ctx = {
      waitUntil: () => {},
      passThroughOnException: () => {}
    };
    
    const response = await worker.fetch(request, env, ctx);
    expect(response.status).toBe(200);
  });
});
```

### Test Checklist
- [ ] Valid request handling
- [ ] Error scenarios
- [ ] Security headers present
- [ ] Rate limiting works
- [ ] Cache behavior correct
- [ ] Input validation effective

---

## 📚 SEO & GEO Optimization

### Traditional SEO
- Dynamic sitemap generation
- Optimized robots.txt
- Structured data (Schema.org)
- Meta tags optimization
- Performance optimization

See `docs/SEO-GEO-GUIDE.md` for complete details.

### GEO (Generative Engine Optimization)
- **llms.txt**: AI crawler guidance
- **llms-full.txt**: Comprehensive content map
- Structured content for AI systems
- Clear entity relationships
- Fact-based organization

**Target Keywords**:
- Missoula police misconduct
- YWCA institutional corruption
- Montana civil rights violations
- Legal malpractice Montana
- First Amendment retaliation
- Prosecutorial misconduct

---

## 🛠 Troubleshooting

### Common Issues

**"Error: No account_id found"**
```bash
# Add to wrangler.toml or specify via CLI
wrangler deploy --account-id YOUR_ACCOUNT_ID
```

**"Route already exists"**
```bash
# Check existing routes
wrangler routes list

# Remove conflicting route
wrangler route delete [route-id]
```

**"KV namespace not found"**
```bash
# Create namespace
wrangler kv:namespace create "NAMESPACE_NAME"

# Add ID to wrangler.toml
```

**Worker not responding**
```bash
# Check logs
wrangler tail

# Verify routes
wrangler routes list

# Test locally
wrangler dev
```

---

## 📖 Additional Resources

### Documentation
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Workers Examples](https://developers.cloudflare.com/workers/examples/)
- [Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)

### Repository Files
- `.cursorrules`: Cursor IDE configuration
- `.clinerules`: Cline AI configuration
- `.aiderules`: Aider AI configuration
- `docs/SEO-GEO-GUIDE.md`: Complete SEO/GEO guide
- `docs/WORKER-TEMPLATE.md`: Template for new workers
- `docs/DEPLOYMENT.md`: Deployment procedures

---

## 🎯 Development Workflow

### For New Features
1. Create feature branch
2. Develop in worker directory
3. Test locally with `wrangler dev`
4. Write/update tests
5. Deploy to development
6. Test in staging
7. Deploy to production
8. Monitor for issues

### For Bug Fixes
1. Identify issue
2. Reproduce locally
3. Fix and test
4. Deploy to staging
5. Verify fix
6. Deploy to production
7. Document in CHANGELOG

### For Updates
1. Update code
2. Run tests
3. Update documentation
4. Deploy to staging
5. Verify changes
6. Deploy to production
7. Monitor metrics

---

## 🚨 Emergency Procedures

### Critical Bug
1. Rollback immediately: `wrangler rollback [deployment-id]`
2. Assess impact
3. Fix in development
4. Test thoroughly
5. Deploy fix
6. Post-mortem

### Security Incident
1. Disable worker if necessary
2. Assess scope
3. Patch vulnerability
4. Review logs
5. Deploy fix
6. Notify stakeholders

---

## 💡 Tips for Claude Code

### When Working on This Repository

1. **Understand the Context**: This is a legal advocacy platform. Code quality directly impacts access to justice.

2. **Security First**: Always implement security headers, input validation, and rate limiting.

3. **Performance Matters**: Optimize for edge computing constraints (CPU time, memory).

4. **Test Thoroughly**: Lives and legal outcomes may depend on this platform working correctly.

5. **Document Changes**: Update README, CHANGELOG, and relevant documentation.

6. **Follow Patterns**: Look at existing workers for established patterns.

7. **Ask When Uncertain**: Legal and privacy implications require careful consideration.

### Useful Commands

```bash
# Development
wrangler dev                    # Start local dev
wrangler dev --remote          # Dev with remote resources
wrangler tail                  # Stream logs
wrangler tail --format pretty  # Pretty logs

# Deployment
wrangler deploy                # Deploy to production
wrangler deploy --dry-run      # Preview deployment
wrangler deploy --env staging  # Deploy to staging

# KV Operations
wrangler kv:namespace list
wrangler kv:key list --namespace-id=<ID>
wrangler kv:key get <KEY> --namespace-id=<ID>
wrangler kv:key put <KEY> <VALUE> --namespace-id=<ID>

# Troubleshooting
wrangler whoami               # Check auth
wrangler deployments list     # View deployments
wrangler rollback [id]        # Rollback deployment
```

---

## ✅ Pre-Commit Checklist

Before committing code:
- [ ] Tests passing
- [ ] No linting errors
- [ ] Security headers implemented
- [ ] No hardcoded secrets
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Performance optimized
- [ ] Error handling complete

---

## 📞 Support & Contact

- **Organization**: MISJustice Alliance
- **Website**: [YWCAOfMissoula.com](https://ywcaofmissoula.com)
- **Technical Issues**: GitHub issues
- **Security**: security@misjusticealliance.org

---

**Remember**: This platform serves justice. Every optimization, every security measure, every line of code contributes to exposing institutional corruption and protecting civil rights.

Code with purpose. Code for justice. ⚖️
