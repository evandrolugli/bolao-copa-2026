// import MatchCard from "../components/MatchCard";
// import { getPredictionsByMatch } from "../lib/services/predictionService";

// export const dynamic = "force-dynamic";

// type PredictionsPageProps = {
// 	searchParams: Promise<{
// 		round?: string;
// 	}>;
// };

// export default async function PredictionsPage({
// 	searchParams,
// }: PredictionsPageProps) {
// 	const { round } = await searchParams;

// 	const matches = await getPredictionsByMatch();

// 	// unique rounds
// 	const rounds = [...new Set(matches.map((m) => m.round))];

// 	// filter by round
// 	const filteredMatches = round
// 		? matches.filter((m) => m.round === round)
// 		: matches;

// 	let currentPhase = "";

// 	return (
// 		<main className="min-h-screen bg-zinc-100 p-6">
// 			<div className="max-w-5xl mx-auto space-y-4">
// 				<h1 className="text-3xl font-bold">Apostas</h1>

// 				{/* Round Filter */}
// 				<div className="flex flex-wrap gap-2">
// 					<a
// 						href="/predictions"
// 						className={`px-4 py-2 rounded-lg border ${
// 							!round ? "bg-black text-white" : "bg-white text-black"
// 						}`}
// 					>
// 						Todas
// 					</a>

// 					{rounds.map((r) => (
// 						<a
// 							key={r}
// 							href={`/predictions?round=${encodeURIComponent(r)}`}
// 							className={`px-4 py-2 rounded-lg border ${
// 								round === r ? "bg-black text-white" : "bg-white text-black"
// 							}`}
// 						>
// 							{r}
// 						</a>
// 					))}
// 				</div>

// 				{/* Matches */}
// 				<div className="space-y-4">
// 					{filteredMatches.map((match) => {
// 						const showPhase = match.phase !== currentPhase;

// 						if (showPhase) {
// 							currentPhase = match.phase;
// 						}

// 						return (
// 							<div key={match.id}>
// 								{showPhase && (
// 									<div className="pt-4">
// 										<h2 className="text-xl font-bold text-zinc-700">
// 											{match.phase}
// 										</h2>
// 									</div>
// 								)}

// 								<MatchCard match={match} />
// 							</div>
// 						);
// 					})}
// 				</div>
// 			</div>
// 		</main>
// 	);
// }

import MatchCard from "../components/MatchCard";
import { getPredictionsByMatch } from "../lib/services/predictionService";

export const dynamic = "force-dynamic";

type PredictionsPageProps = {
	searchParams: Promise<{
		phase?: string;
		round?: string;
	}>;
};

export default async function PredictionsPage({
	searchParams,
}: PredictionsPageProps) {
	const { phase, round } = await searchParams;

	const matches = await getPredictionsByMatch();

	// unique phases
	const phases = [...new Set(matches.map((m) => m.phase))];

	// selected phase
	const selectedPhase = phase || phases[0];

	// rounds based on selected phase
	const rounds = [
		...new Set(
			matches.filter((m) => m.phase === selectedPhase).map((m) => m.round),
		),
	];

	// filtered matches
	const filteredMatches = matches.filter((m) => {
		const phaseMatch = selectedPhase ? m.phase === selectedPhase : true;

		const roundMatch = round ? m.round === round : true;

		return phaseMatch && roundMatch;
	});

	let currentGroup = "";

	return (
		<main className="min-h-screen bg-zinc-100 p-6">
			<div className="max-w-5xl mx-auto space-y-6">
				<h1 className="text-3xl font-bold">Apostas</h1>

				{/* Main Phase Filters */}
				<div className="flex flex-wrap gap-2">
					{phases.map((p) => (
						<a
							key={p}
							href={`/predictions?phase=${encodeURIComponent(p)}`}
							className={`px-4 py-2 rounded-lg border font-medium transition ${
								selectedPhase === p
									? "bg-black text-white"
									: "bg-white text-black"
							}`}
						>
							{p}
						</a>
					))}
				</div>

				{/* Round Filters */}
				<div className="flex flex-wrap gap-2">
					<a
						href={`/predictions?phase=${encodeURIComponent(selectedPhase)}`}
						className={`px-4 py-2 rounded-lg border text-sm ${
							!round ? "bg-zinc-800 text-white" : "bg-white text-black"
						}`}
					>
						Todas
					</a>

					{rounds.map((r) => (
						<a
							key={r}
							href={`/predictions?phase=${encodeURIComponent(
								selectedPhase,
							)}&round=${encodeURIComponent(r)}`}
							className={`px-4 py-2 rounded-lg border text-sm ${
								round === r ? "bg-zinc-800 text-white" : "bg-white text-black"
							}`}
						>
							{r}
						</a>
					))}
				</div>

				{/* Matches */}
				<div className="space-y-4">
					{filteredMatches.map((match) => {
						const showGroup =
							selectedPhase === "Primeira Fase" && match.group !== currentGroup;

						if (showGroup) {
							currentGroup = match.group;
						}

						return (
							<div key={match.id}>
								{/* Group Subtitle */}
								{showGroup && (
									<div className="pt-4">
										<h2 className="text-xl font-bold text-zinc-700">
											{match.group}
										</h2>
									</div>
								)}

								<MatchCard match={match} />
							</div>
						);
					})}
				</div>
			</div>
		</main>
	);
}
