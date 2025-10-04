/**
 * robots.txt Worker for YWCAOfMissoula.com
 * 
 * Purpose: Dynamically generate robots.txt with AI crawler optimization
 * Route: ywcaofmissoula.com/robots.txt
 * 
 * Features:
 * - Environment-aware rules (dev vs production)
 * - AI crawler-specific directives
 * - Rate limiting for aggressive crawlers
 * - Sitemap references
 * - Custom user-agent handling
 */

export interface Env {
  ENVIRONMENT?: string;
  SITE_URL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      // Only handle /robots.txt
      if (url.pathname !== '/robots.txt') {
        return new Response('Not Found', { status: 404 });
      }
      
      // Generate robots.txt content
      const robotsTxt = generateRobotsTxt(env);
      
      // Return with appropriate headers
      return new Response(robotsTxt, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          'X-Robots-Tag': 'noindex', // Don't index robots.txt itself
        }
      });
      
    } catch (error) {
      console.error('robots.txt worker error:', error);
      return new Response(
        'Internal Server Error',
        { status: 500 }
      );
    }
  }
};

/**
 * Generate robots.txt content based on environment
 */
function generateRobotsTxt(env: Env): string {
  const environment = env.ENVIRONMENT || 'production';
  const siteUrl = env.SITE_URL || 'https://ywcaofmissoula.com';
  
  // Development environment - restrict all crawlers
  if (environment === 'development') {
    return `# Development Environment - No Indexing
User-agent: *
Disallow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
  }
  
  // Staging environment - restrict most crawlers
  if (environment === 'staging') {
    return `# Staging Environment - Limited Indexing
User-agent: *
Disallow: /

# Allow specific crawlers for testing
User-agent: Googlebot
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
  }
  
  // Production environment - full configuration
  return `# robots.txt for YWCAOfMissoula.com
# Civil Rights Violations Documentation Platform
# Optimized for both traditional search engines and AI crawlers
# Generated via Cloudflare Worker

# Default rules for all crawlers
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/private/
Disallow: /.well-known/
Disallow: /cgi-bin/
Crawl-delay: 1

# Google crawlers
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Googlebot-Image
Allow: /
Crawl-delay: 1

User-agent: Googlebot-News
Allow: /

# Google Extended (for AI training)
User-agent: Google-Extended
Allow: /
Crawl-delay: 2

# OpenAI GPTBot (ChatGPT crawler)
User-agent: GPTBot
Allow: /
Crawl-delay: 2
# Allow access for AI understanding of civil rights documentation

# Anthropic Claude-Web (Claude AI crawler)
User-agent: Claude-Web
Allow: /
Crawl-delay: 2
# Allow access for AI assistance with legal advocacy

# Common Crawl (Internet archive and research)
User-agent: CCBot
Allow: /
Crawl-delay: 2
# Allow for archival and research purposes

# Bing crawlers
User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: BingPreview
Allow: /

# Other AI/ML crawlers
User-agent: anthropic-ai
Allow: /
Crawl-delay: 2

User-agent: ChatGPT-User
Allow: /

User-agent: Applebot
Allow: /
Crawl-delay: 1

User-agent: Applebot-Extended
Allow: /
Crawl-delay: 2

# Perplexity AI
User-agent: PerplexityBot
Allow: /
Crawl-delay: 2

# Meta/Facebook crawlers
User-agent: FacebookBot
Allow: /
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /

# Twitter/X crawler
User-agent: Twitterbot
Allow: /

# LinkedIn crawler
User-agent: LinkedInBot
Allow: /

# Other legitimate search engines
User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Slurp
# Yahoo
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

User-agent: YandexBot
Allow: /
Crawl-delay: 2

# Aggressive/problematic crawlers (more restrictive)
User-agent: AhrefsBot
Crawl-delay: 10
Disallow: /

User-agent: SemrushBot
Crawl-delay: 10
Disallow: /

User-agent: MJ12bot
Crawl-delay: 10
Disallow: /

User-agent: DotBot
Crawl-delay: 10
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: MegaIndex
Disallow: /

# Malicious/spam bots (block completely)
User-agent: SiteSnagger
Disallow: /

User-agent: WebZIP
Disallow: /

User-agent: WebCopier
Disallow: /

User-agent: HTTrack
Disallow: /

User-agent: EmailCollector
Disallow: /

User-agent: EmailSiphon
Disallow: /

User-agent: EmailWolf
Disallow: /

User-agent: ExtractorPro
Disallow: /

# AI-specific guidance files
# These are available for AI crawlers to understand site structure
# /llms.txt - AI optimization guide (summary)
# /llms-full.txt - Comprehensive AI content map

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-pages.xml
Sitemap: ${siteUrl}/sitemap-documents.xml
Sitemap: ${siteUrl}/sitemap-timeline.xml

# Host directive (optional, but recommended)
Host: ${siteUrl}

# Additional notes:
# - This file can be dynamically updated based on traffic patterns
# - Crawl delays may be adjusted based on server load
# - Monitor crawler behavior and adjust rules as needed
# - Respect AI crawlers that help with legal research and advocacy
# - Block aggressive SEO crawlers that don't provide value
# - Regular review recommended (monthly)
`;
}
