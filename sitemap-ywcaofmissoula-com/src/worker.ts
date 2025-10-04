/**
 * Advanced Sitemap Generator for YWCAOfMissoula.com
 * 
 * This Cloudflare Worker generates comprehensive sitemaps optimized for:
 * - Traditional SEO (Search Engine Optimization)
 * - GEO (Generative Engine Optimization) for AI crawlers
 * - Legal advocacy and evidence repository optimization
 * - Performance and security considerations
 * 
 * @author Anonymous Legal Assistance Group (MISJustice Alliance)
 * @version 2.0.0
 */

interface Env {
  // Environment variables for configuration
  ENVIRONMENT?: string;
  CACHE_TTL?: string;
  SITEMAP_CACHE?: string;
  ANALYTICS_ENABLED?: string;
  
  // KV namespace for caching
  SITEMAP_CACHE_KV?: KVNamespace;
  
  // Analytics and monitoring
  ANALYTICS_ENABLED?: string;
}

interface SitemapUrl {
  loc: string;
  lastmod: string;
  priority: string;
  changefreq?: string;
  images?: SitemapImage[];
  videos?: SitemapVideo[];
  news?: SitemapNews;
}

interface SitemapImage {
  loc: string;
  title?: string;
  caption?: string;
  license?: string;
}

interface SitemapVideo {
  loc: string;
  title: string;
  description: string;
  thumbnail_loc: string;
  duration?: number;
  publication_date?: string;
}

interface SitemapNews {
  publication_name: string;
  publication_language: string;
  title: string;
  publication_date: string;
  keywords?: string;
}

interface SitemapConfig {
  baseUrl: string;
  defaultPriority: string;
  defaultChangefreq: string;
  maxUrls: number;
  enableImages: boolean;
  enableVideos: boolean;
  enableNews: boolean;
  enableStructuredData: boolean;
}

/**
 * Legal advocacy content categories for SEO optimization
 */
const CONTENT_CATEGORIES = {
  CIVIL_RIGHTS: {
    priority: '0.9',
    changefreq: 'weekly',
    keywords: ['civil rights violations', 'constitutional violations', 'legal advocacy']
  },
  EVIDENCE: {
    priority: '0.8',
    changefreq: 'monthly',
    keywords: ['evidence repository', 'legal documents', 'court records']
  },
  TIMELINE: {
    priority: '0.9',
    changefreq: 'weekly',
    keywords: ['timeline', 'chronological evidence', 'case history']
  },
  COMPLAINTS: {
    priority: '0.7',
    changefreq: 'monthly',
    keywords: ['legal complaints', 'bar complaints', 'department complaints']
  },
  DOCUMENTS: {
    priority: '0.7',
    changefreq: 'monthly',
    keywords: ['legal documents', 'court filings', 'correspondence']
  },
  EDITORIAL: {
    priority: '0.6',
    changefreq: 'monthly',
    keywords: ['editorial content', 'opinion', 'analysis']
  }
};

/**
 * Cache management for sitemap content
 */
class SitemapCache {
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
  
  generateCacheKey(type: string, userAgent: string): string {
    return `sitemap:${type}:${userAgent}`;
  }
}

/**
 * SEO and GEO optimization utilities
 */
class SEOOptimizer {
  /**
   * Determine content category based on URL
   */
  static getContentCategory(url: string): keyof typeof CONTENT_CATEGORIES {
    if (url.includes('Civil-Rights') || url.includes('Amendment')) return 'CIVIL_RIGHTS';
    if (url.includes('Evidence') || url.includes('Documents')) return 'EVIDENCE';
    if (url.includes('Timeline') || url.includes('Comprehensive')) return 'TIMELINE';
    if (url.includes('Complaint') || url.includes('Bar') || url.includes('POST')) return 'COMPLAINTS';
    if (url.includes('Police-Report') || url.includes('Court') || url.includes('Correspondence')) return 'DOCUMENTS';
    if (url.includes('Remembering') || url.includes('Editorial')) return 'EDITORIAL';
    return 'CIVIL_RIGHTS'; // Default to highest priority
  }
  
