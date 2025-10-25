import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();
    const supabase = createServerClient();

    // Store performance metrics
    await supabase.from('performance_metrics').insert({
      metric_name: metric.name,
      metric_value: metric.value,
      url: metric.url,
      user_agent: request.headers.get('user-agent'),
      recorded_at: new Date(metric.timestamp).toISOString()
    });

    // Check for performance issues
    const thresholds: Record<string, number> = {
      LCP: 4000,
      FID: 300,
      CLS: 0.25,
      FCP: 3000,
      TTFB: 800,
      PageLoad: 5000
    };

    if (metric.value > thresholds[metric.name]) {
      // Log performance issue
      console.warn(`Performance issue: ${metric.name} = ${metric.value}ms on ${metric.url}`);
      
      // Could trigger alert/notification here
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record metric' }, { status: 500 });
  }
}
