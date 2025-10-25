import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const aiSortSchema = z.object({
  listings: z.array(z.object({
    id: z.string(),
    title: z.string(),
    rating: z.number(),
    base_price: z.number().optional(),
    review_count: z.number(),
    verified: z.boolean(),
    city: z.string(),
    listing_type: z.string(),
  })),
  user_context: z.object({
    budget: z.number().optional(),
    guest_count: z.number().optional(),
    location: z.string().optional(),
    preferences: z.array(z.string()).optional(),
    event_date: z.string().optional(),
  }).optional(),
  sort_type: z.enum([
    'recommended',
    'best_match',
    'value_for_money',
    'popularity',
    'location_proximity',
    'budget_optimized'
  ]).default('recommended'),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { listings, user_context, sort_type } = aiSortSchema.parse(body);

    // Apply AI-based sorting algorithm
    const sortedListings = await applySortingAlgorithm(listings, user_context, sort_type);

    // Log the AI sort usage
    await supabase.from('events').insert({
      event_type: 'ai_sort_used',
      event_data: {
        sort_type,
        listings_count: listings.length,
        user_context,
      },
    });

    return NextResponse.json({
      sorted_listings: sortedListings,
      sort_explanation: generateSortExplanation(sort_type, user_context),
      algorithm_version: '1.0',
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('AI Sort error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function applySortingAlgorithm(
  listings: any[], 
  userContext: any, 
  sortType: string
): Promise<any[]> {
  
  const scoredListings = listings.map(listing => {
    let score = 0;
    const factors: string[] = [];

    switch (sortType) {
      case 'recommended':
        score = calculateRecommendedScore(listing, userContext, factors);
        break;
      case 'best_match':
        score = calculateBestMatchScore(listing, userContext, factors);
        break;
      case 'value_for_money':
        score = calculateValueScore(listing, userContext, factors);
        break;
      case 'popularity':
        score = calculatePopularityScore(listing, factors);
        break;
      case 'location_proximity':
        score = calculateLocationScore(listing, userContext, factors);
        break;
      case 'budget_optimized':
        score = calculateBudgetScore(listing, userContext, factors);
        break;
      default:
        score = calculateRecommendedScore(listing, userContext, factors);
    }

    return {
      ...listing,
      ai_score: score,
      score_factors: factors,
    };
  });

  return scoredListings.sort((a, b) => b.ai_score - a.ai_score);
}

function calculateRecommendedScore(listing: any, context: any, factors: string[]): number {
  let score = 0;

  // Base quality score (40% weight)
  const qualityScore = (listing.rating * 20) + (listing.verified ? 10 : 0);
  score += qualityScore * 0.4;
  if (listing.rating >= 4.5) factors.push('High rating');
  if (listing.verified) factors.push('Verified listing');

  // Budget alignment (25% weight)
  if (context?.budget && listing.base_price) {
    const budgetRatio = listing.base_price / context.budget;
    if (budgetRatio <= 0.8) {
      score += 25 * 0.25;
      factors.push('Within budget');
    } else if (budgetRatio <= 1.0) {
      score += 15 * 0.25;
      factors.push('Near budget limit');
    }
  }

  // Popularity (20% weight)
  const popularityScore = Math.min(listing.review_count / 10, 20);
  score += popularityScore * 0.2;
  if (listing.review_count > 50) factors.push('Popular choice');

  // Location preference (15% weight)
  if (context?.location && listing.city) {
    if (listing.city.toLowerCase().includes(context.location.toLowerCase())) {
      score += 15 * 0.15;
      factors.push('Preferred location');
    }
  }

  return Math.round(score);
}

function calculateBestMatchScore(listing: any, context: any, factors: string[]): number {
  let score = 0;

  // Perfect budget match (35% weight)
  if (context?.budget && listing.base_price) {
    const budgetRatio = listing.base_price / context.budget;
    if (budgetRatio >= 0.7 && budgetRatio <= 0.9) {
      score += 35;
      factors.push('Perfect budget match');
    } else if (budgetRatio <= 1.0) {
      score += 25;
      factors.push('Good budget fit');
    }
  }

  // Location exact match (30% weight)
  if (context?.location && listing.city) {
    if (listing.city.toLowerCase() === context.location.toLowerCase()) {
      score += 30;
      factors.push('Exact location match');
    } else if (listing.city.toLowerCase().includes(context.location.toLowerCase())) {
      score += 20;
      factors.push('Location area match');
    }
  }

  // Quality and reliability (35% weight)
  score += (listing.rating * 7) + (listing.verified ? 10 : 0);
  if (listing.rating >= 4.7) factors.push('Excellent rating');
  if (listing.verified) factors.push('Verified');

  return Math.round(score);
}

function calculateValueScore(listing: any, context: any, factors: string[]): number {
  let score = 0;

  // Price efficiency (50% weight)
  if (listing.base_price && listing.rating) {
    const valueRatio = listing.rating / (listing.base_price / 10000);
    score += Math.min(valueRatio * 10, 50);
    if (valueRatio > 0.5) factors.push('Great value for money');
  }

  // Review quality vs price (30% weight)
  if (listing.review_count > 20 && listing.rating >= 4.0) {
    score += 30;
    factors.push('Well-reviewed at good price');
  }

  // Budget optimization (20% weight)
  if (context?.budget && listing.base_price) {
    const budgetUtilization = listing.base_price / context.budget;
    if (budgetUtilization <= 0.7) {
      score += 20;
      factors.push('Leaves room in budget');
    }
  }

  return Math.round(score);
}

function calculatePopularityScore(listing: any, factors: string[]): number {
  let score = 0;

  // Review count (40% weight)
  score += Math.min(listing.review_count / 2, 40);
  if (listing.review_count > 100) factors.push('Very popular');
  else if (listing.review_count > 50) factors.push('Popular');

  // Rating popularity (35% weight)
  score += listing.rating * 7;
  if (listing.rating >= 4.5) factors.push('Highly rated');

  // Verified boost (25% weight)
  if (listing.verified) {
    score += 25;
    factors.push('Verified popular choice');
  }

  return Math.round(score);
}

function calculateLocationScore(listing: any, context: any, factors: string[]): number {
  let score = 50; // Base score

  if (context?.location && listing.city) {
    const userLocation = context.location.toLowerCase();
    const listingCity = listing.city.toLowerCase();

    if (listingCity === userLocation) {
      score += 50;
      factors.push('Same city');
    } else if (listingCity.includes(userLocation) || userLocation.includes(listingCity)) {
      score += 30;
      factors.push('Nearby area');
    } else {
      // Check for metro area proximity (mock implementation)
      const metroAreas = {
        'delhi': ['gurgaon', 'noida', 'faridabad', 'ghaziabad'],
        'mumbai': ['navi mumbai', 'thane', 'pune'],
        'bangalore': ['whitefield', 'electronic city', 'koramangala'],
      };

      for (const [metro, areas] of Object.entries(metroAreas)) {
        if ((userLocation.includes(metro) && areas.some(area => listingCity.includes(area))) ||
            (listingCity.includes(metro) && areas.some(area => userLocation.includes(area)))) {
          score += 20;
          factors.push('Metro area');
          break;
        }
      }
    }
  }

  // Quality bonus
  score += listing.rating * 5;
  if (listing.rating >= 4.5) factors.push('Quality location option');

  return Math.round(score);
}

function calculateBudgetScore(listing: any, context: any, factors: string[]): number {
  let score = 0;

  if (context?.budget && listing.base_price) {
    const budgetRatio = listing.base_price / context.budget;
    
    if (budgetRatio <= 0.6) {
      score += 50;
      factors.push('Well under budget');
    } else if (budgetRatio <= 0.8) {
      score += 40;
      factors.push('Comfortably in budget');
    } else if (budgetRatio <= 1.0) {
      score += 25;
      factors.push('Within budget');
    } else {
      score += 5;
      factors.push('Over budget');
    }

    // Value consideration
    if (listing.rating >= 4.5 && budgetRatio <= 0.9) {
      score += 20;
      factors.push('High quality in budget');
    }
  } else {
    // No budget context, use rating
    score += listing.rating * 10;
  }

  // Verified bonus
  if (listing.verified) {
    score += 10;
    factors.push('Verified option');
  }

  return Math.round(score);
}

function generateSortExplanation(sortType: string, context: any): string {
  const explanations = {
    recommended: `Balanced ranking considering quality, budget fit, and popularity${context?.budget ? ` for your ₹${context.budget.toLocaleString()} budget` : ''}`,
    best_match: `Optimized for your specific requirements${context?.location ? ` in ${context.location}` : ''}${context?.budget ? ` within ₹${context.budget.toLocaleString()}` : ''}`,
    value_for_money: 'Prioritizing best value - high quality at competitive prices',
    popularity: 'Most popular choices based on reviews and bookings',
    location_proximity: `Sorted by distance${context?.location ? ` from ${context.location}` : ' from your preferred area'}`,
    budget_optimized: `Optimized for your budget${context?.budget ? ` of ₹${context.budget.toLocaleString()}` : ''} while maintaining quality`,
  };

  return explanations[sortType as keyof typeof explanations] || explanations.recommended;
}