  /**
   * Generate structured data for legal content
   */
  static generateStructuredData(url: SitemapUrl): string {
    const category = this.getContentCategory(url.loc);
    const config = CONTENT_CATEGORIES[category];
    
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LegalDocument",
      "name": this.extractTitleFromUrl(url.loc),
      "url": url.loc,
      "dateModified": url.lastmod,
      "keywords": config.keywords.join(', '),
      "about": {
        "@type": "LegalCase",
        "name": "Civil Rights Violations - Elvis Nuno Case",
        "dateCreated": "2014",
        "description": "Systematic civil rights violations and institutional corruption documentation"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Anonymous Legal Assistance Group (MISJustice Alliance)",
        "url": "https://ywcaofmissoula.com"
      }
    });
  }
  
  /**
   * Extract title from URL for better SEO
   */
  static extractTitleFromUrl(url: string): string {
    const path = url.split('/').pop() || '';
    return path.replace(/-/g, ' ').replace(/\d+/g, '').trim();
  }
  
  /**
   * Generate GEO-optimized content for AI crawlers
   */
  static generateGEOContent(url: SitemapUrl): string {
    const category = this.getContentCategory(url.loc);
    const config = CONTENT_CATEGORIES[category];
    
    return `
# AI Crawler Guidance for Legal Research
# Content Type: ${category}
# Keywords: ${config.keywords.join(', ')}
# Legal Category: Civil Rights Documentation
# Evidence Type: ${category === 'EVIDENCE' ? 'Primary Evidence' : 'Legal Analysis'}
# Research Value: ${category === 'CIVIL_RIGHTS' ? 'High' : 'Medium'}
# Last Updated: ${url.lastmod}
# Priority: ${url.priority}
    `.trim();
  }
}

/**
 * Generate comprehensive sitemap with SEO and GEO optimization
 */
