# Deployment Guide
## Cloudflare Workers - YWCAOfMissoula.com

This guide covers the deployment process for all Cloudflare Workers in the YWCAOfMissoula.com platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Deployment Workflows](#deployment-workflows)
5. [Manual Deployment](#manual-deployment)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Rollback Procedures](#rollback-procedures)
8. [Monitoring](#monitoring)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### Deployment Environments

| Environment | Purpose | Branch | URL |
|-------------|---------|--------|-----|
| **Development** | Feature testing | `develop` | `dev.ywcaofmissoula.com` |
| **Staging** | Pre-production testing | `staging` | `staging.ywcaofmissoula.com` |
| **Production** | Live site | `main` | `ywcaofmissoula.com` |

### Deployment Strategy

We use a **staged deployment** approach:
1. Develop and test locally
2. Deploy to development environment
3. Deploy to staging for final validation
4. Deploy to production after approval

---

## Prerequisites

### Required Tools

```bash
# Node.js (18+)
node --version

# Wrangler CLI
npm install -g wrangler

# Git
git --version
```

### Authentication

```bash
# Login to Cloudflare
wrangler login

# Verify authentication
wrangler whoami
```

### Access Requirements

- Cloudflare account with Workers enabled
- Appropriate permissions for the zone
- GitHub repository access (for CI/CD)
- Environment variable access

---

## Environment Setup

### 1. Configure wrangler.toml

Each worker needs environment-specific configuration:

```toml
name = "worker-name"
main = "src/worker.ts"
compatibility_date = "2024-01-01"
account_id = "your-account-id"

# Development
[env.development]
name = "worker-name-dev"
vars = { ENVIRONMENT = "development" }

# Staging
[env.staging]
name = "worker-name-staging"
vars = { ENVIRONMENT = "staging" }

# Production (default)
vars = { ENVIRONMENT = "production" }

[[routes]]
pattern = "ywcaofmissoula.com/*"
zone_name = "ywcaofmissoula.com"
```

### 2. Set Environment Variables

```bash
# Development
wrangler deploy --env development

# The vars section in wrangler.toml handles environment variables
```

### 3. Configure Secrets

```bash
# Set secrets (production)
wrangler secret put API_KEY
wrangler secret put DATABASE_URL

# Set secrets (development)
wrangler secret put API_KEY --env development

# List secrets
wrangler secret list
```

### 4. Create KV Namespaces

```bash
# Create production namespace
wrangler kv:namespace create "CACHE"

# Create development namespace
wrangler kv:namespace create "CACHE" --env development

# Add to wrangler.toml
[[kv_namespaces]]
binding = "CACHE"
id = "production-namespace-id"

[[env.development.kv_namespaces]]
binding = "CACHE"
id = "development-namespace-id"
```

---

## Deployment Workflows

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Develop and test locally
cd worker-name
wrangler dev

# 3. Run tests
npm test

# 4. Deploy to development
npm run deploy:dev
# or
wrangler deploy --env development

# 5. Test development deployment
curl https://dev.ywcaofmissoula.com/endpoint

# 6. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 7. Create pull request to develop
```

### Staging Workflow

```bash
# 1. Merge to staging branch
git checkout staging
git merge develop

# 2. Deploy to staging
cd worker-name
npm run deploy:staging
# or
wrangler deploy --env staging

# 3. Run staging tests
npm run test:staging

# 4. Manual validation
# Test all critical paths

# 5. Push staging branch
git push origin staging
```

### Production Workflow

```bash
# 1. Final review
# - All tests passing
# - Staging validation complete
# - Documentation updated
# - Security review done

# 2. Merge to main
git checkout main
git merge staging

# 3. Tag release
git tag -a v1.0.0 -m "Release version 1.0.0"

# 4. Deploy to production
cd worker-name
npm run deploy:production
# or
wrangler deploy --env production

# 5. Verify deployment
wrangler tail --env production

# 6. Monitor metrics
# Check Cloudflare dashboard for errors

# 7. Push and tag
git push origin main
git push origin v1.0.0
```

---

## Manual Deployment

### Single Worker Deployment

```bash
# Navigate to worker directory
cd worker-name

# Run pre-deployment checks
npm test
npm run lint
npm run type-check

# Deploy to specific environment
wrangler deploy --env production

# Verify deployment
wrangler tail --env production
```

### Multi-Worker Deployment

```bash
#!/bin/bash
# deploy-all.sh

WORKERS=("reverse-proxy-ywca" "sitemap-ywcaofmissoula-com")
ENV=${1:-production}

for worker in "${WORKERS[@]}"; do
  echo "Deploying $worker to $ENV..."
  cd "$worker"
  wrangler deploy --env "$ENV"
  cd ..
done

echo "All workers deployed to $ENV"
```

### Deployment Checklist

Pre-deployment:
- [ ] All tests passing
- [ ] Linting clean
- [ ] TypeScript compiled
- [ ] Environment variables set
- [ ] Secrets configured
- [ ] KV namespaces created
- [ ] Routes configured
- [ ] Documentation updated

Post-deployment:
- [ ] Deployment successful
- [ ] No errors in logs
- [ ] All endpoints responding
- [ ] Security headers present
- [ ] Performance acceptable
- [ ] Analytics tracking
- [ ] Monitoring alerts active

---

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Workers

on:
  push:
    branches:
      - develop
      - staging
      - main
  pull_request:
    branches:
      - develop
      - staging
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd reverse-proxy-ywca
          npm ci
          
      - name: Run tests
        run: |
          cd reverse-proxy-ywca
          npm test
          
      - name: Run linter
        run: |
          cd reverse-proxy-ywca
          npm run lint

  deploy-development:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Wrangler
        run: npm install -g wrangler
        
      - name: Deploy to Development
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          cd reverse-proxy-ywca
          wrangler deploy --env development

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Wrangler
        run: npm install -g wrangler
        
      - name: Deploy to Staging
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          cd reverse-proxy-ywca
          wrangler deploy --env staging

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Wrangler
        run: npm install -g wrangler
        
      - name: Deploy to Production
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          cd reverse-proxy-ywca
          wrangler deploy --env production
          
      - name: Notify on success
        if: success()
        run: echo "Production deployment successful!"
        
      - name: Notify on failure
        if: failure()
        run: echo "Production deployment failed!"
```

### GitHub Secrets

Required secrets in GitHub repository settings:

| Secret | Description | How to Get |
|--------|-------------|------------|
| `CLOUDFLARE_API_TOKEN` | API token for deployments | Cloudflare Dashboard → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID | Cloudflare Dashboard → Workers → Overview |

### Creating API Token

1. Go to Cloudflare Dashboard
2. Navigate to My Profile → API Tokens
3. Create Token → "Edit Cloudflare Workers" template
4. Configure permissions:
   - Account → Workers Scripts → Edit
   - Zone → Workers Routes → Edit
5. Copy token and add to GitHub secrets

---

## Rollback Procedures

### View Deployment History

```bash
# List recent deployments
wrangler deployments list

# Output:
# Created:     2025-01-15 10:30:00
# ID:          abc123...
# Version:     v1.2.3
```

### Rollback to Previous Version

```bash
# Rollback using deployment ID
wrangler rollback [deployment-id]

# Example
wrangler rollback abc123def456

# Verify rollback
wrangler tail
```

### Emergency Rollback

```bash
#!/bin/bash
# emergency-rollback.sh

WORKER_NAME=$1
DEPLOYMENT_ID=$2

if [ -z "$WORKER_NAME" ] || [ -z "$DEPLOYMENT_ID" ]; then
  echo "Usage: ./emergency-rollback.sh <worker-name> <deployment-id>"
  exit 1
fi

cd "$WORKER_NAME"
echo "Rolling back $WORKER_NAME to $DEPLOYMENT_ID..."
wrangler rollback "$DEPLOYMENT_ID"

echo "Rollback complete. Verifying..."
wrangler tail --env production
```

### Rollback from Git

```bash
# Revert to previous commit
git revert HEAD

# Or reset to specific commit
git reset --hard <commit-hash>

# Redeploy
wrangler deploy --env production

# Push revert
git push origin main
```

---

## Monitoring

### Real-Time Logs

```bash
# Tail production logs
wrangler tail --env production

# Tail with filtering
wrangler tail --env production --status error

# Tail with format
wrangler tail --env production --format pretty
```

### Cloudflare Dashboard

Monitor in Cloudflare Dashboard:
1. Workers → Your Worker → Metrics
2. Key metrics:
   - Requests per second
   - Error rate
   - CPU time
   - Duration

### Custom Logging

```typescript
// Structured logging
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'info',
  worker: 'worker-name',
  environment: env.ENVIRONMENT,
  message: 'Request processed',
  metadata: {
    path: url.pathname,
    method: request.method,
    status: response.status
  }
}));
```

### Health Checks

```bash
# Create health check endpoint
curl https://ywcaofmissoula.com/health

# Expected response:
# {"status": "healthy", "timestamp": "2025-01-15T10:30:00Z"}
```

### Alerting

Set up alerts for:
- Error rate > 5%
- Response time > 1000ms
- Request rate drop > 50%
- Worker unavailable

---

## Troubleshooting

### Common Issues

#### Issue: Deployment fails with authentication error

```bash
# Solution: Re-authenticate
wrangler logout
wrangler login
```

#### Issue: Route not working after deployment

```bash
# Check route configuration
wrangler routes list

# Verify in wrangler.toml
[[routes]]
pattern = "ywcaofmissoula.com/*"
zone_name = "ywcaofmissoula.com"
```

#### Issue: Environment variables not available

```bash
# Check vars in wrangler.toml
[vars]
ENVIRONMENT = "production"

# Verify deployment
wrangler tail --env production
```

#### Issue: KV namespace not found

```bash
# List namespaces
wrangler kv:namespace list

# Verify binding in wrangler.toml
[[kv_namespaces]]
binding = "CACHE"
id = "your-namespace-id"
```

#### Issue: Worker exceeds CPU time limit

```typescript
// Solution: Optimize code
// - Use caching
// - Minimize regex operations
// - Avoid synchronous operations
// - Profile with Performance API
```

### Debug Mode

```bash
# Deploy with verbose output
wrangler deploy --env production --verbose

# Test locally with debug
wrangler dev --local --inspect
```

### Verification Steps

After deployment:
1. ✅ Check logs for errors
2. ✅ Test all endpoints
3. ✅ Verify caching working
4. ✅ Check security headers
5. ✅ Monitor error rates
6. ✅ Validate analytics
7. ✅ Test from different locations

---

## Best Practices

### Deployment Schedule

- **Development**: Continuous (multiple times per day)
- **Staging**: Daily (end of day)
- **Production**: Weekly or as needed (Tuesday/Thursday preferred)

### Code Review

All production deployments require:
- ✅ Code review (at least 1 approval)
- ✅ All tests passing
- ✅ Documentation updated
- ✅ Security review (if applicable)
- ✅ Performance impact assessed

### Change Management

1. Document all changes in CHANGELOG.md
2. Tag releases semantically (v1.2.3)
3. Communicate deployments to team
4. Monitor for 1 hour post-deployment
5. Be ready to rollback if needed

### Testing Strategy

Before production deployment:
1. Unit tests (100% pass rate)
2. Integration tests (if applicable)
3. Staging environment validation
4. Manual testing of critical paths
5. Performance testing
6. Security scanning

---

## Emergency Procedures

### Critical Bug in Production

1. **Immediate**: Rollback to last known good version
2. **Fix**: Create hotfix branch from main
3. **Test**: Validate fix in development
4. **Deploy**: Push hotfix to production
5. **Document**: Record incident and resolution

### Worker Outage

1. **Check Status**: Cloudflare status page
2. **Review Logs**: Identify root cause
3. **Communication**: Notify stakeholders
4. **Resolution**: Deploy fix or rollback
5. **Post-Mortem**: Document lessons learned

### Data Loss Prevention

- Regular backups of KV data
- Version control for all code
- Document all configuration changes
- Test rollback procedures regularly

---

## Additional Resources

- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Workers Deployment Docs](https://developers.cloudflare.com/workers/platform/deploy/)
- [GitHub Actions for Workers](https://github.com/cloudflare/wrangler-action)
- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)

---

## Support

For deployment issues:
- GitHub Issues: Technical problems
- Cloudflare Support: Platform issues
- Team Chat: Internal coordination

---

**Remember**: Every deployment serves the YWCAOfMissoula.com mission of justice and accountability. Deploy with care, monitor actively, and be ready to respond to issues.
