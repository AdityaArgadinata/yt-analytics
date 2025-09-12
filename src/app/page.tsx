"use client";
import { useState, useEffect } from "react";
import ChannelHeader from "@/components/channel-header";
import AnalyticsTab from "@/components/analytics-tab";
import KeywordInsightsTab from "@/components/keyword-insights-tab";
import AuthButton from "@/components/AuthButton";
import PricingCard from "@/components/PricingCard";
import CouponActivation from "@/components/CouponActivation";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { auth } from "@/lib/firebase";
import type { AnalyzeResponse } from "@/types";

export default function HomePage() {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'keywords'>('analytics');

  // Load cached results only when user and subscription are ready, not on every keystroke
  useEffect(() => {
    // Only check cache when subscription status changes, not when typing
  }, [user, subscription.status]);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!user || subscription.status !== "active") return;

    // Check for cached results first
    const key = `yt-analytics-cache-${q.trim().toLowerCase()}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < 3600_000) {
          setData(data);
          return; // Use cached data, no need to make API call
        } else {
          localStorage.removeItem(key); // Remove expired cache
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
      // Save only results to localStorage with timestamp, not the query input
      localStorage.setItem(key, JSON.stringify({ data: json, ts: Date.now() }));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center px-2 sm:px-4 py-4 sm:py-8 font-apple">
      <div className="w-full max-w-4xl">
        <header className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                YouTube Analytics
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Wawasan profesional untuk kreator konten
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <AuthButton />
            </div>
          </div>

          {!user ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 border border-gray-200">
                  <svg
                    className="w-10 h-10 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              {!auth ? (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Konfigurasi Firebase Diperlukan
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    Silakan konfigurasi Firebase untuk mengaktifkan autentikasi.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-left backdrop-blur-sm">
                    <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Petunjuk Setup:
                    </h3>
                    <ol className="text-sm text-amber-700 space-y-2">
                      <li className="flex gap-2">
                        <span className="text-amber-600 font-semibold">1.</span>
                        Buat proyek Firebase di console.firebase.google.com
                      </li>
                      <li className="flex gap-2">
                        <span className="text-amber-600 font-semibold">2.</span>
                        Aktifkan Authentication dengan provider Google
                      </li>
                      <li className="flex gap-2">
                        <span className="text-amber-600 font-semibold">3.</span>
                        Salin konfigurasi ke file .env.local
                      </li>
                      <li className="flex gap-2">
                        <span className="text-amber-600 font-semibold">4.</span>
                        Restart server development
                      </li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Masuk untuk mengakses Analytics
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Hubungkan dengan akun Google Anda untuk menganalisis channel
                    YouTube
                  </p>
                </div>
              )}
            </div>
          ) : subscription.status !== "active" ? (
            <div>
              <SubscriptionStatus />
              <PricingCard onActivateCode={() => setShowCouponModal(true)} />
            </div>
          ) : (
            <>
              <SubscriptionStatus />
              <form onSubmit={onSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
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
                  className="rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-white shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base whitespace-nowrap"
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
                      <span className="hidden sm:inline">Menganalisis...</span>
                      <span className="sm:hidden">Analisis...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 sm:gap-3">
                      Analisis
                    </span>
                  )}
                </button>
              </form>
              {error && (
                <p className="mt-4 text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </p>
              )}
            </>
          )}
        </header>

        {user && subscription.status === "active" && data && (
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6">
              <ChannelHeader channel={data.channel} />
            </div>
            
            {/* Tab Navigation */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-t-2xl shadow-xl">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6 pt-6">
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                      activeTab === 'analytics'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('keywords')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                      activeTab === 'keywords'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Keyword & Hashtag Insights
                    <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
                      NEW
                    </span>
                  </button>
                </nav>
              </div>
              
              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'analytics' && <AnalyticsTab data={data} />}
                {activeTab === 'keywords' && (
                  <KeywordInsightsTab 
                    channelId={data.channel.id}
                    channelTitle={data.channel.title}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {user && subscription.status === "active" && !data && !loading && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 border border-gray-200">
                <svg
                  className="w-8 h-8 text-gray-500"
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
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Siap untuk analisis
            </h3>
            <p className="text-gray-600 text-lg">
              Masukkan nama channel YouTube di atas dan klik{" "}
              <span className="text-emerald-600 font-semibold">Analisis</span>
              <br />
            </p>
          </div>
        )}
      </div>

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
    </main>
  );
}
