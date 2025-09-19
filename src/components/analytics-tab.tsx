"use client";
import { useMemo } from "react";
import type { AnalyzeResponse } from "@/types";
import DataTable from "@/components/data-table";

export default function AnalyticsTabs({ data }: { data: AnalyzeResponse }) {
  const topHash = useMemo(
    () => data.analytics.topKeywords.map((k) => `#${k.word}`),
    [data]
  );

  const totals = useMemo(
    () => ({
      videos: data.videos.length,
      views: data.channel.statistics.viewCount,
      subscribers: data.channel.statistics.subscriberCount ?? 0,
    }),
    [data]
  );

  return (
    <div className="space-y-6 font-apple">
      {/* Ringkasan & Views */}
      <section className="tab-card p-4 mb-2">
        <h2 className="section-title mb-3 font-bold">Ringkasan & Views</h2>
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          <Stat
            label="Total Video (sample)"
            value={totals.videos.toLocaleString()}
          />
          <Stat
            label="Total Channel Views"
            value={totals.views.toLocaleString()}
          />
          <Stat
            label="Total Subscriber"
            value={totals.subscribers.toLocaleString()}
          />
          <Stat
            label="Rata‑rata Views / Video"
            value={Math.round(
              data.videos.reduce((a, b) => a + b.viewCount, 0) /
                Math.max(1, data.videos.length)
            ).toLocaleString()}
          />
        </div>
      </section>

      {/* Data Video Section */}
      <section className="tab-card p-4">
        <h2 className="section-title mb-3 font-bold">Data Video</h2>
        <p className="text-sm text-gray-600 mb-4">
          Informasi detail video yang dianalisis berdasarkan data dari YouTube API.
        </p>
        <div className="mt-4">
          <DataTable videos={data.videos} />
        </div>
      </section>

      {/* Rekomendasi Konten */}
      <section className="tab-card p-4">
        <h2 className="section-title mb-3 font-bold">Rekomendasi Konten</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Idea title="Optimasi format video">
            Analisis 5 video dengan performa terbaik berdasarkan data YouTube untuk mengidentifikasi pola judul dan tema yang efektif.
          </Idea>
          <Idea title="Strategi konten berkelanjutan">
            Manfaatkan insights dari data video trending untuk mengembangkan strategi konten yang konsisten dan relevan.
          </Idea>
        </div>
      </section>

      {/* Pencarian Hashtag */}
      <section className="tab-card p-4">
        <h2 className="section-title mb-3 font-bold">Pencarian Hashtag</h2>
        <div className="flex flex-wrap gap-2">
          {topHash.map((h, i) => (
            <span
              key={i}
              className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              {h}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function Idea({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}
