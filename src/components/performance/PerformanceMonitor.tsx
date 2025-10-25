"use client";

import { useEffect, useState } from 'react';
import { trackEvent, WeddingAnalytics } from '@/lib/analytics';

interface PerformanceMetrics {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
}

interface PerformanceMonitorProps {
  pageName: string;
  reportThreshold?: number; // Only report if metrics exceed this threshold
  enableConsoleLogging?: boolean;
}

export function PerformanceMonitor({ 
  pageName, 
  reportThreshold = 2500,
  enableConsoleLogging = false 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let reportSent = false;

    // Function to send metrics to analytics
    const reportMetrics = (metric: Partial<PerformanceMetrics>) => {
      if (reportSent) return;

      const updatedMetrics = { ...metrics, ...metric };
      setMetrics(updatedMetrics);

      // Log to console if enabled
      if (enableConsoleLogging) {
        console.log(`Performance metrics for ${pageName}:`, updatedMetrics);
      }

      // Report to analytics if any metric exceeds threshold
      const hasSlowMetrics = Object.values(updatedMetrics).some(
        value => value !== null && value > reportThreshold
      );

      if (hasSlowMetrics) {
        WeddingAnalytics.trackError('slow_performance', `Page load exceeded ${reportThreshold}ms`, pageName);
      }

      // Track individual metrics
      Object.entries(updatedMetrics).forEach(([key, value]) => {
        if (value !== null) {
          trackEvent('performance_metric', 'performance', `${pageName}_${key}`, Math.round(value));
        }
      });

      reportSent = true;
    };

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
          reportMetrics({ lcp: lastEntry.startTime });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            reportMetrics({ fid: entry.processingStart - entry.startTime });
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          reportMetrics({ cls: clsValue });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // First Contentful Paint
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              reportMetrics({ fcp: entry.startTime });
            }
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });

        // Cleanup observers
        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
          fcpObserver.disconnect();
        };
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }

    // Navigation Timing API for TTFB
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        reportMetrics({ ttfb });
      }
    });

    // Fallback: Track basic load time
    const startTime = performance.now();
    window.addEventListener('load', () => {
      const loadTime = performance.now() - startTime;
      WeddingAnalytics.trackPageLoadTime(pageName, loadTime);
    });

  }, [pageName, reportThreshold, enableConsoleLogging, metrics]);

  // Don't render anything - this is just for monitoring
  return null;
}

// Hook for performance monitoring
export function usePerformanceMonitor(pageName: string) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startTime = performance.now();
    let metricsCollected = 0;
    const totalMetrics = 5;

    const updateMetric = (key: keyof PerformanceMetrics, value: number) => {
      setMetrics(prev => {
        const updated = { ...prev, [key]: value };
        metricsCollected++;
        
        if (metricsCollected >= totalMetrics) {
          setIsLoading(false);
        }
        
        return updated;
      });
    };

    // Collect all performance metrics
    if ('PerformanceObserver' in window) {
      const observers: PerformanceObserver[] = [];

      try {
        // LCP Observer
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          updateMetric('lcp', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        observers.push(lcpObserver);

        // FID Observer
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            updateMetric('fid', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        observers.push(fidObserver);

        // CLS Observer
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          updateMetric('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        observers.push(clsObserver);

        // FCP Observer
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              updateMetric('fcp', entry.startTime);
            }
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        observers.push(fcpObserver);

        // Cleanup
        return () => {
          observers.forEach(observer => observer.disconnect());
        };
      } catch (error) {
        console.warn('Performance Observer setup failed:', error);
        setIsLoading(false);
      }
    }

    // TTFB from Navigation Timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        updateMetric('ttfb', ttfb);
      }
    });

  }, [pageName]);

  return { metrics, isLoading };
}

// Performance score calculator
export function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  const weights = {
    lcp: 0.25,
    fid: 0.25,
    cls: 0.25,
    fcp: 0.15,
    ttfb: 0.10
  };

  const thresholds = {
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 },
    fcp: { good: 1800, poor: 3000 },
    ttfb: { good: 800, poor: 1800 }
  };

  let totalScore = 0;
  let totalWeight = 0;

  Object.entries(metrics).forEach(([key, value]) => {
    if (value === null) return;

    const metricKey = key as keyof PerformanceMetrics;
    const threshold = thresholds[metricKey];
    const weight = weights[metricKey];

    let score: number;
    if (value <= threshold.good) {
      score = 100;
    } else if (value <= threshold.poor) {
      score = 50 + (50 * (threshold.poor - value) / (threshold.poor - threshold.good));
    } else {
      score = Math.max(0, 50 - (value - threshold.poor) / threshold.poor * 50);
    }

    totalScore += score * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

// Performance badge component
export function PerformanceBadge({ score }: { score: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white">
      <div className={`w-2 h-2 rounded-full mr-2 ${getScoreColor(score)}`} />
      Performance: {score}/100 ({getScoreLabel(score)})
    </div>
  );
}
