"use client";
import { useState } from "react";
import { HiTrendingUp, HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import ChannelHeader from "@/components/channel-header";

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "keywords">("analytics");

  // Fake demo data
  const demoData = {
    channel: {
      id: "demo-channel-id",
      title: "TechGuru Indonesia",
      description: "Channel teknologi terpercaya dengan tips, review, dan tutorial programming untuk developer Indonesia",
      thumbnails: {
        default: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=88&h=88&fit=crop&crop=face",
        medium: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=face",
        high: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face"
      },
      statistics: {
        subscriberCount: 125000,
        videoCount: 342,
        viewCount: 15680000
      }
    },
    videos: [
      {
        id: "demo-video-1",
        title: "Tutorial React Next.js 14 - Build Full Stack App",
        viewCount: "95230",
        likeCount: "4156",
        commentCount: "289",
        publishedAt: "2024-01-15T10:30:00Z",
        thumbnails: { medium: { url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=320&h=180&fit=crop" } }
      },
      {
        id: "demo-video-2", 
        title: "Cara Riset Keyword YouTube yang Efektif 2024",
        viewCount: "78890",
        likeCount: "3276",
        commentCount: "234",
        publishedAt: "2024-01-10T14:20:00Z",
        thumbnails: { medium: { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=320&h=180&fit=crop" } }
      },
      {
        id: "demo-video-3",
        title: "JavaScript ES6+ Tips untuk Developer Pemula",
        viewCount: "65675",
        likeCount: "2845",
        commentCount: "198",
        publishedAt: "2024-01-05T16:45:00Z",
        thumbnails: { medium: { url: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=320&h=180&fit=crop" } }
      },
      {
        id: "demo-video-4",
        title: "Setup Development Environment with Docker",
        viewCount: "54320",
        likeCount: "2234",
        commentCount: "156",
        publishedAt: "2024-01-01T12:30:00Z",
        thumbnails: { medium: { url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=320&h=180&fit=crop" } }      },
      {
        id: "demo-video-5",
        title: "API Design Best Practices untuk Backend Developer",
        viewCount: "48190",
        likeCount: "1987",
        commentCount: "143",
        publishedAt: "2023-12-28T09:15:00Z",
        thumbnails: { medium: { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=320&h=180&fit=crop" } }
      },
      {
        id: "demo-video-6",
        title: "Database Optimization Techniques - MySQL vs PostgreSQL",
        viewCount: "42150",
        likeCount: "1756",
        commentCount: "128",
        publishedAt: "2023-12-25T14:45:00Z",
        thumbnails: { medium: { url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=320&h=180&fit=crop" } }
      }
    ],
    analytics: {
      totalViews: 15680000,
      totalSubscribers: 125000,
      totalVideos: 342,
      avgViewsPerVideo: 45847,
      engagementRate: 4.8,
      subscriberGrowth: 8.5
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: string | number) => {
    return parseInt(num.toString()).toLocaleString('id-ID');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Experimental Ribbon */}
      <div className="fixed top-6 right-6 z-[9999]">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-lg shadow-xl transform rotate-12 hover:rotate-6 transition-transform duration-300 border-2 border-white">
          <span className="text-xs font-bold italic tracking-wider uppercase">Experimental</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <HiArrowLeft className="w-5 h-5" />
                <span className="font-medium">Kembali</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <HiTrendingUp className="w-6 h-6 text-emerald-500" />
                <span className="text-xl font-bold text-gray-900">YoutubePro</span>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">Demo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <ChannelHeader channel={demoData.channel} />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "analytics"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("keywords")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "keywords"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Keywords
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Analytics Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Channel Performance Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{formatNumber(demoData.channel.statistics.viewCount)}</div>
                  <div className="text-sm text-blue-800">Total Views</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{formatNumber(demoData.channel.statistics.subscriberCount!)}</div>
                  <div className="text-sm text-green-800">Subscribers</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{demoData.analytics.engagementRate}%</div>
                  <div className="text-sm text-purple-800">Engagement Rate</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{formatNumber(demoData.analytics.avgViewsPerVideo)}</div>
                  <div className="text-sm text-yellow-800">Avg Views/Video</div>
                </div>
              </div>
            </div>

            {/* Videos Performance Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Video Performance</h3>
                <p className="text-sm text-gray-600 mt-1">Analisis performa video terbaru dari channel</p>
              </div>
              
              <div className="relative">
                {/* Table Content */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {demoData.videos.map((video, index) => (
                        <tr 
                          key={video.id}
                          className={`transition-all duration-300 ${index >= 3 ? 'relative' : ''}`}
                          style={{
                            filter: index >= 3 ? `blur(${(index - 2) * 1.5}px)` : 'none',
                            opacity: index >= 3 ? 1 - ((index - 2) * 0.2) : 1
                          }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Image
                                src={video.thumbnails.medium.url}
                                alt="Video thumbnail"
                                width={64}
                                height={36}
                                className="w-16 h-9 rounded object-cover flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {video.title}
                                </div>
                                <div className="text-sm text-gray-500">ID: {video.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatNumber(video.viewCount)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatNumber(video.likeCount)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{video.commentCount}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(video.publishedAt)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Glassmorphism Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.1) 65%, rgba(255,255,255,0.8) 80%, rgba(255,255,255,0.95) 90%, rgba(255,255,255,0.98) 100%)',
                      backdropFilter: 'blur(0.5px)'
                    }}
                  />
                </div>

                {/* Login CTA Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center pointer-events-auto">
                  <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-xl max-w-md mx-auto">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Login untuk Akses Data Lengkap
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Lihat analisis mendalam, riset keyword, dan insight trending untuk channel YouTube Anda
                    </p>
                    <Link
                      href="/"
                      className="inline-block w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
                    >
                      Mulai Sekarang
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "keywords" && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fitur Keywords Premium
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Dapatkan analisis keyword mendalam, trending hashtags, dan strategi SEO YouTube untuk meningkatkan visibility channel Anda
              </p>
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
              >
                Upgrade ke Premium
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}