export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Target backend
    const backendHost = 'techport-cgc8mj.manus.space';
    const backendUrl = `https://${backendHost}${url.pathname}${url.search}`;
    
    // Clone the request headers and modify Host header
    const headers = new Headers(request.headers);
    headers.set('Host', backendHost);
    
    // Create new request with modified headers
    const modifiedRequest = new Request(backendUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'manual'
    });
    
    try {
      // Fetch from backend
      const response = await fetch(modifiedRequest);
      
      // Handle redirects by following them internally
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('Location');
        if (location) {
          // Follow redirect internally
          const redirectUrl = new URL(location, backendUrl);
          const redirectHeaders = new Headers(headers);
          redirectHeaders.set('Host', backendHost);
          
          const redirectRequest = new Request(redirectUrl.toString(), {
            method: 'GET',
            headers: redirectHeaders,
            redirect: 'manual'
          });
          
          const redirectResponse = await fetch(redirectRequest);
          
          // Return content without redirect
          return new Response(redirectResponse.body, {
            status: 200,
            statusText: 'OK',
            headers: redirectResponse.headers
          });
        }
      }
      
      // Return the response as-is for non-redirect responses
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    } catch (error) {
      return new Response('Proxy error: ' + error.message, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
