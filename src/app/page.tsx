"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ChannelHeader from "@/components/channel-header";
import AnalyticsTab from "@/components/analytics-tab";
import KeywordInsightsTab from "@/components/keyword-insights-tab";
import TrendingAnalytics from "@/components/trending-analytics-new";
import AuthButton from "@/components/AuthButton";
import PricingCard from "@/components/PricingCard";
import CouponActivation from "@/components/CouponActivation";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { safeLocalStorage } from "@/lib/hydration";
import type { AnalyzeResponse } from "@/types";
import { HiTrendingUp } from "react-icons/hi";

export default function HomePage() {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "keywords">(
    "analytics"
  );
  const [showChannelAnalysis, setShowChannelAnalysis] = useState(false);
  const [showTrendingAnalysis, setShowTrendingAnalysis] = useState(false);

  // Load cached results only when user and subscription are ready, not on every keystroke
  useEffect(() => {
    // Only check cache when subscription status changes, not when typing
  }, [user, subscription.status]);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!user || subscription.status !== "active") return;

    // Check for cached results first (only on client side)
    const key = `yt-analytics-cache-${q.trim().toLowerCase()}`;
    const cached = safeLocalStorage.getItem(key);
    if (cached) {
      try {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < 3600_000) {
          setData(data);
          setShowTrendingAnalysis(false);
          return; // Use cached data, no need to make API call
        } else {
          safeLocalStorage.removeItem(key); // Remove expired cache
        }
      } catch {}
    }

    setError(null);
    setData(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/analyze?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setData(json as AnalyzeResponse);
      setShowTrendingAnalysis(false);
      // Save only results to localStorage with timestamp, not the query input (client-side only)
      safeLocalStorage.setItem(key, JSON.stringify({ data: json, ts: Date.now() }));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Show landing page for non-authenticated users */}
      {!user ? (
        <div className="min-h-screen bg-white">
          {/* Navigation */}
          <nav className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <HiTrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-lg text-gray-900">
                    YoutubePro
                  </span>
                </div>
                <div className="flex items-center">
                  <AuthButton />
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Analisis dalam sekejap
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                  Berkembang ke jutaan
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
                Platform analisis YouTube profesional untuk content creator. 
                Analisis performa channel, temukan trending keywords, dan kembangkan strategi konten dengan data real-time.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
                <div className="w-full sm:w-auto">
                  <AuthButton />
                </div>
                <Link 
                  href="/demo"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-100 bg-gradient-to-br from-emerald-500 to-emerald-600 transition-colors"
                >
                  Lihat Demo
                </Link>
              </div>

              {/* Trusted by section */}
              <div className="mt-8 sm:mt-12">
                <p className="text-xs sm:text-sm text-gray-400 mb-4 font-medium">Didukung oleh teknologi terpercaya</p>
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                  <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    <HiTrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">YouTube API</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Firebase Auth</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13 2.05v2.02c4.39.54 7.5 4.53 6.96 8.92-.39 3.16-2.58 5.8-5.66 6.84v2.02c5.89-.84 9.95-6.5 8.98-12.65C22.35 4.91 18.11.76 13 2.05z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Real-time Data</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Fitur Unggulan
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                  Tools lengkap untuk menganalisis dan mengoptimalkan channel YouTube Anda
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Feature 1 */}
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Analisis Channel
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Insights mendalam tentang performa channel, subscriber growth, dan engagement metrics yang akurat.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Trending Keywords
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Temukan kata kunci trending dan strategi SEO untuk meningkatkan visibilitas konten.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Real-time Data
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Data langsung dari YouTube API dengan caching optimal untuk performa terbaik.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Mulai analisis channel Anda
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan creator Indonesia yang menggunakan data
                untuk mengembangkan channel mereka.
              </p>
              <div className="flex justify-center">
                <AuthButton />
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-gray-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded flex items-center justify-center">
                  <HiTrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-base sm:text-lg text-gray-900">
                  YoutubePro
                </span>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm">
                © 2025 YoutubePro. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header - Simple and Clean */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <HiTrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                    YoutubePro Analytics
                  </h1>
                </div>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Wawasan profesional untuk kreator konten
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Educational tool for public YouTube data analysis under fair
                  use
                </p>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto">
                <AuthButton />
              </div>
            </div>
          </div>

          {subscription.status !== "active" ? (
            <div>
              <SubscriptionStatus />
              <PricingCard onActivateCode={() => setShowCouponModal(true)} />
            </div>
          ) : (
            <>
              {/* Back Button - Positioned at top left corner */}
              {(showChannelAnalysis || showTrendingAnalysis) && (
                <div className="mb-4">
                  <button
                    onClick={() => {
                      setShowChannelAnalysis(false);
                      setShowTrendingAnalysis(false);
                      setQ("");
                      setError(null);
                      setData(null);
                    }}
                    className="px-5 py-2 bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors w-auto"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Kembali
                  </button>
                </div>
              )}

              <SubscriptionStatus />

              {/* Main Menu Selection - Only show when no data, not loading, and not in any analysis mode */}
              {!data &&
                !loading &&
                !showChannelAnalysis &&
                !showTrendingAnalysis && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Channel Analysis Card */}
                    <div
                      onClick={() => setShowChannelAnalysis(true)}
                      className="cursor-pointer group bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200 hover:border-emerald-400 rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-emerald-800 mb-3">
                          📊 Analisis Channel
                        </h3>
                        <p className="text-emerald-600 mb-4">
                          Analisis mendalam channel YouTube spesifik dengan data
                          statistik, performa video, dan insights kata kunci
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 text-xs">
                          <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full">
                            Analytics
                          </span>
                          <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full">
                            Keywords
                          </span>
                          <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full">
                            Performance
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Trending Analysis Card */}
                    <div
                      onClick={() => setShowTrendingAnalysis(true)}
                      className="cursor-pointer group bg-gradient-to-br from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 border-2 border-red-200 hover:border-red-400 rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] relative overflow-hidden"
                    >
                      {/* Experimental Ribbon */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-1 rounded-md shadow-md transform rotate-12 hover:rotate-6 transition-transform duration-300">
                          <span className="text-xs font-bold italic tracking-wide">Experimental</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                          <span className="absolute -top-2 -right-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full animate-pulse">
                            HOT
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-red-800 mb-3">
                          🔥 Trending Topic
                        </h3>
                        <p className="text-red-600 mb-4">
                          Analisis real-time video trending YouTube dengan
                          insights kata kunci dan hashtag terpopuler saat ini
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 text-xs">
                          <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full">
                            Real-time
                          </span>
                          <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full">
                            Global Trends
                          </span>
                          <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full">
                            Hot Topics
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Channel Analysis Form */}
              {showChannelAnalysis && (
                <div className="space-y-6">
                  {/* Header - Simplified without back button */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      📊 Analisis Channel YouTube
                    </h3>
                    <p className="text-gray-600">
                      Masukkan nama channel untuk analisis mendalam
                    </p>
                  </div>

                  <form
                    onSubmit={onSearch}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
                  >
                    <div className="relative w-full">
                      <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </span>
                      <input
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-gray-300 bg-gray-50/50 backdrop-blur-sm outline-none ring-emerald-400/50 focus:ring-2 focus:bg-white focus:border-emerald-400 transition-all text-gray-900 placeholder:text-gray-400 text-sm sm:text-lg"
                        placeholder="Cari channel YouTube..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        autoFocus
                        autoComplete="off"
                      />
                    </div>
                    <button
                      disabled={
                        loading || !q.trim() || subscription.status !== "active"
                      }
                      className="rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-white shadow-lg hover:shadow-emerald-500/25 hover:scale-90 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base whitespace-nowrap"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2 sm:gap-3">
                          <svg
                            className="animate-spin w-4 h-4 sm:w-5 sm:h-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              opacity=".25"
                            />
                            <path
                              d="M22 12a10 10 0 0 1-10 10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                          </svg>
                          <span className="hidden sm:inline">
                            Menganalisis...
                          </span>
                          <span className="sm:hidden">Analisis...</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 sm:gap-3">
                          Analisis Channel
                        </span>
                      )}
                    </button>
                  </form>
                  {error && (
                    <p className="mt-4 text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg p-3">
                      {error}
                    </p>
                  )}
                </div>
              )}

              {/* Show data results */}
              {data && (
                <div className="space-y-8">
                  <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6">
                    <ChannelHeader channel={data.channel} />
                  </div>

                  {/* Tab Navigation */}
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                    {/* Tab Header with clear visual separation */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
                      <h3 className="text-sm sm:text-sm font-bold text-emerald-700 flex items-center gap-2">
                        Menu Analytics
                      </h3>
                      <p className="text-xs text-emerald-600 mt-1 font-medium">
                        Pilih jenis analisis yang ingin ditampilkan
                      </p>
                    </div>

                    {/* Tab Buttons */}
                    <div className="bg-gray-50 border-b border-gray-200 px-2 sm:px-4 py-2">
                      <nav className="flex gap-2 overflow-x-auto scrollbar-hide">
                        <button
                          onClick={() => setActiveTab("analytics")}
                          className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 border-2 font-bold text-sm whitespace-nowrap flex flex-col sm:flex-row items-center gap-2 transition-all duration-200 rounded-xl shadow-sm ${
                            activeTab === "analytics"
                              ? "border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:scale-90"
                              : "border-gray-300 text-gray-600 bg-white hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/50 hover:shadow-md"
                          }`}
                        >
                          <svg
                            className="w-6 h-6 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                          <div className="text-center sm:text-left">
                            <div className="text-sm font-bold">Analytics</div>
                            <div className="text-xs opacity-75 hidden sm:block">
                              Data statistik channel
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveTab("keywords")}
                          className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 border-2 font-bold text-sm whitespace-nowrap flex flex-col sm:flex-row items-center gap-2 transition-all duration-200 rounded-xl shadow-sm relative ${
                            activeTab === "keywords"
                              ? "border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:scale-90"
                              : "border-gray-300 text-gray-600 bg-white hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/50 hover:shadow-md"
                          }`}
                        >
                          <svg
                            className="w-6 h-6 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          <div className="text-center sm:text-left">
                            <div className="text-sm font-bold">Keywords</div>
                            <div className="text-xs opacity-75 hidden sm:block">
                              Analisis kata kunci & hashtag
                            </div>
                          </div>
                        </button>
                      </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px] px-3 sm:px-6 py-3 sm:py-6">
                      {activeTab === "analytics" && (
                        <AnalyticsTab data={data} />
                      )}
                      {activeTab === "keywords" && (
                        <KeywordInsightsTab
                          channelId={data.channel.id}
                          channelTitle={data.channel.title}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Trending Analysis Section */}
              {!data && !loading && showTrendingAnalysis && (
                <div className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
                      <div>
                        <h3 className="text-sm sm:text-sm font-bold text-red-700 flex items-center gap-2">
                          🔥 Trending Analysis
                        </h3>
                        <p className="text-xs text-red-600 mt-1 font-medium">
                          Analisis real-time video trending YouTube
                        </p>
                      </div>
                    </div>

                    <div className="min-h-[400px] px-3 sm:px-6 py-3 sm:py-6">
                      <TrendingAnalytics />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Coupon Activation Modal */}
          {showCouponModal && (
            <CouponActivation
              onClose={() => setShowCouponModal(false)}
              onSuccess={() => {
                setShowCouponModal(false);
                // Refresh will happen automatically via useSubscription hook
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
