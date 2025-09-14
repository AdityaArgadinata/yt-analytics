import React, { useState, useEffect, useCallback } from 'react';

interface TrendingKeyword {
  keyword: string;
  frequency: number;
  videos: Array<{
    id: string;
    title: string;
    viewCount: number;
    channelTitle: string;
  }>;
  avgViewCount: number;
  avgLikeCount: number;
  totalEngagement: number;
  trendScore: number;
}

interface TrendingHashtag {
  hashtag: string;
  frequency: number;
  videos: Array<{
    id: string;
    title: string;
    viewCount: number;
    channelTitle: string;
  }>;
  avgViewCount: number;
  avgLikeCount: number;
  totalEngagement: number;
  trendScore: number;
}

interface CategoryTrend {
  categoryId: string;
  categoryName: string;
  videoCount: number;
  totalViews: number;
  avgViews: number;
  totalEngagement: number;
  percentage: number;
  topVideos: Array<{
    id: string;
    title: string;
    viewCount: number;
    channelTitle: string;
  }>;
}

interface TrendingAnalysis {
  period: string;
  keywords: TrendingKeyword[];
  hashtags: TrendingHashtag[];
  categories: CategoryTrend[];
  totalVideos: number;
  totalViews: number;
  avgEngagement: number;
  generatedAt: string;
}

interface TrendingInsightsTabProps {
  regionCode?: string;
}

