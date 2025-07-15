// Performance monitoring and optimization utilities
import React from 'react';
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Observe Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();
  }

  // Largest Contentful Paint
  private observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    }
  }

  // First Input Delay
  private observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    }
  }

  // Cumulative Layout Shift
  private observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric('CLS', clsValue);
          }
        });
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    }
  }

  // First Contentful Paint
  private observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordMetric('FCP', entry.startTime);
        });
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    }
  }

  // Time to First Byte
  private observeTTFB() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('TTFB', entry.responseStart - entry.requestStart);
        });
      });
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    }
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
    
    // Keep only last 100 measurements
    const values = this.metrics.get(name)!;
    if (values.length > 100) {
      values.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name}: ${value.toFixed(2)}ms`);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(name, value);
    }
  }

  private sendToAnalytics(name: string, value: number) {
    // Send to analytics service (Google Analytics, etc.)
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        non_interaction: true,
      });
    }
  }

  // Public methods
  getMetrics(): Record<string, number[]> {
    const result: Record<string, number[]> = {};
    this.metrics.forEach((values, key) => {
      result[key] = [...values];
    });
    return result;
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  // Measure custom performance
  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    return fn().finally(() => {
      const end = performance.now();
      this.recordMetric(name, end - start);
    });
  }

  measureSync<T>(name: string, fn: () => T): T {
    const start = performance.now();
    try {
      return fn();
    } finally {
      const end = performance.now();
      this.recordMetric(name, end - start);
    }
  }

  // Resource timing
  analyzeResources() {
    if (typeof window === 'undefined') return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const analysis = {
      totalResources: resources.length,
      totalSize: 0,
      slowestResources: [] as Array<{ name: string; duration: number; size?: number }>,
      resourceTypes: {} as Record<string, number>,
    };

    resources.forEach((resource) => {
      const duration = resource.responseEnd - resource.startTime;
      const size = resource.transferSize || 0;
      
      analysis.totalSize += size;
      
      // Track resource types
      const type = this.getResourceType(resource.name);
      analysis.resourceTypes[type] = (analysis.resourceTypes[type] || 0) + 1;
      
      // Track slowest resources
      analysis.slowestResources.push({
        name: resource.name,
        duration,
        size,
      });
    });

    // Sort by duration
    analysis.slowestResources.sort((a, b) => b.duration - a.duration);
    analysis.slowestResources = analysis.slowestResources.slice(0, 10);

    return analysis;
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'JavaScript';
    if (url.includes('.css')) return 'CSS';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/)) return 'Image';
    if (url.includes('/api/')) return 'API';
    return 'Other';
  }

  // Bundle size analysis
  analyzeBundleSize() {
    if (typeof window === 'undefined') return;

    const scripts = Array.from(document.querySelectorAll('script[src]')) as HTMLScriptElement[];
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];

    const analysis = {
      scripts: scripts.map(script => ({
        src: script.src,
        async: script.async,
        defer: script.defer,
      })),
      stylesheets: stylesheets.map(link => ({
        href: link.href,
        media: link.media,
      })),
    };

    return analysis;
  }

  // Memory usage
  getMemoryUsage() {
    if (typeof window === 'undefined' || !('memory' in performance)) return null;

    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usedPercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    };
  }

  // Cleanup
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();
  
  React.useEffect(() => {
    return () => {
      // Cleanup on unmount
    };
  }, []);

  return {
    getMetrics: () => monitor.getMetrics(),
    getAverageMetric: (name: string) => monitor.getAverageMetric(name),
    measureAsync: (name: string, fn: () => Promise<any>) => monitor.measureAsync(name, fn),
    measureSync: (name: string, fn: () => any) => monitor.measureSync(name, fn),
    analyzeResources: () => monitor.analyzeResources(),
    getMemoryUsage: () => monitor.getMemoryUsage(),
  };
}

// Performance HOC
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    const monitor = PerformanceMonitor.getInstance();
    
    React.useEffect(() => {
      const start = performance.now();
      return () => {
        const end = performance.now();
        monitor.measureSync(`${componentName}_render`, () => end - start);
      };
    });

    return <Component {...props} />;
  };
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();