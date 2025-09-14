import { NextRequest, NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const regionCode = searchParams.get('regionCode') || 'ID';
    const period = searchParams.get('period') || '24h';
    const maxResults = parseInt(searchParams.get('maxResults') || '50');

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      );
    }

    // Step 1: Fetch video categories for mapping
    const categoriesUrl = new URL('https://www.googleapis.com/youtube/v3/videoCategories');
    categoriesUrl.searchParams.append('part', 'snippet');
    categoriesUrl.searchParams.append('regionCode', regionCode);
    categoriesUrl.searchParams.append('key', YOUTUBE_API_KEY);

    let categoryMapping: Record<string, string> = {};
    
    try {
      const categoriesResponse = await fetch(categoriesUrl.toString());
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.items) {
          categoriesData.items.forEach((category: { id: string; snippet: { title: string } }) => {
            categoryMapping[category.id] = category.snippet.title;
          });
        }
      }
    } catch (err) {
      console.warn('Failed to fetch categories, using defaults:', err);
      // Default categories
      categoryMapping = {
        '1': 'Film & Animation',
        '2': 'Autos & Vehicles', 
        '10': 'Music',
        '15': 'Pets & Animals',
        '17': 'Sports',
        '19': 'Travel & Events',
        '20': 'Gaming',
        '22': 'People & Blogs',
        '23': 'Comedy',
        '24': 'Entertainment',
        '25': 'News & Politics',
        '26': 'Howto & Style',
        '27': 'Education',
        '28': 'Science & Technology'
      };
    }

    // Step 2: Fetch trending videos
    const trendingUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    trendingUrl.searchParams.append('part', 'snippet,statistics,contentDetails');
    trendingUrl.searchParams.append('chart', 'mostPopular');
    trendingUrl.searchParams.append('regionCode', regionCode);
    trendingUrl.searchParams.append('maxResults', Math.min(maxResults, 50).toString());
    trendingUrl.searchParams.append('key', YOUTUBE_API_KEY);

    const trendingResponse = await fetch(trendingUrl.toString());
    
    if (!trendingResponse.ok) {
      const errorData = await trendingResponse.text();
      throw new Error(`YouTube API error: ${trendingResponse.status} - ${errorData}`);
    }

    const trendingData = await trendingResponse.json();
    const videos = trendingData.items || [];

    // Step 3: Process and analyze the data
    const analysis = processVideosData(videos, categoryMapping, period);

    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        regionCode,
        period,
        videosAnalyzed: videos.length,
        fetchedAt: new Date().toISOString(),
        fromCache: false,
      }
    });

  } catch (error) {
    console.error('Error in trending analysis:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to analyze trending data',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Define types for the YouTube API responses
interface VideoSnippet {
  title?: string;
  description?: string;
  categoryId?: string;
  publishedAt?: string;
  channelTitle?: string;
  thumbnails?: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
  };
}

interface VideoStatistics {
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
}

interface YouTubeVideo {
  id: string;
  snippet?: VideoSnippet;
  statistics?: VideoStatistics;
}

interface ProcessedVideo {
  id: string;
  title: string;
  viewCount: number;
  channelTitle: string;
}

// Process videos data into analysis
function processVideosData(videos: YouTubeVideo[], categoryMapping: Record<string, string>, period: string) {
  // Extract keywords from titles and descriptions
  const keywordFreq = new Map<string, {
    count: number;
    videos: ProcessedVideo[];
    totalViews: number;
    totalLikes: number;
  }>();

  // Extract hashtags
  const hashtagFreq = new Map<string, {
    count: number;
    videos: ProcessedVideo[];
    totalViews: number;
    totalLikes: number;
  }>();

  // Category analysis
  const categoryStats = new Map<string, {
    count: number;
    totalViews: number;
    totalEngagement: number;
    videos: ProcessedVideo[];
  }>();

  videos.forEach(video => {
    const title = video.snippet?.title || '';
    const description = video.snippet?.description || '';
    const viewCount = parseInt(video.statistics?.viewCount || '0');
    const likeCount = parseInt(video.statistics?.likeCount || '0');
    const categoryId = video.snippet?.categoryId || '';

    // Extract keywords from title (simple word extraction)
    const titleWords = extractKeywords(title);
    titleWords.forEach(keyword => {
      if (!keywordFreq.has(keyword)) {
        keywordFreq.set(keyword, { count: 0, videos: [], totalViews: 0, totalLikes: 0 });
      }
      const entry = keywordFreq.get(keyword)!;
      entry.count++;
      entry.videos.push({ 
        id: video.id, 
        title: title.substring(0, 60) + '...', 
        viewCount, 
        channelTitle: video.snippet?.channelTitle || ''
      });
      entry.totalViews += viewCount;
      entry.totalLikes += likeCount;
    });

    // Extract hashtags
    const hashtags = extractHashtags(title + ' ' + description);
    hashtags.forEach(hashtag => {
      if (!hashtagFreq.has(hashtag)) {
        hashtagFreq.set(hashtag, { count: 0, videos: [], totalViews: 0, totalLikes: 0 });
      }
      const entry = hashtagFreq.get(hashtag)!;
      entry.count++;
      entry.videos.push({ 
        id: video.id, 
        title: title.substring(0, 60) + '...', 
        viewCount, 
        channelTitle: video.snippet?.channelTitle || ''
      });
      entry.totalViews += viewCount;
      entry.totalLikes += likeCount;
    });

    // Category stats
    if (categoryId) {
      if (!categoryStats.has(categoryId)) {
        categoryStats.set(categoryId, { count: 0, totalViews: 0, totalEngagement: 0, videos: [] });
      }
      const catEntry = categoryStats.get(categoryId)!;
      catEntry.count++;
      catEntry.totalViews += viewCount;
      catEntry.totalEngagement += likeCount + parseInt(video.statistics?.commentCount || '0');
      catEntry.videos.push({
        id: video.id,
        title: title.substring(0, 60) + '...',
        viewCount,
        channelTitle: video.snippet?.channelTitle || ''
      });
    }
  });

  // Convert to arrays and sort
  const keywords = Array.from(keywordFreq.entries())
    .filter(([, data]) => data.count >= 2)
    .map(([keyword, data]) => ({
      keyword,
      frequency: data.count,
      videos: data.videos.slice(0, 3),
      avgViewCount: Math.round(data.totalViews / data.count),
      avgLikeCount: Math.round(data.totalLikes / data.count),
      totalEngagement: data.totalLikes,
      trendScore: calculateScore(data.count, data.totalViews, data.totalLikes)
    }))
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, 20);

  const hashtags = Array.from(hashtagFreq.entries())
    .filter(([, data]) => data.count >= 2)
    .map(([hashtag, data]) => ({
      hashtag,
      frequency: data.count,
      videos: data.videos.slice(0, 3),
      avgViewCount: Math.round(data.totalViews / data.count),
      avgLikeCount: Math.round(data.totalLikes / data.count),
      totalEngagement: data.totalLikes,
      trendScore: calculateScore(data.count, data.totalViews, data.totalLikes)
    }))
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, 15);

  const categories = Array.from(categoryStats.entries())
    .map(([categoryId, data]) => ({
      categoryId,
      categoryName: categoryMapping[categoryId] || `Category ${categoryId}`,
      videoCount: data.count,
      totalViews: data.totalViews,
      avgViews: Math.round(data.totalViews / data.count),
      totalEngagement: data.totalEngagement,
      percentage: (data.count / videos.length) * 100,
      topVideos: data.videos.sort((a, b) => b.viewCount - a.viewCount).slice(0, 3)
    }))
    .sort((a, b) => b.videoCount - a.videoCount);

  const totalViews = videos.reduce((sum, v) => sum + parseInt(v.statistics?.viewCount || '0'), 0);
  const totalEngagement = videos.reduce((sum, v) => sum + parseInt(v.statistics?.likeCount || '0') + parseInt(v.statistics?.commentCount || '0'), 0);

  return {
    period,
    keywords,
    hashtags,
    categories,
    totalVideos: videos.length,
    totalViews,
    avgEngagement: Math.round(totalEngagement / videos.length),
    generatedAt: new Date().toISOString(),
  };
}

