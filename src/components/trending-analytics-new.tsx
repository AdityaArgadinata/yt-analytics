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

interface TrendingAnalyticsProps {
  regionCode?: string;
}

export default function TrendingAnalytics({ regionCode = 'ID' }: TrendingAnalyticsProps) {
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

  if (loading && !analysis) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity=".25"/>
              <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none"/>
            </svg>
            <span className="font-medium">Loading trending data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-500 mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={fetchTrendingAnalysis}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No trending data available</h3>
            <p className="text-gray-600 text-sm mb-4">Click refresh to load the latest trending insights</p>
            <button
              onClick={fetchTrendingAnalysis}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Load Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Trending Analysis</h2>
        <p className="text-gray-600">Analisis mendalam video trending YouTube dengan insights kata kunci, hashtag, dan kategori</p>
      </div>

      {/* Period Selector - Dropdown Version */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-800">Periode Analisis:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '24h' | '7d' | '30d')}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            >
              <option value="24h">24 Jam Terakhir</option>
              <option value="7d">7 Hari Terakhir</option>
              <option value="30d">30 Hari Terakhir</option>
            </select>
          </div>
          <button
            onClick={() => fetchTrendingAnalysis()}
            disabled={loading}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg disabled:opacity-50 flex items-center gap-2 transition-colors w-auto self-start"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Stats Summary Cards - 2 Columns Mobile, 4 Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-2 sm:p-4 text-center shadow-sm">
          <div className="text-xl sm:text-3xl font-bold text-emerald-600 mb-1">{analysis.keywords.length}</div>
          <div className="text-xs sm:text-sm font-medium text-emerald-700">Keywords</div>
          <div className="text-xs text-emerald-600 mt-1 hidden sm:block">Kata kunci trending</div>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-2 sm:p-4 text-center shadow-sm">
          <div className="text-xl sm:text-3xl font-bold text-teal-600 mb-1">{analysis.hashtags.length}</div>
          <div className="text-xs sm:text-sm font-medium text-teal-700">Hashtags</div>
          <div className="text-xs text-teal-600 mt-1 hidden sm:block">Tags yang viral</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-2 sm:p-4 text-center shadow-sm">
          <div className="text-xl sm:text-3xl font-bold text-cyan-600 mb-1">{(analysis.keywords.length / analysis.totalVideos).toFixed(1)}</div>
          <div className="text-xs sm:text-sm font-medium text-cyan-700">K/Video</div>
          <div className="text-xs text-cyan-600 mt-1 hidden sm:block">Per video</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-2 sm:p-4 text-center shadow-sm">
          <div className="text-xl sm:text-3xl font-bold text-blue-600 mb-1">{(analysis.hashtags.length / analysis.totalVideos).toFixed(1)}</div>
          <div className="text-xs sm:text-sm font-medium text-blue-700">H/Video</div>
          <div className="text-xs text-blue-600 mt-1 hidden sm:block">Per video</div>
        </div>
      </div>

      {/* Tab Navigation - Responsive Layout (Vertical Mobile, Horizontal Desktop) */}
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('keywords')}
          className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 border-2 font-bold text-sm whitespace-nowrap flex flex-col sm:flex-row items-center gap-2 transition-all duration-200 rounded-xl shadow-sm relative ${
            activeTab === 'keywords'
              ? 'border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:scale-90'
              : 'border-gray-300 text-gray-600 bg-white hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/50 hover:shadow-md'
          }`}
        >
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <div className="text-center sm:text-left">
            <div className="text-sm font-bold">Keywords</div>
            <div className="text-xs opacity-75 hidden sm:block">Analisis kata kunci</div>
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('hashtags')}
          className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 border-2 font-bold text-sm whitespace-nowrap flex flex-col sm:flex-row items-center gap-2 transition-all duration-200 rounded-xl shadow-sm relative ${
            activeTab === 'hashtags'
              ? 'border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:scale-90'
              : 'border-gray-300 text-gray-600 bg-white hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/50 hover:shadow-md'
          }`}
        >
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <div className="text-center sm:text-left">
            <div className="text-sm font-bold">Tags</div>
            <div className="text-xs opacity-75 hidden sm:block">Analisis hashtag</div>
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 border-2 font-bold text-sm whitespace-nowrap flex flex-col sm:flex-row items-center gap-2 transition-all duration-200 rounded-xl shadow-sm relative ${
            activeTab === 'categories'
              ? 'border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:scale-90'
              : 'border-gray-300 text-gray-600 bg-white hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/50 hover:shadow-md'
          }`}
        >
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div className="text-center sm:text-left">
            <div className="text-sm font-bold">Tips</div>
            <div className="text-xs opacity-75 hidden sm:block">Kategori insights</div>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'keywords' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Kata Kunci Teratas
              </h4>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Terfilter dari noise & URL
              </span>
            </div>
            <div className="grid gap-4">
              {analysis.keywords.slice(0, 10).map((keyword, index) => (
                <div key={keyword.keyword} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-600 text-sm font-bold rounded-full">
                        {index + 1}
                      </span>
                      <h5 className="font-semibold text-gray-900">&ldquo;{keyword.keyword}&rdquo;</h5>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                      Tinggi
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Digunakan {keyword.frequency} kali • ⭐ Konsisten
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-gray-900">{formatNumber(keyword.avgViewCount)}</div>
                      <div className="text-xs text-gray-600">Rata-rata Views</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-gray-900">{formatNumber(keyword.avgLikeCount)}</div>
                      <div className="text-xs text-gray-600">Rata-rata Likes</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-gray-900">{keyword.videos.length}</div>
                      <div className="text-xs text-gray-600">Rata-rata Komentar</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="font-medium text-gray-700">Video dengan kata kunci ini:</div>
                    <div className="space-y-2">
                      {keyword.videos.slice(0, 3).map((video) => (
                        <div key={video.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="font-medium text-gray-900 text-sm leading-relaxed mb-2">
                            {video.title}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-500 gap-2">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                              </svg>
                              {formatNumber(video.viewCount)} views
                            </div>
                            <a
                              href={`https://www.youtube.com/watch?v=${video.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                              Watch
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hashtags' && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Hashtag Trending
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.hashtags.slice(0, 8).map((hashtag, index) => (
                <div key={hashtag.hashtag} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-600 text-xs font-bold rounded-full">
                        {index + 1}
                      </span>
                      <h5 className="font-semibold text-emerald-600">{hashtag.hashtag}</h5>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                      Hot
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="font-semibold text-gray-900">{hashtag.frequency}</div>
                      <div className="text-xs text-gray-600">Videos</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{formatNumber(hashtag.avgViewCount)}</div>
                      <div className="text-xs text-gray-600">Views</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{formatNumber(hashtag.avgLikeCount)}</div>
                      <div className="text-xs text-gray-600">Likes</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs font-medium text-gray-500 mb-2">Top Video:</div>
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                      <div className="font-medium text-gray-900 text-xs leading-relaxed mb-2">
                        {hashtag.videos[0]?.title || 'No videos available'}
                      </div>
                      {hashtag.videos[0] && (
                        <div className="flex justify-end pt-2">
                          <a
                            href={`https://www.youtube.com/watch?v=${hashtag.videos[0].id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                            Watch
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Rekomendasi Kategori
            </h4>
            <div className="grid gap-4">
              {analysis.categories.map((category, index) => (
                <div key={category.categoryId} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-600 text-sm font-bold rounded-full">
                        {index + 1}
                      </span>
                      <h5 className="font-semibold text-gray-900">{category.categoryName}</h5>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                      {category.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center text-sm mb-4">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="font-semibold text-gray-900">{category.videoCount}</div>
                      <div className="text-xs text-gray-600">Videos</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="font-semibold text-gray-900">{formatNumber(category.totalViews)}</div>
                      <div className="text-xs text-gray-600">Total Views</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="font-semibold text-gray-900">{formatNumber(category.avgViews)}</div>
                      <div className="text-xs text-gray-600">Avg Views</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="font-semibold text-gray-900">{formatNumber(category.totalEngagement)}</div>
                      <div className="text-xs text-gray-600">Engagement</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="font-medium text-gray-700">Top videos in category:</div>
                    <div className="space-y-2">
                      {category.topVideos.slice(0, 2).map((video) => (
                        <div key={video.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="font-medium text-gray-900 text-sm leading-relaxed mb-2">
                            {video.title}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex flex-col gap-1">
                              <span className="text-gray-500">{video.channelTitle}</span>
                              <div className="flex items-center text-gray-500 gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                </svg>
                                {formatNumber(video.viewCount)} views
                              </div>
                            </div>
                            <a
                              href={`https://www.youtube.com/watch?v=${video.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                              Watch
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}