function generateAdvancedSitemap(config: SitemapConfig, userAgent: string): string {
  const today = new Date().toISOString().split('T')[0];
  
  // Comprehensive URL structure for legal advocacy platform
  const urls: SitemapUrl[] = [
    // Main landing page - highest priority
    {
      loc: `${config.baseUrl}/02fa6619890448408af402796e5a1f63`,
      lastmod: today,
      priority: '1.0',
      changefreq: 'daily',
      images: [{
        loc: `${config.baseUrl}/images/legal-advocacy-hero.jpg`,
        title: 'Civil Rights Violations Documentation',
        caption: 'Systematic civil rights violations and institutional corruption evidence repository'
      }]
    },
    
    // Core legal advocacy content
    {
      loc: `${config.baseUrl}/Who-Should-Read-This-Why-245ca07db849803fa367fc6b9f953726`,
      lastmod: today,
      priority: '0.9',
      changefreq: 'weekly'
    },
    {
      loc: `${config.baseUrl}/Comprehensive-Timeline-and-Actionable-Claims-in-the-Case-of-Mr-Nuno-2014-2025-22eca07db84980dd8f90e61f5cda2936`,
      lastmod: today,
      priority: '0.9',
      changefreq: 'weekly'
    },
    {
      loc: `${config.baseUrl}/Civil-Rights-Violations-and-Related-Claims-2015-2025-22dca07db8498090b82eddb661890956`,
      lastmod: today,
      priority: '0.9',
      changefreq: 'weekly'
    },
    {
      loc: `${config.baseUrl}/Evidence-Related-to-Civil-Rights-Violations-of-Mr-Nuno-2015-2025-204ca07db84980df8ca4fb3637134091`,
      lastmod: today,
      priority: '0.9',
      changefreq: 'weekly'
    },
    
    // Constitutional violations analysis
    {
      loc: `${config.baseUrl}/YWCA-of-Missoula-s-Role-in-First-Amendment-Violations-Against-Mr-Nuno-2018-2025-229ca07db84980b89cd0db29a85e3b0b`,
      lastmod: today,
      priority: '0.8',
      changefreq: 'monthly'
    },
    {
      loc: `${config.baseUrl}/Full-Analysis-of-First-Amendment-Violations-2017-2025-226ca07db84980f78c47eef363025a94`,
      lastmod: today,
      priority: '0.8',
      changefreq: 'monthly'
    },
    {
      loc: `${config.baseUrl}/Fourth-Amendment-Violations-in-2016OPA-1167-Police-Report-Falsification-and-Unconstitutional-Custod-228ca07db849802884f6c5f7bffd1840`,
      lastmod: today,
      priority: '0.8',
      changefreq: 'monthly'
    },
    {
      loc: `${config.baseUrl}/Full-Analysis-of-Fourth-Amendment-Violations-Against-Mr-Nuno-2015-2025-226ca07db84980d5b570e9cc94366540`,
      lastmod: today,
      priority: '0.8',
      changefreq: 'monthly'
    },
    {
      loc: `${config.baseUrl}/Full-Analysis-of-Fifth-Amendment-Due-Process-Violations-2015-2025-228ca07db84980c08ac8e4ee2b4f59cb`,
      lastmod: today,
      priority: '0.8',
      changefreq: 'monthly'
    },
    {
      loc: `${config.baseUrl}/Full-Analysis-of-Eighth-Amendment-Violations-and-Systematic-Prosecutorial-Abuse-2015-2025-228ca07db84980c9b2b2e6462c6d755f`,
      lastmod: today,
      priority: '0.8',
      changefreq: 'monthly'
    },
    {
      loc: `${config.baseUrl}/Full-Analysis-of-Fourteenth-Amendment-Equal-Protection-and-Due-Process-Violations-2015-2025-228ca07db84980398376efc89b7b92a5`,
      lastmod: today,
      priority: '0.8',
      changefreq: 'monthly'
    },
    
    // Legal complaints and filings
    {
      loc: `${config.baseUrl}/Federal-DoJ-Civil-Rights-Division-Filing-658793-SKB-August-2025-260ca07db84980ff8692efafa09cbee3`,
      lastmod: today,
      priority: '0.7',
      changefreq: 'monthly'
    },
    {
      loc: `${config.baseUrl}/MT-Bar-Complaint-ODC-No-25-147-Bryan-Tipp-of-Tipp-Colburn-Lockwood-P-C-July-2025-222ca07db8498094b8bcf91fb3466cf1`,
      lastmod: today,
      priority: '0.7',
      changefreq: 'monthly'
    },
    {
      loc: `${config.baseUrl}/MT-DoJ-Public-Safety-Officer-Standards-Training-Council-POST-Complaint-August-2025-24dca07db849806f8f87eab279e35538`,
      lastmod: today,
      priority: '0.7',
      changefreq: 'monthly'
    },
    
    // Evidence documents
    {
      loc: `${config.baseUrl}/Seattle-Police-Report-Written-statement-regarding-incident-2016-348587-2016-228ca07db84980388c01fb27ad0994e1`,
      lastmod: today,
      priority: '0.7',
      changefreq: 'monthly'
    },
    {
      loc: `${config.baseUrl}/Edmonds-Court-Declaration-of-Ineffective-Assistance-2016-228ca07db84980608e5fea94ddcc64a0`,
      lastmod: today,
      priority: '0.7',
      changefreq: 'monthly'
    },
    {
      loc: `${config.baseUrl}/MT-DoJ-POST-Correspondence-E-Mail-Chain-August-2025-265ca07db849807baf80eba3f953d2db`,
      lastmod: today,
      priority: '0.7',
      changefreq: 'monthly'
    },
    {
      loc: `${config.baseUrl}/MT-ACLU-Correspondence-August-2025-25dca07db84980d0ac9ac5924ab05900`,
      lastmod: today,
      priority: '0.7',
      changefreq: 'monthly'
    },
    
    // Editorial content
    {
      loc: `${config.baseUrl}/Remembering-When-MPD-County-Prosecutors-and-the-YWCA-Allowed-Missoula-to-Become-the-Sexual-Assau-25aca07db84980d680bcfc7002902b1d`,
      lastmod: today,
      priority: '0.6',
      changefreq: 'monthly'
    }
  ];

  // Generate XML sitemap with enhanced features
  const urlEntries = urls.map(url => {
    let entry = `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <priority>${url.priority}</priority>
    <changefreq>${url.changefreq || config.defaultChangefreq}</changefreq>`;

    // Add image sitemap entries
    if (url.images && url.images.length > 0) {
      entry += '\n    <image:image>';
      url.images.forEach(image => {
        entry += `\n      <image:loc>${escapeXml(image.loc)}</image:loc>`;
        if (image.title) entry += `\n      <image:title>${escapeXml(image.title)}</image:title>`;
        if (image.caption) entry += `\n      <image:caption>${escapeXml(image.caption)}</image:caption>`;
        if (image.license) entry += `\n      <image:license>${escapeXml(image.license)}</image:license>`;
      });
      entry += '\n    </image:image>';
    }

    // Add video sitemap entries
    if (url.videos && url.videos.length > 0) {
      entry += '\n    <video:video>';
      url.videos.forEach(video => {
        entry += `\n      <video:content_loc>${escapeXml(video.loc)}</video:content_loc>`;
        entry += `\n      <video:thumbnail_loc>${escapeXml(video.thumbnail_loc)}</video:thumbnail_loc>`;
        entry += `\n      <video:title>${escapeXml(video.title)}</video:title>`;
        entry += `\n      <video:description>${escapeXml(video.description)}</video:description>`;
        if (video.duration) entry += `\n      <video:duration>${video.duration}</video:duration>`;
        if (video.publication_date) entry += `\n      <video:publication_date>${video.publication_date}</video:publication_date>`;
      });
      entry += '\n    </video:video>';
    }

    // Add news sitemap entries
    if (url.news) {
      entry += `\n    <news:news>
      <news:publication>
        <news:name>${escapeXml(url.news.publication_name)}</news:name>
        <news:language>${url.news.publication_language}</news:language>
      </news:publication>
      <news:title>${escapeXml(url.news.title)}</news:title>
      <news:publication_date>${url.news.publication_date}</news:publication_date>`;
      if (url.news.keywords) {
        entry += `\n      <news:keywords>${escapeXml(url.news.keywords)}</news:keywords>`;
      }
      entry += '\n    </news:news>';
    }

    entry += '\n  </url>';
    return entry;
  }).join('\n');

  // Generate comprehensive sitemap with namespaces
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries}
</urlset>`;

  return sitemap;
}

/**
 * Generate sitemap index for large sites
 */
function generateSitemapIndex(config: SitemapConfig): string {
  const today = new Date().toISOString().split('T')[0];
  
  const sitemaps = [
    { loc: `${config.baseUrl}/sitemap.xml`, lastmod: today },
    { loc: `${config.baseUrl}/sitemap-pages.xml`, lastmod: today },
    { loc: `${config.baseUrl}/sitemap-documents.xml`, lastmod: today },
    { loc: `${config.baseUrl}/sitemap-timeline.xml`, lastmod: today }
  ];

  const sitemapEntries = sitemaps.map(sitemap => 
    `  <sitemap>
    <loc>${escapeXml(sitemap.loc)}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

