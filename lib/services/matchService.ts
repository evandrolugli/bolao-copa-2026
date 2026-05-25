import { fetchSheet } from "@/lib/googleSheets/fetchSheet";
import { scorePrediction } from "@/lib/utils/scorePrediction";
import type {
	Match,
	MatchWithPredictions,
	Participant,
	Prediction,
	PredictionWithParticipant,
} from "../utils/types";

export async function getMatchesWithPredictions(): Promise<
	MatchWithPredictions[]
> {
	const [matches, participants, predictions] = await Promise.all([
		fetchSheet<Match>("matches"),
		fetchSheet<Participant>("participants"),
		fetchSheet<Prediction>("predictions"),
	]);

	// map participants
	const participantMap = new Map<number, Participant>();
	participants.forEach((p) => {
		participantMap.set(p.id, p);
	});

	// group predictions by match
	const predictionsByMatch = new Map<number, PredictionWithParticipant[]>();

	for (const pred of predictions) {
		const participant = participantMap.get(pred.participant_id);

		if (!participant) {
			continue;
		}

		const enriched: PredictionWithParticipant = {
			...pred,
			participant,
		};

		let list = predictionsByMatch.get(pred.match_id);

		if (!list) {
			list = [];
			predictionsByMatch.set(pred.match_id, list);
		}

		list.push(enriched);
	}

	// enrich matches with predictions + stats
	return matches.map((match) => {
		const scoredPredictions = (predictionsByMatch.get(match.id) ?? []).map(
			(prediction) => scorePrediction(prediction, match),
		);

		const stats = scoredPredictions.reduce(
			(acc, prediction) => {
				if (prediction.status === "exact") acc.exact++;
				else if (prediction.status === "correct") acc.correct++;
				else acc.wrong++;

				return acc;
			},
			{ exact: 0, correct: 0, wrong: 0 },
		);

		return {
			...match,
			predictions: scoredPredictions,
			stats,
		};
	});
}
