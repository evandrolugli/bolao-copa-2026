"use client";

import { useMemo, useState } from "react";
import { isMatchPublished, PREDICTION_STATUS } from "../lib/utils/constants";
import type { MatchWithPredictions } from "../lib/utils/types";

type Props = {
	match: MatchWithPredictions;
	stats?: {
		exact: number;
		correct: number;
		wrong: number;
	};
	variant?: "published" | "pending";
	leaderboard?: {
		id: number;
		position: number;
		points: number;
		name: string;
	}[];
};

function sortPredictions(
	predictions: any[],
	isPublished: boolean,
	leaderboardMap: Map<number, number>,
) {
	const sorted = [...predictions];

	if (!isPublished) {
		// UNPUBLISHED → use leaderboard ranking
		return sorted.sort((a, b) => {
			const posA = leaderboardMap.get(a.participant.id) ?? 9999;
			const posB = leaderboardMap.get(b.participant.id) ?? 9999;

			if (posA !== posB) return posA - posB;

			return a.participant.name.localeCompare(b.participant.name);
		});
	}

	// PUBLISHED → by points
	return sorted.sort((a, b) => {
		if (b.points !== a.points) return b.points - a.points;
		return a.participant.name.localeCompare(b.participant.name);
	});
}

function getBadgeClass(status: string) {
	switch (status) {
		case PREDICTION_STATUS.EXACT:
			return "bg-green-100 text-green-700";
		case PREDICTION_STATUS.CORRECT:
			return "bg-yellow-100 text-yellow-700";
		default:
			return "bg-red-100 text-red-600";
	}
}

export default function MatchCard({
	match,
	stats,
	variant,
	leaderboard,
}: Props) {
	const [open, setOpen] = useState(false);

	const isPublished = isMatchPublished(match);

	// ✅ build map safely inside component
	const leaderboardMap = useMemo(() => {
		return new Map((leaderboard ?? []).map((p) => [p.id, p.position]));
	}, [leaderboard]);

	function renderScore() {
		if (!isPublished || match.home_score == null || match.away_score == null) {
			return <p className="text-xs text-zinc-200">Pendente</p>;
		}

		return (
			<p className="font-bold text-zinc-200">
				{match.home_score} x {match.away_score}
			</p>
		);
	}

	const headerClass = isPublished
		? "bg-green-900 text-white active:bg-green-800"
		: "bg-zinc-900 text-white active:bg-zinc-800";

	return (
		<div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
			{/* HEADER */}
			<button
				onClick={() => setOpen((prev) => !prev)}
				className={`w-full flex justify-between items-center p-4 ${headerClass}`}
			>
				<div className="text-left">
					<p className="text-xs text-zinc-300">{match.group}</p>

					<p className="font-semibold">
						{match.home} vs {match.away}
					</p>

					{variant === "published" && stats && (
						<div className="flex gap-4 mt-1 text-xs text-zinc-300">
							<span>🔥 {stats.exact}</span>
							<span>⚡ {stats.correct}</span>
							<span>❌ {stats.wrong}</span>
						</div>
					)}
				</div>

				<div className="text-right">
					<p className="text-xs text-zinc-300">Resultado</p>
					{renderScore()}
				</div>
			</button>

			{/* BODY */}
			{open && (
				<div className="p-3 space-y-2 bg-white">
					{sortPredictions(match.predictions, isPublished, leaderboardMap).map(
						(p) => {
							const canShowPoints =
								isPublished && p.status !== PREDICTION_STATUS.PENDING;

							return (
								<div
									key={`${p.participant_id}-${p.match_id}`}
									className="flex items-center justify-between p-2 rounded-lg border border-zinc-100 active:bg-zinc-50"
								>
									<span className="font-medium text-zinc-900">
										{p.participant.name}
									</span>

									<div className="flex items-center gap-3">
										<span className="font-semibold text-zinc-900 text-base">
											{p.pred_home} x {p.pred_away}
										</span>

										{canShowPoints ? (
											<span
												className={`text-xs px-2 py-1 rounded-md font-semibold ${getBadgeClass(
													p.status,
												)}`}
											>
												{p.points}
											</span>
										) : (
											<span className="text-xs text-zinc-400">—</span>
										)}
									</div>
								</div>
							);
						},
					)}
				</div>
			)}
		</div>
	);
}
