import { NextRequest, NextResponse } from 'next/server';
import { getKeywordInsights } from '@/lib/keywords';

export async function POST(request: NextRequest) {
  try {
    const { channelId, maxResults = 50 } = await request.json();

    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID diperlukan' },
        { status: 400 }
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'YouTube API key tidak dikonfigurasi' },
        { status: 500 }
      );
    }

    // Ambil data channel untuk mendapatkan uploads playlist
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );

    if (!channelResponse.ok) {
      throw new Error('Gagal mengambil data channel');
    }

    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json(
        { error: 'Channel tidak ditemukan' },
        { status: 404 }
      );
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Ambil daftar video dari uploads playlist
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`
    );

    if (!playlistResponse.ok) {
      throw new Error('Gagal mengambil daftar video');
    }

    const playlistData = await playlistResponse.json();
    
    if (!playlistData.items || playlistData.items.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada video ditemukan' },
        { status: 404 }
      );
    }

    // Ambil video IDs
    const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');

    // Ambil detail video dengan snippet dan statistics
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`
    );

    if (!videosResponse.ok) {
      throw new Error('Gagal mengambil detail video');
    }

    const videosData = await videosResponse.json();

    if (!videosData.items || videosData.items.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada detail video ditemukan' },
        { status: 404 }
      );
    }

    // Analisis keyword insights
    const insights = getKeywordInsights(videosData.items);

    // Tambahkan metadata
    const response = {
      ...insights,
      metadata: {
        channelId,
        totalVideosAnalyzed: videosData.items.length,
        analyzedAt: new Date().toISOString(),
        timeRange: 'latest_videos'
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error analyzing keywords:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menganalisis kata kunci'
      },
      { status: 500 }
    );
  }
}

// GET method untuk mendapatkan contoh analisis atau cache
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const demo = searchParams.get('demo');

  if (demo === 'true') {
    // Return demo data untuk preview
    const demoData = {
      topKeywords: [
        {
          keyword: 'tutorial',
          frequency: 15,
          avgViews: 25000,
          avgLikes: 1200,
          avgComments: 150,
          performance: 'high' as const,
          videos: [
            { id: 'demo1', title: 'Tutorial Complete Guide', views: 30000, likes: 1500, comments: 200 },
            { id: 'demo2', title: 'Advanced Tutorial Tips', views: 20000, likes: 900, comments: 100 }
          ]
        },
        {
          keyword: 'tips',
          frequency: 12,
          avgViews: 18000,
          avgLikes: 800,
          avgComments: 90,
          performance: 'medium' as const,
          videos: [
            { id: 'demo3', title: 'Pro Tips & Tricks', views: 22000, likes: 1000, comments: 120 },
            { id: 'demo4', title: 'Essential Tips', views: 14000, likes: 600, comments: 60 }
          ]
        }
      ],
      trendingHashtags: [
        {
          hashtag: '#tutorial',
          frequency: 20,
          avgViews: 28000,
          performance: 'high' as const,
          trending: true,
          videos: [
            { id: 'demo5', title: 'Complete #tutorial Guide', views: 35000 },
            { id: 'demo6', title: 'Quick #tutorial Tips', views: 21000 }
          ]
        },
        {
          hashtag: '#tips',
          frequency: 15,
          avgViews: 19000,
          performance: 'medium' as const,
          trending: true,
          videos: [
            { id: 'demo7', title: 'Pro #tips for Beginners', views: 24000 },
            { id: 'demo8', title: 'Advanced #tips', views: 14000 }
          ]
        }
      ],
      recommendations: {
        suggestedKeywords: ['tutorial', 'guide', 'tips', 'complete', 'advanced'],
        suggestedHashtags: ['#tutorial', '#tips', '#guide', '#howto', '#learn'],
        insights: [
          'Kata kunci "tutorial" menunjukkan performa terbaik dengan rata-rata 25,000 views per video.',
          'Hashtag #tutorial, #tips sedang trending di channel Anda.',
          'Anda konsisten menggunakan kata kunci "tutorial" yang muncul 15 kali.',
          'Kata kunci "guide" memiliki performa tinggi tapi jarang digunakan. Pertimbangkan untuk menggunakannya lebih sering.'
        ]
      },
      stats: {
        totalKeywords: 145,
        totalHashtags: 23,
        avgKeywordsPerVideo: 8.5,
        avgHashtagsPerVideo: 2.3
      },
      metadata: {
        channelId: 'demo',
        totalVideosAnalyzed: 50,
        analyzedAt: new Date().toISOString(),
        timeRange: 'latest_videos'
      }
    };

    return NextResponse.json(demoData);
  }

  return NextResponse.json(
    { error: 'Method not allowed. Use POST to analyze keywords.' },
    { status: 405 }
  );
}