import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchRankingRequest {
  query: string
  listings: Array<{
    id: string
    title: string
    description: string
    tags: string[]
    rating: number
    review_count: number
    base_price: number
    city: string
    listing_type: string
  }>
  user_preferences?: {
    budget_range?: [number, number]
    preferred_cities?: string[]
    style_preferences?: string[]
    previous_searches?: string[]
  }
}

interface RankedListing {
  id: string
  relevance_score: number
  ranking_factors: {
    text_similarity: number
    rating_boost: number
    price_match: number
    location_preference: number
    popularity_boost: number
    ai_score: number
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { query, listings, user_preferences }: SearchRankingRequest = await req.json()

    if (!query || !listings || listings.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query and listings are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate AI-powered rankings
    const rankedListings = await rankListings(query, listings, user_preferences)

    // Log search analytics
    await supabase.from('events').insert({
      event_type: 'ai_search_ranking',
      metadata: {
        query,
        listings_count: listings.length,
        user_preferences,
        top_results: rankedListings.slice(0, 5).map(r => ({
          id: r.id,
          score: r.relevance_score
        }))
      }
    })

    return new Response(
      JSON.stringify({ 
        ranked_listings: rankedListings,
        query_processed: query,
        total_listings: listings.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI search ranking error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function rankListings(
  query: string, 
  listings: any[], 
  userPreferences?: any
): Promise<RankedListing[]> {
  const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 2)
  
  const rankedListings: RankedListing[] = listings.map(listing => {
    const factors = {
      text_similarity: calculateTextSimilarity(query, listing),
      rating_boost: calculateRatingBoost(listing.rating, listing.review_count),
      price_match: calculatePriceMatch(listing.base_price, userPreferences?.budget_range),
      location_preference: calculateLocationPreference(listing.city, userPreferences?.preferred_cities),
      popularity_boost: calculatePopularityBoost(listing.review_count, listing.rating),
      ai_score: 0 // Placeholder for future ML model
    }

    // Calculate weighted relevance score
    const relevance_score = 
      factors.text_similarity * 0.35 +
      factors.rating_boost * 0.25 +
      factors.price_match * 0.15 +
      factors.location_preference * 0.10 +
      factors.popularity_boost * 0.10 +
      factors.ai_score * 0.05

    return {
      id: listing.id,
      relevance_score: Math.round(relevance_score * 100) / 100,
      ranking_factors: factors
    }
  })

  // Sort by relevance score (descending)
  return rankedListings.sort((a, b) => b.relevance_score - a.relevance_score)
}

function calculateTextSimilarity(query: string, listing: any): number {
  const queryTerms = query.toLowerCase().split(' ')
  const searchableText = [
    listing.title,
    listing.description,
    ...(listing.tags || [])
  ].join(' ').toLowerCase()

  let matches = 0
  let totalTerms = queryTerms.length

  for (const term of queryTerms) {
    if (searchableText.includes(term)) {
      matches++
    }
  }

  // Boost exact phrase matches
  if (searchableText.includes(query.toLowerCase())) {
    matches += queryTerms.length * 0.5
  }

  return Math.min(matches / totalTerms, 1.0)
}

function calculateRatingBoost(rating: number, reviewCount: number): number {
  if (!rating || rating === 0) return 0
  
  // Normalize rating (0-5 scale to 0-1)
  const normalizedRating = rating / 5
  
  // Apply review count confidence factor
  const confidenceFactor = Math.min(reviewCount / 50, 1.0) // Max confidence at 50+ reviews
  
  return normalizedRating * confidenceFactor
}

function calculatePriceMatch(price: number, budgetRange?: [number, number]): number {
  if (!budgetRange || !price) return 0.5 // Neutral if no budget specified
  
  const [minBudget, maxBudget] = budgetRange
  
  if (price >= minBudget && price <= maxBudget) {
    return 1.0 // Perfect match
  }
  
  if (price < minBudget) {
    // Below budget - still good but slightly lower score
    return 0.8
  }
  
  if (price > maxBudget) {
    // Over budget - penalize based on how much over
    const overBudgetRatio = price / maxBudget
    return Math.max(0.1, 1 - (overBudgetRatio - 1) * 0.5)
  }
  
  return 0.5
}

function calculateLocationPreference(city: string, preferredCities?: string[]): number {
  if (!preferredCities || preferredCities.length === 0) return 0.5
  
  const cityLower = city.toLowerCase()
  const isPreferred = preferredCities.some(prefCity => 
    prefCity.toLowerCase() === cityLower
  )
  
  return isPreferred ? 1.0 : 0.3
}

function calculatePopularityBoost(reviewCount: number, rating: number): number {
  if (!reviewCount || reviewCount === 0) return 0
  
  // Logarithmic scaling for review count
  const reviewScore = Math.log(reviewCount + 1) / Math.log(100) // Normalize to 0-1
  
  // Combine with rating
  const ratingScore = (rating || 0) / 5
  
  return Math.min(reviewScore * ratingScore, 1.0)
}
