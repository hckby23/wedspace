// Advanced Performance Monitoring System

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 100;

  // Track Core Web Vitals
  trackWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
    
    // First Contentful Paint (FCP)
    this.observeFCP();
    
    // Time to First Byte (TTFB)
    this.observeTTFB();
  }

  private observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.recordMetric({
        name: 'LCP',
        value: lastEntry.startTime,
        timestamp: Date.now(),
        url: window.location.pathname
      });

      // Good: <2.5s, Needs Improvement: 2.5-4s, Poor: >4s
      if (lastEntry.startTime > 4000) {
        console.warn('Poor LCP detected:', lastEntry.startTime);
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  private observeFID() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.recordMetric({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          timestamp: Date.now(),
          url: window.location.pathname
        });
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
  }

  private observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          
          this.recordMetric({
            name: 'CLS',
            value: clsValue,
            timestamp: Date.now(),
            url: window.location.pathname
          });
        }
      });
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }

  private observeFCP() {
    if (!window.performance || !window.performance.getEntriesByName) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          this.recordMetric({
            name: 'FCP',
            value: fcpEntry.startTime,
            timestamp: Date.now(),
            url: window.location.pathname
          });
        }
      }, 0);
    });
  }

  private observeTTFB() {
    if (!window.performance || !window.performance.timing) return;

    window.addEventListener('load', () => {
      const { responseStart, requestStart } = performance.timing;
      const ttfb = responseStart - requestStart;

      this.recordMetric({
        name: 'TTFB',
        value: ttfb,
        timestamp: Date.now(),
        url: window.location.pathname
      });
    });
  }

  private recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Send to analytics
    this.sendToAnalytics(metric);
  }

  private sendToAnalytics(metric: PerformanceMetric) {
    // Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.value),
        event_label: metric.url,
        non_interaction: true,
      });
    }

    // Send to custom analytics endpoint
    if (metric.value > this.getThreshold(metric.name)) {
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      }).catch(() => {}); // Silent fail
    }
  }

  private getThreshold(metricName: string): number {
    const thresholds: Record<string, number> = {
      LCP: 4000,    // 4s
      FID: 300,     // 300ms
      CLS: 0.25,    // 0.25
      FCP: 3000,    // 3s
      TTFB: 800,    // 800ms
    };
    return thresholds[metricName] || Infinity;
  }

  // Track custom metrics
  trackPageLoad() {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      
      this.recordMetric({
        name: 'PageLoad',
        value: loadTime,
        timestamp: Date.now(),
        url: window.location.pathname
      });
    });
  }

  // Track API performance
  trackAPICall(endpoint: string, duration: number, success: boolean) {
    this.recordMetric({
      name: success ? 'API_Success' : 'API_Failure',
      value: duration,
      timestamp: Date.now(),
      url: endpoint
    });
  }

  // Get performance summary
  getSummary() {
    const summary: Record<string, { avg: number; max: number; count: number }> = {};

    this.metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = { avg: 0, max: 0, count: 0 };
      }
      
      const s = summary[metric.name];
      s.count++;
      s.avg = (s.avg * (s.count - 1) + metric.value) / s.count;
      s.max = Math.max(s.max, metric.value);
    });

    return summary;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-initialize
if (typeof window !== 'undefined') {
  performanceMonitor.trackWebVitals();
  performanceMonitor.trackPageLoad();
}
