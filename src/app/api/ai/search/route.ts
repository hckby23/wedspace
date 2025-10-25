import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json().catch(() => ({}));
    const query: string = (body?.query || '').toString();
    const type: 'venues' | 'vendors' | 'all' = body?.type || 'all';

    // Basic heuristics for insights
    const qLower = query.toLowerCase();
    const insights: string[] = [];
    if (qLower.includes('luxury') || qLower.includes('palace')) insights.push('Prioritizing premium listings');
    if (qLower.includes('budget') || qLower.includes('affordable')) insights.push('Focusing on budget-friendly options');
    const cityMatch = qLower.match(/(delhi|mumbai|jaipur|pune|bangalore|hyderabad|chennai)/i);
    if (cityMatch) insights.push(`Location preference detected: ${cityMatch[0]}`);
    if (!insights.length) insights.push('Using general relevance for results');

    // Build Supabase query (best effort; falls back gracefully)
    let sbQuery = supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .limit(24);

    if (type === 'venues') sbQuery = sbQuery.eq('listing_type', 'venue');
    if (type === 'vendors') sbQuery = sbQuery.eq('listing_type', 'vendor');

    if (query && query.trim()) {
      const pattern = `%${query}%`;
      sbQuery = sbQuery.or(
        `title.ilike.${pattern},description.ilike.${pattern},city.ilike.${pattern},category.ilike.${pattern}`
      );
    }

    const { data, error } = await sbQuery;
    if (error) {
      // Soft fail: return empty results with insights (client falls back to featured data)
      return NextResponse.json({ results: [], insights }, { status: 200 });
    }

    // Map minimal fields if needed; pass through for now
    return NextResponse.json({ results: data || [], insights }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ results: [], insights: ["Temporary issue fetching AI search results"] }, { status: 200 });
  }
}
