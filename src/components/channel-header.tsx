"use client";
import Image from "next/image";
import type { ChannelBasics } from "@/types";
import { FaYoutube } from "react-icons/fa";


export default function ChannelHeader({ channel }: { channel: ChannelBasics }) {
	return (
		<div className="tab-card mb-6 flex items-center gap-4 p-4">
			<div className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-slate-200">
				{channel.thumbnails?.high ? (
					<Image src={channel.thumbnails.high} alt={channel.title} fill sizes="64px" className="object-cover" />
				) : (
					<div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">YT</div>
				)}
			</div>
			<div>
				<h1 className="text-xl font-bold mb-2 flex items-center gap-1.5"><FaYoutube className="text-red-600 translate-y-0.5"/> {channel.title}</h1>
				{channel.description && (
					<p className="text-slate-600 text-sm mb-1 max-w-xl line-clamp-2">{channel.description}</p>
				)}
				<p className="subtle text-sm">Total channel views: {channel.statistics.viewCount.toLocaleString()}</p>
			</div>
		</div>
	);
}