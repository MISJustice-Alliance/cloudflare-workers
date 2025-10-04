export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.endsWith('/robots.txt')) {
      return new Response('Not Found', { status: 404 });
    }
    const country = request.cf?.country || 'US';
    const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

    // SEO & Bot specific rules
    let lines = [];
    if (userAgent.includes('googlebot')) {
      lines.push('User-agent: Googlebot','Allow: /','Disallow: /private/','Disallow: /admin/');
    } else if (userAgent.includes('bingbot')) {
      lines.push('User-agent: Bingbot','Allow: /','Disallow: /private/','Crawl-delay: 5');
    } else if (userAgent.includes('baiduspider')) {
      lines.push('User-agent: Baiduspider','Disallow: /');
    } else {
      lines.push('User-agent: *','Disallow: /admin/','Disallow: /login/','Disallow: /private/','Allow: /');
    }

    // Example GEO rules: block certain folders by region, or slow crawling
    if(country==='RU' || country==='CN') {
      lines.push('Disallow: /secure-content/','Crawl-delay: 20  # Slow down crawlers in CN/RU');
    }
    if(country==='DE') {
      lines.push('Disallow: /ccpa-content/');
    }
    if(country==='US') {
      lines.push('Allow: /us-only-content/');
    } else {
      lines.push('Disallow: /us-only-content/');
    }

    lines.push('Sitemap: https://www.ywcaofmissoula.com/sitemap.xml','# Auto-generated ' + new Date().toISOString(),'# GEO: '+country,'');

    return new Response(lines.join('\n'),{headers:{'Content-Type':'text/plain'}});
  }
}
