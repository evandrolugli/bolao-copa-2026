import type { Match, Participant, Prediction } from "../types";
import { POINTS } from "./constants";

type BuildPreviousLeaderboardParams = {
	leaderboard: any[];
	participants: Participant[];
	matches: Match[];
	predictions: Prediction[];
	matchMap: Map<number, Match>;
	effectiveDay: number;
};

type PreviousEntry = {
	id: number;
	name: string;
	points: number;
	exactHits: number;
	correctWinner: number;
	wrong: number;
	brazilPoints: number;
};

export function buildPreviousLeaderboard({
	leaderboard,
	participants,
	matches,
	predictions,
	matchMap,
	effectiveDay,
}: BuildPreviousLeaderboardParams) {
	if (effectiveDay <= 1) return;

	const previousMap = new Map<number, PreviousEntry>();

	for (const p of participants) {
		previousMap.set(p.id, {
			id: p.id,
			name: p.name,
			points: 0,
			exactHits: 0,
			correctWinner: 0,
			wrong: 0,
			brazilPoints: 0,
		});
	}

	for (const pred of predictions) {
		const entry = previousMap.get(pred.participant_id);
		const match = matchMap.get(pred.match_id);

		if (!entry || !match) continue;
		if (match.day >= effectiveDay) continue;
		if (match.home_score == null || match.away_score == null) continue;

		const isExact =
			match.home_score === pred.pred_home &&
			match.away_score === pred.pred_away;

		const actual = Math.sign(match.home_score - match.away_score);
		const predicted = Math.sign(pred.pred_home - pred.pred_away);

		const isWinner = actual === predicted;

		if (isExact) entry.points += POINTS.exactHits;
		else if (isWinner) entry.points += POINTS.correctHits;

		if (match.is_brazil) {
			entry.brazilPoints += entry.points;
		}
	}

	const previousArr = Array.from(previousMap.values());

	previousArr.sort((a, b) => b.points - a.points);

	const previousPositions = new Map<number, number>(
		previousArr.map((p, i) => [p.id, i + 1]),
	);

	for (const entry of leaderboard) {
		const prevPos = previousPositions.get(entry.id);

		entry.previousPosition = prevPos ?? null;

		if (prevPos && entry.position != null) {
			entry.positionChange = prevPos - entry.position;
		}
	}
}
