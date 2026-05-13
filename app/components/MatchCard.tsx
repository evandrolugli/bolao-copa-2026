"use client";

import { useState } from "react";
import type { MatchWithPredictions } from "../lib/utils/types";

export default function MatchCard({ match }: { match: MatchWithPredictions }) {
	const [open, setOpen] = useState(false);

	// 🧠 helper: match is published
	const isPublished = match.status === "publicar";

	// 🧠 helper: points badge style
	const getBadgeClass = (status: string) => {
		if (status === "exact") return "bg-green-200 text-green-800";
		if (status === "winner") return "bg-yellow-200 text-yellow-800";
		return "bg-red-200 text-red-700";
	};

	// 🧠 helper: score display
	const renderScore = () => {
		if (!isPublished) {
			return <p className="text-xs text-zinc-400">not published</p>;
		}

		return (
			<p className="font-bold">
				{match.home_score ?? "-"} : {match.away_score ?? "-"}
			</p>
		);
	};

	return (
		<div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
			{/* HEADER */}
			<button
				onClick={() => setOpen(!open)}
				className="w-full flex justify-between items-center p-4 bg-zinc-900 text-white"
			>
				<div className="text-left">
					<p className="text-xs text-zinc-300">Round {match.round}</p>
					<p className="font-bold">
						{match.home} vs {match.away}
					</p>
				</div>

				<div className="text-right">
					<p className="text-xs text-zinc-300">Score</p>
					{renderScore()}
				</div>
			</button>

			{/* BODY */}
			{open && (
				<div className="p-3 space-y-2">
					{match.predictions.map((p) => {
						const showPoints = isPublished && p.status !== "pending";

						return (
							<div
								key={`${p.participant_id}-${p.match_id}`}
								className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50"
							>
								{/* name */}
								<span className="font-medium">{p.participant.name}</span>

								{/* prediction + score */}
								<div className="flex items-center gap-3">
									<span className="font-semibold">
										{p.pred_home} - {p.pred_away}
									</span>

									{/* badge */}
									{showPoints ? (
										<span
											className={`
												text-xs px-2 py-1 rounded-md font-semibold
												${getBadgeClass(p.status)}
											`}
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
