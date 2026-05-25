import { isMatchPublished } from "@/lib/utils/constants";
import type { Match, Participant } from "@/lib/utils/types";

type BuildLeaderboardParams = {
	participants: Participant[];
	matches: Match[];
};

export function buildLeaderboard({
	participants,
	matches,
}: BuildLeaderboardParams) {
	// base leaderboard structure
	const leaderboard = participants.map((p) => ({
		...p,
		position: null,
		points: 0,
		exactHits: 0,
		correctHits: 0,
		wrong: 0,
		brazilPoints: 0,
		todayPoints: 0,
		previousPosition: null,
		positionChange: 0,
		round1: 0,
		round2: 0,
		round3: 0,
		phase1: 0,
		phase2: 0,
		finalStandingsPoints: 0,
	}));

	// build matchMap from ALL matches
	const matchMap = new Map<number, Match>(matches.map((m) => [m.id, m]));

	let effectiveDay = 0;

	for (const m of matches) {
		if (isMatchPublished(m)) {
			effectiveDay = Math.max(effectiveDay, m.day);
		}
	}

	return {
		leaderboard,
		matchMap,
		effectiveDay,
	};
}
