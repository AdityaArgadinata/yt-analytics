"use client";
import Image from "next/image";
import type { ChannelBasics } from "@/types";
import { FaYoutube, FaCheckCircle } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";

export default function ChannelHeader({ channel }: { channel: ChannelBasics }) {
	const formatSubscribers = (count: number) => {
		if (count >= 1000000) {
			return `${(count / 1000000).toFixed(1)}M subscriber`;
		} else if (count >= 1000) {
			return `${(count / 1000).toFixed(1)}K subscriber`;
		}
		return `${count} subscriber`;
	};

	const formatViews = (count: number) => {
		if (count >= 1000000000) {
			return `${(count / 1000000000).toFixed(1)}B tayangan`;
		} else if (count >= 1000000) {
			return `${(count / 1000000).toFixed(1)}M tayangan`;
		} else if (count >= 1000) {
			return `${(count / 1000).toFixed(1)}K tayangan`;
		}
		return `${count} tayangan`;
	};

	return (
		<div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg shadow-gray-200/20 mb-4 sm:mb-6">
			{/* Channel Banner */}
			<div className="relative h-24 sm:h-32 md:h-40 lg:h-48 bg-gradient-to-r from-red-500 via-red-600 to-red-700 overflow-hidden">
				{channel.thumbnails?.high ? (
					<div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent">
						<Image 
							src={channel.thumbnails.high} 
							alt={`${channel.title} banner`} 
							fill 
							className="object-cover opacity-80" 
						/>
					</div>
				) : (
					<div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-700">
						<div className="absolute inset-0 bg-black/10"></div>
						<div className="absolute inset-0 flex items-center justify-center">
							<FaYoutube className="text-white/30 text-3xl sm:text-4xl md:text-5xl lg:text-6xl" />
						</div>
					</div>
				)}
			</div>

			{/* Channel Info Section */}
			<div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6">
				<div className="flex flex-col gap-3 sm:gap-4">
					{/* Mobile: Stacked Layout */}
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start">
						{/* Avatar */}
						<div className="relative flex-shrink-0 -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-24 self-start">
							<div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 overflow-hidden rounded-full bg-white p-0.5 sm:p-1 shadow-lg shadow-black/20">
								{channel.thumbnails?.high ? (
									<Image 
										src={channel.thumbnails.high} 
										alt={channel.title} 
										fill 
										sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px" 
										className="object-cover rounded-full" 
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 rounded-full">
										<FaYoutube className="text-lg sm:text-xl md:text-2xl" />
									</div>
								)}
							</div>
						</div>

						{/* Channel Details */}
						<div className="flex-1 min-w-0">
							{/* Channel Name & Verification */}
							<div className="flex items-start sm:items-center gap-2 mb-2 sm:mb-3">
								<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight break-words">
									{channel.title}
								</h1>
								<FaCheckCircle className="text-gray-400 text-sm sm:text-base md:text-lg flex-shrink-0 mt-0.5 sm:mt-0" />
							</div>

							{/* Channel Handle & Stats - Mobile: Stack vertically */}
							<div className="space-y-1 sm:space-y-0 mb-3">
								<div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-600">
									<span>@{channel.title.toLowerCase().replace(/\s+/g, '')}</span>
								</div>
								<div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-600">
									<span>
										{channel.statistics.subscriberCount ? 
											formatSubscribers(channel.statistics.subscriberCount) : 
											'Subscriber tersembunyi'
										}
									</span>
									<span className="text-gray-400">•</span>
									<span>
										{channel.statistics.videoCount || 0} video
									</span>
								</div>
							</div>

							{/* Description - Hide on very small screens */}
							{channel.description && (
								<p className="hidden sm:block text-gray-700 text-sm mb-3 line-clamp-2 max-w-3xl leading-relaxed">
									{channel.description}
								</p>
							)}

							{/* Total Views */}
							<div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
								<span className="font-medium">{formatViews(channel.statistics.viewCount)}</span>
								<span className="ml-1">total tayangan</span>
							</div>
						</div>
					</div>

					{/* Action Buttons - Full width on mobile */}
					<div className="flex justify-end flex-col sm:flex-row gap-2 sm:gap-3">
						<a
							href={`https://youtube.com/channel/${channel.id}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium shadow-lg shadow-red-600/25 order-1"
						>
							<FaYoutube className="text-sm sm:text-base" />
							<span>Kunjungi Channel</span>
							<HiOutlineExternalLink className="text-xs sm:text-sm" />
						</a>
						<button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 text-xs sm:text-sm font-medium order-2">
							<svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
							</svg>
							<span>Bagikan</span>
						</button>
					</div>

					{/* Description on mobile - Show at bottom */}
					{channel.description && (
						<div className="sm:hidden">
							<p className="text-gray-700 text-xs leading-relaxed line-clamp-3">
								{channel.description}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}