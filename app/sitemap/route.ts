import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Revalidate every 24 hours

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL || 'https://server.pariksahub.com';
    const sitemapUrl = `${backendUrl}/sitemap.xml`;
    
    const response = await fetch(sitemapUrl, {
      headers: {
        'Accept': 'application/xml, text/xml',
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
    }

    const sitemap = await response.text();

    // Return with proper XML headers to prevent browser from treating it as HTML
    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'X-Content-Type-Options': 'nosniff', // Prevent MIME type sniffing
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching sitemap:', error);
    return new NextResponse('Error generating sitemap', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

