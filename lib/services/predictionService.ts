import { fetchSheet } from "@/lib/googleSheets/fetchSheet";
import { scorePrediction } from "@/lib/utils/scorePrediction";
import type {
	Match,
	MatchWithPredictions,
	Participant,
	Prediction,
	PredictionWithParticipant,
} from "../utils/types";

export async function getPredictionsByMatch(): Promise<MatchWithPredictions[]> {
	const [matches, participants, predictions] = await Promise.all([
		fetchSheet("matches"),
		fetchSheet("participants"),
		fetchSheet("predictions"),
	]);

	const typedMatches = matches as Match[];
	// const typedMatches: Match[] = matches.map((m: any) => ({
	// 	id: Number(m.id),
	// 	phase: m.phase,
	// 	round: m.round,
	// 	group: m.group,
	// 	home: m.home,
	// 	away: m.away,
	// 	home_score: m.home_score ? Number(m.home_score) : null,
	// 	away_score: m.away_score ? Number(m.away_score) : null,
	// 	is_brazil: m.is_brazil === "TRUE",
	// 	day: Number(m.day),
	// 	status: m.status === "publicar" ? "published" : "pending",
	// }));

	const typedParticipants = participants as Participant[];
	const typedPredictions = predictions as Prediction[];

	// map participants
	const participantMap = new Map<number, Participant>();
	typedParticipants.forEach((p) => participantMap.set(p.id, p));

	// group predictions per match
	const predictionsByMatch = new Map<number, PredictionWithParticipant[]>();

	for (const pred of typedPredictions) {
		const enriched: PredictionWithParticipant = {
			...pred,
			participant: participantMap.get(pred.participant_id)!,
		};

		if (!predictionsByMatch.has(pred.match_id)) {
			predictionsByMatch.set(pred.match_id, []);
		}

		predictionsByMatch.get(pred.match_id)!.push(enriched);
	}

	return typedMatches.map((match) => {
		const predictions = (predictionsByMatch.get(match.id) || []).map((p) =>
			scorePrediction(p, match),
		);

		const stats = predictions.reduce(
			(acc, p) => {
				if (p.status === "exact") acc.exact++;
				else if (p.status === "correct") acc.correct++;
				else acc.wrong++;
				return acc;
			},
			{ exact: 0, correct: 0, wrong: 0 },
		);

		return {
			...match,
			predictions,
			stats,
		};
	});
}
