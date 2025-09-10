import { NextRequest, NextResponse } from "next/server";
import { searchChannelByName, getChannelDetails, listUploadVideoIds, getVideoStats } from "@/app/lib/youtube";
import { buildAnalytics } from "@/app/lib/analytics";
import type { AnalyzeResponse } from "@/types";


export const dynamic = "force-dynamic"; // always run on demand


export async function GET(req: NextRequest) {
	try {
		const query = req.nextUrl.searchParams.get("q");
		if (!query) {
			return NextResponse.json({ error: "Query is required" }, { status: 400 });
		}

		const { id } = await searchChannelByName(query);
		const info = await getChannelDetails(id);
		const uploads = await listUploadVideoIds(info.uploadsPlaylistId);
		const videos = await getVideoStats(uploads);
		const analytics = buildAnalytics(videos);

		const payload: AnalyzeResponse = {
			channel: {
				id: info.id,
				title: info.title,
				description: info.description,
				thumbnails: {
					default: info.thumbnails?.default?.url,
					medium: info.thumbnails?.medium?.url,
					high: info.thumbnails?.high?.url,
				},
				statistics: info.statistics,
			},
			videos,
			analytics,
		};
		return NextResponse.json(payload, { status: 200 });
	} catch (e: any) {
		console.error("Analyze API error:", e);
		return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
	}
}