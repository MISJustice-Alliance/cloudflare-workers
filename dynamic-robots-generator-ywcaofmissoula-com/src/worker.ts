/**
 * Dynamic Robots.txt Generator for YWCAOfMissoula.com
 * 
 * This Cloudflare Worker generates dynamic robots.txt files optimized for:
 * - Traditional search engines (Google, Bing, etc.)
 * - AI crawlers (GPTBot, Claude-Web, etc.)
 * - Legal advocacy and evidence repository optimization
 * - Security and performance considerations
 * 
 * @author Anonymous Legal Assistance Group (MISJustice Alliance)
 * @version 2.0.0
 */

interface Env {
  // Environment variables for configuration
  ENVIRONMENT?: string;
  CACHE_TTL?: string;
  RATE_LIMIT_REQUESTS?: string;
  RATE_LIMIT_WINDOW?: string;
  
  // KV namespace for caching
  ROBOTS_CACHE?: KVNamespace;
  
  // Analytics and monitoring
  ANALYTICS_ENABLED?: string;
}

interface CrawlerInfo {
  name: string;
  userAgent: string;
  crawlDelay: number;
  allowed: boolean;
  restrictions: string[];
  aiCrawler: boolean;
  legalResearch: boolean;
}

interface GeoRules {
  country: string;
  restrictions: string[];
  crawlDelay?: number;
  allowedPaths: string[];
  blockedPaths: string[];
}

interface RobotsConfig {
  sitemaps: string[];
  host: string;
  defaultCrawlDelay: number;
  geoRules: GeoRules[];
  crawlers: CrawlerInfo[];
  blockedBots: string[];
  aiOptimized: boolean;
}

/**
 * Comprehensive crawler database with legal advocacy optimization
 */
const CRAWLER_DATABASE: CrawlerInfo[] = [
  // Google crawlers
  {
    name: 'Googlebot',
    userAgent: 'googlebot',
    crawlDelay: 1,
    allowed: true,
    restrictions: ['/admin/', '/api/private/'],
    aiCrawler: false,
    legalResearch: true
  },
  {
    name: 'Googlebot-Image',
    userAgent: 'googlebot-image',
    crawlDelay: 1,
    allowed: true,
    restrictions: ['/admin/', '/api/private/'],
    aiCrawler: false,
    legalResearch: true
  },
  {
    name: 'Googlebot-News',
    userAgent: 'googlebot-news',
    crawlDelay: 0,
    allowed: true,
    restrictions: ['/admin/', '/api/private/'],
    aiCrawler: false,
    legalResearch: true
  },
  {
    name: 'Google-Extended',
    userAgent: 'google-extended',
    crawlDelay: 2,
    allowed: true,
    restrictions: [],
    aiCrawler: true,
    legalResearch: true
  },
  
  // AI Crawlers - Legal Research Optimized
  {
    name: 'GPTBot',
    userAgent: 'gptbot',
    crawlDelay: 2,
    allowed: true,
    restrictions: [],
    aiCrawler: true,
    legalResearch: true
  },
  {
    name: 'Claude-Web',
    userAgent: 'claude-web',
    crawlDelay: 2,
    allowed: true,
    restrictions: [],
    aiCrawler: true,
    legalResearch: true
  },
  {
    name: 'ChatGPT-User',
    userAgent: 'chatgpt-user',
    crawlDelay: 2,
    allowed: true,
    restrictions: [],
    aiCrawler: true,
    legalResearch: true
  },
  {
    name: 'PerplexityBot',
    userAgent: 'perplexitybot',
    crawlDelay: 2,
    allowed: true,
    restrictions: [],
    aiCrawler: true,
    legalResearch: true
  },
  {
    name: 'Anthropic-AI',
    userAgent: 'anthropic-ai',
    crawlDelay: 2,
    allowed: true,
    restrictions: [],
    aiCrawler: true,
    legalResearch: true
  },
  
  // Research and Archive Crawlers
  {
    name: 'CCBot',
    userAgent: 'ccbot',
    crawlDelay: 2,
    allowed: true,
    restrictions: [],
    aiCrawler: false,
    legalResearch: true
  },
  {
    name: 'Applebot',
    userAgent: 'applebot',
    crawlDelay: 1,
    allowed: true,
    restrictions: ['/admin/', '/api/private/'],
    aiCrawler: false,
    legalResearch: true
  },
  {
    name: 'Applebot-Extended',
    userAgent: 'applebot-extended',
    crawlDelay: 2,
    allowed: true,
    restrictions: [],
    aiCrawler: true,
    legalResearch: true
  },
  
  // Other Search Engines
  {
    name: 'Bingbot',
    userAgent: 'bingbot',
    crawlDelay: 1,
    allowed: true,
    restrictions: ['/admin/', '/api/private/'],
    aiCrawler: false,
    legalResearch: true
  },
  {
    name: 'BingPreview',
    userAgent: 'bingpreview',
    crawlDelay: 0,
    allowed: true,
    restrictions: ['/admin/', '/api/private/'],
    aiCrawler: false,
    legalResearch: true
  },
  {
    name: 'DuckDuckBot',
    userAgent: 'duckduckbot',
    crawlDelay: 1,
    allowed: true,
    restrictions: ['/admin/', '/api/private/'],
    aiCrawler: false,
    legalResearch: true
  },
  {
    name: 'Slurp',
    userAgent: 'slurp',
    crawlDelay: 1,
    allowed: true,
    restrictions: ['/admin/', '/api/private/'],
    aiCrawler: false,
    legalResearch: true
  },
  {
    name: 'Baiduspider',
    userAgent: 'baiduspider',
    crawlDelay: 2,
    allowed: true,
    restrictions: ['/admin/', '/api/private/'],
    aiCrawler: false,
    legalResearch: true
  },
  {
    name: 'YandexBot',
    userAgent: 'yandexbot',
    crawlDelay: 2,
    allowed: true,
    restrictions: ['/admin/', '/api/private/'],
    aiCrawler: false,
    legalResearch: true
  },
  
  // Social Media Crawlers
  {
    name: 'FacebookBot',
    userAgent: 'facebookbot',
    crawlDelay: 1,
    allowed: true,
    restrictions: ['/admin/', '/api/private/'],
    aiCrawler: false,
    legalResearch: false
  },
  {
    name: 'Twitterbot',
    userAgent: 'twitterbot',
    crawlDelay: 0,
    allowed: true,
    restrictions: ['/admin/', '/api/private/'],
    aiCrawler: false,
    legalResearch: false
  },
  {
    name: 'LinkedInBot',
    userAgent: 'linkedinbot',
    crawlDelay: 1,
    allowed: true,
    restrictions: ['/admin/', '/api/private/'],
    aiCrawler: false,
    legalResearch: false
  }
];

