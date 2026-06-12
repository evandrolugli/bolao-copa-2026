export const dynamic = "force-dynamic";

import { getLeaderboard } from "@/lib/services/leaderboardService";

type LeaderboardEntry = {
	id: number;
	name: string;
	position: number | null;
	points: number;
	exactHits: number;
	correctHits: number;
	wrong: number;
	brazilPoints: number;
	todayPoints: number;
	positionChange: number;

	// Secondary columns
	round1: number;
	round2: number;
	round3: number;
	phase1: number;
	phase2: number;
};

export default async function LeaderboardPage() {
	const { leaderboard, day, matchesCount } = await getLeaderboard();

	const maxValues = {
		exactHits: 0,
		brazilPoints: 0,
		todayPoints: 0,
		positionChange: 0,
		round1: 0,
		round2: 0,
		round3: 0,
		phase1: 0,
		phase2: 0,
	};

	for (const p of leaderboard) {
		maxValues.exactHits = Math.max(maxValues.exactHits, p.exactHits);
		maxValues.brazilPoints = Math.max(maxValues.brazilPoints, p.brazilPoints);
		maxValues.todayPoints = Math.max(maxValues.todayPoints, p.todayPoints);
		maxValues.positionChange = Math.max(
			maxValues.positionChange,
			Math.abs(p.positionChange),
		);

		maxValues.round1 = Math.max(maxValues.round1, p.round1);
		maxValues.round2 = Math.max(maxValues.round2, p.round2);
		maxValues.round3 = Math.max(maxValues.round3, p.round3);
		maxValues.phase1 = Math.max(maxValues.phase1, p.phase1);
		maxValues.phase2 = Math.max(maxValues.phase2, p.phase2);
	}

	function isMax(value: number, max: number) {
		return value === max && max !== 0;
	}

	const roundKeys = ["round1", "round2", "round3", "phase1", "phase2"] as const;

	return (
		<main className="page-container">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-end justify-between gap-4 flex-wrap">
					{/* Left */}
					<div>
						<h1 className="page-title">Classificação</h1>
					</div>

					{/* Right Info */}
					<div className="flex items-center gap-3">
						{/* Matches */}
						<div className="surface px-5 py-3 text-center min-w-[110px]">
							<p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">
								Jogos
							</p>
							<p className="text-2xl font-bold text-zinc-900">{matchesCount}</p>
						</div>

						{/* Day */}
						<div className="surface px-5 py-3 text-center min-w-[110px]">
							<p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">
								Dia
							</p>
							<p className="text-2xl font-bold text-zinc-900">{day}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="table-wrapper">
				<table className="table">
					{/* Header */}
					<thead className="table-header">
						<tr>
							<th className="w-14 p-3 font-semibold">#</th>

							<th className="w-[240px] p-3 text-left font-semibold">
								Participante
							</th>

							<th className="w-16 p-3 bg-emerald-700 text-emerald-100 font-semibold">
								PTS
							</th>

							<th className="w-16 p-3 font-semibold">Em cheio</th>
							<th className="w-16 p-3 font-semibold">Desfechos</th>
							<th className="w-16 p-3 font-semibold">Erros</th>

							<th className="w-16 p-3 bg-amber-200/20 text-amber-200 font-semibold border-l border-amber-200/20">
								Brasil
							</th>

							<th className="w-16 p-3 bg-sky-700 text-sky-200 font-semibold border-l border-sky-200/20">
								Δ Pts (dia)
							</th>

							<th className="w-16 p-3 bg-sky-700 text-sky-200 font-semibold border-r border-sky-200/20">
								Δ Pos (dia)
							</th>

							<th className="w-16 p-3 bg-white/5 text-zinc-200 font-semibold">
								R1
							</th>

							<th className="w-16 p-3 bg-white/5 text-zinc-200 font-semibold">
								R2
							</th>

							<th className="w-16 p-3 bg-white/5 text-zinc-200 font-semibold">
								R3
							</th>

							<th className="w-16 p-3 bg-white/5 text-zinc-200 font-semibold">
								F1
							</th>

							<th className="w-16 p-3 bg-white/5 text-zinc-200 font-semibold">
								F2
							</th>
						</tr>
					</thead>

					<tbody>
						{leaderboard.map((participant, index) => {
							const prevPosition = leaderboard[index - 1]?.position;

							const showPosition =
								participant.position !== null &&
								participant.position !== prevPosition;

							const topThree =
								index <= 2
									? "bg-amber-50 hover:bg-amber-100"
									: "bg-white hover:bg-zinc-50";

							return (
								<tr
									key={participant.id}
									className={`table-row text-center ${topThree}`}
								>
									{/* Position */}
									<td className="table-cell font-bold text-base text-amber-700">
										{showPosition && participant.position !== null
											? `${participant.position}º`
											: ""}
									</td>

									{/* Name */}
									<td className="p-3 text-left font-semibold whitespace-nowrap">
										{participant.name}
									</td>

									{/* Points */}
									<td className="table-cell">
										<div
											className={`
											inline-flex items-center justify-center
											min-w-[52px] h-8 px-3 rounded-lg
											font-bold text-base
											${
												index <= 2
													? "bg-emerald-200 text-emerald-900"
													: "text-emerald-700"
											}
										`}
										>
											{participant.points}
										</div>
									</td>

									{/* Exact */}
									<td className="table-cell">
										<div
											className={`
											inline-flex items-center justify-center
											min-w-10 h-8 px-2 rounded-lg
											${
												isMax(participant.exactHits, maxValues.exactHits)
													? "bg-violet-200 text-violet-900 font-bold"
													: ""
											}
										`}
										>
											{participant.exactHits}
										</div>
									</td>

									{/* Correct */}
									<td className="table-cell">
										<div className="inline-flex items-center justify-center min-w-10 h-8 px-2 rounded-lg">
											{participant.correctHits}
										</div>
									</td>

									{/* Wrong */}
									<td className="table-cell text-zinc-500">
										{participant.wrong}
									</td>

									{/* Brasil */}
									<td className="table-cell border-l border-zinc-200">
										<div
											className={`
											inline-flex items-center justify-center
											min-w-10 h-8 px-2 rounded-lg
											${
												isMax(participant.brazilPoints, maxValues.brazilPoints)
													? "bg-violet-200 text-violet-900 font-bold"
													: "text-amber-700"
											}
										`}
										>
											{participant.brazilPoints}
										</div>
									</td>

									{/* Δ Points */}
									<td className="table-cell border-l border-zinc-200">
										<div
											className={`
											inline-flex items-center justify-center
											min-w-[48px] h-8 px-2 rounded-lg font-semibold
											${
												isMax(participant.todayPoints, maxValues.todayPoints)
													? "bg-violet-200 text-violet-900 font-bold"
													: "text-sky-700"
											}
										`}
										>
											{participant.todayPoints > 0
												? `+${participant.todayPoints}`
												: participant.todayPoints}
										</div>
									</td>

									{/* Δ Position */}
									<td className="table-cell text-center border-r border-zinc-200">
										<div
											className={`
												inline-flex items-center gap-1 font-semibold text-sm
												transition-all duration-200 px-2 py-1 rounded-lg
													${
														participant.previousPosition !== null &&
														isMax(
															participant.positionChange,
															maxValues.positionChange,
														)
															? "bg-violet-200"
															: ""
													}
												`}
										>
											{participant.previousPosition === null ? (
												<span className="text-zinc-400">—</span>
											) : participant.positionChange > 0 ? (
												<>
													<span className="text-emerald-600">▲</span>
													<span className="text-emerald-600">
														+{participant.positionChange}
													</span>
												</>
											) : participant.positionChange < 0 ? (
												<>
													<span className="text-red-500">▼</span>
													<span className="text-red-500">
														{Math.abs(participant.positionChange)}
													</span>
												</>
											) : (
												<span className="text-zinc-500">0</span>
											)}
										</div>
									</td>

									{/* Rounds */}
									{roundKeys.map((key) => {
										const value = participant[key];
										const highlighted = isMax(value, maxValues[key]);

										return (
											<td key={key} className="table-cell">
												<div
													className={`inline-flex items-center justify-center min-w-[42px] h-8 px-2 rounded-lg
															${highlighted ? "bg-violet-200 text-violet-900 font-bold" : ""}
														`}
												>
													{value}
												</div>
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</main>
	);
}
