# Worker Template - Cloudflare Workers
## YWCAOfMissoula.com Platform

This template provides a starting point for creating new Cloudflare Workers.

## Quick Start

```bash
# Create worker directory
mkdir worker-name && cd worker-name

# Create structure
mkdir -p src tests
touch src/worker.ts wrangler.toml package.json README.md

# Initialize
npm init -y
npm install --save-dev @cloudflare/workers-types typescript wrangler
```

## Worker Entry Point Template

```typescript
export interface Env {
  ENVIRONMENT?: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({ 
          status: 'healthy' 
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response('OK');
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Error', { status: 500 });
    }
  }
};
```

See full template details in project documentation.