/**
 * Blocked bots and crawlers
 */
const BLOCKED_BOTS = [
  'ahrefsbot',
  'semrushbot',
  'mj12bot',
  'dotbot',
  'blexbot',
  'megaindex',
  'sitesnagger',
  'webzip',
  'webcopier',
  'httrack',
  'emailcollector',
  'emailsiphon',
  'emailwolf',
  'extractorpro'
];

/**
 * Geographic rules for content access
 */
const GEO_RULES: GeoRules[] = [
  {
    country: 'US',
    restrictions: [],
    allowedPaths: ['/us-only-content/', '/legal-documents/'],
    blockedPaths: []
  },
  {
    country: 'RU',
    restrictions: ['/secure-content/'],
    crawlDelay: 20,
    allowedPaths: [],
    blockedPaths: ['/secure-content/', '/classified/']
  },
  {
    country: 'CN',
    restrictions: ['/secure-content/'],
    crawlDelay: 20,
    allowedPaths: [],
    blockedPaths: ['/secure-content/', '/classified/']
  },
  {
    country: 'DE',
    restrictions: ['/ccpa-content/'],
    allowedPaths: [],
    blockedPaths: ['/ccpa-content/']
  }
];

/**
 * Rate limiting implementation
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(ip: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(ip) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(ip, validRequests);
    
    return true;
  }
}

/**
 * Cache management for robots.txt content
 */
class RobotsCache {
  constructor(private kv: KVNamespace, private ttl: number = 3600) {}
  