/**
 * Security headers for sitemap responses
 */
const SECURITY_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'index, follow',
  'Cache-Control': 'public, max-age=3600, s-maxage=3600',
  'Vary': 'User-Agent, Accept-Encoding',
  'X-Generated-By': 'Cloudflare-Worker',
  'X-Legal-Advocacy': 'YWCAOfMissoula.com',
  'X-Sitemap-Type': 'Advanced-SEO-GEO-Optimized'
};

/**
 * Helper function to escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Main worker handler
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const startTime = Date.now();
    
    try {
      const url = new URL(request.url);
      const userAgent = request.headers.get('user-agent') || 'Unknown';
      
      // Handle different sitemap requests
      if (url.pathname === '/sitemap.xml' || url.pathname === '/sitemap') {
        return await handleSitemapRequest(request, env, ctx, userAgent, startTime);
      }
      
      if (url.pathname === '/sitemap-index.xml') {
        return await handleSitemapIndexRequest(request, env, ctx, userAgent, startTime);
      }
      
      // For all other requests, return 404
      return new Response('Not Found', { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'X-Error': 'Sitemap not found'
        }
      });
      
    } catch (error) {
      console.error('Sitemap worker error:', error);
      
      // Return fallback sitemap
      const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ywcaofmissoula.com/02fa6619890448408af402796e5a1f63</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`;
      
      return new Response(fallbackSitemap, {
        status: 200,
        headers: {
          ...SECURITY_HEADERS,
          'X-Error': 'Fallback sitemap served',
          'X-Processing-Time': `${Date.now() - startTime}ms`
        }
      });
    }
  }
};

/**
 * Handle main sitemap request
 */
