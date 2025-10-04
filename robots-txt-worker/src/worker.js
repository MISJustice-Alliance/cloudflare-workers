/**
 * robots.txt Worker - YWCAOfMissoula.com
 * Dynamically generates robots.txt with AI crawler optimization
 * Organization: MISJustice Alliance
 */

export interface Env {
  ENVIRONMENT?: string;
}

const ROBOTS_TXT = `# robots.txt for YWCAOfMissoula.com
# Legal Advocacy Platform - Civil Rights Documentation
# Generated dynamically via Cloudflare Worker

# Default rules for all crawlers
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/private/
Crawl-delay: 1

# Google crawlers
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Google-Extended
Allow: /
Crawl-delay: 2

# OpenAI GPTBot
User-agent: GPTBot
Allow: /
Crawl-delay: 2

# Anthropic Claude
User-agent: Claude-Web
Allow: /
Crawl-delay: 2

User-agent: anthropic-ai
Allow: /
Crawl-delay: 2

# Common Crawl
User-agent: CCBot
Allow: /
Crawl-delay: 2

# Perplexity AI
User-agent: PerplexityBot
Allow: /
Crawl-delay: 2

# Apple
User-agent: Applebot
Allow: /
Crawl-delay: 1

User-agent: Applebot-Extended
Allow: /
Crawl-delay: 2

# Bing
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Other search engines
User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Block aggressive SEO crawlers
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: BLEXBot
Disallow: /

# Sitemaps
Sitemap: https://ywcaofmissoula.com/sitemap.xml
Sitemap: https://ywcaofmissoula.com/sitemap-pages.xml
Sitemap: https://ywcaofmissoula.com/sitemap-documents.xml

# Host
Host: https://ywcaofmissoula.com
`;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      // Only respond to /robots.txt
      if (url.pathname !== '/robots.txt') {
        return new Response('Not Found', { status: 404 });
      }
      
      // Generate robots.txt
      const robotsTxt = generateRobotsTxt(env);
      
      // Return with caching
      return new Response(robotsTxt, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          'X-Robots-Tag': 'noindex' // Don't index robots.txt itself
        }
      });
      
    } catch (error) {
      console.error('robots.txt worker error:', error);
      
      // Return basic fallback robots.txt
      return new Response(ROBOTS_TXT, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }
  }
};

/**
 * Generate robots.txt content based on environment
 */
function generateRobotsTxt(env: Env): string {
  const environment = env.ENVIRONMENT || 'production';
  
  // In development, be more restrictive
  if (environment === 'development') {
    return `# Development Environment - Do Not Crawl
User-agent: *
Disallow: /

Sitemap: https://dev.ywcaofmissoula.com/sitemap.xml
`;
  }
  
  // Production robots.txt
  return ROBOTS_TXT;
}
