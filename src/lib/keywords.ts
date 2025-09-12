export interface KeywordData {
  keyword: string;
  frequency: number;
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  performance: 'high' | 'medium' | 'low';
  videos: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
  }>;
}

export interface HashtagData {
  hashtag: string;
  frequency: number;
  avgViews: number;
  performance: 'high' | 'medium' | 'low';
  trending: boolean;
  videos: Array<{
    id: string;
    title: string;
    views: number;
  }>;
}

export interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    tags?: string[];
  };
  statistics: {
    viewCount: string;
    likeCount?: string;
    commentCount?: string;
  };
}

export interface KeywordInsights {
  topKeywords: KeywordData[];
  trendingHashtags: HashtagData[];
  recommendations: {
    suggestedKeywords: string[];
    suggestedHashtags: string[];
    insights: string[];
  };
  stats: {
    totalKeywords: number;
    totalHashtags: number;
    avgKeywordsPerVideo: number;
    avgHashtagsPerVideo: number;
  };
  metadata?: {
    channelId: string;
    totalVideosAnalyzed: number;
    analyzedAt: string;
    timeRange: string;
  };
}

// Stop words yang akan diabaikan dalam analisis
const STOP_WORDS = new Set([
  'dan', 'atau', 'yang', 'ini', 'itu', 'di', 'ke', 'dari', 'untuk', 'dengan', 'pada', 'adalah', 'akan', 'telah', 'dapat', 'sudah', 'juga', 'tidak', 'ada', 'jika', 'saya', 'kamu', 'dia', 'kita', 'mereka', 'apa', 'siapa', 'kapan', 'dimana', 'mengapa', 'bagaimana',
  'the', 'and', 'or', 'that', 'this', 'in', 'to', 'from', 'for', 'with', 'on', 'is', 'are', 'was', 'were', 'will', 'have', 'has', 'had', 'can', 'could', 'should', 'would', 'may', 'might', 'must', 'shall', 'do', 'does', 'did', 'not', 'no', 'yes', 'if', 'when', 'where', 'why', 'how', 'what', 'who', 'which', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
]);

