import { buildLeaderboard } from "./buildLeaderboard";
import { buildPreviousLeaderboard } from "./buildPreviousLeaderboard";
import { calculatePredictionPoints } from "./calculatePredictionPoints";
import { rankLeaderboard } from "./rankLeaderboard";

export function calculateLeaderboard(data) {
	const { participants, matches, predictions } = data;

	const { leaderboard, matchMap, effectiveDay } = buildLeaderboard({
		participants,
		matches,
	});

	calculatePredictionPoints({
		leaderboard,
		predictions,
		matchMap,
		effectiveDay,
	});

	rankLeaderboard(leaderboard);

	buildPreviousLeaderboard({
		leaderboard,
		participants,
		matches,
		predictions,
		matchMap,
		effectiveDay,
	});

	return leaderboard;
}
