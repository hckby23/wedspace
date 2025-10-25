import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const uploadSchema = z.object({
  bucket: z.enum(['public-media', 'protected-media', 'reels']),
  filename: z.string(),
  content_type: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bucket, filename, content_type } = uploadSchema.parse(body);

    // Generate unique filename with user ID prefix
    const uniqueFilename = `${user.id}/${Date.now()}-${filename}`;

    // Create signed URL for upload
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(uniqueFilename, {
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      upload_url: data.signedUrl,
      file_path: uniqueFilename,
      public_url: supabase.storage.from(bucket).getPublicUrl(uniqueFilename).data.publicUrl,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
