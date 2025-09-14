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

// Kata kunci yang akan difilter (URL, platform, dan noise)
const FILTERED_KEYWORDS = new Set([
  // URL components
  'https', 'http', 'www', 'com', 'org', 'net', 'co', 'id', 'url', 'link', 'website', 'bit', 'ly', 'tinyurl',
  
  // Social media platforms
  'instagram', 'facebook', 'twitter', 'tiktok', 'discord', 'telegram', 'whatsapp', 'linkedin',
  
  // YouTube specific
  'youtube', 'yt', 'video', 'channel', 'subscribe', 'like', 'comment', 'share', 'playlist',
  'shorts', 'live', 'stream', 'streaming', 'upload', 'thumbnail', 'description', 'title',
  'views', 'subscriber', 'membership', 'monetization', 'ad', 'ads', 'revenue',
  
  // Generic tech terms
  'app', 'application', 'software', 'platform', 'website', 'digital', 'online', 'internet',
  'browser', 'mobile', 'desktop', 'download', 'install', 'update', 'version',
  
  // Common words
  'and', 'or', 'but', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'dari', 'ke', 'di', 'dan', 'atau', 'yang', 'adalah', 'ini', 'itu', 'untuk', 'dengan',
  
  // Time related
  'today', 'yesterday', 'tomorrow', 'hari', 'minggu', 'bulan', 'tahun', 'jam', 'menit', 'detik',
  
  // Actions
  'click', 'tap', 'press', 'open', 'close', 'start', 'stop', 'pause', 'play', 'replay',
  'klik', 'tekan', 'buka', 'tutup', 'mulai', 'berhenti', 'jeda', 'putar', 'ulang',
  
  // Generic terms
  'free', 'premium', 'pro', 'plus', 'basic', 'standard', 'advanced', 'gratis', 'berbayar'
]);

// Ekstrak kata kunci dari teks dengan algoritma yang lebih tajam
export function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  // Ekstrak frasa penting (2-3 kata) dan kata tunggal
  const phrases = extractMeaningfulPhrases(text);
  const singleWords = extractSingleKeywords(text);
  
  // Gabungkan dan deduplikasi
  return [...new Set([...phrases, ...singleWords])];
}

// Ekstrak frasa bermakna (2-3 kata)
function extractMeaningfulPhrases(text: string): string[] {
  const cleanText = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const words = cleanText.split(' ');
  const phrases: string[] = [];
  
  // Ekstrak frasa 2 kata
  for (let i = 0; i < words.length - 1; i++) {
    const word1 = words[i];
    const word2 = words[i + 1];
    
    if (isValidKeywordWord(word1) && isValidKeywordWord(word2)) {
      const phrase = `${word1} ${word2}`;
      if (isMeaningfulPhrase(phrase)) {
        phrases.push(phrase);
      }
    }
  }
  
  // Ekstrak frasa 3 kata untuk topik spesifik
  for (let i = 0; i < words.length - 2; i++) {
    const word1 = words[i];
    const word2 = words[i + 1];
    const word3 = words[i + 2];
    
    if (isValidKeywordWord(word1) && isValidKeywordWord(word2) && isValidKeywordWord(word3)) {
      const phrase = `${word1} ${word2} ${word3}`;
      if (isMeaningfulPhrase(phrase) && phrase.length <= 25) {
        phrases.push(phrase);
      }
    }
  }
  
  return phrases;
}

// Ekstrak kata kunci tunggal yang bermakna
function extractSingleKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s#]/g, ' ')
    .split(/\s+/)
    .filter(word => isValidKeywordWord(word))
    .filter(word => isMeaningfulSingleWord(word));
  
  return words;
}

// Validasi apakah kata layak menjadi bagian keyword
function isValidKeywordWord(word: string): boolean {
  if (!word || word.length < 3) return false;
  if (STOP_WORDS.has(word)) return false;
  if (FILTERED_KEYWORDS.has(word)) return false;
  if (/^\d+$/.test(word)) return false;
  if (isUrlComponent(word)) return false;
  
  return true;
}

