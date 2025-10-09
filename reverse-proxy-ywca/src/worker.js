/**
 * Injects Cloudflare Web Analytics script into HTML
 * @param {string} html - The HTML content
 * @param {string} token - Cloudflare Web Analytics token
 * @returns {string} HTML with analytics script injected
 */
function injectAnalytics(html, token) {
  const analyticsScript = `<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "${token}"}'></script><!-- End Cloudflare Web Analytics -->`;

  // Try to inject before </head> tag
  if (html.includes('</head>')) {
    return html.replace('</head>', `${analyticsScript}\n</head>`);
  }

  // Fallback: inject before </body> tag
  if (html.includes('</body>')) {
    return html.replace('</body>', `${analyticsScript}\n</body>`);
  }

  // Last resort: append to end of HTML
  return html + analyticsScript;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Target backend
    const backendHost = 'techport-cgc8mj.manus.space';
    const backendUrl = `https://${backendHost}${url.pathname}${url.search}`;
    const proxyHost = url.hostname; // ywcaofmissoula.com

    // Clone the request headers and modify Host header
    const headers = new Headers(request.headers);
    headers.set('Host', backendHost);
    // Remove headers that might cause issues
    headers.delete('referer');
    headers.delete('origin');

    // Create new request with modified headers
    const modifiedRequest = new Request(backendUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'follow' // Follow redirects automatically
    });

    try {
      // Fetch from backend
      const response = await fetch(modifiedRequest);

      // Clone response headers and remove problematic ones
      const responseHeaders = new Headers(response.headers);

      // Remove Location header to prevent external redirects
      responseHeaders.delete('Location');

      // Add security headers
      responseHeaders.set('X-Content-Type-Options', 'nosniff');
      responseHeaders.set('X-Frame-Options', 'DENY');
      responseHeaders.set('X-XSS-Protection', '1; mode=block');
      responseHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      // Check if response is HTML and needs URL rewriting
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('text/html')) {
        // Read response body
        let body = await response.text();

        // Replace all instances of backend URL with proxy URL
        body = body.replace(
          new RegExp(`https?://${backendHost.replace(/\./g, '\\.')}`, 'g'),
          `https://${proxyHost}`
        );

        // Also replace protocol-relative URLs
        body = body.replace(
          new RegExp(`//${backendHost.replace(/\./g, '\\.')}`, 'g'),
          `//${proxyHost}`
        );

        // Inject Cloudflare Web Analytics
        const analyticsToken = env.ANALYTICS_TOKEN || 'd42a1351b9ef4539894a367233dc068e';
        body = injectAnalytics(body, analyticsToken);

        return new Response(body, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders
        });
      }

      // For non-HTML responses, return as-is with modified headers
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders
      });
    } catch (error) {
      console.error('Proxy error:', error);
      return new Response('Proxy error: ' + error.message, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
