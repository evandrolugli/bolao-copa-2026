import { buildLeaderboard } from "@/lib/utils/buildLeaderboard";
import { buildPreviousLeaderboard } from "@/lib/utils/buildPreviousLeaderboard";
import { calculatePredictionPoints } from "@/lib/utils/calculatePredictionPoints";
import { rankLeaderboard } from "@/lib/utils/rankLeaderboard";

export function calculateLeaderboard({
	participants,
	matches,
	predictions,
	finalistsPredictions,
	finalistsResult,
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
		finalistsPredictions,
		finalistsResult,
	});

	// sort leaderboard and assign positions (including tie logic)
	rankLeaderboard(leaderboard);

	// compute previous positions for delta comparison (Δ Pos)
	buildPreviousLeaderboard({
		leaderboard,
		participants,
		matches,
		predictions,
		finalistsPredictions,
		finalistsResult,
	});

	// return final computed leaderboard + current effective day
	return {
		leaderboard,
		effectiveDay,
	};
}
