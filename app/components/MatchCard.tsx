"use client";

import { useState } from "react";
import { isMatchPublished, PREDICTION_STATUS } from "../lib/utils/constants";
import type { MatchWithPredictions } from "../lib/utils/types";

function sortPredictions(predictions: any[]) {
	return [...predictions].sort((a, b) => {
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

export default function MatchCard({ match }: { match: MatchWithPredictions }) {
	const [open, setOpen] = useState(false);

	const isPublished = isMatchPublished(match);

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

	return (
		<div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
			{/* HEADER */}
			<button
				onClick={() => setOpen((prev) => !prev)}
				className="w-full flex justify-between items-center p-4 bg-zinc-900 text-white active:bg-zinc-800"
			>
				<div className="text-left">
					<p className="text-xs text-zinc-300">{match.group}</p>
					<p className="font-semibold">
						{match.home} vs {match.away}
					</p>
				</div>

				<div className="text-right">
					<p className="text-xs text-zinc-300">Resultado</p>
					{renderScore()}
				</div>
			</button>

			{/* BODY */}
			{open && (
				<div className="p-3 space-y-2 bg-white">
					{sortPredictions(match.predictions).map((p) => {
						const canShowPoints =
							isPublished && p.status !== PREDICTION_STATUS.PENDING;

						return (
							<div
								key={`${p.participant_id}-${p.match_id}`}
								className="flex items-center justify-between p-2 rounded-lg border border-zinc-100 active:bg-zinc-50"
							>
								{/* name */}
								<span className="font-medium text-zinc-900">
									{p.participant.name}
								</span>

								{/* prediction + points */}
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
					})}
				</div>
			)}
		</div>
	);
}
