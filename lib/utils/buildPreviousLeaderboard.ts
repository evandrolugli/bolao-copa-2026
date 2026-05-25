import { calculatePredictionPoints } from "@/lib/utils/calculatePredictionPoints";
import { isMatchPublished } from "@/lib/utils/constants";
import { rankLeaderboard } from "@/lib/utils/rankLeaderboard";

export function buildPreviousLeaderboard({
	leaderboard,
	participants,
	matches,
	predictions,
}: any) {
	const publishedMatches = matches.filter(isMatchPublished);

	if (publishedMatches.length === 0) return;

	const currentDay = Math.max(...publishedMatches.map((m: any) => m.day));

	if (currentDay <= 1) return;

	// ONLY matches before current day
	const previousMatches = publishedMatches.filter(
		(m: any) => m.day < currentDay,
	);

	// build previous leaderboard
	const previousLeaderboard = participants.map((p: any) => ({
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
		finalistsPoints: 0,
	}));

	// previous match map
	const previousMatchMap = new Map(previousMatches.map((m: any) => [m.id, m]));

	// APPLY SAME SCORING ENGINE
	calculatePredictionPoints({
		leaderboard: previousLeaderboard,
		predictions,
		matchMap: previousMatchMap,
		effectiveDay: currentDay - 1,
	});

	// rank previous standings
	rankLeaderboard(previousLeaderboard);

	// compare positions
	for (const current of leaderboard) {
		const previous = previousLeaderboard.find((p: any) => p.id === current.id);

		if (!previous) continue;

		current.previousPosition = previous.position;

		if (current.position != null && previous.position != null) {
			current.positionChange = previous.position - current.position;
		}
	}
}
