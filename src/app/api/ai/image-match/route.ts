import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const imageMatchSchema = z.object({
  image_url: z.string().url(),
  match_type: z.enum(['venue', 'decoration', 'style']).default('venue'),
  filters: z.object({
    city: z.string().optional(),
    budget_range: z.array(z.number()).optional(),
    venue_type: z.string().optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { image_url, match_type, filters } = imageMatchSchema.parse(body);

    // Mock image analysis (replace with actual AI vision service)
    const imageAnalysis = await analyzeImage(image_url);
    
    // Search for similar listings based on analysis
    let matchingListings = [];
    
    if (match_type === 'venue') {
      const { data: venues } = await supabase
        .from('listings')
        .select(`
          *,
          venues(*),
          media(url, type, caption)
        `)
        .eq('listing_type', 'venue')
        .eq('status', 'active')
        .eq('verified', true)
        .limit(10);
      
      // Filter based on image analysis and user filters
      matchingListings = filterVenuesByImageAnalysis(venues || [], imageAnalysis, filters);
    }

    // Calculate similarity scores
    const scoredMatches = matchingListings.map(listing => ({
      ...listing,
      similarity_score: calculateSimilarityScore(listing, imageAnalysis),
      match_reasons: generateMatchReasons(listing, imageAnalysis),
    })).sort((a, b) => b.similarity_score - a.similarity_score);

    // Log the search
    await supabase.from('events').insert({
      event_type: 'ai_image_match',
      event_data: {
        image_url,
        match_type,
        filters,
        analysis: imageAnalysis,
        results_count: scoredMatches.length,
      },
    });

    return NextResponse.json({
      matches: scoredMatches.slice(0, 6),
      analysis: imageAnalysis,
      total_matches: scoredMatches.length,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('Image match error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function analyzeImage(imageUrl: string) {
  // Mock image analysis - replace with actual AI vision service
  // This would typically use services like Google Vision, AWS Rekognition, or OpenAI Vision
  
  const mockAnalysis = {
    dominant_colors: ['#8B4513', '#F4A460', '#DEB887'], // Brown, Sandy Brown, Burlywood
    style_tags: ['rustic', 'outdoor', 'garden', 'natural'],
    venue_type: 'garden',
    lighting: 'natural',
    setting: 'outdoor',
    decorative_elements: ['fairy_lights', 'floral', 'wooden_elements'],
    ambiance: 'romantic',
    formality: 'semi_formal',
    capacity_estimate: 'medium', // small, medium, large
    architecture_style: 'contemporary',
    confidence_scores: {
      venue_type: 0.85,
      style: 0.78,
      setting: 0.92,
      ambiance: 0.73,
    }
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockAnalysis;
}

function filterVenuesByImageAnalysis(venues: any[], analysis: any, filters: any) {
  return venues.filter(venue => {
    // Apply user filters first
    if (filters?.city && !venue.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    
    if (filters?.budget_range && venue.base_price) {
      const [minBudget, maxBudget] = filters.budget_range;
      if (venue.base_price < minBudget || venue.base_price > maxBudget) {
        return false;
      }
    }
    
    if (filters?.venue_type && venue.venues?.venue_type !== filters.venue_type) {
      return false;
    }
    
    return true;
  });
}

function calculateSimilarityScore(listing: any, analysis: any): number {
  let score = 0;
  
  // Venue type matching
  if (listing.venues?.venue_type) {
    const venueType = listing.venues.venue_type.toLowerCase();
    if (analysis.venue_type && venueType.includes(analysis.venue_type)) {
      score += 30;
    }
  }
  
  // Style tags matching
  if (listing.venues?.amenities && analysis.style_tags) {
    const amenities = listing.venues.amenities.map((a: string) => a.toLowerCase());
    const matchingTags = analysis.style_tags.filter((tag: string) => 
      amenities.some((amenity: string) => amenity.includes(tag))
    );
    score += matchingTags.length * 10;
  }
  
  // Setting matching (indoor/outdoor)
  if (analysis.setting === 'outdoor') {
    const outdoorKeywords = ['garden', 'beach', 'outdoor', 'lawn', 'terrace'];
    const hasOutdoorFeatures = listing.venues?.amenities?.some((amenity: string) =>
      outdoorKeywords.some(keyword => amenity.toLowerCase().includes(keyword))
    );
    if (hasOutdoorFeatures) score += 20;
  }
  
  // Capacity matching
  if (analysis.capacity_estimate && listing.venues?.capacity_max) {
    const capacity = listing.venues.capacity_max;
    let capacityMatch = false;
    
    switch (analysis.capacity_estimate) {
      case 'small':
        capacityMatch = capacity <= 150;
        break;
      case 'medium':
        capacityMatch = capacity > 150 && capacity <= 400;
        break;
      case 'large':
        capacityMatch = capacity > 400;
        break;
    }
    
    if (capacityMatch) score += 15;
  }
  
  // Rating boost
  if (listing.rating >= 4.5) score += 10;
  if (listing.verified) score += 5;
  
  return Math.min(score, 100); // Cap at 100
}

function generateMatchReasons(listing: any, analysis: any): string[] {
  const reasons = [];
  
  if (listing.venues?.venue_type && analysis.venue_type) {
    const venueType = listing.venues.venue_type.toLowerCase();
    if (venueType.includes(analysis.venue_type)) {
      reasons.push(`Similar ${analysis.venue_type} venue type`);
    }
  }
  
  if (analysis.style_tags && listing.venues?.amenities) {
    const amenities = listing.venues.amenities.map((a: string) => a.toLowerCase());
    const matchingTags = analysis.style_tags.filter((tag: string) => 
      amenities.some((amenity: string) => amenity.includes(tag))
    );
    
    if (matchingTags.length > 0) {
      reasons.push(`Matching style: ${matchingTags.join(', ')}`);
    }
  }
  
  if (analysis.setting === 'outdoor') {
    const outdoorKeywords = ['garden', 'beach', 'outdoor', 'lawn', 'terrace'];
    const hasOutdoorFeatures = listing.venues?.amenities?.some((amenity: string) =>
      outdoorKeywords.some(keyword => amenity.toLowerCase().includes(keyword))
    );
    if (hasOutdoorFeatures) {
      reasons.push('Outdoor setting like your reference');
    }
  }
  
  if (listing.rating >= 4.5) {
    reasons.push('Highly rated venue');
  }
  
  if (listing.verified) {
    reasons.push('Verified by WedSpace');
  }
  
  return reasons.slice(0, 3); // Limit to top 3 reasons
}
