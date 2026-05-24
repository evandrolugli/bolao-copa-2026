"use client";

import { useState } from "react";
import { isMatchPublished, PREDICTION_STATUS } from "../lib/utils/constants";
import type { MatchWithPredictions } from "../lib/utils/types";

function sortPredictions(predictions: any[]) {
	return [...predictions].sort((a, b) => {
		// points first (descending)
		if (b.points !== a.points) return b.points - a.points;

		// then alphabetical by name
		return a.participant.name.localeCompare(b.participant.name);
	});
}

// helper: badge style based on prediction result
function getBadgeClass(status: string) {
	switch (status) {
		case PREDICTION_STATUS.EXACT:
			return "bg-green-200 text-green-800";
		case PREDICTION_STATUS.CORRECT:
			return "bg-yellow-200 text-yellow-800";
		default:
			return "bg-red-200 text-red-700";
	}
}

export default function MatchCard({ match }: { match: MatchWithPredictions }) {
	const [open, setOpen] = useState(false);

	const isPublished = isMatchPublished(match);

	// helper: render match score
	function renderScore() {
		if (!isPublished) {
			return <p className="text-xs text-zinc-400">Pendente</p>;
		}

		if (match.home_score == null || match.away_score == null) {
			return <p className="text-xs text-zinc-400">Pendente</p>;
		}

		return (
			<p className="font-bold">
				{match.home_score} x {match.away_score}
			</p>
		);
	}

	return (
		<div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
			{/* HEADER */}
			<button
				onClick={() => setOpen((prev) => !prev)}
				className="w-full flex justify-between items-center p-4 bg-zinc-900 text-white"
			>
				<div className="text-left">
					<p className="text-xs text-zinc-300">{match.group}</p>
					<p className="font-bold">
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
				<div className="p-3 space-y-2">
					{sortPredictions(match.predictions).map((p) => {
						const canShowPoints =
							isPublished && p.status !== PREDICTION_STATUS.PENDING;

						return (
							<div
								key={`${p.participant_id}-${p.match_id}`}
								className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50"
							>
								{/* name */}
								<span className="font-medium">{p.participant.name}</span>

								{/* prediction + points */}
								<div className="flex items-center gap-3">
									<span className="font-semibold">
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
