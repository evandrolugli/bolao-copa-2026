import { fetchGoogleSheet } from "../googleSheets/fetchSheet";
import { scorePrediction } from "../utils/scorePrediction";
import type {
	Match,
	MatchWithPredictions,
	Participant,
	Prediction,
	PredictionWithParticipant,
} from "../utils/types";

export async function getPredictionsByMatch(): Promise<MatchWithPredictions[]> {
	const [matches, participants, predictions] = await Promise.all([
		fetchGoogleSheet("matches"),
		fetchGoogleSheet("participants"),
		fetchGoogleSheet("predictions"),
	]);

	const typedMatches = matches as Match[];
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

	// merge matches + scored predictions
	return typedMatches.map((match) => ({
		...match,
		predictions: (predictionsByMatch.get(match.id) || []).map((p) =>
			scorePrediction(p, match),
		),
	}));
}
