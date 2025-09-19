import type { VideoLite } from "@/types";

export function buildAnalytics(videos: VideoLite[]) {
  const keywordCount = new Map<string, number>();
  const stop = new Set(
    "a,an,the,di,dan,yang,ke,dari,of,for,to,in,on,itu,ini,apa,kok,ga,nggak,gak,udah,aja,siapa,kan,ya,aku,kamu,mas,adik,adiknya,my,our,your,with,vs,vs.,&,#,?,!,|".split(
      ","
    )
  );

  // Simple keyword extraction from video titles (direct from YouTube API data)
  for (const v of videos) {
    const words = v.title
      .toLowerCase()
      .replace(/[#"'()\[\],.?!:;|]/g, " ")
      .split(/\s+/)
      .filter((w) => w && !stop.has(w) && w.length > 2);
    for (const w of words) keywordCount.set(w, (keywordCount.get(w) ?? 0) + 1);
  }

  const topKeywords = Array.from(keywordCount, ([word, count]) => ({
    word,
    count,
  }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  // Simple suggestions based on direct YouTube data
  const suggestions: string[] = [
    "Analisis berdasarkan data video terbaru dari YouTube API.",
    "Keyword analysis menggunakan judul video yang tersedia secara publik.",
    "Manfaatkan trending keywords untuk optimasi konten selanjutnya."
  ];

  const topKeyword = topKeywords[0]?.word;
  if (topKeyword)
    suggestions.push(
      `Kata kunci "${topKeyword}" muncul paling sering dalam judul video Anda.`
    );

  return { 
    topKeywords, 
    suggestions,
    // Empty arrays for compatibility but no calculated metrics
    byDay: [],
    byHour: [],
    byMonth: []
  };
}