// Cek apakah frasa bermakna
function isMeaningfulPhrase(phrase: string): boolean {
  // Frasa terlalu pendek
  if (phrase.length < 5) return false;
  
  // Hindari frasa yang terlalu generik atau noise
  const genericPatterns = [
    /^(ini|itu|yang|adalah|akan|sudah|juga|tidak|ada|dari|untuk|dengan|pada)/,
    /^(this|that|which|will|have|also|not|there|from|with|for)/,
    /(video|channel|subscribe|like|comment|views|subscriber)$/,
    /^(dan|atau|the|and|or|but)$/,
    /\b(http|https|www|com|org|net)\b/
  ];
  
  // Jika mengandung pattern generik, tolak
  for (const pattern of genericPatterns) {
    if (pattern.test(phrase)) return false;
  }
  
  // Jika frasa mengandung setidaknya satu kata yang bermakna, terima
  const words = phrase.split(' ');
  const hasMeaningfulWord = words.some(word => {
    // Kata minimal 3 karakter dan bukan stop word
    if (word.length < 3 || STOP_WORDS.has(word) || FILTERED_KEYWORDS.has(word)) {
      return false;
    }
    
    // Kata yang mengandung huruf dan bukan hanya angka
    return /^[a-zA-Z]+$/.test(word) || /^[a-zA-Z0-9]+$/.test(word);
  });
  
  return hasMeaningfulWord;
}

// Cek apakah kata tunggal bermakna  
function isMeaningfulSingleWord(word: string): boolean {
  // Minimal 3 karakter untuk kata tunggal (lebih fleksibel)
  if (word.length < 3) return false;
  
  // Hindari kata yang terlalu umum
  const tooCommonWords = [
    'very', 'good', 'nice', 'great', 'best', 'new', 'old', 'big', 'small',
    'bagus', 'baik', 'baru', 'lama', 'besar', 'kecil', 'sangat', 'sekali'
  ];
  
  if (tooCommonWords.includes(word)) return false;
  
  // Terima kata yang mengandung huruf (bukan hanya angka)
  if (!/^[a-zA-Z]+$/.test(word) && !/^[a-zA-Z0-9]+$/.test(word)) {
    return false;
  }
  
  // Prioritaskan kata yang lebih panjang dan spesifik
  if (word.length >= 5) return true;
  
  // Untuk kata 3-4 karakter, cek apakah mengandung huruf vokal dan konsonan
  const hasVowel = /[aeiouAEIOU]/.test(word);
  const hasConsonant = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/.test(word);
  
  return hasVowel && hasConsonant;
}

// Fungsi untuk mendeteksi komponen URL
function isUrlComponent(word: string): boolean {
  // Deteksi pattern URL
  if (word.includes('://') || word.startsWith('www.') || word.startsWith('http')) {
    return true;
  }
  
  // Deteksi domain extensions
  if (/\.(com|org|net|co|id|io|tv|me|ly|tk|ml|ga|cf|edu|gov|mil|info|biz|name|pro|aero|asia|cat|coop|int|jobs|mobi|museum|post|tel|travel|xxx|onion|test|localhost)$/i.test(word)) {
    return true;
  }
  
  // Deteksi pattern email atau domain
  if (word.includes('@') || (word.includes('.') && word.length > 4)) {
    return true;
  }
  
  // Deteksi common URL shorteners dan platform specific
  if (/^(bit|tinyurl|short|link|url|goto|redirect|youtu|goo|t|ow|buff|dlvr|ift|fb|twit|ig|ln|amzn|ebay|shp|ali|afi|ref)$/i.test(word)) {
    return true;
  }
  
  // Deteksi URL parameters
  if (/^(utm|ref|source|medium|campaign|content|term|gclid|fbclid|igshid|si|t|v|list|index|feature)$/i.test(word)) {
    return true;
  }
  
  return false;
}

