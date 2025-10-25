import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if OpenRouter API key is configured
    const hasApiKey = !!process.env.OPENROUTER_API_KEY;
    
    if (!hasApiKey) {
      return NextResponse.json(
        { status: 'degraded', message: 'AI service not configured' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'AI service check failed' },
      { status: 503 }
    );
  }
}
