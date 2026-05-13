import type {
	Match,
	PredictionWithParticipant,
	ScoredPrediction,
} from "../utils/types";

function getOutcome(home: number, away: number) {
	if (home > away) return "HOME";
	if (home < away) return "AWAY";
	return "DRAW";
}

export function scorePrediction(
	pred: PredictionWithParticipant,
	match: Match,
): ScoredPrediction {
	// not published
	if (match.status !== "publicar") {
		return {
			...pred,
			points: 0,
			status: "pending",
		};
	}

	// no result yet
	if (match.home_score === null || match.away_score === null) {
		return {
			...pred,
			points: 0,
			status: "pending",
		};
	}

	const isExact =
		pred.pred_home === match.home_score && pred.pred_away === match.away_score;

	if (isExact) {
		return {
			...pred,
			points: 3,
			status: "exact",
		};
	}

	const predOutcome = getOutcome(pred.pred_home, pred.pred_away);
	const realOutcome = getOutcome(match.home_score, match.away_score);

	if (predOutcome === realOutcome) {
		return {
			...pred,
			points: 1,
			status: "correct",
		};
	}

	return {
		...pred,
		points: 0,
		status: "wrong",
	};
}
