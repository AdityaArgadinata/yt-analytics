"use client";
import { useState, useEffect } from "react";
import ChannelHeader from "@/components/channel-header";
import AnalyticsTab from "@/components/analytics-tab";
import type { AnalyzeResponse } from "@/types";

export default function HomePage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load query and cache from localStorage only on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastQuery = localStorage.getItem("yt-analytics-last-query") || "";
      if (lastQuery && !q) setQ(lastQuery);
    }
  }, []);

  useEffect(() => {
    if (!q.trim()) return;
    const key = `yt-analytics-cache-${q.trim().toLowerCase()}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < 3600_000) {
          setData(data);
        } else {
          localStorage.removeItem(key);
        }
      } catch {}
    }
    // Simpan query terakhir
    localStorage.setItem("yt-analytics-last-query", q.trim());
  }, [q]);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setData(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/analyze?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setData(json as AnalyzeResponse);
      // Save to localStorage with timestamp
      const key = `yt-analytics-cache-${q.trim().toLowerCase()}`;
      localStorage.setItem(key, JSON.stringify({ data: json, ts: Date.now() }));
      localStorage.setItem("yt-analytics-last-query", q.trim());
    } catch (err: any) {
      setError(err?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <header className="bg-white/90 rounded-2xl p-6 mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-4 text-center">
            YouTube Channel Analytics
          </h1>
          <form onSubmit={onSearch} className="flex items-center gap-2">
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg
                  width="20"
                  height="20"
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
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 outline-none ring-slate-400 focus:ring-2 focus:bg-white transition text-base placeholder:text-slate-400"
                placeholder="Telusuri nama channel"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                autoFocus
                autoComplete="off"
              />
            </div>
            <button
              disabled={loading || !q.trim()}
              className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-3 font-semibold text-white shadow hover:scale-105 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin"
                    width="18"
                    height="18"
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
                  Memproses...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  Analisis
                </span>
              )}
            </button>
          </form>
          {error && (
            <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
          )}
        </header>

        {data && (
          <div className="space-y-6">
            <ChannelHeader channel={data.channel} />
            <AnalyticsTab data={data} />
          </div>
        )}

        {!data && !loading && (
          <div className="bg-white/80 rounded-xl shadow p-6 text-center text-slate-700">
            <p className="text-base subtle">
              Masukkan nama channel lalu tekan <b>Analisis</b>.<br />
              Kita akan mengambil hingga <b>500 video terbaru</b> untuk laporan
              seperti pada contoh.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
