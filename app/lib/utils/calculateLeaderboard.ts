import { buildLeaderboard } from "./buildLeaderboard";
import { buildPreviousLeaderboard } from "./buildPreviousLeaderboard";
import { calculatePredictionPoints } from "./calculatePredictionPoints";
import { rankLeaderboard } from "./rankLeaderboard";

export function calculateLeaderboard({
	participants,
	matches,
	predictions,
}: any) {
	// build base leaderboard + match lookup + current valid day
	const { leaderboard, matchMap, effectiveDay } = buildLeaderboard({
		participants,
		matches,
	});

	// calculate points from predictions using valid matches only
	calculatePredictionPoints({
		leaderboard,
		predictions,
		matchMap,
		effectiveDay,
	});

	// sort leaderboard and assign positions (including tie logic)
	rankLeaderboard(leaderboard);

	// compute previous positions for delta comparison (Δ Pos)
	buildPreviousLeaderboard({
		leaderboard,
		participants,
		matches,
		predictions,
	});

	// return final computed leaderboard + current effective day
	return {
		leaderboard,
		effectiveDay,
	};
}
