"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import type { VideoLite } from "@/types";

type SortKey = "title" | "publishedAt" | "viewCount" | "type";
type SortOrder = "asc" | "desc";
const PAGE_SIZE = 20;

// Helper function to convert ISO 8601 duration to seconds
function parseDuration(duration?: string): number {
  if (!duration) return 0;
  
  // YouTube duration format: PT#H#M#S, PT#M#S, PT#S
  // Examples: PT4M13S (4 minutes 13 seconds), PT1H2M10S (1 hour 2 minutes 10 seconds), PT30S (30 seconds)
  
  // Clean the duration string and validate format
  const cleanDuration = duration.trim().toUpperCase();
  if (!cleanDuration.startsWith('PT')) {
    console.warn('Invalid duration format (no PT prefix):', duration);
    return 0;
  }
  
  // More comprehensive regex to handle all possible formats including edge cases
  const match = cleanDuration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/);
  if (!match) {
    console.warn('Duration format not recognized:', duration);
    return 0;
  }
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseFloat(match[3] || '0');
  
  // Validate parsed values
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    console.warn('Invalid numeric values in duration:', { duration, hours, minutes, seconds });
    return 0;
  }
  
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
  // Additional validation
  if (totalSeconds < 0) {
    console.warn('Negative duration calculated:', { duration, totalSeconds });
    return 0;
  }
  
  return totalSeconds;
}

// Helper function to determine video type
function getVideoType(duration?: string): 'Short' | 'Long' {
  // If no duration data, assume it's a Long video (safer default)
  if (!duration) {
    return 'Long';
  }
  
  const durationInSeconds = parseDuration(duration);
  
  // If parsing failed (0 seconds), default to Long
  if (durationInSeconds === 0) {
    return 'Long';
  }
  
  // YouTube Shorts are videos 3 minutes (180 seconds) or less
  // Updated from 60 seconds to 180 seconds (3 minutes)
  const isShort = durationInSeconds > 0 && durationInSeconds <= 180;
  
  return isShort ? 'Short' : 'Long';
}

