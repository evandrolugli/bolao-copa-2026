import type { Match, Prediction } from "./types";

export function calculatePredictionPoints(
	match: Match,
	prediction: Prediction,
) {
	const actualHome = match.home_score;
	const actualAway = match.away_score;

	// Match not finished yet
	if (actualHome == null || actualAway == null) {
		return null;
	}

	const predictedHome = prediction.pred_home;
	const predictedAway = prediction.pred_away;

	const isExact = actualHome === predictedHome && actualAway === predictedAway;

	const actualResult = Math.sign(actualHome - actualAway);
	const predictedResult = Math.sign(predictedHome - predictedAway);

	const isCorrectWinner = actualResult === predictedResult;

	if (isExact) {
		return {
			points: 5,
			exact: true,
			winner: true,
		};
	}

	if (isCorrectWinner) {
		return {
			points: 2,
			exact: false,
			winner: true,
		};
	}

	return {
		points: 0,
		exact: false,
		winner: false,
	};
}
