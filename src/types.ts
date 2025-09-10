export type VideoLite = {
id: string;
title: string;
publishedAt: string; // ISO
viewCount: number;
};


export type ChannelBasics = {
id: string;
title: string;
description?: string;
thumbnails: { default?: string; medium?: string; high?: string };
statistics: { viewCount: number; subscriberCount?: number; videoCount?: number };
};


export type AnalyzeResponse = {
channel: ChannelBasics;
videos: VideoLite[]; // up to 500, newest first
analytics: {
byDay: { day: string; uploads: number; totalViews: number }[];
byHour: { hour: number; uploads: number; totalViews: number }[];
byMonth: { ym: string; uploads: number; totalViews: number }[];
suggestions: string[];
topKeywords: { word: string; count: number }[];
};
};