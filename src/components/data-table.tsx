"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import type { VideoLite } from "@/types";

type SortKey = "title" | "publishedAt" | "viewCount";
type SortOrder = "asc" | "desc";
const PAGE_SIZE = 20;

export default function DataTable({ videos }: { videos: VideoLite[] }) {
  function handleExportExcel() {
    const data = videos.map((v) => ({
      "Judul Video": v.title,
      "Tanggal Upload":
        new Date(v.publishedAt).toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }) + " - WIB",
      Views: v.viewCount,
    }));

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortKey, sortOrder, videos]);

  if (clientDates.length !== pagedVideos.length) {
    return <div className="text-center py-8 text-slate-500">Memuat data…</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-slate-900">Data Video</h3>
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg font-medium shadow hover:bg-green-700 transition-colors flex items-center gap-2"
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
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left font-medium">
            <tr>
              <th
                className="px-3 py-2 cursor-pointer select-none"
                onClick={() => handleSort("title")}
              >
                Judul Video{" "}
                {sortKey === "title" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-3 py-2 cursor-pointer select-none"
                onClick={() => handleSort("publishedAt")}
              >
                Tanggal Upload{" "}
                {sortKey === "publishedAt" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-3 py-2 text-right cursor-pointer select-none"
                onClick={() => handleSort("viewCount")}
              >
                Views{" "}
                {sortKey === "viewCount" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedVideos.map((v, i) => (
              <tr
                key={v.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td
                  className="px-4 py-2 pr-6 truncate max-w-[48ch] align-middle text-slate-900"
                  title={v.title}
                >
                  {v.title}
                </td>
                <td className="px-4 py-2 whitespace-nowrap align-middle text-slate-700">
                  {clientDates[i]} - WIB
                </td>
                <td className="px-4 py-2 text-right tabular-nums align-middle font-semibold text-slate-800">
                  {v.viewCount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
          <span className="text-xs text-slate-600">
            Menampilkan {(page - 1) * PAGE_SIZE + 1} -{" "}
            {Math.min(page * PAGE_SIZE, sortedVideos.length)} dari{" "}
            {sortedVideos.length} video
          </span>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 rounded bg-slate-200 text-xs disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <span className="text-xs translate-y-1">
              Halaman {page} / {totalPages}
            </span>
            <button
              className="px-2 py-1 rounded bg-slate-200 text-xs disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
