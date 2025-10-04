# Deployment Guide - Dynamic Robots.txt Generator

## Prerequisites

1. **Cloudflare Account**: Active account with Workers enabled
2. **Domain Setup**: YWCAOfMissoula.com configured in Cloudflare
3. **Wrangler CLI**: Latest version installed
4. **Node.js**: Version 18 or higher

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create KV Namespace
```bash
# Create production KV namespace
wrangler kv:namespace create ROBOTS_CACHE

# Create preview KV namespace
wrangler kv:namespace create ROBOTS_CACHE --preview
```

### 3. Update Configuration
Edit `wrangler.toml` and replace the KV namespace IDs:

```toml
[[kv_namespaces]]
binding = "ROBOTS_CACHE"
id = "your-actual-kv-namespace-id"
preview_id = "your-actual-preview-kv-namespace-id"
```

### 4. Configure Routes
Ensure routes are properly configured in `wrangler.toml`:

```toml
[[routes]]
pattern = "ywcaofmissoula.com/robots.txt"
zone_name = "ywcaofmissoula.com"

[[routes]]
pattern = "www.ywcaofmissoula.com/robots.txt"
zone_name = "ywcaofmissoula.com"
```

## Deployment Process

### Development Environment
```bash
# Deploy to development
npm run deploy:dev

# Test locally
npm run dev
```

### Staging Environment
```bash
# Deploy to staging
npm run deploy:staging

# Test staging deployment
curl -H "User-Agent: GPTBot" https://staging.ywcaofmissoula.com/robots.txt
```

### Production Deployment
```bash
# Deploy to production
npm run deploy:production

# Verify deployment
curl -H "User-Agent: GPTBot" https://ywcaofmissoula.com/robots.txt
```

## Testing Deployment

### 1. Basic Functionality Test
```bash
# Test with different user agents
curl -H "User-Agent: GPTBot" https://ywcaofmissoula.com/robots.txt
curl -H "User-Agent: Googlebot" https://ywcaofmissoula.com/robots.txt
curl -H "User-Agent: AhrefsBot" https://ywcaofmissoula.com/robots.txt
```

### 2. Geographic Testing
```bash
# Test with different countries (use VPN or proxy)
curl -H "User-Agent: Googlebot" -H "CF-IPCountry: US" https://ywcaofmissoula.com/robots.txt
curl -H "User-Agent: Googlebot" -H "CF-IPCountry: RU" https://ywcaofmissoula.com/robots.txt
```

### 3. Performance Testing
```bash
# Load test with multiple requests
for i in {1..10}; do
  curl -H "User-Agent: GPTBot" https://ywcaofmissoula.com/robots.txt &
done
wait
```

## Monitoring and Maintenance

### 1. View Logs
```bash
# Real-time logs
npm run tail

# Specific environment logs
wrangler tail --env production
```

### 2. Monitor Performance
- Check Cloudflare Analytics dashboard
- Monitor CPU usage (should be <50ms)
- Track cache hit rates
- Monitor error rates

### 3. Update Configuration
```bash
# Update environment variables
wrangler secret put CACHE_TTL
wrangler secret put RATE_LIMIT_REQUESTS
wrangler secret put RATE_LIMIT_WINDOW
```

## Troubleshooting

### Common Issues

#### 1. KV Namespace Errors
```bash
# Check KV namespace exists
wrangler kv:namespace list

# Test KV access
wrangler kv:key put --namespace-id=YOUR_ID "test" "value"
wrangler kv:key get --namespace-id=YOUR_ID "test"
```

#### 2. Route Configuration Issues
- Verify domain is added to Cloudflare
- Check DNS settings
- Ensure SSL/TLS is enabled

#### 3. Performance Issues
- Monitor CPU usage in Cloudflare dashboard
- Check for memory leaks
- Optimize crawler database queries

#### 4. Cache Issues
- Clear KV namespace if needed
- Check TTL settings
- Verify cache key generation

### Debug Mode
```bash
# Local development with debugging
wrangler dev --local --debug

# Production debugging
wrangler tail --env production
```

## Security Considerations

### 1. Environment Variables
- Never commit secrets to version control
- Use Wrangler secrets for sensitive data
- Rotate secrets regularly

### 2. Rate Limiting
- Monitor for abuse patterns
- Adjust limits based on traffic
- Implement IP blocking for persistent abusers

### 3. Content Security
- Validate all user inputs
- Sanitize user agents
- Implement proper error handling

## Rollback Procedure

### 1. Quick Rollback
```bash
# Deploy previous version
wrangler deploy --env production --compatibility-date=2024-12-17
```

### 2. Emergency Fallback
If the worker fails completely, create a static robots.txt file:

```bash
# Upload static robots.txt to origin server
# This ensures basic functionality during worker issues
```

## Maintenance Schedule

### Daily
- Monitor error rates
- Check cache performance
- Review rate limiting logs

### Weekly
- Analyze crawler patterns
- Review geographic access patterns
- Update blocked bot lists if needed

### Monthly
- Review and update crawler rules
- Analyze performance metrics
- Update security configurations
- Review legal compliance requirements

## Support and Documentation

### Resources
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Workers KV Documentation](https://developers.cloudflare.com/workers/runtime-apis/kv/)

### Contact
- **Technical Issues**: GitHub Issues
- **Legal Advocacy**: YWCAOfMissoula.com
- **Security Concerns**: Anonymous Legal Assistance Group

---

**Note**: This deployment guide is part of a legal advocacy platform. All configurations should prioritize security, transparency, and compliance with legal requirements.
