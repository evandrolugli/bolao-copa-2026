import type { Match, Participant } from "../utils/types";
import { MATCH_STATUS } from "./constants";

export function buildLeaderboard({ participants, matches }) {
	const leaderboardMap = new Map<number, any>();

	for (const p of participants) {
		leaderboardMap.set(p.id, {
			...p,
			position: null,
			points: 0,
			exactHits: 0,
			correctWinner: 0,
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
		});
	}

	const publishedMatches = matches.filter(
		(m) => m.status === MATCH_STATUS.PUBLISHED,
	);

	const effectiveDay = publishedMatches.length
		? Math.max(...publishedMatches.map((m) => m.day))
		: 0;

	const matchMap = new Map<number, Match>(
		publishedMatches.map((m) => [m.id, m]),
	);

	return {
		leaderboard: Array.from(leaderboardMap.values()),
		matchMap,
		effectiveDay,
	};
}
