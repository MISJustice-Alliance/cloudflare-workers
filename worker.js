export default {
  async fetch(request) {
    const url = new URL(request.url);
    const targetUrl = 'https://techport-cgc8mj.manus.space' + url.pathname + url.search;
    
    // Create a new request with the target URL
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    try {
      // Fetch from the target
      const response = await fetch(modifiedRequest);
      
      // Return the response with appropriate headers
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