// Extract keywords from text
function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => 
      word.length >= 3 && 
      word.length <= 20 &&
      !isStopWord(word)
    );

  return [...new Set(words)];
}

// Extract hashtags from text
function extractHashtags(text: string): string[] {
  if (!text) return [];
  
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  const hashtags = text.match(hashtagRegex) || [];
  
  return hashtags
    .map(tag => tag.toLowerCase())
    .filter(tag => tag.length > 2 && tag.length <= 30)
    .filter((tag, index, arr) => arr.indexOf(tag) === index);
}

// Calculate trend score
function calculateScore(frequency: number, totalViews: number, totalLikes: number): number {
  const freqScore = Math.min(frequency * 10, 40);
  const viewScore = Math.min(totalViews / 100000, 35);
  const engagementScore = Math.min(totalLikes / 1000, 25);
  
  return Math.round(freqScore + viewScore + engagementScore);
}

// Check if word is a stop word
function isStopWord(word: string): boolean {
  const stopWords = [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'her', 'its', 'our', 'their',
    'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'dengan', 'adalah', 'ada', 'akan', 'sudah',
    'bisa', 'tidak', 'juga', 'atau', 'tapi', 'ini', 'itu', 'saya', 'kamu', 'dia', 'kita', 'mereka',
    'video', 'youtube', 'subscribe', 'like', 'comment', 'share', 'watch', 'new', 'latest', 'full'
  ];
  return stopWords.includes(word.toLowerCase());
}