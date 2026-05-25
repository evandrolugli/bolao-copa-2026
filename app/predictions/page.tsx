import MatchCard from "../components/MatchCard";
import { getPredictionsByMatch } from "../lib/services/predictionService";
import { getMatchCardVariant } from "../lib/utils/getMatchCardVariant";

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

	return (
		<main className="min-h-screen bg-zinc-100 p-6">
			<div className="max-w-5xl mx-auto space-y-6">
				<h1 className="text-zinc-900 text-3xl font-bold">Palpites</h1>

				{/* Main Phase Filters */}
				<div className="flex flex-wrap gap-3">
					{phases.map((p) => (
						<a
							key={p}
							href={`/predictions?phase=${encodeURIComponent(p)}`}
							className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
								selectedPhase === p
									? "bg-black text-white"
									: "bg-white text-zinc-700 border border-zinc-300 hover:border-zinc-500"
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
						className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
							!round
								? "bg-zinc-700 text-white"
								: "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
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
							className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
								round === r
									? "bg-zinc-700 text-white"
									: "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
							}`}
						>
							{r}
						</a>
					))}
				</div>

				{/* Matches */}
				<div className="space-y-4">
					{filteredMatches.map((match) => {
						const variant = getMatchCardVariant(match);

						return (
							<MatchCard
								key={match.id}
								match={match}
								stats={match.stats}
								variant={variant}
							/>
						);
					})}
				</div>
			</div>
		</main>
	);
}
