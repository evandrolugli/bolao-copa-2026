import type {
	Match,
	PredictionWithParticipant,
	ScoredPrediction,
} from "../utils/types";
import { MATCH_STATUS, POINTS } from "./constants";

function getOutcome(home: number, away: number) {
	if (home > away) return "HOME";
	if (home < away) return "AWAY";
	return "DRAW";
}

export function scorePrediction(
	pred: PredictionWithParticipant,
	match: Match,
): ScoredPrediction {
	// match not published
	if (match.status !== MATCH_STATUS.PUBLISHED) {
		return {
			...pred,
			points: POINTS.wrong,
			status: "pending",
		};
	}

	// no final result yet
	if (match.home_score === null || match.away_score === null) {
		return {
			...pred,
			points: POINTS.wrong,
			status: "pending",
		};
	}

	const isExact =
		pred.pred_home === match.home_score && pred.pred_away === match.away_score;

	if (isExact) {
		return {
			...pred,
			points: POINTS.exactHits,
			status: "exact",
		};
	}

	const predOutcome = getOutcome(pred.pred_home, pred.pred_away);

	const realOutcome = getOutcome(match.home_score, match.away_score);

	const isCorrect = predOutcome === realOutcome;

	if (isCorrect) {
		return {
			...pred,
			points: POINTS.correctHits,
			status: "correct",
		};
	}

	return {
		...pred,
		points: POINTS.wrong,
		status: "wrong",
	};
}
