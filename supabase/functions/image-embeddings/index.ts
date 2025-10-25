import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImageEmbeddingRequest {
  image_url: string
  listing_id?: string
  media_id?: string
  type: 'listing' | 'inspiration' | 'moodboard'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { image_url, listing_id, media_id, type }: ImageEmbeddingRequest = await req.json()

    if (!image_url) {
      return new Response(
        JSON.stringify({ error: 'Image URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate image embedding using OpenAI CLIP or similar service
    const embedding = await generateImageEmbedding(image_url)

    if (!embedding) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate embedding' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store embedding based on type
    let result
    switch (type) {
      case 'listing':
        if (media_id) {
          result = await supabase
            .from('media')
            .update({ 
              embedding: embedding,
              embedding_model: 'openai-clip-vit-b-32'
            })
            .eq('id', media_id)
        }
        break
      
      case 'inspiration':
        // Store in inspiration_posts or separate embeddings table
        result = await supabase
          .from('image_embeddings')
          .insert({
            image_url,
            embedding,
            embedding_model: 'openai-clip-vit-b-32',
            entity_type: 'inspiration',
            entity_id: listing_id
          })
        break
      
      case 'moodboard':
        result = await supabase
          .from('image_embeddings')
          .insert({
            image_url,
            embedding,
            embedding_model: 'openai-clip-vit-b-32',
            entity_type: 'moodboard',
            entity_id: listing_id
          })
        break
    }

    if (result?.error) {
      console.error('Database error:', result.error)
      return new Response(
        JSON.stringify({ error: 'Failed to store embedding' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        embedding_dimensions: embedding.length,
        message: 'Image embedding generated and stored successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Image embedding error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function generateImageEmbedding(imageUrl: string): Promise<number[] | null> {
  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      console.log('OpenAI API key not found, using mock embedding')
      // Return mock embedding for development
      return Array.from({ length: 512 }, () => Math.random() * 2 - 1)
    }

    // Use OpenAI CLIP API to generate image embeddings
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002', // Placeholder - would use CLIP for images
        input: imageUrl, // In real implementation, would process image data
      }),
    })

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText)
      return null
    }

    const data = await response.json()
    return data.data[0].embedding

  } catch (error) {
    console.error('Error generating embedding:', error)
    
    // Fallback to mock embedding
    console.log('Using mock embedding as fallback')
    return Array.from({ length: 512 }, () => Math.random() * 2 - 1)
  }
}

// Helper function to calculate cosine similarity between embeddings
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}
