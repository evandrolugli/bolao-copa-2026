import { isMatchPublished, POINTS } from "@/lib/utils/constants";
import { calculateFinalistsPoints } from "@/lib/utils/finalistsPoints";
import type { Match, Prediction } from "@/lib/utils/types";

function calculatePoints(match: Match, prediction: Prediction) {
	// check if exact score prediction
	const isExact =
		match.home_score === prediction.pred_home &&
		match.away_score === prediction.pred_away;

	// determine match result direction (home win, draw, away win)
	const actual = Math.sign(match.home_score! - match.away_score!);
	const predicted = Math.sign(prediction.pred_home - prediction.pred_away);

	// check if correct outcome (winner/draw)
	const isCorrect = actual === predicted;

	// return points based on accuracy
	if (isExact) return { points: POINTS.exactHits, type: "exact" };
	if (isCorrect) return { points: POINTS.correctHits, type: "correct" };

	return { points: 0, type: "wrong" };
}

export function calculatePredictionPoints({
	leaderboard,
	predictions,
	matchMap,
	effectiveDay,
	finalistsPredictions,
	finalistsResult,
}: any) {
	for (const pred of predictions) {
		// find participant entry
		const entry = leaderboard.find((l: any) => l.id === pred.participant_id);
		const match = matchMap.get(pred.match_id);

		if (!entry || !match) continue;

		if (!isMatchPublished(match)) continue;

		// ignore future matches beyond current day
		if (match.day > effectiveDay) continue;

		const { points, type } = calculatePoints(match, pred);

		// add total points
		entry.points += points;

		// update hit counters
		if (type === "exact") entry.exactHits++;
		else if (type === "correct") entry.correctHits++;
		else entry.wrong++;

		// track special categories
		if (match.is_brazil) entry.brazilPoints += points;
		if (match.day === effectiveDay) entry.todayPoints += points;

		// track by competition stage
		if (match.round === "Rodada 1") entry.round1 += points;
		if (match.round === "Rodada 2") entry.round2 += points;
		if (match.round === "Rodada 3") entry.round3 += points;

		if (match.phase !== "Fase 2") entry.phase1 += points;
		if (match.phase === "Fase 2") entry.phase2 += points;
	}

	// finalists points
	for (const pred of finalistsPredictions || []) {
		const entry = leaderboard.find((l: any) => l.id === pred.participant_id);

		if (!entry) continue;

		const points = calculateFinalistsPoints(pred, finalistsResult);

		entry.points += points;
		entry.finalistsPoints = (entry.finalistsPoints || 0) + points;
	}
}
