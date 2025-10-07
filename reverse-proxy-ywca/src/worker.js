export default {
  async fetch(request) {
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
