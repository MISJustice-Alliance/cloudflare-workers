# Cloudflare Workers - YWCAOfMissoula.com
## Legal Advocacy Platform Infrastructure

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

> Infrastructure code for YWCAOfMissoula.com - A comprehensive legal advocacy platform documenting systematic civil rights violations and institutional corruption.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Workers](#workers)
- [Quick Start](#quick-start)
- [Development](#development)
- [Deployment](#deployment)
- [SEO & GEO Optimization](#seo--geo-optimization)
- [AI IDE Configuration](#ai-ide-configuration)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

### Mission

This repository contains Cloudflare Workers that power the infrastructure for **YWCAOfMissoula.com**, a legal advocacy platform documenting systematic civil rights violations in Missoula, Montana (2014-2025).

**Organization**: Anonymous Legal Assistance Group (MISJustice Alliance)

### Purpose

The platform serves multiple critical functions:
- **Evidence Repository**: Comprehensive documentation of civil rights violations
- **Legal Advocacy**: Support for legal professionals seeking case information
- **Public Awareness**: Transparency and institutional accountability
- **Media Resource**: Fact-based information for journalists and researchers

### Technical Stack

- **Platform**: Cloudflare Workers (Edge Computing)
- **Language**: TypeScript/JavaScript
- **CMS**: Notion (Headless)
- **Generator**: Super.so
- **CDN**: Cloudflare
- **Repository**: GitHub with CI/CD
- **Analytics**: Google Analytics 4, Cloudflare Analytics

---

## Project Structure

```
cloudflare-workers/
├── .cursorrules              # Cursor AI IDE configuration
├── .clinerules               # Cline AI IDE configuration
├── .aiderules                # Aider AI IDE configuration
├── CLAUDE.md                 # Claude Code configuration and context
├── .github/
│   ├── workflows/            # CI/CD pipelines
│   │   └── deploy.yml        # GitHub Actions deployment workflow
│   └── copilot-instructions.md
├── docs/
│   ├── SEO-GEO-GUIDE.md     # SEO & GEO optimization guide
│   ├── WORKER-TEMPLATE.md   # Template for new workers
│   └── DEPLOYMENT.md        # Deployment procedures
├── llms.txt                  # AI crawler optimization guide
├── llms-full.txt             # Comprehensive AI content map
├── robots.txt.template       # robots.txt template
├── reverse-proxy-ywca/       # Main traffic routing worker (CRITICAL)
│   ├── src/
│   │   └── worker.js
│   ├── wrangler.toml
│   ├── README.md
│   └── CLAUDE.md
├── sitemap-ywcaofmissoula-com/  # Sitemap generation worker (HIGH)
│   ├── src/
│   │   └── worker.ts
│   ├── wrangler.toml
│   ├── package.json
│   ├── README.md
│   └── CLAUDE.md
├── dynamic-robots-generator-ywcaofmissoula-com/  # Dynamic robots.txt (HIGH)
│   ├── src/
│   │   └── worker.ts
│   ├── wrangler.toml
│   ├── package.json
│   ├── README.md
│   └── CLAUDE.md
├── llms-txt-worker/          # AI optimization file server (MEDIUM)
│   ├── src/
│   │   └── worker.ts
│   ├── wrangler.toml
│   ├── package.json
│   ├── README.md
│   └── CLAUDE.md
├── robots-txt-worker/        # Legacy robots.txt worker (deprecated)
└── README.md                 # This file
```

---

## Workers

### Active Workers

#### 1. Reverse Proxy (`reverse-proxy-ywca`)
**Purpose**: Main traffic routing and management for YWCAOfMissoula.com
**Priority**: CRITICAL - Handles ALL site traffic

**Features**:
- Traffic routing to Super.so backend
- Security header injection (CSP, HSTS, XSS protection)
- Request/response modification
- Analytics tracking
- Error handling and resilience

**Routes**:
- `ywcaofmissoula.com/*`

**Configuration**: Production, staging, and development environments configured

---

#### 2. Sitemap Generator (`sitemap-ywcaofmissoula-com`)
**Purpose**: Dynamically generate XML sitemaps for SEO optimization
**Priority**: HIGH - Critical for search engine discoverability

**Features**:
- Multiple sitemap support (index, pages, constitutional, documents, complaints)
- Priority and change frequency calculation
- Dynamic generation from content
- Category-specific sitemaps
- Observability and monitoring enabled

**Routes**:
- `ywcaofmissoula.com/sitemap.xml`
- `www.ywcaofmissoula.com/sitemap.xml`
- `ywcaofmissoula.com/sitemap-index.xml`
- `ywcaofmissoula.com/sitemap-pages.xml`
- `ywcaofmissoula.com/sitemap-constitutional.xml`
- `ywcaofmissoula.com/sitemap-documents.xml`
- `ywcaofmissoula.com/sitemap-complaints.xml`

**Configuration**: TypeScript-based with environment-specific caching (TTL: 300s dev, 1800s staging, 3600s production)

---

#### 3. Dynamic robots.txt Generator (`dynamic-robots-generator-ywcaofmissoula-com`)
**Purpose**: Dynamic robots.txt with AI crawler optimization
**Priority**: HIGH - Controls crawler access to entire platform

**Features**:
- AI crawler-specific directives (GPTBot, Claude-Web, Google-Extended, Perplexity)
- Traditional SEO optimization (Googlebot, Bing)
- Security (blocks malicious crawlers)
- Environment-aware rules (dev/staging/production)
- KV namespace caching
- Rate limiting support

**Routes**:
- `ywcaofmissoula.com/robots.txt`
- `www.ywcaofmissoula.com/robots.txt`

**Configuration**: TypeScript with KV binding for caching, observability enabled

---

#### 4. llms.txt Worker (`llms-txt-worker`)
**Purpose**: Serve AI optimization files for Generative Engine Optimization (GEO)
**Priority**: MEDIUM - Important for AI discoverability

**Features**:
- Serves `llms.txt` (AI optimization guide)
- Serves `llms-full.txt` (comprehensive content map)
- Health check endpoint
- Environment-specific caching (86400s production, 3600s dev)
- Rate limiting for crawler management

**Routes**:
- `ywcaofmissoula.com/llms.txt`
- `ywcaofmissoula.com/llms-full.txt`
- `ywcaofmissoula.com/health`

**Configuration**: TypeScript with optional KV namespace for content caching

---

### Deployment Status

All four workers are configured and deployed with:
- ✅ Production environment configurations
- ✅ Staging and development environments
- ✅ Shared routes across environments
- ✅ Observability and monitoring enabled
- ✅ Account ID configured for GitHub Actions deployment
- ✅ Environment-specific variables (caching, analytics, rate limiting)

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed
- Cloudflare account with Workers enabled
- Git for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/misjustice-alliance/cloudflare-workers.git
cd cloudflare-workers

# Install Wrangler globally
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

### Environment Setup

Each worker requires configuration in `wrangler.toml`:

```toml
name = "worker-name"
main = "src/worker.js"
compatibility_date = "2024-01-01"
account_id = "your-account-id"

[vars]
ENVIRONMENT = "development"

[[routes]]
pattern = "ywcaofmissoula.com/*"
zone_name = "ywcaofmissoula.com"
```

---

## Development

### Local Development

```bash
# Start worker in development mode
wrangler dev

# Watch for changes
wrangler dev --live-reload

# Test with remote resources
wrangler dev --remote
```

### Testing

```bash
# Run tests (if configured)
npm test

# Lint code
npm run lint

# Type check (for TypeScript)
npm run type-check
```

### Creating a New Worker

1. **Create directory**:
```bash
mkdir new-worker-name
cd new-worker-name
```

2. **Initialize structure**:
```bash
mkdir src tests
touch src/worker.ts wrangler.toml README.md
npm init -y
```

3. **Copy templates**:
- Use `docs/WORKER-TEMPLATE.md` as reference
- Configure `wrangler.toml`
- Implement worker logic

4. **Configure routes**:
```toml
[[routes]]
pattern = "ywcaofmissoula.com/your-path/*"
zone_name = "ywcaofmissoula.com"
```

### Code Standards

Follow the patterns in `.cursorrules`, `.clinerules`, and `.aiderules`:
- TypeScript/JavaScript ES6+
- Comprehensive error handling
- Security headers on all responses
- Performance optimization
- Proper logging (no sensitive data)
- Documentation and comments

---

## Deployment

### Development Environment

```bash
wrangler deploy --env development
```

### Staging Environment

```bash
wrangler deploy --env staging
```

### Production Environment

```bash
# Final testing
npm test
npm run lint

# Deploy to production
wrangler deploy --env production

# Verify deployment
wrangler tail --env production
```

### CI/CD Pipeline

Deployments are automated via GitHub Actions:
- **Push to `develop`**: Deploys to development
- **Push to `staging`**: Deploys to staging
- **Push to `main`**: Deploys to production

### Rollback

```bash
# View deployment history
wrangler deployments list

# Rollback to previous version
wrangler rollback [deployment-id]
```

### Recent Deployment Fixes

The following issues were identified and resolved in recent deployments:

1. **Account ID Configuration**: Added `account_id = "e6537b26b3f9444de8e670aa4442fd6e"` to all wrangler.toml files for GitHub Actions compatibility

2. **Route Consolidation**: Removed environment-specific worker names (e.g., `-dev`, `-staging`, `-production` suffixes) and moved routes to shared configuration for consistent deployment

3. **Environment Variables**: Configured environment-specific settings in `[env.development]`, `[env.staging]`, and `[env.production]` sections

4. **Workers Dev Mode**: Disabled `workers_dev = false` in production workers to prevent conflicts with custom routes

5. **GitHub Actions Integration**: Ensured all environment variables (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) are properly passed to wrangler CLI

---

## SEO & GEO Optimization

### Traditional SEO

The platform implements comprehensive SEO:
- Dynamic sitemap generation
- Optimized robots.txt
- Meta tags and structured data
- Internal linking strategy
- Mobile optimization
- Page speed optimization

See `docs/SEO-GEO-GUIDE.md` for complete details.

### GEO (Generative Engine Optimization)

Optimized for AI systems (ChatGPT, Claude, Perplexity, etc.):
- **llms.txt**: AI crawler guidance file
- **llms-full.txt**: Comprehensive content mapping
- Structured content for AI understanding
- Clear entity relationships
- Fact-based organization

### Key Files

| File | Purpose | Location |
|------|---------|----------|
| `llms.txt` | AI optimization guide | Root directory |
| `llms-full.txt` | Comprehensive AI content map | Root directory |
| `robots.txt.template` | robots.txt template | Root directory |
| `SEO-GEO-GUIDE.md` | Complete optimization guide | docs/ |

---

## AI IDE Configuration

This repository includes comprehensive configuration for AI coding assistants:

### Cursor IDE
**File**: `.cursorrules`
**Purpose**: Comprehensive project context and coding standards

### Cline AI
**File**: `.clinerules`
**Purpose**: Autonomous agent guidelines and decision-making framework

### Aider
**File**: `.aiderules`
**Purpose**: AI pair programming and code editing optimization

### GitHub Copilot
**File**: `.github/copilot-instructions.md`
**Purpose**: Copilot-specific guidance and context

### Usage

These configuration files ensure AI assistants:
- Understand project context and mission
- Follow coding standards and best practices
- Implement security and performance requirements
- Generate production-ready code
- Maintain documentation quality

---

## Security

### Security Headers

All workers implement comprehensive security headers:

```javascript
{
  'Content-Security-Policy': "default-src 'self'",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
}
```

### Best Practices

1. **Never log sensitive data**: No PII, API keys, or user identifiers
2. **Validate all inputs**: Sanitize and validate user-provided data
3. **Rate limiting**: Implement on all public endpoints
4. **Encryption**: HTTPS only, SSL/TLS enforcement
5. **Access control**: Proper authentication and authorization
6. **Regular audits**: Security reviews and dependency updates

### Vulnerability Reporting

If you discover a security vulnerability:
1. **DO NOT** open a public issue
2. Contact: security@misjusticealliance.org
3. Provide detailed description
4. Allow time for remediation

---

## Contributing

### Guidelines

We welcome contributions that support our mission of justice and accountability!

**Before Contributing**:
1. Read the mission statement and project context
2. Review existing workers and code patterns
3. Check `.cursorrules` for coding standards
4. Understand security and privacy requirements

**Contribution Process**:
1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes following coding standards
4. Add tests for new functionality
5. Update documentation
6. Submit pull request with clear description

**Code Review Criteria**:
- Follows project coding standards
- Includes comprehensive error handling
- Implements security best practices
- Optimized for performance
- Well-documented
- Tested thoroughly

### Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR-USERNAME/cloudflare-workers.git
cd cloudflare-workers

# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
wrangler dev

# Commit with meaningful messages
git commit -m "feat: add new worker for X functionality"

# Push and create PR
git push origin feature/your-feature
```

---

## Documentation

### Available Guides

- **[SEO & GEO Guide](docs/SEO-GEO-GUIDE.md)**: Complete optimization guide
- **[Worker Template](docs/WORKER-TEMPLATE.md)**: Template for new workers
- **[Deployment Guide](docs/DEPLOYMENT.md)**: Deployment procedures
- **[AI Configuration](.cursorrules)**: AI IDE setup and standards

### Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Workers Examples](https://developers.cloudflare.com/workers/examples/)
- [Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)

---

## Project Context

### Mission Critical

This infrastructure serves a **legal advocacy platform** with serious real-world implications:

- **Justice**: Code quality affects access to justice
- **Security**: Protects vulnerable individuals  
- **Performance**: Crisis situations require fast access
- **Reliability**: Evidence availability is critical
- **Accountability**: Every line serves institutional reform

### Stakeholders

- **Legal Professionals**: Attorneys seeking case information
- **Journalists**: Media coverage and investigation
- **Advocacy Groups**: Civil rights and institutional reform
- **Public**: Transparency and democratic accountability

### Success Metrics

**Legal Objectives**:
- Attorney inquiries generated
- Legal representation secured
- Media coverage achieved
- Institutional policy changes

**Technical Metrics**:
- Page load times < 3 seconds
- 99.9% uptime
- Search engine rankings
- AI system accessibility
- Document download tracking

---

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

### Additional Terms

While the code is open source under Apache 2.0, the content and documentation related to the specific legal case are maintained by MISJustice Alliance for accuracy and integrity.

---

## Support

### Contact

- **Organization**: Anonymous Legal Assistance Group (MISJustice Alliance)
- **Website**: [YWCAOfMissoula.com](https://ywcaofmissoula.com)
- **Related**: [MISJusticeAlliance.org](https://misjusticealliance.org)

### Getting Help

- **Technical Issues**: Open GitHub issue
- **Security Concerns**: security@misjusticealliance.org
- **Legal Inquiries**: Via website contact form
- **Media Inquiries**: Via website contact form

---

## Acknowledgments

This infrastructure is built on:
- **Cloudflare Workers**: Edge computing platform
- **Notion**: Headless CMS
- **Super.so**: Notion-to-website conversion
- **Open Source Community**: Various tools and libraries

Special thanks to:
- Civil rights advocates
- Legal professionals supporting the cause
- Open source contributors
- The community fighting for justice

---

## Version History

### v1.2.0 (2025-01)
- ✅ All four workers fully configured and deployed
- ✅ Environment-specific configurations (dev/staging/production)
- ✅ Observability and monitoring enabled
- ✅ GitHub Actions CI/CD pipeline configured
- ✅ Route consolidation (removed environment-specific worker names)
- ✅ Account ID unified across all workers (e6537b26b3f9444de8e670aa4442fd6e)
- ✅ TypeScript migration for sitemap, robots, and llms-txt workers
- ✅ KV namespace bindings configured
- ✅ Comprehensive CLAUDE.md files for each worker

### v1.1.0 (2025-01)
- Added dynamic robots.txt generator worker
- Added llms.txt worker for AI optimization
- Expanded sitemap generator with multiple sitemap types
- Implemented environment-aware caching strategies
- Added rate limiting support
- Enhanced security configurations

### v1.0.0 (2025-01)
- Initial repository setup
- Reverse proxy worker
- Basic sitemap generator
- SEO/GEO optimization files (llms.txt, llms-full.txt)
- AI IDE configuration (.cursorrules, .clinerules, .aiderules)
- Comprehensive documentation

---

**Remember**: Every deployment, every line of code, every optimization serves the mission of exposing institutional corruption and protecting civil rights. Write code with that responsibility in mind.

For justice and accountability. 🔨⚖️