// Ekstrak kata kunci dari teks
export function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  // Bersihkan teks dan pisahkan kata
  const words = text
    .toLowerCase()
    .replace(/[^\w\s#]/g, ' ') // Hapus punctuation kecuali #
    .split(/\s+/)
    .filter(word => word.length > 2) // Minimal 3 karakter
    .filter(word => !STOP_WORDS.has(word))
    .filter(word => !/^\d+$/.test(word)); // Hapus angka murni
  
  return words;
}

// Ekstrak hashtag dari teks
export function extractHashtags(text: string): string[] {
  if (!text) return [];
  
  const hashtags = text.match(/#[\w]+/g) || [];
  return hashtags.map(tag => tag.toLowerCase());
}

// Analisis kata kunci dari array video
export function analyzeKeywords(videos: YouTubeVideo[]): KeywordData[] {
  const keywordMap = new Map<string, {
    frequency: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    videos: Array<{
      id: string;
      title: string;
      views: number;
      likes: number;
      comments: number;
    }>;
  }>();

  // Ekstrak kata kunci dari setiap video
  videos.forEach(video => {
    const title = video.snippet?.title || '';
    const description = video.snippet?.description || '';
    const views = parseInt(video.statistics?.viewCount || '0');
    const likes = parseInt(video.statistics?.likeCount || '0');
    const comments = parseInt(video.statistics?.commentCount || '0');

    const keywords = [
      ...extractKeywords(title),
      ...extractKeywords(description)
    ];

    keywords.forEach(keyword => {
      if (!keywordMap.has(keyword)) {
        keywordMap.set(keyword, {
          frequency: 0,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          videos: []
        });
      }

      const data = keywordMap.get(keyword)!;
      data.frequency++;
      data.totalViews += views;
      data.totalLikes += likes;
      data.totalComments += comments;
      data.videos.push({
        id: video.id,
        title: title,
        views: views,
        likes: likes,
        comments: comments
      });
    });
  });

  // Convert ke array dan hitung rata-rata
  const keywordData: KeywordData[] = Array.from(keywordMap.entries()).map(([keyword, data]) => {
    const avgViews = data.totalViews / data.frequency;
    const avgLikes = data.totalLikes / data.frequency;
    const avgComments = data.totalComments / data.frequency;

    // Tentukan performance berdasarkan rata-rata views
    const overallAvgViews = videos.reduce((sum, v) => sum + parseInt(v.statistics?.viewCount || '0'), 0) / videos.length;
    let performance: 'high' | 'medium' | 'low' = 'low';
    
    if (avgViews > overallAvgViews * 1.5) {
      performance = 'high';
    } else if (avgViews > overallAvgViews * 0.8) {
      performance = 'medium';
    }

    return {
      keyword,
      frequency: data.frequency,
      avgViews,
      avgLikes,
      avgComments,
      performance,
      videos: data.videos.slice(0, 5) // Ambil 5 video teratas
    };
  });

  // Sort berdasarkan kombinasi frequency dan performance
  return keywordData
    .filter(kw => kw.frequency >= 2) // Minimal muncul 2 kali
    .sort((a, b) => {
      const scoreA = a.frequency * (a.performance === 'high' ? 3 : a.performance === 'medium' ? 2 : 1);
      const scoreB = b.frequency * (b.performance === 'high' ? 3 : b.performance === 'medium' ? 2 : 1);
      return scoreB - scoreA;
    })
    .slice(0, 20); // Top 20 keywords
}

// Analisis hashtag dari array video
export function analyzeHashtags(videos: YouTubeVideo[]): HashtagData[] {
  const hashtagMap = new Map<string, {
    frequency: number;
    totalViews: number;
    videos: Array<{
      id: string;
      title: string;
      views: number;
    }>;
  }>();

  videos.forEach(video => {
    const title = video.snippet?.title || '';
    const description = video.snippet?.description || '';
    const views = parseInt(video.statistics?.viewCount || '0');

    const hashtags = [
      ...extractHashtags(title),
      ...extractHashtags(description)
    ];

    hashtags.forEach(hashtag => {
      if (!hashtagMap.has(hashtag)) {
        hashtagMap.set(hashtag, {
          frequency: 0,
          totalViews: 0,
          videos: []
        });
      }

      const data = hashtagMap.get(hashtag)!;
      data.frequency++;
      data.totalViews += views;
      data.videos.push({
        id: video.id,
        title: title,
        views: views
      });
    });
  });

  const overallAvgViews = videos.reduce((sum, v) => sum + parseInt(v.statistics?.viewCount || '0'), 0) / videos.length;

  const hashtagData: HashtagData[] = Array.from(hashtagMap.entries()).map(([hashtag, data]) => {
    const avgViews = data.totalViews / data.frequency;
    
    let performance: 'high' | 'medium' | 'low' = 'low';
    if (avgViews > overallAvgViews * 1.5) {
      performance = 'high';
    } else if (avgViews > overallAvgViews * 0.8) {
      performance = 'medium';
    }

    // Tentukan trending berdasarkan frequency dan recent usage
    const trending = data.frequency >= 3 && performance !== 'low';

    return {
      hashtag,
      frequency: data.frequency,
      avgViews,
      performance,
      trending,
      videos: data.videos.slice(0, 3)
    };
  });

  return hashtagData
    .filter(ht => ht.frequency >= 2)
    .sort((a, b) => {
      const scoreA = a.frequency * (a.performance === 'high' ? 3 : a.performance === 'medium' ? 2 : 1);
      const scoreB = b.frequency * (b.performance === 'high' ? 3 : b.performance === 'medium' ? 2 : 1);
      return scoreB - scoreA;
    })
    .slice(0, 15); // Top 15 hashtags
}

// Generate rekomendasi berdasarkan analisis
export function generateRecommendations(keywords: KeywordData[], hashtags: HashtagData[]): {
  suggestedKeywords: string[];
  suggestedHashtags: string[];
  insights: string[];
} {
  const highPerformanceKeywords = keywords.filter(k => k.performance === 'high');
  const highPerformanceHashtags = hashtags.filter(h => h.performance === 'high');
  const trendingHashtags = hashtags.filter(h => h.trending);

  const insights: string[] = [];

  // Insight tentang keyword performance
  if (highPerformanceKeywords.length > 0) {
    insights.push(`Kata kunci "${highPerformanceKeywords[0].keyword}" menunjukkan performa terbaik dengan rata-rata ${Math.round(highPerformanceKeywords[0].avgViews).toLocaleString()} views per video.`);
  }

  // Insight tentang hashtag trending
  if (trendingHashtags.length > 0) {
    insights.push(`Hashtag ${trendingHashtags.slice(0, 3).map(h => h.hashtag).join(', ')} sedang trending di channel Anda.`);
  }

  // Insight tentang konsistensi
  const consistentKeywords = keywords.filter(k => k.frequency >= 5);
  if (consistentKeywords.length > 0) {
    insights.push(`Anda konsisten menggunakan kata kunci "${consistentKeywords[0].keyword}" yang muncul ${consistentKeywords[0].frequency} kali.`);
  }

  // Insight tentang opportunity
  const underusedHighPerformers = keywords.filter(k => k.performance === 'high' && k.frequency < 3);
  if (underusedHighPerformers.length > 0) {
    insights.push(`Kata kunci "${underusedHighPerformers[0].keyword}" memiliki performa tinggi tapi jarang digunakan. Pertimbangkan untuk menggunakannya lebih sering.`);
  }

  return {
    suggestedKeywords: [...new Set(highPerformanceKeywords.slice(0, 10).map(k => k.keyword))],
    suggestedHashtags: [...new Set([...trendingHashtags.slice(0, 5).map(h => h.hashtag), ...highPerformanceHashtags.slice(0, 5).map(h => h.hashtag)])],
    insights
  };
}

// Fungsi utama untuk mendapatkan keyword insights
export function getKeywordInsights(videos: YouTubeVideo[]): KeywordInsights {
  const keywords = analyzeKeywords(videos);
  const hashtags = analyzeHashtags(videos);
  const recommendations = generateRecommendations(keywords, hashtags);

  // Hitung statistik
  const totalKeywords = new Set(keywords.map(k => k.keyword)).size;
  const totalHashtags = new Set(hashtags.map(h => h.hashtag)).size;
  const avgKeywordsPerVideo = keywords.reduce((sum, k) => sum + k.frequency, 0) / videos.length;
  const avgHashtagsPerVideo = hashtags.reduce((sum, h) => sum + h.frequency, 0) / videos.length;

  return {
    topKeywords: keywords,
    trendingHashtags: hashtags,
    recommendations,
    stats: {
      totalKeywords,
      totalHashtags,
      avgKeywordsPerVideo: Math.round(avgKeywordsPerVideo * 10) / 10,
      avgHashtagsPerVideo: Math.round(avgHashtagsPerVideo * 10) / 10
    }
  };
}