// Helper function to format duration for display
function formatDuration(duration?: string): string {
  if (!duration) return 'N/A';
  
  const totalSeconds = parseDuration(duration);
  if (totalSeconds === 0) return 'N/A';
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Test function to validate duration parsing (for debugging)
function testDurationParsing() {
  const testCases = [
    { duration: 'PT30S', expected: 30, type: 'Short' },
    { duration: 'PT1M', expected: 60, type: 'Short' },
    { duration: 'PT1M30S', expected: 90, type: 'Short' },
    { duration: 'PT2M', expected: 120, type: 'Short' },
    { duration: 'PT3M', expected: 180, type: 'Short' },
    { duration: 'PT3M1S', expected: 181, type: 'Long' },
    { duration: 'PT4M', expected: 240, type: 'Long' },
    { duration: 'PT1H', expected: 3600, type: 'Long' },
    { duration: 'PT1H2M3S', expected: 3723, type: 'Long' },
    { duration: '', expected: 0, type: 'Long' },
    { duration: 'PT0S', expected: 0, type: 'Long' },
  ];
  
  console.log('=== Duration Parsing Test Results (Updated: 3 minutes threshold) ===');
  testCases.forEach(({ duration, expected, type }) => {
    const parsed = parseDuration(duration);
    const classified = getVideoType(duration);
    const isCorrect = parsed === expected && classified === type;
    console.log(`${isCorrect ? '✅' : '❌'} "${duration}" → ${parsed}s (${classified}) | Expected: ${expected}s (${type})`);
  });
}

export default function DataTable({ videos }: { videos: VideoLite[] }) {
  // Run duration parsing test on component mount (for debugging)
  useEffect(() => {
    testDurationParsing();
  }, []);

  function handleExportExcel() {
    const data = videos.map((v) => {
      const date = new Date(v.publishedAt);
      const formattedDate = date.toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      const dayName = date.toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        weekday: "long",
      });
      
      return {
        "Tipe": getVideoType(v.duration),
        "Judul Video": v.title,
        "Tanggal Upload": `${formattedDate} - WIB`,
        "Hari": dayName,
        "Durasi": formatDuration(v.duration),
        "Durasi Raw": v.duration || 'N/A',
        Views: v.viewCount,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Video Analytics");
    XLSX.writeFile(
      workbook,
      `yt-analytics-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  }
  const [sortKey, setSortKey] = useState<SortKey>("publishedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);
  const [clientDates, setClientDates] = useState<string[]>([]);
  const [clientDays, setClientDays] = useState<string[]>([]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
    setPage(1); // reset to first page on sort
  }

  const sortedVideos = [...videos].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "title") {
      cmp = a.title.localeCompare(b.title);
    } else if (sortKey === "publishedAt") {
      cmp =
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    } else if (sortKey === "viewCount") {
      cmp = a.viewCount - b.viewCount;
    } else if (sortKey === "type") {
      const typeA = getVideoType(a.duration);
      const typeB = getVideoType(b.duration);
      cmp = typeA.localeCompare(typeB);
    }
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sortedVideos.length / PAGE_SIZE);
  const pagedVideos = sortedVideos.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setClientDates(
      pagedVideos.map((v) =>
        new Date(v.publishedAt).toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    );
    
    setClientDays(
      pagedVideos.map((v) =>
        new Date(v.publishedAt).toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          weekday: "long",
        }).toLowerCase()
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortKey, sortOrder, videos]);

  if (clientDates.length !== pagedVideos.length || clientDays.length !== pagedVideos.length) {
    return <div className="text-center py-8 text-slate-500">Memuat data…</div>;
  }

  return (
    <div className="font-apple">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-slate-900">Data Video</h3>
        <button
          onClick={handleExportExcel}
          className="text-sm rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-4 py-2 text-white shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export to Excel
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-emerald-50 text-left font-semibold text-slate-700">
            <tr>
              <th
                className="px-4 py-3 cursor-pointer select-none border-b border-slate-200 hover:bg-emerald-100 transition-colors"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center gap-2">
                  Tipe
                  <span className="text-emerald-600">
                    {sortKey === "type" && (sortOrder === "asc" ? "▲" : "▼")}
                  </span>
                </div>
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none border-b border-slate-200 hover:bg-emerald-100 transition-colors"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center gap-2">
                  Judul Video
                  <span className="text-emerald-600">
                    {sortKey === "title" && (sortOrder === "asc" ? "▲" : "▼")}
                  </span>
                </div>
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none border-b border-slate-200 hover:bg-emerald-100 transition-colors"
                onClick={() => handleSort("publishedAt")}
              >
                <div className="flex items-center gap-2">
                  Tanggal Upload
                  <span className="text-emerald-600">
                    {sortKey === "publishedAt" && (sortOrder === "asc" ? "▲" : "▼")}
                  </span>
                </div>
              </th>
              <th className="px-4 py-3 border-b border-slate-200 text-center">
                <div className="text-slate-700">
                  Durasi
                </div>
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer select-none border-b border-slate-200 hover:bg-emerald-100 transition-colors"
                onClick={() => handleSort("viewCount")}
              >
                <div className="flex items-center justify-end gap-2">
                  Views
                  <span className="text-emerald-600">
                    {sortKey === "viewCount" && (sortOrder === "asc" ? "▲" : "▼")}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pagedVideos.map((v, i) => (
              <tr
                key={v.id}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-slate-100"
                } hover:bg-emerald-50 transition-colors`}
              >
                <td className="px-4 py-3 border-r border-slate-200 align-top">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <span>{getVideoType(v.duration) === 'Short' ? '📱' : '🎬'}</span>
                      <span>{getVideoType(v.duration)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border-r border-slate-200 align-top">
                  <div className="font-medium text-slate-900 leading-snug text-sm sm:text-base" title={v.title}>
                    {v.title}
                  </div>
                </td>
                <td className="px-4 py-3 border-r border-slate-200 whitespace-nowrap align-top text-slate-600">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs sm:text-sm">{clientDates[i]} - WIB</div>
                    <div className="text-xs font-bold text-slate-500 capitalize">{clientDays[i]}</div>
                  </div>
                </td>
                <td className="px-4 py-3 border-r border-slate-200 text-center align-top">
                  <div className="text-sm font-medium text-slate-700">
                    {formatDuration(v.duration)}
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums align-top">
                  <div className="font-semibold text-slate-800 text-sm sm:text-base">
                    {v.viewCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">views</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-emerald-50/50 border-t border-slate-200 gap-3">
          <span className="text-sm text-slate-600 font-medium">
            Menampilkan {(page - 1) * PAGE_SIZE + 1} -{" "}
            {Math.min(page * PAGE_SIZE, sortedVideos.length)} dari{" "}
            {sortedVideos.length} video
          </span>
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ← Prev
            </button>
            <span className="text-sm font-medium text-slate-700 px-2">
              {page} / {totalPages}
            </span>
            <button
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
