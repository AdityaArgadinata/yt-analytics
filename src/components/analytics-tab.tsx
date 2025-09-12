"use client";
import { useMemo } from "react";
import type { AnalyzeResponse } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import DataTable from "@/components/data-table";

export default function AnalyticsTabs({ data }: { data: AnalyzeResponse }) {
  const dayData = data.analytics.byDay.map((d) => ({
    name: d.day,
    Uploads: d.uploads,
    Views: d.totalViews,
  }));
  const hourData = data.analytics.byHour.map((d) => ({
    name: `${String(d.hour).padStart(2, "0")}:00`,
    Uploads: d.uploads,
    Views: d.totalViews,
  }));
  const monthData = data.analytics.byMonth.map((d) => ({
    name: d.ym,
    Uploads: d.uploads,
    Views: d.totalViews,
  }));

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
      <section className="tab-card p-4 mb-10">
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
        <div className="mt-4">
          <DataTable videos={data.videos} />
        </div>
      </section>

      {/* Pola Upload Harian & Jam */}
      <section className="tab-card p-4">
        <h2 className="section-title mb-3 font-bold">Pola Upload Harian & Jam</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <ChartCard title="Total Views per Hari">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Views" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Uploads per Jam">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={hourData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Uploads" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <h3 className="mt-6 font-semibold text-slate-900">Rekomendasi Terapan</h3>
        <ul className="mt-4 list-disc pl-6 text-sm text-slate-600 space-y-1 leading-relaxed">
          {data.analytics.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      {/* Pola Upload Bulanan */}
      <section className="tab-card p-4">
        <h2 className="section-title mb-3 font-bold">Pola Upload Bulanan</h2>
        <ChartCard title="Uploads & Views per Bulan">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Uploads" fill="#059669" />
              <Bar dataKey="Views" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Rekomendasi Konten */}
      <section className="tab-card p-4">
        <h2 className="section-title mb-3 font-bold">Rekomendasi Konten</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Idea title="Ulangi format top‑performer">
            Lihat 5 video dengan views tertinggi dan ulangi pola judul/tema,
            variasikan sudut pandang atau latar.
          </Idea>
          <Idea title="Eksperimen waktu unggah">
            Fokus pada hari/jam terbaik yang direkomendasikan di atas selama 2
            minggu, ukur uplift CTR/retensi.
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

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3 text-sm font-semibold text-slate-700">{title}</div>
      {children}
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
