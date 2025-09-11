import type { VideoLite } from "@/types";

const DAYS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

export function buildAnalytics(videos: VideoLite[]) {
  const byDayMap = new Map<string, { uploads: number; totalViews: number }>();
  const byHourMap = new Map<number, { uploads: number; totalViews: number }>();
  const byMonthMap = new Map<string, { uploads: number; totalViews: number }>();

  const keywordCount = new Map<string, number>();
  const stop = new Set(
    "a,an,the,di,dan,yang,ke,dari,of,for,to,in,on,itu,ini,apa,kok,ga,nggak,gak,udah,aja,siapa,kan,ya,aku,kamu,mas,adik,adiknya,my,our,your,with,vs,vs.,&,#,?,!,|".split(
      ","
    )
  );

  for (const v of videos) {
    const d = new Date(v.publishedAt);
    const day = DAYS[d.getDay()];
    const hour = d.getHours();
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    const dayEntry = byDayMap.get(day) ?? { uploads: 0, totalViews: 0 };
    dayEntry.uploads += 1;
    dayEntry.totalViews += v.viewCount;
    byDayMap.set(day, dayEntry);

    const hourEntry = byHourMap.get(hour) ?? { uploads: 0, totalViews: 0 };
    hourEntry.uploads += 1;
    hourEntry.totalViews += v.viewCount;
    byHourMap.set(hour, hourEntry);

    const monthEntry = byMonthMap.get(ym) ?? { uploads: 0, totalViews: 0 };
    monthEntry.uploads += 1;
    monthEntry.totalViews += v.viewCount;
    byMonthMap.set(ym, monthEntry);

    // keyword extraction (very simple)
    const words = v.title
      .toLowerCase()
      .replace(/[#"'()\[\],.?!:;|]/g, " ")
      .split(/\s+/)
      .filter((w) => w && !stop.has(w) && w.length > 2);
    for (const w of words) keywordCount.set(w, (keywordCount.get(w) ?? 0) + 1);
  }

  const byDay = Array.from(byDayMap, ([day, val]) => ({ day, ...val })).sort(
    (a, b) => (DAYS as readonly string[]).indexOf(a.day) - (DAYS as readonly string[]).indexOf(b.day)
  );

  const byHour = Array.from(byHourMap, ([hour, val]) => ({
    hour,
    ...val,
  })).sort((a, b) => a.hour - b.hour);

  const byMonth = Array.from(byMonthMap, ([ym, val]) => ({ ym, ...val })).sort(
    (a, b) => a.ym.localeCompare(b.ym)
  );

  const topKeywords = Array.from(keywordCount, ([word, count]) => ({
    word,
    count,
  }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  // suggestions
  const bestDay = byDay
    .slice()
    .sort((a, b) => b.totalViews - a.totalViews)[0]?.day;
  const bestHour = byHour
    .slice()
    .sort((a, b) => b.totalViews - a.totalViews)[0]?.hour;
  const suggestions: string[] = [];
  if (bestDay !== undefined)
    suggestions.push(
      `Unggah di hari ${bestDay} (berdasarkan total views historis).`
    );
  if (bestHour !== undefined)
    suggestions.push(
      `Target jam ${String(bestHour).padStart(2, "0")}:00 untuk boost awal.`
    );
  const topKeyword = topKeywords[0]?.word;
  if (topKeyword)
    suggestions.push(
      `Masukkan kata/hashtag terkait \"${topKeyword}\" pada 1‑2 video berikutnya.`
    );

  return { byDay, byHour, byMonth, topKeywords, suggestions };
}
