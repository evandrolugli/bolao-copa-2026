import { buildLeaderboard } from "./buildLeaderboard";
import { buildPreviousLeaderboard } from "./buildPreviousLeaderboard";
import { calculatePredictionPoints } from "./calculatePredictionPoints";
import { rankLeaderboard } from "./rankLeaderboard";

export function calculateLeaderboard({
	participants,
	matches,
	predictions,
}: any) {
	// 1. base leaderboard
	const { leaderboard, matchMap, effectiveDay } = buildLeaderboard({
		participants,
		matches,
	});

	// 2. calculate CURRENT points
	calculatePredictionPoints({
		leaderboard,
		predictions,
		matchMap,
		effectiveDay,
	});

	// 3. current ranking
	rankLeaderboard(leaderboard);

	// 4. compare with PREVIOUS ranking
	buildPreviousLeaderboard({
		leaderboard,
		participants,
		matches,
		predictions,
	});

	return leaderboard;
}
