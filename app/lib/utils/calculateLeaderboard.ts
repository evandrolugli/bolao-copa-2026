import { buildLeaderboard } from "./buildLeaderboard";
import { buildPreviousLeaderboard } from "./buildPreviousLeaderboard";
import { rankLeaderboard } from "./rankLeaderboard";
import type { Match, Participant, Prediction } from "./types";

type CalculateLeaderboardData = {
	participants: Participant[];
	matches: Match[];
	predictions: Prediction[];
};

export function calculateLeaderboard(data: CalculateLeaderboardData) {
	const { participants, matches, predictions } = data;

	const { leaderboard, matchMap, effectiveDay } = buildLeaderboard({
		participants,
		matches,
		predictions,
	});

	buildPreviousLeaderboard({
		leaderboard,
		participants,
		matches,
		predictions,
		matchMap,
		effectiveDay,
	});

	rankLeaderboard(leaderboard);

	return leaderboard;
}
