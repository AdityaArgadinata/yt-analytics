// lib/youtube.ts
import { cache } from "react";

const API = "https://www.googleapis.com/youtube/v3";
const KEY = process.env.YOUTUBE_API_KEY || "";
const MAX_VIDEOS = Number(process.env.MAX_VIDEOS ?? 100);

// ---------- helpers ----------
function qs(obj: Record<string, any>) {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
}

// agar log tidak membocorkan API key
function maskKey(k: string) {
  if (!k) return "(EMPTY)";
  if (k.length <= 8) return "********";
  return `${k.slice(0, 4)}****${k.slice(-4)}`;
}

async function fetchJson(url: string, revalidateSec = 60) {
  const started = Date.now();
  const res = await fetch(url, { next: { revalidate: revalidateSec } }).catch(
    (e) => {
      // network error
      console.error("[YT] Network error:", e);
      throw new Error("YouTube fetch failed (network).");
    }
  );

  if (!res.ok) {
    // coba ambil body agar tahu reason (quotaExceeded, accessNotConfigured, dll)
    let detail: any = null;
    try {
      detail = await res.json();
    } catch {
      try {
        detail = await res.text();
      } catch {}
    }
    console.error("[YT] HTTP error", {
      status: res.status,
      url,
      detail,
      tookMs: Date.now() - started,
      keySet: !!KEY,
    });
    const reason =
      (detail && (detail.error?.errors?.[0]?.reason || detail.error?.message)) ||
      "";
    throw new Error(
      `YouTube API error (HTTP ${res.status})${reason ? `: ${reason}` : ""}`
    );
  }

  const json = await res.json();
  // log ringkas saat success (matikan jika dirasa berlebihan)
  console.log("[YT] OK", {
    url,
    tookMs: Date.now() - started,
  });
  return json;
}

// ---------- API wrappers ----------

export const searchChannelByName = cache(async (query: string) => {
  if (!KEY) {
    console.error("[YT] Missing API KEY. process.env.YOUTUBE_API_KEY is empty.");
    throw new Error("Server is not configured with YOUTUBE_API_KEY.");
  }

  const url = `${API}/search?${qs({
    part: "snippet",
    q: query,
    type: "channel",
    maxResults: 1,
    key: KEY,
  })}`;

  console.log("[YT] searchChannelByName", { query, key: maskKey(KEY) });

  const data = await fetchJson(url, 60 * 10);
  const item = data.items?.[0];
  if (!item) {
    console.warn("[YT] Channel not found for query:", query);
    throw new Error("Channel not found");
  }
  return {
    id: item.id.channelId as string,
    title: item.snippet.title as string,
  };
});

export async function getChannelDetails(channelId: string) {
  const url = `${API}/channels?${qs({
    part: "snippet,statistics,contentDetails",
    id: channelId,
    key: KEY,
  })}`;

  console.log("[YT] getChannelDetails", { channelId });

  const data = await fetchJson(url, 60 * 10);
  const c = data.items?.[0];
  if (!c) {
    console.error("[YT] Channel details not found", { channelId, data });
    throw new Error("Channel details not found");
  }
  return {
    id: c.id as string,
    title: c.snippet.title as string,
    description: c.snippet.description as string,
    thumbnails: c.snippet.thumbnails ?? {},
    statistics: {
      viewCount: Number(c.statistics.viewCount ?? 0),
      subscriberCount: Number(c.statistics.subscriberCount ?? 0),
      videoCount: Number(c.statistics.videoCount ?? 0),
    },
    uploadsPlaylistId: c.contentDetails?.relatedPlaylists?.uploads as string,
  };
}

export async function listUploadVideoIds(
  uploadsPlaylistId: string,
  max: number = MAX_VIDEOS
) {
  if (!uploadsPlaylistId) {
    console.error("[YT] uploadsPlaylistId is empty");
    throw new Error("Channel has no public uploads playlist.");
  }

  let pageToken: string | undefined = undefined;
  const ids: { id: string; title: string; publishedAt: string }[] = [];

  console.log("[YT] listUploadVideoIds: start", {
    uploadsPlaylistId,
    max,
  });

  while (ids.length < max) {
    const url = `${API}/playlistItems?${qs({
      part: "snippet,contentDetails", // penting: contentDetails untuk videoId
      playlistId: uploadsPlaylistId,
      maxResults: 50,
      pageToken,
      key: KEY,
    })}`;

    const data = await fetchJson(url, 60);
    const items = data.items ?? [];

    if (!items.length) {
      console.warn("[YT] No playlistItems returned", {
        uploadsPlaylistId,
        pageToken,
      });
    }

    for (const it of items) {
      const vid = it.contentDetails?.videoId || it.snippet?.resourceId?.videoId;
      const title = it.snippet?.title ?? "";
      const publishedAt =
        it.contentDetails?.videoPublishedAt || it.snippet?.publishedAt;
      if (vid) ids.push({ id: vid, title, publishedAt });
      if (ids.length >= max) break;
    }
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  console.log("[YT] listUploadVideoIds: done", {
    total: ids.length,
    truncated: ids.length > max,
  });

  return ids;
}

export async function getVideoStats(
  videoIds: { id: string; title: string; publishedAt: string }[]
) {
  const out: {
    id: string;
    title: string;
    publishedAt: string;
    viewCount: number;
  }[] = [];

  console.log("[YT] getVideoStats: start", { count: videoIds.length });

  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);
    const ids = chunk.map((v) => v.id).join(",");
    const url = `${API}/videos?${qs({
      part: "statistics,snippet",
      id: ids,
      maxResults: 50,
      key: KEY,
    })}`;

    const data = await fetchJson(url, 60);
    const map: Record<string, any> = {};
    for (const it of data.items ?? []) map[it.id] = it;

    for (const v of chunk) {
      const it = map[v.id];
      out.push({
        id: v.id,
        title: (it?.snippet?.title as string) ?? v.title,
        publishedAt: (it?.snippet?.publishedAt as string) ?? v.publishedAt,
        viewCount: Number(it?.statistics?.viewCount ?? 0),
      });
    }
  }

  out.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  console.log("[YT] getVideoStats: done", { total: out.length });

  return out;
}
