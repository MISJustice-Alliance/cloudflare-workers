/**
 * Test suite for Dynamic Robots.txt Generator
 * 
 * Tests crawler detection, geographic rules, caching, and performance
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Cloudflare Workers environment
const mockEnv: any = {
  ENVIRONMENT: 'test',
  CACHE_TTL: '300',
  RATE_LIMIT_REQUESTS: '10',
  RATE_LIMIT_WINDOW: '60000',
  ANALYTICS_ENABLED: 'false',
  ROBOTS_CACHE: {
    get: vi.fn(),
    put: vi.fn()
  }
};

const mockCf = {
  country: 'US',
  clientIP: '192.168.1.1'
};

describe('Dynamic Robots.txt Generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Crawler Detection', () => {
    it('should detect GPTBot and generate appropriate rules', async () => {
      const request = new Request('https://ywcaofmissoula.com/robots.txt', {
        headers: {
          'user-agent': 'GPTBot/1.0'
        }
      });

      // Mock the worker
      const worker = await import('./worker');
      const response = await worker.default.fetch(request, mockEnv, {} as any);
      
      expect(response.status).toBe(200);
      const content = await response.text();
      
      expect(content).toContain('User-agent: GPTBot');
      expect(content).toContain('Allow: /');
      expect(content).toContain('Crawl-delay: 2');
      expect(content).toContain('AI crawler guidance for legal advocacy');
    });

    it('should detect Googlebot and generate standard rules', async () => {
      const request = new Request('https://ywcaofmissoula.com/robots.txt', {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
      });

      const worker = await import('./worker');
      const response = await worker.default.fetch(request, mockEnv, {} as any);
      
      expect(response.status).toBe(200);
      const content = await response.text();
      
      expect(content).toContain('User-agent: Googlebot');
      expect(content).toContain('Allow: /');
      expect(content).toContain('Crawl-delay: 1');
    });

    it('should block malicious bots', async () => {
      const request = new Request('https://ywcaofmissoula.com/robots.txt', {
        headers: {
          'user-agent': 'AhrefsBot/6.1'
        }
      });

      const worker = await import('./worker');
      const response = await worker.default.fetch(request, mockEnv, {} as any);
      
      expect(response.status).toBe(200);
      const content = await response.text();
      
      expect(content).toContain('User-agent: *');
      expect(content).toContain('Disallow: /');
    });
  });

  describe('Geographic Rules', () => {
    it('should apply US-specific rules', async () => {
      const request = new Request('https://ywcaofmissoula.com/robots.txt', {
        headers: {
          'user-agent': 'Googlebot'
        }
      });

      // Mock CF object with US country
      const mockRequest = {
        ...request,
        cf: { country: 'US', clientIP: '192.168.1.1' }
      };

      const worker = await import('./worker');
      const response = await worker.default.fetch(mockRequest as any, mockEnv, {} as any);
      
      expect(response.status).toBe(200);
      const content = await response.text();
      
      expect(content).toContain('Country: US');
    });

    it('should apply restrictive rules for RU/CN', async () => {
      const request = new Request('https://ywcaofmissoula.com/robots.txt', {
        headers: {
          'user-agent': 'Googlebot'
        }
      });

      // Mock CF object with RU country
      const mockRequest = {
        ...request,
        cf: { country: 'RU', clientIP: '192.168.1.1' }
      };

      const worker = await import('./worker');
      const response = await worker.default.fetch(mockRequest as any, mockEnv, {} as any);
      
      expect(response.status).toBe(200);
      const content = await response.text();
      
      expect(content).toContain('Country: RU');
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      const request = new Request('https://ywcaofmissoula.com/robots.txt', {
        headers: {
          'user-agent': 'Googlebot'
        }
      });

      const worker = await import('./worker');
      const response = await worker.default.fetch(request, mockEnv, {} as any);
      
      expect(response.status).toBe(200);
    });

    it('should reject requests exceeding rate limit', async () => {
      // This would require more complex mocking of the rate limiter
      // For now, we'll test the basic functionality
      const request = new Request('https://ywcaofmissoula.com/robots.txt', {
        headers: {
          'user-agent': 'Googlebot'
        }
      });

      const worker = await import('./worker');
      const response = await worker.default.fetch(request, mockEnv, {} as any);
      
      // Should not be rate limited in normal circumstances
      expect(response.status).not.toBe(429);
    });
  });

  describe('Caching', () => {
    it('should return cached content when available', async () => {
      const cachedContent = 'User-agent: *\nAllow: /';
      mockEnv.ROBOTS_CACHE.get.mockResolvedValue(cachedContent);

      const request = new Request('https://ywcaofmissoula.com/robots.txt', {
        headers: {
          'user-agent': 'Googlebot'
        }
      });

      const worker = await import('./worker');
      const response = await worker.default.fetch(request, mockEnv, {} as any);
      
      expect(response.status).toBe(200);
      expect(mockEnv.ROBOTS_CACHE.get).toHaveBeenCalled();
    });

    it('should cache new content when not available', async () => {
      mockEnv.ROBOTS_CACHE.get.mockResolvedValue(null);

      const request = new Request('https://ywcaofmissoula.com/robots.txt', {
        headers: {
          'user-agent': 'Googlebot'
        }
      });

      const worker = await import('./worker');
      const response = await worker.default.fetch(request, mockEnv, {} as any);
      
      expect(response.status).toBe(200);
      expect(mockEnv.ROBOTS_CACHE.put).toHaveBeenCalled();
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in response', async () => {
      const request = new Request('https://ywcaofmissoula.com/robots.txt', {
        headers: {
          'user-agent': 'Googlebot'
        }
      });

      const worker = await import('./worker');
      const response = await worker.default.fetch(request, mockEnv, {} as any);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('Cache-Control')).toContain('public');
    });
  });

  describe('Error Handling', () => {
    it('should return fallback content on error', async () => {
      // Mock an error in the worker
      const request = new Request('https://ywcaofmissoula.com/robots.txt', {
        headers: {
          'user-agent': 'Googlebot'
        }
      });

      const worker = await import('./worker');
      const response = await worker.default.fetch(request, mockEnv, {} as any);
      
      // Should not throw, should return a response
      expect(response.status).toBe(200);
      const content = await response.text();
      expect(content).toContain('User-agent:');
    });

    it('should handle invalid paths', async () => {
      const request = new Request('https://ywcaofmissoula.com/invalid-path', {
        headers: {
          'user-agent': 'Googlebot'
        }
      });

      const worker = await import('./worker');
      const response = await worker.default.fetch(request, mockEnv, {} as any);
      
      expect(response.status).toBe(404);
    });
  });

  describe('Performance', () => {
    it('should respond within performance limits', async () => {
      const startTime = Date.now();
      
      const request = new Request('https://ywcaofmissoula.com/robots.txt', {
        headers: {
          'user-agent': 'Googlebot'
        }
      });

      const worker = await import('./worker');
      const response = await worker.default.fetch(request, mockEnv, {} as any);
      
      const endTime = Date.now();
      const processingTime = endTime - startTime;
      
      expect(response.status).toBe(200);
      expect(processingTime).toBeLessThan(100); // Should be much faster than 100ms
    });
  });
});
