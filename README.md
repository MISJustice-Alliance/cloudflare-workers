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
├── .github/
│   ├── workflows/            # CI/CD pipelines
│   └── copilot-instructions.md
├── docs/
│   ├── SEO-GEO-GUIDE.md     # SEO & GEO optimization guide
│   ├── WORKER-TEMPLATE.md   # Template for new workers
│   └── DEPLOYMENT.md        # Deployment procedures
├── llms.txt                  # AI crawler optimization
├── llms-full.txt             # Comprehensive AI content map
├── robots.txt.template       # robots.txt template
├── reverse-proxy-ywca/      # Reverse proxy worker
│   ├── src/
│   │   └── worker.js
│   ├── wrangler.toml
│   └── README.md
├── sitemap-ywcaofmissoula-com/  # Sitemap generation worker
│   ├── src/
│   │   └── worker.js
│   ├── wrangler.toml
│   └── README.md
└── README.md                 # This file
```

---

## Workers

### Active Workers

#### 1. Reverse Proxy (`reverse-proxy-ywca`)
**Purpose**: Route and manage traffic to YWCAOfMissoula.com
**Features**:
- Traffic routing and load balancing
- Security header injection
- Request/response modification
- Analytics tracking

**Routes**: `ywcaofmissoula.com/*`

#### 2. Sitemap Generator (`sitemap-ywcaofmissoula-com`)
**Purpose**: Dynamically generate sitemap.xml
**Features**:
- Notion database integration
- Dynamic page discovery
- Priority and change frequency calculation
- Multiple sitemap support (index, pages, documents)

**Route**: `ywcaofmissoula.com/sitemap.xml`

### Planned Workers

#### 3. robots.txt Generator
**Purpose**: Dynamic robots.txt with AI crawler optimization
**Status**: Template ready, implementation pending

#### 4. llms.txt Server
**Purpose**: Serve AI optimization files (llms.txt, llms-full.txt)
**Status**: Files ready, worker implementation pending

#### 5. Security Headers
**Purpose**: Inject comprehensive HTTP security headers
**Status**: Can be integrated into reverse proxy or standalone

#### 6. Analytics Enhancer
**Purpose**: Enhanced analytics and custom event tracking
**Status**: Planning phase

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

### v1.0.0 (2025-01)
- Initial repository setup
- Reverse proxy worker
- Sitemap generator
- SEO/GEO optimization files
- AI IDE configuration
- Comprehensive documentation

---

**Remember**: Every deployment, every line of code, every optimization serves the mission of exposing institutional corruption and protecting civil rights. Write code with that responsibility in mind.

For justice and accountability. 🔨⚖️