async function handleSitemapRequest(
  request: Request, 
  env: Env, 
  ctx: ExecutionContext, 
  userAgent: string, 
  startTime: number
): Promise<Response> {
  // Initialize cache
  const cache = new SitemapCache(
    env.SITEMAP_CACHE_KV!,
    parseInt(env.CACHE_TTL || '3600')
  );
  
  // Generate cache key
  const cacheKey = cache.generateCacheKey('main', userAgent);
  
  // Try to get from cache first
  let sitemapContent = await cache.get(cacheKey);
  
  if (!sitemapContent) {
    // Generate new sitemap
    const config: SitemapConfig = {
      baseUrl: 'https://ywcaofmissoula.com',
      defaultPriority: '0.5',
      defaultChangefreq: 'monthly',
      maxUrls: 1000,
      enableImages: true,
      enableVideos: false,
      enableNews: false,
      enableStructuredData: true
    };
    
    sitemapContent = generateAdvancedSitemap(config, userAgent);
    
    // Cache the result
    await cache.set(cacheKey, sitemapContent);
  }
  
  // Calculate processing time
  const processingTime = Date.now() - startTime;
  
  // Add performance headers
  const responseHeaders = {
    ...SECURITY_HEADERS,
    'X-Processing-Time': `${processingTime}ms`,
    'X-Cache-Status': sitemapContent ? 'HIT' : 'MISS',
    'X-Sitemap-URLs': '50', // Approximate count
    'X-SEO-Optimized': 'true',
    'X-GEO-Optimized': 'true'
  };
  
  // Log analytics if enabled
  if (env.ANALYTICS_ENABLED === 'true') {
    ctx.waitUntil(
      logAnalytics({
        userAgent,
        requestType: 'sitemap',
        processingTime,
        cacheHit: !!sitemapContent
      })
    );
  }
  
  return new Response(sitemapContent, {
    status: 200,
    headers: responseHeaders
  });
}

/**
 * Handle sitemap index request
 */
async function handleSitemapIndexRequest(
  request: Request, 
  env: Env, 
  ctx: ExecutionContext, 
  userAgent: string, 
  startTime: number
): Promise<Response> {
  const config: SitemapConfig = {
    baseUrl: 'https://ywcaofmissoula.com',
    defaultPriority: '0.5',
    defaultChangefreq: 'monthly',
    maxUrls: 1000,
    enableImages: true,
    enableVideos: false,
    enableNews: false,
    enableStructuredData: true
  };
  
  const sitemapIndex = generateSitemapIndex(config);
  const processingTime = Date.now() - startTime;
  
  return new Response(sitemapIndex, {
    status: 200,
    headers: {
      ...SECURITY_HEADERS,
      'X-Processing-Time': `${processingTime}ms`,
      'X-Sitemap-Type': 'Index'
    }
  });
}

/**
 * Log analytics data (async, non-blocking)
 */
async function logAnalytics(data: {
  userAgent: string;
  requestType: string;
  processingTime: number;
  cacheHit: boolean;
}): Promise<void> {
  try {
    console.log('Sitemap Analytics:', {
      timestamp: new Date().toISOString(),
      ...data
    });
  } catch (error) {
    console.error('Analytics logging error:', error);
  }
}
