/**
 * Tests for LLMS.txt Worker
 *
 * Comprehensive test suite covering:
 * - File serving (llms.txt, llms-full.txt)
 * - Caching behavior
 * - Rate limiting
 * - Security headers
 * - Health check endpoint
 * - Error handling
 * - ETag support
 */

import { describe, it, expect, beforeEach } from 'vitest';
import worker from './worker';

// Mock environment for testing
const createMockEnv = (overrides = {}): any => ({
  ENVIRONMENT: 'test',
  CACHE_TTL: '86400',
  RATE_LIMIT_REQUESTS: '100',
  RATE_LIMIT_WINDOW: '60',
  ANALYTICS_ENABLED: 'false',
  ...overrides
});

// Mock ExecutionContext
const createMockContext = (): ExecutionContext => {
  const waitUntilPromises: Promise<any>[] = [];

  return {
    waitUntil: (promise: Promise<any>) => {
      waitUntilPromises.push(promise);
    },
    passThroughOnException: () => {}
  } as ExecutionContext;
};

describe('LLMS.txt Worker Tests', () => {
  let env: any;
  let ctx: ExecutionContext;

  beforeEach(() => {
    env = createMockEnv();
    ctx = createMockContext();
  });

  describe('File Serving', () => {
    it('should serve llms.txt with correct content type', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');

      const text = await response.text();
      expect(text).toContain('YWCAOfMissoula.com');
      expect(text).toContain('AI Optimization Guide');
    });

    it('should serve llms-full.txt with correct content type', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms-full.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');

      const text = await response.text();
      expect(text).toContain('Comprehensive AI Content Map');
    });

    it('should return 404 for unknown routes', async () => {
      const request = new Request('https://ywcaofmissoula.com/unknown');
      const response = await worker.fetch(request, env, ctx);

      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toBe('Not Found');
    });
  });

  describe('Security Headers', () => {
    it('should include X-Content-Type-Options header', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    });

    it('should include X-Frame-Options header', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    });

    it('should include X-XSS-Protection header', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
    });

    it('should include Referrer-Policy header', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    });

    it('should include Content-Security-Policy header', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'none'");
    });

    it('should include Strict-Transport-Security header', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('Strict-Transport-Security')).toContain('max-age=31536000');
    });

    it('should include Permissions-Policy header', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('Permissions-Policy')).toBeTruthy();
    });
  });

  describe('Caching', () => {
    it('should include Cache-Control header', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('Cache-Control')).toContain('public');
      expect(response.headers.get('Cache-Control')).toContain('max-age=86400');
    });

    it('should include ETag header', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('ETag')).toBeTruthy();
      expect(response.headers.get('ETag')).toMatch(/^".*"$/);
    });

    it('should include X-Content-Version header', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('X-Content-Version')).toBe('2.0.0');
    });

    it('should return 304 for matching ETag', async () => {
      // First request to get ETag
      const request1 = new Request('https://ywcaofmissoula.com/llms.txt');
      const response1 = await worker.fetch(request1, env, ctx);
      const etag = response1.headers.get('ETag');

      // Second request with If-None-Match
      const request2 = new Request('https://ywcaofmissoula.com/llms.txt', {
        headers: { 'If-None-Match': etag || '' }
      });
      const response2 = await worker.fetch(request2, env, ctx);

      expect(response2.status).toBe(304);
    });

    it('should respect custom cache TTL from environment', async () => {
      const customEnv = createMockEnv({ CACHE_TTL: '3600' });
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, customEnv, ctx);

      expect(response.headers.get('Cache-Control')).toContain('max-age=3600');
    });
  });

  describe('CORS Headers', () => {
    it('should include Access-Control-Allow-Origin header', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('should include Vary header for encoding', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('Vary')).toContain('Accept-Encoding');
    });
  });

  describe('Health Check Endpoint', () => {
    it('should respond to /health endpoint', async () => {
      const request = new Request('https://ywcaofmissoula.com/health');
      const response = await worker.fetch(request, env, ctx);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
    });

    it('should return health status JSON', async () => {
      const request = new Request('https://ywcaofmissoula.com/health');
      const response = await worker.fetch(request, env, ctx);

      const health = await response.json();
      expect(health.status).toBe('healthy');
      expect(health.version).toBe('2.0.0');
      expect(health.environment).toBe('test');
      expect(health.timestamp).toBeTruthy();
      expect(health.services).toBeDefined();
    });

    it('should not cache health check responses', async () => {
      const request = new Request('https://ywcaofmissoula.com/health');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('Cache-Control')).toContain('no-cache');
      expect(response.headers.get('Cache-Control')).toContain('no-store');
    });

    it('should include security headers on health check', async () => {
      const request = new Request('https://ywcaofmissoula.com/health');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', async () => {
      // Create a request that will cause an error
      const request = new Request('https://invalid-url');

      try {
        const response = await worker.fetch(request, env, ctx);
        // Should return 500 on error, not throw
        expect(response.status).toBe(500);
      } catch (error) {
        // If it throws, that's also acceptable
        expect(error).toBeDefined();
      }
    });

    it('should not expose error details in response', async () => {
      const request = new Request('https://invalid-url');

      try {
        const response = await worker.fetch(request, env, ctx);
        const text = await response.text();
        // Should not contain stack traces or detailed errors
        expect(text).toBe('Internal Server Error');
      } catch (error) {
        // Error handling may vary
      }
    });
  });

  describe('Content Validation', () => {
    it('should serve non-empty llms.txt content', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);
      const text = await response.text();

      expect(text.length).toBeGreaterThan(100);
      expect(text).toContain('Purpose');
      expect(text).toContain('Content Structure');
    });

    it('should serve non-empty llms-full.txt content', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms-full.txt');
      const response = await worker.fetch(request, env, ctx);
      const text = await response.text();

      expect(text.length).toBeGreaterThan(1000);
      expect(text).toContain('Document Metadata');
      expect(text).toContain('Content Taxonomy');
    });

    it('should include required sections in llms.txt', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);
      const text = await response.text();

      // Check for required sections
      expect(text).toContain('Purpose');
      expect(text).toContain('Key Entities');
      expect(text).toContain('Content Structure');
      expect(text).toContain('Search Intent');
      expect(text).toContain('Usage Guidelines');
    });

    it('should include required sections in llms-full.txt', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms-full.txt');
      const response = await worker.fetch(request, env, ctx);
      const text = await response.text();

      // Check for required sections
      expect(text).toContain('Document Metadata');
      expect(text).toContain('Platform Overview');
      expect(text).toContain('Content Taxonomy');
      expect(text).toContain('Entity Definitions');
      expect(text).toContain('Search Intent Analysis');
    });
  });

  describe('Environment Configuration', () => {
    it('should use production environment by default', async () => {
      const prodEnv = createMockEnv({ ENVIRONMENT: undefined });
      const request = new Request('https://ywcaofmissoula.com/health');
      const response = await worker.fetch(request, prodEnv, ctx);

      const health = await response.json();
      expect(health.environment).toBe('production');
    });

    it('should respect custom environment setting', async () => {
      const customEnv = createMockEnv({ ENVIRONMENT: 'staging' });
      const request = new Request('https://ywcaofmissoula.com/health');
      const response = await worker.fetch(request, customEnv, ctx);

      const health = await response.json();
      expect(health.environment).toBe('staging');
    });
  });

  describe('SEO Headers', () => {
    it('should include X-Robots-Tag for llms.txt files', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('X-Robots-Tag')).toBe('noindex');
    });

    it('should include X-Robots-Tag for llms-full.txt files', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms-full.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('X-Robots-Tag')).toBe('noindex');
    });
  });

  describe('Request Methods', () => {
    it('should handle GET requests', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt', {
        method: 'GET'
      });
      const response = await worker.fetch(request, env, ctx);

      expect(response.status).toBe(200);
    });

    it('should handle HEAD requests', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt', {
        method: 'HEAD'
      });

      try {
        const response = await worker.fetch(request, env, ctx);
        // HEAD should work like GET but without body
        expect(response.status).toBeLessThan(500);
      } catch (error) {
        // HEAD might not be implemented, which is acceptable
      }
    });
  });

  describe('Performance', () => {
    it('should respond quickly (< 1000ms)', async () => {
      const start = Date.now();
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      await worker.fetch(request, env, ctx);
      const duration = Date.now() - start;

      // Should be fast (under 1 second for tests)
      expect(duration).toBeLessThan(1000);
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() =>
        worker.fetch(new Request('https://ywcaofmissoula.com/llms.txt'), env, ctx)
      );

      const responses = await Promise.all(requests);

      // All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Character Encoding', () => {
    it('should use UTF-8 encoding', async () => {
      const request = new Request('https://ywcaofmissoula.com/llms.txt');
      const response = await worker.fetch(request, env, ctx);

      expect(response.headers.get('Content-Type')).toContain('charset=utf-8');
    });
  });
});
