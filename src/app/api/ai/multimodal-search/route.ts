import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const search_type = formData.get('search_type') as string || 'venue';

    if (!image) {
      return NextResponse.json({ error: 'Image required' }, { status: 400 });
    }

    // In production: Call Google Vision API for image analysis
    // For now, simulate with keyword extraction
    const mockImageAnalysis = {
      colors: ['gold', 'white', 'red'],
      styles: ['traditional', 'elegant', 'luxurious'],
      objects: ['chandelier', 'stage', 'decoration'],
      setting: 'indoor',
      capacity: 'large'
    };

    // Build search query based on image analysis
    const keywords = [
      ...mockImageAnalysis.styles,
      ...mockImageAnalysis.colors,
      mockImageAnalysis.setting
    ].join(' ');

    const { data: listings, error } = await supabase
      .from('listings')
      .select('*')
      .eq('listing_type', search_type)
      .textSearch('description', keywords)
      .limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      results: listings,
      analysis: mockImageAnalysis,
      query: keywords
    });
  } catch (error) {
    console.error('Multimodal search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