export default function TrendingInsightsTab({ regionCode = 'ID' }: TrendingInsightsTabProps) {
  const [analysis, setAnalysis] = useState<TrendingAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d'>('24h');
  const [activeTab, setActiveTab] = useState<'keywords' | 'hashtags' | 'categories'>('keywords');

  const fetchTrendingAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/trending/analyze?regionCode=${regionCode}&period=${selectedPeriod}&maxResults=50`
      );
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorData}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Trending analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [regionCode, selectedPeriod]);

  useEffect(() => {
    fetchTrendingAnalysis();
  }, [fetchTrendingAnalysis]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getTrendScoreColor = (score: number): string => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getTrendScoreLabel = (score: number): string => {
    if (score >= 80) return 'Viral';
    if (score >= 60) return 'Hot';
    if (score >= 40) return 'Rising';
    return 'Emerging';
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🔥</span>
          </div>
        </div>
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Menganalisis Trending</h3>
          <p className="text-sm text-gray-600 mt-1">Mengumpulkan data trending terbaru...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center py-16">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Trending Data</h3>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => fetchTrendingAnalysis()}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button 
              onClick={() => setSelectedPeriod('24h')}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Reset to 24h
            </button>
          </div>
          <details className="mt-4 text-left">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">Debug Info</summary>
            <pre className="text-xs text-gray-600 mt-2 p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify({ error, regionCode, selectedPeriod }, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">📊</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Ready to Analyze Trending Content
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          Get real-time insights on trending YouTube videos, popular keywords, and hot hashtags
        </p>
        <button
          onClick={() => fetchTrendingAnalysis()}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors font-semibold shadow-lg"
        >
          🔥 Start Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Section - Mobile Optimized */}
      <div className="space-y-4">
        {/* Title and Stats */}
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            🔥 Trending Insights
          </h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
              </svg>
              {analysis.totalVideos} videos
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              {formatNumber(analysis.totalViews)} views
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Live data
            </span>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Period Selector */}
          <div className="flex-1">
            <div className="flex rounded-lg bg-gray-100 p-1 w-full">
              {(['24h', '7d', '30d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    selectedPeriod === period
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {period === '24h' ? '24 Jam' : period === '7d' ? '7 Hari' : '30 Hari'}
                </button>
              ))}
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchTrendingAnalysis()}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Top Keywords</dt>
                <dd className="text-lg font-medium text-gray-900">{analysis.keywords.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Top Hashtags</dt>
                <dd className="text-lg font-medium text-gray-900">{analysis.hashtags.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Categories</dt>
                <dd className="text-lg font-medium text-gray-900">{analysis.categories.length}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Mobile Optimized */}
      <div className="bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
        <div className="grid grid-cols-3 gap-1">
          {[
            { key: 'keywords', label: 'Kata Kunci', icon: '🔑' },
            { key: 'hashtags', label: 'Hashtag', icon: '#️⃣' },
            { key: 'categories', label: 'Kategori', icon: '📂' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'keywords' | 'hashtags' | 'categories')}
              className={`px-2 py-2.5 text-sm font-medium rounded-md transition-all text-center ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-base">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'keywords' && (
          <div className="space-y-3">
            {analysis.keywords.slice(0, 15).map((keyword, index) => (
              <div key={keyword.keyword} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                {/* Keyword Header - Mobile Optimized */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                      {index + 1}
                    </span>
                    <h3 className="text-base font-semibold text-gray-900 truncate">{keyword.keyword}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendScoreColor(keyword.trendScore)}`}>
                    {getTrendScoreLabel(keyword.trendScore)}
                  </span>
                </div>
                
                {/* Stats Grid - Mobile Compact */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Videos</div>
                    <div className="text-sm font-semibold text-gray-900">{keyword.frequency}</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-600">Avg Views</div>
                    <div className="text-sm font-semibold text-blue-700">{formatNumber(keyword.avgViewCount)}</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <div className="text-xs text-red-600">Avg Likes</div>
                    <div className="text-sm font-semibold text-red-700">{formatNumber(keyword.avgLikeCount)}</div>
                  </div>
                </div>

                {/* Top Videos - Compact List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Top Videos</h4>
                  {keyword.videos.slice(0, 2).map((video) => (
                    <div key={video.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium line-clamp-2 leading-tight">{video.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-gray-500 truncate">{video.channelTitle}</p>
                          <span className="text-xs text-blue-600 font-medium">{formatNumber(video.viewCount)} views</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hashtags' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.hashtags.slice(0, 12).map((hashtag, index) => (
              <div key={hashtag.hashtag} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                {/* Hashtag Header - Mobile Optimized */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">
                      {index + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-blue-600 truncate">{hashtag.hashtag}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendScoreColor(hashtag.trendScore)}`}>
                    {getTrendScoreLabel(hashtag.trendScore)}
                  </span>
                </div>
                
                {/* Stats Grid - Compact */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Videos</div>
                    <div className="text-sm font-semibold text-gray-900">{hashtag.frequency}</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-600">Views</div>
                    <div className="text-sm font-semibold text-blue-700">{formatNumber(hashtag.avgViewCount)}</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <div className="text-xs text-red-600">Likes</div>
                    <div className="text-sm font-semibold text-red-700">{formatNumber(hashtag.avgLikeCount)}</div>
                  </div>
                </div>

                {/* Top Video Preview */}
                <div className="p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Top Video:</div>
                  <p className="text-sm text-gray-900 font-medium line-clamp-2 leading-tight">
                    {hashtag.videos[0]?.title || 'No videos available'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-3">
            {analysis.categories.map((category, index) => (
              <div key={category.categoryId} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                {/* Category Header - Mobile Optimized */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 text-xs font-bold rounded-full">
                      {index + 1}
                    </span>
                    <h3 className="text-base font-semibold text-gray-900 truncate">{category.categoryName}</h3>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    {category.percentage.toFixed(1)}%
                  </span>
                </div>
                
                {/* Stats Grid - Compact Mobile Layout */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Videos</div>
                    <div className="text-sm font-semibold text-gray-900">{category.videoCount}</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-600">Total Views</div>
                    <div className="text-sm font-semibold text-blue-700">{formatNumber(category.totalViews)}</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="text-xs text-green-600">Avg Views</div>
                    <div className="text-sm font-semibold text-green-700">{formatNumber(category.avgViews)}</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <div className="text-xs text-red-600">Engagement</div>
                    <div className="text-sm font-semibold text-red-700">{formatNumber(category.totalEngagement)}</div>
                  </div>
                </div>

                {/* Top Videos - Compact List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Top Videos</h4>
                  {category.topVideos.slice(0, 2).map((video) => (
                    <div key={video.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium line-clamp-2 leading-tight">{video.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-gray-500 truncate">{video.channelTitle}</p>
                          <span className="text-xs text-blue-600 font-medium">{formatNumber(video.viewCount)} views</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}