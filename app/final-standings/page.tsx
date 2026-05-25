import { getFinalStandingsPredictionsWithNames } from "@/lib/services/finalStandingsService";
import { getLeaderboard } from "@/lib/services/leaderboardService";

export const dynamic = "force-dynamic";

export default async function FinalStandingsPage() {
	// STEP 1 — FETCH BOTH DATASETS
	const [finalStandings, leaderboardData] = await Promise.all([
		getFinalStandingsPredictionsWithNames(),
		getLeaderboard(),
	]);

	// leaderboardData is an object { leaderboard, day, matchesCount }
	const leaderboard = leaderboardData.leaderboard;

	// STEP 2 — CREATE RANK MAP
	const leaderboardMap = new Map(leaderboard.map((p) => [p.id, p.position]));

	// STEP 3 — SORT FINAL STANDINGS BY LEADERBOARD POSITION
	const sortedFinalStandings = [...finalStandings].sort((a, b) => {
		const posA = leaderboardMap.get(a.participant_id) ?? 9999;
		const posB = leaderboardMap.get(b.participant_id) ?? 9999;

		if (posA !== posB) return posA - posB;

		return a.participantName.localeCompare(b.participantName);
	});

	return (
		<main className="min-h-screen bg-zinc-100 text-zinc-900 p-6">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold tracking-tight text-zinc-900">
						Top 4
					</h1>
				</div>

				{/* Table */}
				<div className="overflow-x-auto rounded-3xl border border-zinc-200 bg-white shadow-lg">
					<table className="w-full text-sm md:text-base border-collapse">
						<thead>
							<tr className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white">
								<th className="p-4 text-left font-semibold">Participante</th>
								<th className="p-4 text-center font-semibold">Campeão</th>
								<th className="p-4 text-center font-semibold">Vice</th>
								<th className="p-4 text-center font-semibold">Terceiro</th>
								<th className="p-4 text-center font-semibold">Quarto</th>
							</tr>
						</thead>

						<tbody className="text-zinc-900">
							{sortedFinalStandings.map((f) => (
								<tr
									key={f.participant_id}
									className="border-t border-zinc-200 bg-white hover:bg-zinc-50 transition-colors duration-200"
								>
									{/* Participant */}
									<td className="p-4 font-semibold whitespace-nowrap">
										{f.participantName}
									</td>

									<td className="p-4 text-center">{f.champion}</td>
									<td className="p-4 text-center">{f.vice}</td>
									<td className="p-4 text-center">{f.third}</td>
									<td className="p-4 text-center">{f.fourth}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	);
}