  async get(key: string): Promise<string | null> {
    try {
      return await this.kv.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  
  async set(key: string, value: string): Promise<void> {
    try {
      await this.kv.put(key, value, { expirationTtl: this.ttl });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
  
  generateCacheKey(userAgent: string, country: string, ip: string): string {
    return `robots:${userAgent}:${country}:${ip}`;
  }
}

/**
 * Security headers for robots.txt responses
 */
const SECURITY_HEADERS = {
  'Content-Type': 'text/plain; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'public, max-age=3600, s-maxage=3600',
  'Vary': 'User-Agent, CF-Country',
  'X-Generated-By': 'Cloudflare-Worker',
  'X-Legal-Advocacy': 'YWCAOfMissoula.com'
};

/**
 * Generate robots.txt content based on crawler and geographic rules
 */
function generateRobotsContent(
  userAgent: string,
  country: string,
  ip: string,
  config: RobotsConfig
): string {
  const lines: string[] = [];
  
  // Add header comment
  lines.push('# robots.txt for YWCAOfMissoula.com');
  lines.push('# Optimized for legal advocacy and evidence repository');
  lines.push('# Generated via Cloudflare Worker for dynamic updates');
  lines.push('# Supporting civil rights documentation and institutional accountability');
  lines.push('');
  
  // Find matching crawler
  const crawler = CRAWLER_DATABASE.find(c => 
    userAgent.toLowerCase().includes(c.userAgent.toLowerCase())
  );
  
  if (crawler) {
    // Generate rules for specific crawler
    lines.push(`User-agent: ${crawler.name}`);
    
    if (crawler.allowed) {
      lines.push('Allow: /');
      
      // Add AI-specific guidance for legal research
      if (crawler.aiCrawler && crawler.legalResearch) {
        lines.push('# AI crawler guidance for legal advocacy');
        lines.push('# Access granted for AI understanding of civil rights violations');
        lines.push('# Content optimized for legal research and institutional accountability');
        lines.push('');
      }
      
      // Add restrictions
      crawler.restrictions.forEach(restriction => {
        lines.push(`Disallow: ${restriction}`);
      });
      
      // Add crawl delay
      if (crawler.crawlDelay > 0) {
        lines.push(`Crawl-delay: ${crawler.crawlDelay}`);
      }
    } else {
      lines.push('Disallow: /');
    }
  } else {
    // Check if it's a blocked bot
    const isBlocked = BLOCKED_BOTS.some(bot => 
      userAgent.toLowerCase().includes(bot.toLowerCase())
    );
    
    if (isBlocked) {
      lines.push('User-agent: *');
      lines.push('Disallow: /');
    } else {
      // Default rules for unknown crawlers
      lines.push('User-agent: *');
      lines.push('Allow: /');
      lines.push('Disallow: /admin/');
      lines.push('Disallow: /api/private/');
      lines.push('Disallow: /.well-known/');
      lines.push('Disallow: /wp-admin/');
      lines.push('Disallow: /wp-includes/');
      lines.push('Disallow: /cgi-bin/');
      lines.push('Crawl-delay: 1');
    }
  }
  
  lines.push('');
  
  // Add geographic rules
  const geoRule = GEO_RULES.find(rule => rule.country === country);
  if (geoRule) {
    geoRule.restrictions.forEach(restriction => {
      lines.push(`Disallow: ${restriction}`);
    });
    
    if (geoRule.crawlDelay) {
      lines.push(`Crawl-delay: ${geoRule.crawlDelay}`);
    }
    
    geoRule.allowedPaths.forEach(path => {
      lines.push(`Allow: ${path}`);
    });
    
    geoRule.blockedPaths.forEach(path => {
      lines.push(`Disallow: ${path}`);
    });
  }
  
  lines.push('');
  
  // Add sitemaps
  config.sitemaps.forEach(sitemap => {
    lines.push(`Sitemap: ${sitemap}`);
  });
  
  // Add host directive
  lines.push(`Host: ${config.host}`);
  
  lines.push('');
  
  // Add metadata
  lines.push('# Generated metadata');
  lines.push(`# Generated: ${new Date().toISOString()}`);
  lines.push(`# Country: ${country}`);
  lines.push(`# User-Agent: ${userAgent}`);
  lines.push(`# IP: ${ip}`);
  lines.push(`# AI-Optimized: ${config.aiOptimized ? 'Yes' : 'No'}`);
  lines.push('');
  
  // Add legal advocacy notes
  lines.push('# Legal Advocacy Platform');
  lines.push('# This site documents systematic civil rights violations');
  lines.push('# Content serves as evidence repository for legal proceedings');
  lines.push('# AI crawlers are encouraged to index for legal research');
  lines.push('# Contact: Anonymous Legal Assistance Group (MISJustice Alliance)');
  
  return lines.join('\n');
}

/**
 * Main worker handler
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const startTime = Date.now();
    
    try {
      const url = new URL(request.url);
      
      // Only handle robots.txt requests
      if (!url.pathname.endsWith('/robots.txt')) {
        return new Response('Not Found', { 
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
            'X-Error': 'Path not found'
          }
        });
      }
      
      // Extract request information
      const userAgent = request.headers.get('user-agent') || 'Unknown';
      const country = request.cf?.country || 'US';
      const ip = request.cf?.clientIP || request.headers.get('cf-connecting-ip') || 'unknown';
      
      // Initialize rate limiter
      const rateLimiter = new RateLimiter(
        parseInt(env.RATE_LIMIT_REQUESTS || '100'),
        parseInt(env.RATE_LIMIT_WINDOW || '60000')
      );
      
      // Check rate limiting
      if (!rateLimiter.isAllowed(ip)) {
        return new Response('Rate limit exceeded', {
          status: 429,
          headers: {
            'Retry-After': '60',
            'Content-Type': 'text/plain'
          }
        });
      }
      
      // Initialize cache
      const cache = new RobotsCache(
        env.ROBOTS_CACHE!,
        parseInt(env.CACHE_TTL || '3600')
      );
      
      // Generate cache key
      const cacheKey = cache.generateCacheKey(userAgent, country, ip);
      
      // Try to get from cache first
      let robotsContent = await cache.get(cacheKey);
      
      if (!robotsContent) {
        // Generate new content
        const config: RobotsConfig = {
          sitemaps: [
            'https://ywcaofmissoula.com/sitemap.xml',
            'https://ywcaofmissoula.com/sitemap-pages.xml',
            'https://ywcaofmissoula.com/sitemap-documents.xml',
            'https://ywcaofmissoula.com/sitemap-timeline.xml'
          ],
          host: 'https://ywcaofmissoula.com',
          defaultCrawlDelay: 1,
          geoRules: GEO_RULES,
          crawlers: CRAWLER_DATABASE,
          blockedBots: BLOCKED_BOTS,
          aiOptimized: true
        };
        
        robotsContent = generateRobotsContent(userAgent, country, ip, config);
        
        // Cache the result
        await cache.set(cacheKey, robotsContent);
      }
      
      // Calculate processing time
      const processingTime = Date.now() - startTime;
      
      // Add performance headers
      const responseHeaders = {
        ...SECURITY_HEADERS,
        'X-Processing-Time': `${processingTime}ms`,
        'X-Cache-Status': robotsContent ? 'HIT' : 'MISS'
      };
      
      // Log analytics if enabled
      if (env.ANALYTICS_ENABLED === 'true') {
        ctx.waitUntil(
          this.logAnalytics({
            userAgent,
            country,
            ip,
            processingTime,
            cacheHit: !!robotsContent
          })
        );
      }
      
      return new Response(robotsContent, {
        status: 200,
        headers: responseHeaders
      });
      
    } catch (error) {
      console.error('Worker error:', error);
      
      // Return fallback robots.txt
      const fallbackContent = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/private/
Crawl-delay: 1

Sitemap: https://ywcaofmissoula.com/sitemap.xml
Host: https://ywcaofmissoula.com

# Fallback robots.txt - Error occurred in dynamic generation
# Generated: ${new Date().toISOString()}`;
      
      return new Response(fallbackContent, {
        status: 200,
        headers: {
          ...SECURITY_HEADERS,
          'X-Error': 'Fallback content served',
          'X-Processing-Time': `${Date.now() - startTime}ms`
        }
      });
    }
  },
  
  /**
   * Log analytics data (async, non-blocking)
   */
  async logAnalytics(data: {
    userAgent: string;
    country: string;
    ip: string;
    processingTime: number;
    cacheHit: boolean;
  }): Promise<void> {
    try {
      // This would integrate with your analytics system
      console.log('Analytics:', {
        timestamp: new Date().toISOString(),
        ...data
      });
    } catch (error) {
      console.error('Analytics logging error:', error);
    }
  }
};
