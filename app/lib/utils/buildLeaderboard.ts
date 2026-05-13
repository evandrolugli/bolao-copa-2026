import type { Match, Participant } from "../utils/types";
import { MATCH_STATUS } from "./constants";

type BuildLeaderboardParams = {
	participants: Participant[];
	matches: Match[];
};

type LeaderboardEntry = Participant & {
	position: number | null;
	points: number;
	exactHits: number;
	correctWinner: number;
	wrong: number;
	brazilPoints: number;
	todayPoints: number;
	previousPosition: number | null;
	positionChange: number;
	round1: number;
	round2: number;
	round3: number;
	phase1: number;
	phase2: number;
};

export function buildLeaderboard({
	participants,
	matches,
}: BuildLeaderboardParams) {
	const leaderboardMap = new Map<number, LeaderboardEntry>();

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