// Ekstrak hashtag dari teks
export function extractHashtags(text: string): string[] {
  if (!text) return [];
  
  const hashtags = text.match(/#[\w]+/g) || [];
  return hashtags
    .map(tag => tag.toLowerCase())
    .filter(tag => tag.length > 2) // Minimal 3 karakter
    .filter(tag => !FILTERED_KEYWORDS.has(tag.replace('#', ''))) // Filter noise
    .filter(tag => !isUrlComponent(tag.replace('#', ''))); // Filter URL components
}

// Analisis kata kunci dari array video dengan algoritma yang lebih tajam
export function analyzeKeywords(videos: YouTubeVideo[]): KeywordData[] {
  const keywordMap = new Map<string, {
    frequency: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    titleFrequency: number; // Frekuensi di title (lebih penting)
    descriptionFrequency: number; // Frekuensi di description
    videos: Array<{
      id: string;
      title: string;
      views: number;
      likes: number;
      comments: number;
    }>;
  }>();

  // Interface untuk keyword data sementara dengan qualityScore
  interface TemporaryKeywordData extends KeywordData {
    qualityScore: number;
  }

  // Ekstrak kata kunci dari setiap video
  videos.forEach(video => {
    const title = video.snippet?.title || '';
    const description = video.snippet?.description || '';
    const views = parseInt(video.statistics?.viewCount || '0');
    const likes = parseInt(video.statistics?.likeCount || '0');
    const comments = parseInt(video.statistics?.commentCount || '0');

    // Ekstrak keywords dari title (prioritas tinggi)
    const titleKeywords = extractKeywords(title);
    // Ekstrak keywords dari description (prioritas sedang)
    const descriptionKeywords = extractKeywords(description);

    // Proses keywords dari title
    titleKeywords.forEach(keyword => {
      if (!keywordMap.has(keyword)) {
        keywordMap.set(keyword, {
          frequency: 0,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          titleFrequency: 0,
          descriptionFrequency: 0,
          videos: []
        });
      }

      const data = keywordMap.get(keyword)!;
      data.frequency++;
      data.titleFrequency++;
      data.totalViews += views;
      data.totalLikes += likes;
      data.totalComments += comments;
      
      // Hindari duplikasi video untuk keyword yang sama
      if (!data.videos.some(v => v.id === video.id)) {
        data.videos.push({
          id: video.id,
          title: title,
          views: views,
          likes: likes,
          comments: comments
        });
      }
    });

    // Proses keywords dari description
    descriptionKeywords.forEach(keyword => {
      if (!titleKeywords.includes(keyword)) { // Hindari duplikasi dari title
        if (!keywordMap.has(keyword)) {
          keywordMap.set(keyword, {
            frequency: 0,
            totalViews: 0,
            totalLikes: 0,
            totalComments: 0,
            titleFrequency: 0,
            descriptionFrequency: 0,
            videos: []
          });
        }

        const data = keywordMap.get(keyword)!;
        data.frequency++;
        data.descriptionFrequency++;
        data.totalViews += views * 0.7; // Bobot lebih rendah untuk description
        data.totalLikes += likes * 0.7;
        data.totalComments += comments * 0.7;
        
        if (!data.videos.some(v => v.id === video.id)) {
          data.videos.push({
            id: video.id,
            title: title,
            views: views,
            likes: likes,
            comments: comments
          });
        }
      }
    });
  });

  // Convert ke array dan hitung rata-rata dengan scoring yang lebih baik
  const keywordData: TemporaryKeywordData[] = Array.from(keywordMap.entries()).map(([keyword, data]) => {
    const avgViews = data.totalViews / data.frequency;
    const avgLikes = data.totalLikes / data.frequency;
    const avgComments = data.totalComments / data.frequency;

    // Hitung score berdasarkan multiple factors
    const titleBonus = data.titleFrequency * 1.5; // Title 1.5x lebih penting (dikurangi)
    const phraseBonus = keyword.includes(' ') ? 1.3 : 1; // Frasa 1.3x lebih penting (dikurangi)
    const lengthBonus = keyword.length > 8 ? 1.2 : keyword.length > 5 ? 1.1 : 1; // Bonus length yang lebih fleksibel
    
    const qualityScore = (data.frequency + titleBonus) * phraseBonus * lengthBonus;

    // Tentukan performance berdasarkan views dan engagement (lebih fleksibel)
    const overallAvgViews = videos.reduce((sum, v) => sum + parseInt(v.statistics?.viewCount || '0'), 0) / videos.length;
    const engagementRate = (avgLikes + avgComments) / Math.max(avgViews, 1);
    const avgEngagement = videos.reduce((sum, v) => {
      const vViews = parseInt(v.statistics?.viewCount || '0');
      const vLikes = parseInt(v.statistics?.likeCount || '0');
      const vComments = parseInt(v.statistics?.commentCount || '0');
      return sum + ((vLikes + vComments) / Math.max(vViews, 1));
    }, 0) / videos.length;
    
    let performance: 'high' | 'medium' | 'low' = 'low';
    
    // Lebih fleksibel dalam menentukan performance
    if (avgViews > overallAvgViews * 1.1 && engagementRate > avgEngagement * 1.1) {
      performance = 'high';
    } else if (avgViews > overallAvgViews * 0.7 || engagementRate > avgEngagement * 0.7) {
      performance = 'medium';
    }

    return {
      keyword,
      frequency: data.frequency,
      avgViews,
      avgLikes,
      avgComments,
      performance,
      qualityScore, // Tambahan untuk sorting yang lebih baik
      videos: data.videos.slice(0, 5)
    };
  });

  // Sort berdasarkan quality score yang lebih sophisticated
  let filteredKeywords = keywordData
    .filter(kw => {
      // Lebih fleksibel: terima keyword yang muncul minimal 1 kali
      // tapi prioritaskan yang lebih sering muncul
      if (kw.frequency >= 2) return true;
      
      // Untuk keyword yang muncul 1 kali, terima jika:
      // 1. Performa tinggi, atau
      // 2. Merupakan frasa (lebih spesifik), atau  
      // 3. Kata yang cukup panjang (lebih spesifik)
      return kw.performance === 'high' || 
             kw.keyword.includes(' ') || 
             kw.keyword.length >= 6;
    });

  // Jika hasil terlalu sedikit, ambil top keywords berdasarkan frequency saja
  if (filteredKeywords.length < 5) {
    filteredKeywords = keywordData
      .filter(kw => kw.frequency >= 1) // Ambil semua yang minimal muncul 1 kali
      .slice(0, 15); // Ambil 15 teratas
  }

  return filteredKeywords
    .sort((a, b) => {
      // Prioritaskan berdasarkan kombinasi quality score dan performance
      const scoreA = a.qualityScore * (a.performance === 'high' ? 3 : a.performance === 'medium' ? 2 : 1);
      const scoreB = b.qualityScore * (b.performance === 'high' ? 3 : b.performance === 'medium' ? 2 : 1);
      return scoreB - scoreA;
    })
    .map((kw): KeywordData => {
      // Remove qualityScore dari hasil akhir dan return proper KeywordData
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { qualityScore, ...finalKeyword } = kw;
      return finalKeyword;
    })
    .slice(0, 20); // Kembalikan ke 20 untuk hasil yang reasonable
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

// Generate rekomendasi berdasarkan analisis yang lebih tajam
export function generateRecommendations(keywords: KeywordData[], hashtags: HashtagData[]): {
  suggestedKeywords: string[];
  suggestedHashtags: string[];
  insights: string[];
} {
  const highPerformanceKeywords = keywords.filter(k => k.performance === 'high');
  const mediumPerformanceKeywords = keywords.filter(k => k.performance === 'medium');
  const highPerformanceHashtags = hashtags.filter(h => h.performance === 'high');
  const trendingHashtags = hashtags.filter(h => h.trending);

  const insights: string[] = [];

  // Insight tentang keyword performance dengan fokus pada frasa
  if (highPerformanceKeywords.length > 0) {
    const topKeyword = highPerformanceKeywords[0];
    const keywordType = topKeyword.keyword.includes(' ') ? 'frasa' : 'kata kunci';
    insights.push(`${keywordType.charAt(0).toUpperCase() + keywordType.slice(1)} "${topKeyword.keyword}" menunjukkan performa terbaik dengan rata-rata ${Math.round(topKeyword.avgViews).toLocaleString()} views per video.`);
  }

  // Insight tentang frasa vs kata tunggal
  const phraseKeywords = keywords.filter(k => k.keyword.includes(' '));
  const singleKeywords = keywords.filter(k => !k.keyword.includes(' '));
  
  if (phraseKeywords.length > 0 && singleKeywords.length > 0) {
    const avgPhraseViews = phraseKeywords.reduce((sum, k) => sum + k.avgViews, 0) / phraseKeywords.length;
    const avgSingleViews = singleKeywords.reduce((sum, k) => sum + k.avgViews, 0) / singleKeywords.length;
    
    if (avgPhraseViews > avgSingleViews * 1.2) {
      insights.push(`Frasa keyword (${phraseKeywords.length} frasa) menunjukkan performa ${Math.round(((avgPhraseViews / avgSingleViews - 1) * 100))}% lebih baik daripada kata tunggal.`);
    }
  }

  // Insight tentang hashtag trending
  if (trendingHashtags.length > 0) {
    insights.push(`Hashtag trending: ${trendingHashtags.slice(0, 3).map(h => h.hashtag).join(', ')} - gunakan untuk meningkatkan reach.`);
  }

  // Insight tentang konsistensi dengan fokus pada keyword berkualitas
  const consistentKeywords = keywords.filter(k => k.frequency >= 4);
  if (consistentKeywords.length > 0) {
    const topConsistent = consistentKeywords[0];
    insights.push(`Konsistensi tinggi: "${topConsistent.keyword}" muncul ${topConsistent.frequency} kali dengan performa ${topConsistent.performance}.`);
  }

  // Insight tentang opportunity - keyword underused tapi high performance
  const underusedHighPerformers = keywords.filter(k => k.performance === 'high' && k.frequency < 4);
  if (underusedHighPerformers.length > 0) {
    insights.push(`Peluang: "${underusedHighPerformers[0].keyword}" berperforma tinggi tapi jarang digunakan. Manfaatkan lebih sering untuk growth.`);
  }

  // Insight tentang diversifikasi keyword
  const totalKeywords = keywords.length;
  const highPerformanceRatio = highPerformanceKeywords.length / totalKeywords;
  if (highPerformanceRatio < 0.3) {
    insights.push(`Fokus pada kualitas: Hanya ${Math.round(highPerformanceRatio * 100)}% keyword berperforma tinggi. Prioritaskan riset keyword yang lebih tajam.`);
  }

  // Filter dan prioritaskan suggested keywords
  const filteredSuggestedKeywords = [
    ...highPerformanceKeywords.slice(0, 8),
    ...mediumPerformanceKeywords.slice(0, 4)
  ]
    .map(k => k.keyword)
    .filter(keyword => !FILTERED_KEYWORDS.has(keyword))
    .filter(keyword => !isUrlComponent(keyword))
    .filter(keyword => keyword.length >= 4) // Minimal 4 karakter
    .slice(0, 12);

  // Filter suggested hashtags dengan prioritas trending dan performance
  const filteredSuggestedHashtags = [
    ...trendingHashtags.slice(0, 5).map(h => h.hashtag),
    ...highPerformanceHashtags.slice(0, 5).map(h => h.hashtag)
  ]
    .filter(hashtag => !FILTERED_KEYWORDS.has(hashtag.replace('#', '')))
    .filter(hashtag => !isUrlComponent(hashtag.replace('#', '')))
    .filter(hashtag => hashtag.length > 3)
    .slice(0, 8);

  return {
    suggestedKeywords: [...new Set(filteredSuggestedKeywords)],
    suggestedHashtags: [...new Set(filteredSuggestedHashtags)],
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