"use client";
import { useState, useEffect } from 'react';
import { useKeywordInsights } from '@/hooks/useKeywordInsights';

interface KeywordInsightsTabProps {
  channelId: string;
  channelTitle: string;
}

// Filter untuk kata-kata yang tidak relevan
const FILTERED_KEYWORDS = new Set([
  // URL components
  'https', 'http', 'www', 'com', 'org', 'net', 'co', 'id', 'url', 'link', 'website',
  
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

// Function to filter relevant keywords
const filterRelevantKeywords = (keywords: Array<{
  keyword: string;
  frequency: number;
  performance: 'high' | 'medium' | 'low';
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  videos: Array<{ id: string; title: string; views: number; likes: number; }>;
}>) => {
  return keywords.filter(item => {
    const keyword = item.keyword.toLowerCase().trim();
    
    // Filter out single characters or very short words
    if (keyword.length < 3) return false;
    
    // Filter out URLs and domains
    if (keyword.includes('.') && (keyword.includes('http') || keyword.includes('www'))) return false;
    
    // Filter out common non-content keywords
    if (FILTERED_KEYWORDS.has(keyword)) return false;
    
    // Filter out pure numbers
    if (/^\d+$/.test(keyword)) return false;
    
    // Filter out email-like patterns
    if (keyword.includes('@')) return false;
    
    // Filter out hashtag symbols (keep the content)
    if (keyword.startsWith('#') && keyword.length === 1) return false;
    
    // Keep keywords with good frequency (more than 1 occurrence)
    if (item.frequency < 2) return false;
    
    return true;
  });
};

export default function KeywordInsightsTab({ channelId }: KeywordInsightsTabProps) {
  const { insights, loading, error, refreshInsights, getCacheStatus, lastFetchType } = useKeywordInsights(channelId);
  const [selectedTab, setSelectedTab] = useState<'keywords' | 'hashtags' | 'recommendations'>('keywords');
  const [showCacheNotification, setShowCacheNotification] = useState(false);
  
  const cacheStatus = getCacheStatus();

  // Show cache notification when data is loaded from cache
  useEffect(() => {
    if (lastFetchType === 'cache' && insights) {
      setShowCacheNotification(true);
      const timer = setTimeout(() => setShowCacheNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastFetchType, insights]);

  const getPerformanceBadge = (performance: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const labels = {
      high: 'Tinggi',
      medium: 'Sedang',
      low: 'Rendah'
    };

    return (
      <span className={`px-1.5 sm:px-2 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${styles[performance]}`}>
        {labels[performance]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12 font-apple">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600 text-sm sm:text-base text-center px-4">Menganalisis kata kunci dan hashtag...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center font-apple mx-4 sm:mx-6 my-4 sm:my-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-2">Gagal Menganalisis</h3>
        <p className="text-red-700 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
        <button
          onClick={refreshInsights}
          className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-4 sm:space-y-6 font-apple p-4 sm:p-6 relative">
      {/* Cache notification */}
      {showCacheNotification && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-50 border border-emerald-200 rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-emerald-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Loaded from cache (fast load)</span>
          </div>
        </div>
      )}
      
      {/* Header dengan statistik ringkas dan cache status */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">Keyword & Hashtag Insights</h2>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cache status indicator */}
            {cacheStatus && (
              <div className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full border ${
                cacheStatus.isCached 
                  ? 'text-emerald-700 bg-emerald-100 border-emerald-200' 
                  : 'text-amber-700 bg-amber-100 border-amber-200'
              }`}>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {cacheStatus.isCached ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <span>
                  {cacheStatus.isCached 
                    ? `Cached (${cacheStatus.ageInMinutes}m ago)` 
                    : `Expired (${cacheStatus.ageInMinutes}m ago)`
                  }
                </span>
              </div>
            )}
            {/* Refresh button */}
            <button
              onClick={refreshInsights}
              disabled={loading}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 hover:text-emerald-600 px-2 sm:px-3 py-1 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <svg 
                className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center border border-emerald-100">
            <div className="text-lg sm:text-2xl font-semibold text-emerald-600">{insights.stats.totalKeywords}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Kata Kunci</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center border border-emerald-100">
            <div className="text-lg sm:text-2xl font-semibold text-emerald-600">{insights.stats.totalHashtags}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Hashtag</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center border border-emerald-100">
            <div className="text-lg sm:text-2xl font-semibold text-emerald-600">{insights.stats.avgKeywordsPerVideo}</div>
            <div className="text-xs sm:text-sm text-gray-600">Kata Kunci/Video</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center border border-emerald-100">
            <div className="text-lg sm:text-2xl font-semibold text-emerald-600">{insights.stats.avgHashtagsPerVideo}</div>
            <div className="text-xs sm:text-sm text-gray-600">Hashtag/Video</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg sm:rounded-t-xl overflow-hidden">
        <nav className="-mb-px flex">
          {[
            { id: 'keywords', label: 'Keywords', shortLabel: 'Keywords', icon: '🔤' },
            { id: 'hashtags', label: 'Hashtags', shortLabel: 'Tags', icon: '#️⃣' },
            { id: 'recommendations', label: 'Rekomendasi', shortLabel: 'Tips', icon: '💡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as 'keywords' | 'hashtags' | 'recommendations')}
              className={`flex-1 py-3 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex items-center justify-center gap-1 sm:gap-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="text-sm sm:text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'keywords' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 px-1">Kata Kunci Teratas</h3>
            <div className="flex items-center gap-2 px-1">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Terfilter dari noise & URL</span>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {filterRelevantKeywords(insights.topKeywords).slice(0, 10).map((keyword, index) => (
              <div key={keyword.keyword} className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight mb-1">&ldquo;{keyword.keyword}&rdquo;</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs sm:text-sm text-gray-600">Digunakan {keyword.frequency} kali</p>
                        {keyword.frequency >= 5 && (
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full border border-emerald-200">
                            ⭐ Konsisten
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {getPerformanceBadge(keyword.performance)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-3 py-5">
                  <div className="text-center">
                    <div className="text-sm sm:text-lg font-semibold text-gray-900">{Math.round(keyword.avgViews).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 leading-tight">Rata-rata Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm sm:text-lg font-semibold text-gray-900">{Math.round(keyword.avgLikes).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 leading-tight">Rata-rata Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm sm:text-lg font-semibold text-gray-900">{Math.round(keyword.avgComments).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 leading-tight">Rata-rata Komentar</div>
                  </div>
                </div>

                {keyword.videos.length > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Video dengan kata kunci ini:</p>
                    <div className="space-y-2 sm:space-y-2">
                      {keyword.videos.slice(0, 3).map((video, videoIndex) => (
                        <div key={`${keyword.keyword}-${video.id}-${videoIndex}`} className="text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="font-medium text-gray-900 text-xs sm:text-sm mb-1 leading-relaxed">{video.title}</div>
                          <div className="text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {video.views.toLocaleString()} views
                            </span>
                            <span className="hidden sm:inline text-gray-400">•</span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              {video.likes.toLocaleString()} likes
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Show notice if many keywords were filtered */}
            {insights.topKeywords.length > filterRelevantKeywords(insights.topKeywords).length && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-blue-900 mb-1">Smart Filtering Applied</p>
                    <p className="text-xs sm:text-sm text-blue-800">
                      Kami telah memfilter {insights.topKeywords.length - filterRelevantKeywords(insights.topKeywords).length} kata kunci yang tidak relevan 
                      (URL, nama platform, kata umum) untuk menampilkan insights yang lebih meaningful.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTab === 'hashtags' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 px-1">Hashtag Trending</h3>
            <div className="flex items-center gap-2 px-1">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Content-focused hashtags</span>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {insights.trendingHashtags
              .filter(hashtag => {
                const tag = hashtag.hashtag.toLowerCase().replace('#', '');
                return !FILTERED_KEYWORDS.has(tag) && tag.length > 2 && hashtag.frequency >= 2;
              })
              .slice(0, 8)
              .map((hashtag) => (
              <div key={hashtag.hashtag} className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                      #
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight mb-1">{hashtag.hashtag}</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs sm:text-sm text-gray-600">Digunakan {hashtag.frequency} kali</p>
                        {hashtag.frequency >= 3 && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">
                            📈 Populer
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                    {hashtag.trending && (
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full border border-red-200">
                        🔥 Hot
                      </span>
                    )}
                    {getPerformanceBadge(hashtag.performance)}
                  </div>
                </div>

                <div className="flex justify-center mb-3">
                  <div className="text-center">
                    <div className="text-sm sm:text-lg font-semibold text-gray-900">{Math.round(hashtag.avgViews).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 leading-tight">Rata-rata Views</div>
                  </div>
                </div>

                {hashtag.videos.length > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Video dengan hashtag ini:</p>
                    <div className="space-y-2 sm:space-y-2">
                      {hashtag.videos.map((video, videoIndex) => (
                        <div key={`${hashtag.hashtag}-${video.id}-${videoIndex}`} className="text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="font-medium text-gray-900 text-xs sm:text-sm mb-1 leading-relaxed">{video.title}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {video.views.toLocaleString()} views
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'recommendations' && (
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 px-1">Rekomendasi & Insights</h3>
          
          {/* AI Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h4 className="font-semibold text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm sm:text-base">AI Insights</span>
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {insights.recommendations.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-blue-800 text-sm sm:text-base leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Keywords */}
          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-base sm:text-lg">🔤</span>
              <span className="text-sm sm:text-base">Kata Kunci yang Disarankan</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full border border-emerald-200">
                Filtered
              </span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {insights.recommendations.suggestedKeywords
                .filter(keyword => {
                  const cleanKeyword = keyword.toLowerCase().trim();
                  return !FILTERED_KEYWORDS.has(cleanKeyword) && 
                         cleanKeyword.length > 2 && 
                         !cleanKeyword.includes('.') &&
                         !cleanKeyword.includes('@') &&
                         !/^\d+$/.test(cleanKeyword);
                })
                .slice(0, 15)
                .map((keyword, index) => (
                <span
                  key={`suggested-keyword-${keyword}-${index}`}
                  className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs sm:text-sm font-medium border border-emerald-200 hover:bg-emerald-200 transition-colors cursor-pointer"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
              Kata kunci ini telah difilter dari noise (URL, platform names, dll) dan menunjukkan performa yang baik. 
              Pertimbangkan untuk menggunakannya dalam judul dan deskripsi video Anda.
            </p>
          </div>

          {/* Suggested Hashtags */}
          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-base sm:text-lg">#️⃣</span>
              <span className="text-sm sm:text-base">Hashtag yang Disarankan</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">
                Curated
              </span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {insights.recommendations.suggestedHashtags
                .filter(hashtag => {
                  const cleanHashtag = hashtag.toLowerCase().replace('#', '').trim();
                  return !FILTERED_KEYWORDS.has(cleanHashtag) && 
                         cleanHashtag.length > 2 &&
                         !cleanHashtag.includes('.') &&
                         !cleanHashtag.includes('@') &&
                         !/^\d+$/.test(cleanHashtag);
                })
                .slice(0, 12)
                .map((hashtag, index) => (
                <span
                  key={`suggested-hashtag-${hashtag}-${index}`}
                  className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  {hashtag}
                </span>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
              Hashtag content-focused yang sedang trending atau menunjukkan engagement tinggi. 
              Gunakan dalam deskripsi video untuk meningkatkan discoverability.
            </p>
          </div>
        </div>
      )}

      {/* Footer dengan metadata */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <span>
            Dianalisis dari {insights.metadata?.totalVideosAnalyzed || 'N/A'} video terbaru
          </span>
          <span className="text-xs text-gray-500">
            Terakhir diperbarui: {new Date(insights.metadata?.analyzedAt || '').toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
}