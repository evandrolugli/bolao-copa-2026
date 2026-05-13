import MatchCard from "../components/MatchCard";
import { getPredictionsByMatch } from "../lib/services/predictionService";

export const dynamic = "force-dynamic";

export default async function PredictionsPage() {
	const matches = await getPredictionsByMatch();

	return (
		<main className="min-h-screen bg-zinc-100 p-6">
			<div className="max-w-5xl mx-auto space-y-4">
				<h1 className="text-3xl font-bold">Apostas</h1>

				<div className="space-y-4">
					{matches.map((match) => (
						<MatchCard key={match.id} match={match} />
					))}
				</div>
			</div>
		</main>
	);
}
